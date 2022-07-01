import * as config  from "./config.js"
export let Components={
    "s3_lambda":{
        "name":"lambdas",
        "type":"lambda",
        "config":{
            "Environment": {
                "Variables": {
               
                }
            },
            "Policies": [
              "AWSLambdaDynamoDBExecutionRole"
            ]
          },
        "logic":true
    },
}