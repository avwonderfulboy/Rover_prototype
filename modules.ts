import * as config  from "./config.js"
export let StackType={
  
    "base_app":{
       
            "l1":{
                "resources":[
                    {
                        "name":"lam1",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":false
                    },
                    {
                        "name":"lam2",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":false
                    }
                ],
            },
            "l2":{
                "resources":[
                    {
                        "name":"lam3",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":false
                    },
                    {
                        "name":"lam4",
                        "type":"lambda",
                        "config":{},
                        "policies":{},
                        "logic":false
                    }
            ],
            }
        
    },
    "base_app2":{
      "stack_resources":{
          "landauerStack":{
              "resources":[
                  {
                      "name":"ESDumpDataFunction",
                      "type":"lambda",
                      "config":{},
                      "policies":{},
                      "logic":false
                  },
                  
              ],
          }
      }
  },
    "test_app":{
        "no_of_stack":1,
        "stack_names":["test"],
        "stack_resources":{
            "test":{
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
                        "logic":true
                    },
                    {
                      "name":"S3Bucket",
                      "type":"s3bucket",
                      "config":{},
                      "logic":false
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
                        "logic":false
                    },
                    {
                        "name":"emailAuthPermission",
                        "type":"lambdaPermission",
                        "config":{
                           
                            "FunctionName": {"Fn::GetAtt": ["PostSignup","Arn"]},
                            "Principal": "cognito-idp.amazonaws.com",
                            "SourceArn": {"Fn::GetAtt": ["AuthUserPools","Arn"]}
                        },
                        "logic":false
                    },
                    {
                        "name":"AuthUserPools",
                        "type":"cognitoUserPool",
                        "config":{
                            "UserPoolName": "Auth-User-Pool",
                            "AutoVerifiedAttributes": [
                                config.CognitoAutoVerifiedAttributes[0]
                            ],
                            "AliasAttributes": [
                                config.CognitoAliasAttributes[0]
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
                        "logic":false
                    },
                    {
                        "name":"AuthUserPoolsClient",
                        "type":"userPoolClient",
                        "config":{
                            "UserPoolId": { "Ref" : "AuthUserPools"},
                            "GenerateSecret": false,
                            "SupportedIdentityProviders": [
                                config.CognitoSupportedIdentityProviders[0]
                            ],
                            "AllowedOAuthFlows": [
                                config.CognitoAllowedOAuthFlows[1]
                            ],
                            "AllowedOAuthScopes": [
                                config.CognitoAllowedOAuthScopes[0],
                                config.CognitoAllowedOAuthScopes[1],
                                config.CognitoAllowedOAuthScopes[2],
                                config.CognitoAllowedOAuthScopes[3],
                                config.CognitoAllowedOAuthScopes[4]
                            ],
                            "ExplicitAuthFlows": [
                                config.CognitoExplicitAuthFlows[2],
                                config.CognitoExplicitAuthFlows[4]
                            ],
                            "AllowedOAuthFlowsUserPoolClient": true,
                            "CallbackURLs": [
                              "https://www.google.com"
                            ]
                          },
                        "logic":false
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
                        "logic":false
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
                            "path":"/books",
                            "resourcetype":"lambda"
                          },
                          {
                            "name":"Authors",
                            "methods":["get","post","put","delete"],
                            "resource":"PostSignup",
                            "path":"/authors",
                            "resourcetype":"lambda"
                          }
                          ]
                        },
                      "logic":false
                    },
                ]
            
            }
        }
    },
    "email_auth_app":{
          "email_auth_app":{
              "resources":[
                  {
                      "name":"DefineAuthChallenge",
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
                  {
                    "name":"AuthorizerFunction",
                    "type":"lambda",
                    "config":{
                        "Environment": {
                            "Variables": {
                            "UserPoolID": { "Ref" : "AuthUserPools"},
                            "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"}
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
                  {
                    "name":"CreateAuthChallenge",
                    "type":"lambda",
                    "config":{
                      "Environment": {
                        "Variables": {
                          "SES_FROM_ADDRESS": {"Ref": "VerifyAuthChallengeResponse"}
                        }
                      },
                      "Policies": [
                        {
                          "Version": "2012-10-17",
                          "Statement": [
                            {
                              "Effect": "Allow",
                              "Action": [
                                "ses:SendEmail"
                              ],
                              "Resource": "*"
                            }
                          ]
                        }
                      ]
                      },
                    "logic":true
                  },
                  {
                    "name":"VerifyAuthChallengeResponse",
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
                              "TableName": { "Ref" : "UserTabel"},
                              "USERPOOLID": { "Ref" : "AuthUserPools"}
                            }
                          }
                        ]
                      },
                    "logic":true
                  },
                  {
                    "name":"PreSignUp",
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
                  {
                    "name":"SignUpFunctions",
                    "type":"lambda",
                    "config":{
                        "Role":  {"Fn::GetAtt": [ "SignUpRoles","Arn"]},
                        "Environment": {
                            "Variables": {
                              "UserPoolID": { "Ref" : "AuthUserPools"},
                              "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"},
                              "userinfoTable": { "Ref" : "UserTabel"}
                            }
                        },
                        "Policies": [
                          "AWSLambdaDynamoDBExecutionRole",
                          {
                            "DynamoDBCrudPolicy": {
                              "TableName": { "Ref" : "UserTabel"},
                              "USERPOOLID": { "Ref" : "AuthUserPools"}
                            }
                          }
                        ]
                      },
                    "logic":true
                  },
                  {
                    "name":"ResendCode",
                    "type":"lambda",
                    "config":{
                        "Role":  {"Fn::GetAtt": [ "SignUpRoles","Arn"]},
                        "Environment": {
                            "Variables": {
                              "UserPoolID": { "Ref" : "AuthUserPools"},
                              "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"},
                            "userinfoTable": { "Ref" : "UserTabel"}
                            }
                        },
                        "Policies": [
                          "AWSLambdaDynamoDBExecutionRole",
                          {
                            "DynamoDBCrudPolicy": {
                              "TableName": { "Ref" : "UserTabel"},
                              "UserPoolID": { "Ref" : "AuthUserPools"},
                              "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"}
                            }
                          }
                        ]
                      },
                    "logic":true
                  },
                  {
                    "name":"ConfirmForgotPassword",
                    "type":"lambda",
                    "config":{
                        "Role":  {"Fn::GetAtt": [ "SignUpRoles","Arn"]},
                        "Environment": {
                            "Variables": {
                              "UserPoolID": { "Ref" : "AuthUserPools"},
                              "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"},
                            "userinfoTable": { "Ref" : "UserTabel"}
                            }
                        },
                        "Policies": [
                          "AWSLambdaDynamoDBExecutionRole",
                          {
                            "DynamoDBCrudPolicy": {
                              "TableName": { "Ref" : "UserTabel"},
                              "USERPOOLID": { "Ref" : "AuthUserPools"}
                            }
                          }
                        ]
                      },
                    "logic":true
                  },
                  {
                    "name":"ForgotPassword",
                    "type":"lambda",
                    "config":{
                        "Role":  {"Fn::GetAtt": [ "SignUpRoles","Arn"]},
                        "Environment": {
                            "Variables": {
                              "UserPoolID": { "Ref" : "AuthUserPools"},
                              "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"},
                            "userinfoTable": { "Ref" : "UserTabel"}
                            }
                        },
                        "Policies": [
                          "AWSLambdaDynamoDBExecutionRole",
                          {
                            "DynamoDBCrudPolicy": {
                              "TableName": { "Ref" : "UserTabel"},
                              "USERPOOLID": { "Ref" : "AuthUserPools"}
                            }
                          }
                        ]
                      },
                    "logic":true
                  },
                  {
                    "name":"ConfirmUser",
                    "type":"lambda",
                    "config":{
                        "Role":  {"Fn::GetAtt": [ "SignUpRoles","Arn"]},
                        "Environment": {
                            "Variables": {
                              "UserPoolID": { "Ref" : "AuthUserPools"},
                              "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"},
                              "userinfoTable": { "Ref" : "UserTabel"}
                            }
                        },
                        "Policies": [
                          "AWSLambdaDynamoDBExecutionRole",
                          {
                            "DynamoDBCrudPolicy": {
                              "TableName": { "Ref" : "UserTabel"},
                              
                            }
                          }
                        ]
                      },
                    "logic":true
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
                      "logic":false
                  },
                  {
                      "name":"CreateAuthChallengeInvocationPermission",
                      "type":"lambdaPermission",
                      "config":{
                         
                        "Action": "lambda:InvokeFunction",
                        "FunctionName":  {"Fn::GetAtt": [ "CreateAuthChallenge","Arn"]},
                        "Principal": "cognito-idp.amazonaws.com",
                        "SourceArn":  {"Fn::GetAtt": [ "AuthUserPools","Arn"]}
                      },
                      "logic":false
                  },
                  {
                    "name":"DefineAuthChallengeInvocationPermission",
                    "type":"lambdaPermission",
                    "config":{
                       
                      "Action": "lambda:InvokeFunction",
                      "FunctionName":  {"Fn::GetAtt": [ "DefineAuthChallenge","Arn"]},
                      "Principal": "cognito-idp.amazonaws.com",
                      "SourceArn":  {"Fn::GetAtt": [ "AuthUserPools","Arn"]}
                    },
                    "logic":false
                  },
                  {
                  "name":"VerifyAuthChallengeResponseInvocationPermission",
                  "type":"lambdaPermission",
                  "config":{
                     
                    "Action": "lambda:InvokeFunction",
                    "FunctionName":  {"Fn::GetAtt": [ "VerifyAuthChallengeResponse","Arn"]},
                    "Principal": "cognito-idp.amazonaws.com",
                    "SourceArn":  {"Fn::GetAtt": [ "AuthUserPools","Arn"]}
                  },
                  "logic":false
                  },
                  {
                "name":"SignUpInvocationPermission",
                "type":"lambdaPermission",
                "config":{
                    "Principal": "cognito-idp.amazonaws.com",
                    "Action": "lambda:InvokeFunction",
                    "FunctionName": {"Fn::GetAtt": ["SignUpFunctions","Arn"]},
                    "SourceArn":  {"Fn::GetAtt": [ "AuthUserPools","Arn"]}
                },
                "logic":false
                  },
                  {
              "name":"PreSignUpInvocationPermission",
              "type":"lambdaPermission",
              "config":{
                 
                "Action": "lambda:InvokeFunction",
                "FunctionName":  {"Fn::GetAtt": [ "PreSignUp","Arn"]},
                "Principal": "cognito-idp.amazonaws.com",
                "SourceArn":  {"Fn::GetAtt": [ "AuthUserPools","Arn"]}

                 
              },
              "logic":false
                  },
                  {
                      "name":"AuthUserPools",
                      "type":"cognitoUserPool",
                      "config":{
                          UserPoolName: "Auth-User-Pool",
                          MfaConfiguration: "OFF",
                          AutoVerifiedAttributes:[
                            "email"
                          ],
                          EmailVerificationSubject: "Your verification code",
                          EmailVerificationMessage: "Your verification code is {####}",
                          EmailConfiguration:{EmailSendingAccount: "COGNITO_DEFAULT"},
                          UsernameAttributes: [
                            "email"
                          ],
                          Schema: [
                            {
                              "Name": "name",
                              "AttributeDataType": "String",
                              "Mutable": true,
                              "Required": true
                            },
                            {
                              "Name": "email",
                              "AttributeDataType": "String",
                              "Mutable": true,
                              "Required": true
                            }
                          ],
                          Policies: {
                            "PasswordPolicy": {
                              "MinimumLength": 8,
                              "RequireUppercase": true,
                              "RequireLowercase": true,
                              "RequireNumbers": true,
                              "RequireSymbols": true
                            }
                          },
                          LambdaConfig: {
                            "CreateAuthChallenge":          {"Fn::GetAtt": [ "CreateAuthChallenge","Arn"]},
                            "DefineAuthChallenge":          {"Fn::GetAtt": [ "DefineAuthChallenge","Arn"]},
                            "PreSignUp":                    {"Fn::GetAtt": [ "PreSignUp","Arn"]},
                            "VerifyAuthChallengeResponse":  {"Fn::GetAtt": [ "VerifyAuthChallengeResponse","Arn"]},
                            
                          }
                        },
                      "logic":false
                  },
                  {
                      "name":"AuthUserPoolsClient",
                      "type":"userPoolClient",
                      "config":{
                          "UserPoolId": { "Ref" : "AuthUserPools"},
                          "ClientName": "email-auth-client",
                          "GenerateSecret": false,
                          
                          "ExplicitAuthFlows": [
                            "CUSTOM_AUTH_FLOW_ONLY"
                          ]
                          
                        },
                      "logic":false
                  },
                  {
                      "name":"SignUpRoles",
                      "type":"iamrole",
                      "config":{
                       "iamservice":["lambda.amazonaws.com","apigateway.amazonaws.com"],
                       "managedarn":["AWSLambdaBasicExecutionRole","AmazonAPIGatewayPushToCloudWatchLogs"],
                       "Path": "/",
                       "Policies":[
                           {  "name":"lambdainvoke",
                               "Action": "lambda:InvokeFunction",
                               "Resource": { "Fn::Sub":"arn:aws:lambda:*:${AWS::AccountId}:function:*"}
                           },
                           {  "name":"cognito",
                               "Action": "cognito-idp:ListUsers",
                               "Resource": { "Fn::Sub":"arn:aws:cognito-idp:*:${AWS::AccountId}:userpool/*"}
                           },
                           {  "name":"dynamodbcrud",
                               "Action":  [
                                "dynamodb:GetItem",
                                "dynamodb:DeleteItem",
                                "dynamodb:PutItem",
                                "dynamodb:Scan",
                                "dynamodb:Query",
                                "dynamodb:UpdateItem",
                                "dynamodb:BatchWriteItem",
                                "dynamodb:BatchGetItem",
                                "dynamodb:DescribeTable",
                                "dynamodb:ConditionCheckItem"
                            ],
                               "Resource":[ { "Fn::Sub":"arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel"},
                               { "Fn::Sub":"arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel/index/*"}
            ]
                           }
                       ]
                          
                      },
                      "logic":false
                  },
                  {
                    "name":"AllowSetUserAttributes",
                    "type":"iampolicy",
                    "config":{
                        
                        "Statement":[
                            {
                                "Action": "cognito-idp:AdminUpdateUserAttributes",
                                "Resource":   {"Fn::GetAtt": [ "AuthUserPools","Arn"]},
                                "Effect": "Allow"
                            }
                       
                        ],
                        "Roles": [{"Ref" : "SignUpRoles"}],
                        "PolicyName": "AllowSetUserAttributespolicy"
                    },
                    "logic":false
                  },
                  {
                    "name":"EmailAuthAPIs",
                    "type":"apigateway",
                    "config":{
                      "StageName":"dev",
                        "objects":[
                        {
                          "name":"SignUpFunctions",
                          "methods":["post"],
                          "resource":"SignUpFunctions",
                          "role":"SignUpRoles",
                          "path":"/SignUp",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"SignIn",
                          "methods":["post"],
                          "resource":"SignUpFunctions",
                          "role":"SignUpRoles",
                          "path":"/signin",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"ConfirmUser",
                          "methods":["post"],
                          "resource":"ConfirmUser",
                          "role":"SignUpRoles",
                          "path":"/confirmuser",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"ResendCode",
                          "methods":["post"],
                          "resource":"ResendCode",
                          "role":"SignUpRoles",
                          "path":"/resendcode",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"ConfirmForgotPassword",
                          "methods":["post"],
                          "resource":"ConfirmForgotPassword",
                          "role":"SignUpRoles",
                          "path":"/confirmforgotPassword",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"ForgotPassword",
                          "methods":["post"],
                          "resource":"ForgotPassword",
                          "role":"SignUpRoles",
                          "path":"/forgotpassword",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"Users",
                          "methods":["get","put","delete"],
                          "resource":"ForgotPassword",
                          "role":"SignUpRoles",
                          "path":"/users",
                          "resourcetype":"lambda"
                        }
                        ],
                        "security":{
                          api_key:{
                            "apikeyName":"user_apikey",
                            "type":"apiKey",
                            "name": "x-api-key",
                            "in": "header",
                        },
                          authorizer:{
                            "authorizerName":"user_authorizer",
                            "type":"oauth2",
                            "x-amazon-apigateway-authorizer": {
                              "type": "jwt",
                              "jwtConfiguration": {
                                 "issuer": "https://cognito-idp.region.amazonaws.com/UserPoolId",
                                 "audience": [
                                   "audience1",
                                   "audience2"
                                 ]
                               },
                               "identitySource": "$request.header.Authorization"
                          }}
                        }
                       
                      },
                    "logic":false
                  },
                  {
                      "name":"ClientApiKey",
                      "type":"apikey",
                      "config": {
                        "DependsOn":["EmailAuthAPIs","EmailAuthAPIsdevStage"],
                        "Enabled": true,
                        "StageKeys": [
                          {
                            "RestApiId": {"Ref":  "EmailAuthAPIs"},
                            "StageName": "dev"
                          },
                        ],
                        
                      }
                    
                  },
                  {
                      "name":"ClientOrderUsagePlan",
                      "type": "usageplan",
                      "config": {
                        "DependsOn":["ClientApiKey"],
                        "ApiStages": [
                          {
                            "ApiId": {"Ref" :"EmailAuthAPIs"},
                            "Stage": "dev"
                          }
                        ],
                        "Description": "Client Orders's usage plan",
                        "Throttle": {
                          "BurstLimit": 5,
                          "RateLimit": 5
                        }
                      }
                    
                  },
                  {
                    "name":"ClientOrderUsagePlanKey",
                    "type": "usageplankey",
                    "config": {
                      "DependsOn":["ClientOrderUsagePlan"],
                      "KeyId": {"Ref" :"ClientApiKey"},
                      "KeyType": "API_KEY",
                      "UsagePlanId": {"Ref" :"ClientOrderUsagePlan"}
                    }
                  
                  },
                  {
                      "name":"CognitoAuthorizer",
                      "type": "apiauthorizer",
                      "config": {
                        "IdentitySource": "method.request.header.authorization",
                        "Name": "CognitoAuthorizer",
                        "ProviderARNs": [
                          {"Fn::GetAtt": [ "AuthUserPools","Arn"]},
                        ],
                        "RestApiId":{"Ref" :"EmailAuthAPIs"},
                        "Type": "COGNITO_USER_POOLS"
                      }
                    
                  }
                  
              ]
          
          }
      
  }
}

    