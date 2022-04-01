"use strict";
exports.__esModule = true;
var exec = require("child_process").execSync;
var rover_utilities = require("./utilities.js");
var config = require("./config.js");
var modules = require("./modules.js");
var input = {
    "app_name": "email_auth",
    "language": "node",
    "app_type": "email_auth_app"
};
function sam_gen(input) {
    var app_name = input.app_name;
    var language = config.lan_support[input.language]["version"];
    var dependency = config.lan_support[input.language]["dependency"];
    var extension = config.lan_support[input.language]["extension"];
    exec(config.sam_init_base + config.sam_language + language + config.sam_dependency + dependency + config.sam_app_name + app_name + config.sam_app_template);
    var app_types = modules.app_type[input["app_type"]];
    rover_utilities.stack_creation(app_name, language, extension, input["app_type"], app_types["no_of_stack"], app_types["stack_names"], app_types["stack_resources"]);
}
sam_gen(input);
