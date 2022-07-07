import * as config  from "../utlities/config"
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

export let ModuleDescription={
  "s3_lambda":"lambda with S3 as trigger",
 
}