"use strict";
exports.__esModule = true;
exports.stack_creation = exports.add_resource_template = exports.file_write = exports.pwd = void 0;
var rover_resources = require("./resources.js");
var logics = require("./logics.js");
var exec = require("child_process").execSync;
var yaml = require("yaml");
var fs = require("fs");
exports.pwd = process.cwd() + "/";
var doc = new yaml.Document();
function file_write(path, data) {
    fs.writeFileSync(exports.pwd + "/" + path, data);
}
exports.file_write = file_write;
function add_resource_template(resources, name) {
    var template = rover_resources.skeleton();
    for (var i in name) {
        template["Resources"][name[i]] = resources[name[i]];
    }
    return template;
}
exports.add_resource_template = add_resource_template;
function stack_creation(app_name, language, extension, app_type, stack_number, stack_names, resource) {
    var j = exec("mv " + exports.pwd + app_name + "/hello-world " + exports.pwd + app_name + "/" + "lambda_demo");
    var stackes = {};
    for (var i = 0; i < stack_number; i++) {
        var stacks = rover_resources.resource_generation("stack", { "TemplateURL": stack_names[i] + "_Stack" + "/template.yaml" });
        stackes[stack_names[i]] = stacks;
        exec("mkdir " + exports.pwd + app_name + "/" + stack_names[i] + "_Stack");
        var resources = resource[stack_names[i]];
        var res = {};
        for (var j_1 in resources["resources"]) {
            var configs = resources["resources"][j_1]["config"];
            if (resources["resources"][j_1]["type"] == "lambda") {
                exec("cp -r " + exports.pwd + app_name + "/" + "lambda_demo" + "/ " + exports.pwd + app_name + "/" + stack_names[i] + "_Stack" + "/" + resources["resources"][j_1]["name"] + "/");
                file_write(app_name + "/" + stack_names[i] + "_Stack" + "/" + resources["resources"][j_1]["name"] + "/" + "app" + extension, logics.lambda_logics[language][app_type][resources["resources"][j_1]["name"]]);
                //console.log(resources["resources"][j]["name"])
                configs["CodeUri"] = resources["resources"][j_1]["name"] + "/";
                configs["Runtime"] = language;
                configs["FunctionName"] = resources["resources"][j_1]["name"];
            }
            else if (resources["resources"][j_1]["type"] == "dynamoDB") {
                configs["TableName"] = resources["resources"][j_1]["name"];
            }
            else if (resources["resources"][j_1]["type"] == "cognitoUserPool") {
                configs["UserPoolName"] = resources["resources"][j_1]["name"];
            }
            else if (resources["resources"][j_1]["type"] == "lambdaPermission") {
                configs["Name"] = resources["resources"][j_1]["name"];
            }
            else if (resources["resources"][j_1]["type"] == "userPoolClient") {
                configs["ClientName"] = resources["resources"][j_1]["name"];
            }
            else if (resources["resources"][j_1]["type"] == "iamrole") {
                configs["RoleName"] = resources["resources"][j_1]["name"];
            }
            else if (resources["resources"][j_1]["type"] == "apigateway") {
                exec("mkdir " + exports.pwd + app_name + "/" + stack_names[i] + "_Stack" + "/" + resources["resources"][j_1]["name"] + "_apigateway");
                // exec("cp  "+resources["resources"][j]["config"]["path"]+" "+pwd+app_name+"/"+stack_names[i]+"_Stack"+"/"+resources["resources"][j]["name"]+"_apigateway"+"/swagger.yaml")
                configs["StageName"] = resources["resources"][j_1]["name"];
                configs["path"] = resources["resources"][j_1]["name"] + "_apigateway" + "/swagger.yaml";
                configs["filepath"] = app_name + "/" + stack_names[i] + "_Stack" + "/" + resources["resources"][j_1]["name"] + "_apigateway" + "/swagger.yaml";
            }
            var resources1 = rover_resources.resource_generation(resources["resources"][j_1]["type"], configs);
            res[resources["resources"][j_1]["name"]] = resources1;
        }
        var template1 = add_resource_template(res, Object.keys(res));
        var doc_1 = new yaml.Document();
        doc_1.contents = template1;
        file_write(app_name + "/" + stack_names[i] + "_Stack" + "/template.yaml", doc_1.toString());
    }
    var template = add_resource_template(stackes, stack_names);
    var doc = new yaml.Document();
    doc.contents = template;
    file_write(app_name + "/template.yaml", doc.toString());
}
exports.stack_creation = stack_creation;
