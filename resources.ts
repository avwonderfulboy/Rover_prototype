import * as configs  from "./config.js"
import * as utilities from "./utilities"
const yaml = require("yaml");
export  function skeleton(){
    let template_skeleton= {}
    template_skeleton["AWSTemplateFormatVersion"]= configs.SkeletonConfig["template_version"]
    template_skeleton["Transform"]= configs.SkeletonConfig["sam_transform_version"]
    template_skeleton["Description"]= "SAM Template"
    template_skeleton["Globals"]= {"Function": {"Timeout": 30}}
    template_skeleton["Resources"]= {}
    return template_skeleton
}
function roleAddition(template,config){
    let policies=[]
    for (let k in config["Policies"]){
        let role=configs.PolicySkeleton
        role["PolicyDocument"]["Statement"][0]["Action"]=config["Policies"][k]["Action"]
        role["PolicyDocument"]["Statement"][0]["Resource"]=config["Policies"][k]["Resource"]
        policies.push(role)
    }
    template["Properties"]["Policies"]=policies
    return template
}
function swaggerGenerator(config){
    let swagger=configs.SwaggerSkeleton
    let pathswagger=configs.SwaggerPathSkeleton
    for (let i in config["objects"]){
        let obj_swagger={}
        obj_swagger[config["objects"][i]["path"]]={}
        for (let j in config["objects"][i]["methods"]){

            obj_swagger[config["objects"][i]["path"]][config["objects"][i]["methods"][j]]= pathswagger[config["objects"][i]["methods"][j]]
            let uri
            if(config["objects"][i]["resourcetype"]=="lambda"){
                uri=(configs.APIGatewayURI[config["objects"][i]["resourcetype"]]).replace("lambda_arn",config["objects"][i]["resource"]);
            }
            
            obj_swagger[config["objects"][i]["path"]][config["objects"][i]["methods"][j]]["x-amazon-apigateway-integration"]["uri"]=uri
        } 
        swagger["paths"]=obj_swagger
    }
    let doc = new yaml.Document();
    doc.contents = swagger;
    utilities.writeFile(config["filepath"],doc.toString())
}
export function apigatewaypath(template,path){
    let definationbody= {
          "Fn::Transform": {
            "Name": "AWS::Include",
            "Parameters": {
                "Location":path
            }
          }
        }
      template["Properties"]["DefinitionBody"]=definationbody
      return template
    }
export let resource_generation=function(resource_name,config){
    let resource_properties=configs.AWSResources[resource_name]
    let template={}
    for (let j in resource_properties.attributes){
        if (resource_properties.attributes[j]=="Type"){
            template[resource_properties.attributes[j]]=configs.AWSResourcesTypes[resource_name]
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
        template=roleAddition(template,config)
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
