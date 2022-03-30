const exec = require("child_process").execSync;
import * as rover_utilities  from "./utilities.js"
import * as config  from "./config.js"
import * as modules  from "./modules.js"
let input={
    "app_name":"email_auth",
    "language":"node",
    "app_type":"email_auth_app"
}



 function  sam_gen(input){
    let app_name=input.app_name
    let language= config.lan_support[input.language]["version"]
    let dependency=config.lan_support[input.language]["dependency"]
    let extension=config.lan_support[input.language]["extension"]
    exec(config.sam_init_base+config.sam_language+language+config.sam_dependency+dependency+config.sam_app_name+app_name+config.sam_app_template)
    let app_types=modules.app_type[input["app_type"]]
    rover_utilities.stack_creation(app_name,language,extension,input["app_type"],app_types["no_of_stack"],app_types["stack_names"],app_types["stack_resources"])

}
    
    
   
sam_gen(input)

