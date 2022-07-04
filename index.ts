const exec = require("child_process").execSync;
import * as rover_utilities  from "./utlities/utilities.js"
import * as config  from "./utlities/config.js"
import * as deployment  from "./utlities/deployment.js"
let input={
    "app_name":"testres3",
    "language":"node",
    "Stacks":{"emailAuth":"EmailAuthApp","emailAuths":"base_app"},
    "CustomStacks":{"customone":["s3_lambda"]},
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

function  samGeneration(input){
    
    rover_utilities.stackCreation(input)
    exec(config.ForceRemove+input.app_name+config.LambdaDemo)
}

    try{
    samGeneration(input)
    deployment.setupRepo(input.app_name,input.repoconfig)
    }catch(err){
        console.log("ERROR!:",err)
    }

