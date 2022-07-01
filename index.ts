const exec = require("child_process").execSync;
import * as rover_utilities  from "./utilities.js"
import * as config  from "./config.js"
import * as modules  from "./modules.js"
import * as deployment from "./deployment.js"
import * as utilities from "./utilities.js"
let input={
    "app_name":"testres3",
    "language":"node",
    "StackNames":["emailAuth"],
    "AppType":["email_auth_app"],
    "moduleconfig":{},
    "repotype":"public",
    "repoconfig": {
        "name":"SAM",
        "tool":"git",
        "language":"js",
        "framework":"sam",
        "no_envs":1,
        "accesskey":"AKIA57GLKGCHUY3HMT56",
        "secretkey":"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",
        "envs":["dev"],
        "steps":{
            "dev":["build","deploy"]
        },
        "stackname":{
            "dev":"",
        },
        "deploymentbucket":{
            "dev":"",
            
        },
        "deploymentregion":
        {
            "dev":"ap-south-1"
        },
        "deploymentparameters":{ "dev":{}},
        "deployment_event":["push"]
    
    }
}
let input1={
    "app_name":"landaurePOC",
    "language":"node",
    "AppType":"email_auth_app",
    "moduleconfig":{},
    "repotype":"public",
    "repoconfig": {
        "name":"SAM",
        "tool":"git",
        "language":"js",
        "framework":"sam",
        "no_envs":1,
        "accesskey":"AKIA57GLKGCHUY3HMT56",
        "secretkey":"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",
        "envs":["dev"],
        "steps":{
            "dev":["build","deploy"]
        },
        "stackname":{
            "dev":"",
        },
        "deploymentbucket":{
            "dev":"",
            
        },
        "deploymentregion":
        {
            "dev":"ap-south-1"
        },
        "deploymentparameters":{ "dev":{}},
        "deployment_event":["push"]
    
    }
}
function  samGeneration2(input){
    let app_name=input.app_name
    exec(config.ForceRemove+input.app_name)
    let language= config.LanguageSupport[input.language]["version"]
    let dependency=config.LanguageSupport[input.language]["dependency"]
    let extension=config.LanguageSupport[input.language]["extension"]
    exec(config.SAMInitBase+config.SAMLanguage+language+config.SAMDependency+dependency+config.SAMAppName+app_name+config.SAMAppTemplate)
    let app_types
    if(input["AppType"]==="customizable"){
        app_types=input["moduleconfig"]
    }else{
        app_types=modules.AppType[input["AppType"]]
    }
    //rover_utilities.stackCreation(app_name,language,extension,input["AppType"],app_types["no_of_stack"],app_types["stack_names"],app_types["stack_resources"])
    exec(config.ForceRemove+input.app_name+config.LambdaDemo)
}
function  samGeneration(input){
    
    rover_utilities.stackCreation(input)
    exec(config.ForceRemove+input.app_name+config.LambdaDemo)
}

try{
    samGeneration(input)
    //let repoconfig=JSON.stringify(input.repoconfig)
    //console.log(repoconfig)
    //deployment.setupRepo(input.app_name,input.repotype,repoconfig)
    }catch(err){
        console.log("ERROR!:",err)
    }

