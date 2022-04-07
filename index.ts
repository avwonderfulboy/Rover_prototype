const exec = require("child_process").execSync;
import * as rover_utilities  from "./utilities.js"
import * as config  from "./config.js"
import * as modules  from "./modules.js"
let input={
    "app_name":"email_auth",
    "language":"node",
    "AppType":"email_auth_app"
}
 function  samGeneration(input){
    let app_name=input.app_name
    let language= config.LanguageSupport[input.language]["version"]
    let dependency=config.LanguageSupport[input.language]["dependency"]
    let extension=config.LanguageSupport[input.language]["extension"]
    exec(config.SAMInitBase+config.SAMLanguage+language+config.SAMDependency+dependency+config.SAMAppName+app_name+config.SAMAppTemplate)
    let app_types=modules.AppType[input["AppType"]]
    rover_utilities.stackCreation(app_name,language,extension,input["AppType"],app_types["no_of_stack"],app_types["stack_names"],app_types["stack_resources"])
}
samGeneration(input)

