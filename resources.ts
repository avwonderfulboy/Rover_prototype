import { Console } from "console";
import * as configs  from "./config.js"
import * as utilities from "./utilities"
const yaml = require("yaml");


export  function skeleton(){
    let template_skeleton= {}
    template_skeleton["AWSTemplateFormatVersion"]= JSON.parse(JSON.stringify(configs.SkeletonConfig["template_version"]))
    template_skeleton["Transform"]= JSON.parse(JSON.stringify(configs.SkeletonConfig["sam_transform_version"]))
    template_skeleton["Description"]= "SAM Template"
    template_skeleton["Globals"]= {"Function": {"Timeout": 30}}
    template_skeleton["Resources"]= {}
    return template_skeleton
}
function rolePolicyAddition(template,config){
    let policies=[]
    let base =template["Properties"]["ManagedPolicyArns"][0]
    for (var j in  config["managedarn"]){
        template["Properties"]["ManagedPolicyArns"][j]=base+config["managedarn"][j]
    }
    if(config.hasOwnProperty(["iamservice"])){
        for (var j in  config["iamservice"]){
            template["Properties"]["AssumeRolePolicyDocument"]["Statement"][0]["Principal"]["Service"].push(config["iamservice"][j])
        }
    }
    
    //console.log("config",JSON.stringify(template["Properties"]["ManagedPolicyArns"]))
    for (let k in config["Policies"]){
        let role=JSON.parse(JSON.stringify(configs.PolicySkeleton))
        role["PolicyName"]=config["Policies"][k]["name"]
        role["PolicyDocument"]["Statement"][0]["Action"]=config["Policies"][k]["Action"]
        role["PolicyDocument"]["Statement"][0]["Resource"]=config["Policies"][k]["Resource"]
        policies.push(role)
    }
    template["Properties"]["Policies"]=policies
    //console.log("rolePolicyAddition",JSON.stringify(template))
    return template
}
function policyAddition(template,config){
    let role=JSON.parse(JSON.stringify(configs.PolicySkeleton))
    for (let k in config["Statement"]){
        role["PolicyDocument"]["Statement"][k]["Action"]=config["Statement"][k]["Action"]
        role["PolicyDocument"]["Statement"][k]["Resource"]=config["Statement"][k]["Resource"]
    }
    template["Properties"]["PolicyDocument"]=role["PolicyDocument"]
    //console.log("policyAddition",JSON.stringify(template))
    return template
}

function swaggerGenerator(config){

    const swagger=configs.SwaggerSkeleton
    let swaggerPaths = {}
    config.objects.map((data,i) => {
        const pathName = data["path"]
        swaggerPaths[pathName] = attachMethods(data["methods"],data)
        return null
    })

    swagger["paths"]=swaggerPaths
    let doc = new yaml.Document();
    doc.contents = swagger;
    utilities.writeFile(config["filepath"],doc.toString())
}

const attachMethods = (methodArray,data) => {
    
    let result = {}
    if(methodArray.length) {
        methodArray.map((item) => {
            result[item]= JSON.parse(JSON.stringify(configs.SwaggerPathSkeleton[item]))
            let uri=result[item]["x-amazon-apigateway-integration"]["uri"]["Fn::Sub"]+configs.APIGatewayURI[data["resourcetype"]]
            if (data["resourcetype"]=="lambda"){
                uri=uri.replace("lambda.Arn",data["resource"]+".Arn")
            }
            result[item]["x-amazon-apigateway-integration"]["uri"]["Fn::Sub"]=uri
            result[item]["x-amazon-apigateway-integration"]["credentials"]={}
            result[item]["x-amazon-apigateway-integration"]["credentials"]["Fn::Sub"]="${"+data["role"]+".Arn}"
            return null
        })
    }
    return result
}

export function apigatewaypath(template,path){
    let definationbody= JSON.parse(JSON.stringify(configs.APIGatewaySkeleton))
    definationbody["Fn::Transform"]["Parameters"]["Location"]=path
      template["Properties"]["DefinitionBody"]=definationbody
      return template
}
export let resourceGeneration=function(resource_name,config){
    let resource_properties=JSON.parse(JSON.stringify(configs.AWSResources[resource_name]))
    let template={}
    for (let j in resource_properties.attributes){
        
        if (resource_properties.attributes[j]=="Type"){
            template[resource_properties.attributes[j]]=JSON.parse(JSON.stringify(configs.AWSResourcesTypes[resource_name]))
        }else{
            template[resource_properties.attributes[j]]={}
            for (let k in resource_properties.Properties.Base){
                template[resource_properties.attributes[j]][resource_properties.Properties.Base[k]]=config[resource_properties.Properties.Base[k]]
            }
            for (let l in resource_properties.Properties.Optional){
                if (config[resource_properties.Properties.Optional[l]]!==undefined){
                   
                    template[resource_properties.attributes[j]][resource_properties.Properties.Optional[l]]=config[resource_properties.Properties.Optional[l]]
                }
            }
            for (let m in resource_properties.Properties.Default){
                template[resource_properties.attributes[j]][resource_properties.Properties.Default[m]["Key"]]=resource_properties.Properties.Default[m]["Value"]
            }
        }
    }
    if(resource_name=="iamrole"){
        template=rolePolicyAddition(template,config)
    }
    if(resource_name=="iampolicy"){
        template=policyAddition(template,config)
    }
    if(resource_name=="apigateway"){
        if(config.hasOwnProperty("path")){
            template=apigatewaypath(template,config["path"])
        }
        if(config.hasOwnProperty("objects")){
            swaggerGenerator(config)
        }   
    }
    return template
}
