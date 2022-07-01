import * as config  from "./config.js"
import * as rover_resources  from "./resources.js"
import * as logics  from "./logics.js"
import * as modules  from "./modules.js"
import * as components  from "./components.js"
import { json } from "node:stream/consumers";
import { AnyArray, AnyObject } from "immer/dist/internal";
const exec = require("child_process").execSync;
const yaml = require("yaml");
var fs = require("fs");
export let  pwd =process.cwd()+"/"
let doc = new yaml.Document();
export  function writeFile(path, data){ 
     fs.writeFileSync(pwd+"/"+path,data);
}
export  function addResourceTemplate(resources, name){ 
    let template=rover_resources.skeleton()
        for(let  i in name){ 
            template["Resources"][name[i]]=resources[name[i]]
        }
        return template   
}
export function yamlReplace(doc){
    let yamlArray = {
        // "off": "'off'",
        // "on": "'on'",
        // "yes":"'yes'",
        // "no":"'no'",
        "OFF": "'OFF'",
        // "ON": "'ON'",
        // "YES":"'YES'",
        // "NO":"'NO'",
    }
    Object.keys(yamlArray).map((key)=> {
        doc=doc.replace(key, yamlArray[key])
    });
    return doc
}
export  function stackCreation(input){
    let app_name=input.app_name
    exec(config.ForceRemove+input.app_name)
    let language= config.LanguageSupport[input.language]["version"]
    let dependency=config.LanguageSupport[input.language]["dependency"]
    let extension=config.LanguageSupport[input.language]["extension"]
    exec(config.SAMInitBase+config.SAMLanguage+language+config.SAMDependency+dependency+config.SAMAppName+app_name+config.SAMAppTemplate)
    let app_types:AnyObject={}
    if( Object.keys(input["Stacks"]).length>0){
        Object.keys(input["Stacks"]).map(ele =>{
            let stackdata:AnyObject=JSON.parse(JSON.stringify(modules.StackType[input["Stacks"][ele]]))
            Object.keys(stackdata).map(ele1=>{
                app_types[ele+"_"+ele1]=stackdata[ele1]
                app_types[ele+"_"+ele1]["type"]="module"
            })
        })
    }
    if( Object.keys(input["CustomStacks"]).length>0){
        Object.keys(input["CustomStacks"]).map(ele =>{
            let resources:AnyArray=[]
            input["CustomStacks"][ele].map(ele=>{
                    resources.push(JSON.parse(JSON.stringify(components.Components[ele])))
                }
            )
            app_types[ele]={}
            app_types[ele]["resources"]=resources
            app_types[ele]["type"]="components"
        })
    }
    //console.log(JSON.stringify(app_types))
    let stack_names = Object.keys(app_types)
    let resource=app_types
    let StackType = Object.values(input["Stacks"])
    exec("mv "+pwd+app_name+"/hello-world "+pwd+app_name+"/"+"lambda_demo")
    let stackes={}
    for( let i=0;i< stack_names.length;i++){ 
        let stacks= rover_resources.resourceGeneration("stack",{"TemplateURL":stack_names[i]+"_Stack"+"/template.yaml"})
        stackes[stack_names[i]]=stacks
        exec("mkdir "+pwd+app_name+"/"+stack_names[i]+"_Stack")
            let resources=resource[stack_names[i]] 
            let res={}
            for(let j in  resources["resources"]){ 
                let configs=resources["resources"][j]["config"]
                let logic=resources["resources"][j]["logic"]
                
                if(config.AWSResources[resources["resources"][j]["type"]].hasOwnProperty("name")){
                    configs[config.AWSResources[resources["resources"][j]["type"]]["name"]]=resources["resources"][j]["name"]
                }
                if(resources["resources"][j]["type"]=="lambda"){ 
                    exec("cp -r "+pwd+app_name+"/"+"lambda_demo"+"/ "+pwd+app_name+"/"+stack_names[i]+"_Stack"+"/"+resources["resources"][j]["name"]+"/")
                    let code
                    if(logic){
                        if(resources["type"]=="components"){
                            code =logics.LambdaLogics[language][resources["resources"][j]["name"]]
                        }else{
                            code =logics.LambdaLogics[language][StackType[i]+"_"+resources["resources"][j]["name"]]
                        }
                        if (code!==undefined){

                        writeFile(app_name+"/"+stack_names[i]+"_Stack"+"/"+resources["resources"][j]["name"]+"/"+"app"+extension,code)
                        }
                    } 
                    configs["CodeUri"]=resources["resources"][j]["name"]+"/"
                    configs["Runtime"]=language
                }else if(resources["resources"][j]["type"]=="apigateway"){
                    exec("mkdir "+pwd+app_name+"/"+stack_names[i]+"_Stack"+"/"+resources["resources"][j]["name"]+"_apigateway")
                    configs["path"]=resources["resources"][j]["name"]+"_apigateway"+"/swagger.yaml"
                    configs["filepath"]=app_name+"/"+stack_names[i]+"_Stack"+"/"+resources["resources"][j]["name"]+"_apigateway"+"/swagger.yaml"
                }
                let resources1=rover_resources.resourceGeneration(resources["resources"][j]["type"],configs)
                res[resources["resources"][j]["name"]] = resources1
            }
            let template1= addResourceTemplate(res,Object.keys(res))
            let doc = new yaml.Document();
            doc.contents = template1;
            let temp=yamlReplace(doc.toString())
            writeFile(app_name+"/"+stack_names[i]+"_Stack"+"/template.yaml",temp)   
    }
    let template= addResourceTemplate(stackes,stack_names)
    let doc = new yaml.Document();
    doc.contents = template;
    writeFile(app_name+"/template.yaml",doc.toString())
}
