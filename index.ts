const exec = require("child_process").execSync;
import * as rover_utilities  from "./utilities.js"
import * as config  from "./config.js"

let input={
    "app_name":"testres3",
    "language":"node",
    "Stacks":{"emailAuth":"EmailAuthApp","emailAuths":"base_app"},
    "CustomStacks":{"customone":["s3_lambda"],"customtwo":["s3_lambda"]},
    "repoconfig": {
        "name":"SAM",
        "repotype":"public",
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
    "StackType":"EmailAuthApp",
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

