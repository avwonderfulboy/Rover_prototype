"use strict";
exports.__esModule = true;
exports.resource_generation = exports.apigatewaypath = exports.skeleton = void 0;
var configs = require("./config.js");
var utilities = require("./utilities");
var yaml = require("yaml");
function skeleton() {
    var template_skeleton = {};
    template_skeleton["AWSTemplateFormatVersion"] = configs.skeleton_config["template_version"];
    template_skeleton["Transform"] = configs.skeleton_config["sam_transform_version"];
    template_skeleton["Description"] = "SAM Template";
    template_skeleton["Globals"] = { "Function": { "Timeout": 30 } };
    template_skeleton["Resources"] = {};
    return template_skeleton;
}
exports.skeleton = skeleton;
function roleAddition(template, config) {
    var policies = [];
    for (var k in config["Policies"]) {
        var role = configs.policySkeleton;
        role["PolicyDocument"]["Statement"][0]["Action"] = config["Policies"][k]["Action"];
        role["PolicyDocument"]["Statement"][0]["Resource"] = config["Policies"][k]["Resource"];
        policies.push(role);
    }
    template["Properties"]["Policies"] = policies;
    return template;
}
function swaggerGenerator(config) {
    var swagger = configs.swagger_skeleton;
    var pathswagger = configs.swagger_path_skeleton;
    for (var i in config["objects"]) {
        var obj_swagger = {};
        obj_swagger[config["objects"][i]["path"]] = {};
        for (var j in config["objects"][i]["methods"]) {
            obj_swagger[config["objects"][i]["path"]][config["objects"][i]["methods"][j]] = pathswagger[config["objects"][i]["methods"][j]];
            var uri = void 0;
            if (config["objects"][i]["resourcetype"] == "lambda") {
                uri = (configs.apigateway_uri[config["objects"][i]["resourcetype"]]).replace("lambda_arn", config["objects"][i]["resource"]);
            }
            obj_swagger[config["objects"][i]["path"]][config["objects"][i]["methods"][j]]["x-amazon-apigateway-integration"]["uri"] = uri;
        }
        swagger["paths"] = obj_swagger;
    }
    var doc = new yaml.Document();
    doc.contents = swagger;
    utilities.file_write(config["filepath"], doc.toString());
}
function apigatewaypath(template, path) {
    var definationbody = {
        "Fn::Transform": {
            "Name": "AWS::Include",
            "Parameters": {
                "Location": path
            }
        }
    };
    template["Properties"]["DefinitionBody"] = definationbody;
    return template;
}
exports.apigatewaypath = apigatewaypath;
var resource_generation = function (resource_name, config) {
    var resource_properties = configs.aws_resources[resource_name];
    var template = {};
    for (var j in resource_properties.attributes) {
        if (resource_properties.attributes[j] == "Type") {
            template[resource_properties.attributes[j]] = configs.aws_resources_types[resource_name];
        }
        else {
            template[resource_properties.attributes[j]] = {};
            for (var k in resource_properties.Properties.Base) {
                template[resource_properties.attributes[j]][resource_properties.Properties.Base[k]] = config[resource_properties.Properties.Base[k]];
            }
            for (var l in resource_properties.Properties.Optional) {
                if (config[resource_properties.Properties.Optional[l]] !== undefined) {
                    template[resource_properties.attributes[j]][resource_properties.Properties.Optional[l]] = config[resource_properties.Properties.Optional[l]];
                }
            }
            for (var m in resource_properties.Properties.Default) {
                template[resource_properties.attributes[j]][resource_properties.Properties.Default[m]["Key"]] = resource_properties.Properties.Default[m]["Value"];
            }
        }
    }
    if (resource_name == "iamrole") {
        template = roleAddition(template, config);
    }
    if (resource_name == "apigateway") {
        if (config.hasOwnProperty("path")) {
            template = apigatewaypath(template, config["path"]);
        }
        if (config.hasOwnProperty("objects")) {
            swaggerGenerator(config);
        }
    }
    return template;
};
exports.resource_generation = resource_generation;
