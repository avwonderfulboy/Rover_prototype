import * as config  from "./config.js"
export let Components={
    "s3_lambda":{
        "name":"s3_lambda",
        "type":"lambda",
        "config":{
            "Environment": {
                "Variables": {
                "userinfoTable": { "Ref" : "UserTabel"}
                }
            },
            "Policies": [
              "AWSLambdaDynamoDBExecutionRole",
              {
                "DynamoDBCrudPolicy": {
                  "TableName": { "Ref" : "UserTabel"}
                }
              }
            ]
          },
        "logic":true
    },
}