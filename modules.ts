import * as configs  from "./config.js"
export let app_type={
    "base_app":{
        "no_of_stack":2,
        "stack_names":["stack1","stack2"],
        "stack_resources":{
            "stack1":{
                "resources":[
                    {
                        "name":"lam1",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":[]
                    },
                    {
                        "name":"lam2",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":[]
                    }
                ],
                
            },
            "stack2":{
                "resources":[
                    {
                        "name":"lam3",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":[]
                    },
                    {
                        "name":"lam4",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":[]
                    }
            ],
               
            }
            
        }
    },
    "email_auth_app":{
        "no_of_stack":1,
        "stack_names":["emailAuth"],
        "stack_resources":{
            "emailAuth":{
                "resources":[
                    {
                        "name":"PostSignup",
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
                        "logic":[]
                    },
                    {
                        "name":"UserTabel",
                        "type":"dynamoDB",
                        "config":{
                            "BillingMode": "PAY_PER_REQUEST",
                            "AttributeDefinitions": [
                              {
                                "AttributeName": "email",
                                "AttributeType": "S"
                              }
                            ],
                            "KeySchema": [
                              {
                                "AttributeName": "email",
                                "KeyType": "HASH"
                              }
                            ]
                          },
                        "logic":[]
                    },
                    {
                        "name":"emailAuthPermission",
                        "type":"lambdaPermission",
                        "config":{
                           
                            "FunctionName": {"Fn::GetAtt": ["PostSignup","Arn"]},
                            "Principal": "cognito-idp.amazonaws.com",
                            "SourceArn": {"Fn::GetAtt": ["AuthUserPool","Arn"]}
                        },
                        "logic":[]
                    },
                    {
                        "name":"AuthUserPool",
                        "type":"cognitoUserPool",
                        "config":{
                            "UserPoolName": "Auth-User-Pool",
                            "AutoVerifiedAttributes": [
                                configs.CognitoAutoVerifiedAttributes[0]
                            ],
                            "AliasAttributes": [
                                configs.CognitoAliasAttributes[0]
                            ],
                            "Policies": {
                              "PasswordPolicy": {
                                "MinimumLength": 8,
                                "RequireUppercase": true,
                                "RequireLowercase": true,
                                "RequireNumbers": true,
                                "RequireSymbols": true
                              }
                            },
                            "Schema": [
                              {
                                "AttributeDataType": "String",
                                "Name": "email",
                                "Required": true
                              }
                            ],
                            "LambdaConfig": {
                              "PostConfirmation":  {"Fn::GetAtt": ["PostSignup","Arn"]}
                            }
                          },
                        "logic":[]
                    },
                    {
                        "name":"AuthUserPoolClient",
                        "type":"userPoolClient",
                        "config":{
                            "UserPoolId": { "Ref" : "AuthUserPool"},
                            "GenerateSecret": false,
                            "SupportedIdentityProviders": [
                                configs.CognitoSupportedIdentityProviders[0]
                            ],
                            "AllowedOAuthFlows": [
                                configs.CognitoAllowedOAuthFlows[1]
                            ],
                            "AllowedOAuthScopes": [
                                configs.CognitoAllowedOAuthScopes[0],
                                configs.CognitoAllowedOAuthScopes[1],
                                configs.CognitoAllowedOAuthScopes[2],
                                configs.CognitoAllowedOAuthScopes[3],
                                configs.CognitoAllowedOAuthScopes[4]
                            ],
                            "ExplicitAuthFlows": [
                                configs.CognitoExplicitAuthFlows[2],
                                configs.CognitoExplicitAuthFlows[4]
                            ],
                            "AllowedOAuthFlowsUserPoolClient": true,
                            "CallbackURLs": [
                              "https://www.google.com"
                            ]
                          },
                        "logic":[]
                    },
                    {
                        "name":"emailAuthRole",
                        "type":"iamrole",
                        "config":{
                            "Path": "/",
                            "Policies":[
                                {
                                    "Action": "lambda:InvokeFunction",
                                    "Resource": { "Fn::Sub":"arn:aws:lambda:*:${AWS::AccountId}:function:*"}
                                }
                            ]
                        },
                        "logic":[]
                    },
                    {
                      "name":"loginapi",
                      "type":"apigateway",
                      "config":{
                          "objects":[
                          {
                            "name":"Books",
                            "methods":["get","post"],
                            "resource":"PostSignup",
                            "path":"books/",
                            "resourcetype":"lambda"
                          }
                          ]
                          
                        },
                      "logic":[]
                  },
                ]
            
            }
        }
    }
    }
    