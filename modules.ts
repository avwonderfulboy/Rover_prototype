import * as config  from "./config.js"
export let AppType={
  
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
            "stack2":{
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
                            "SourceArn": {"Fn::GetAtt": ["AuthUserPool","Arn"]}
                        },
                        "logic":false
                    },
                    {
                        "name":"AuthUserPool",
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
                        "name":"AuthUserPoolClient",
                        "type":"userPoolClient",
                        "config":{
                            "UserPoolId": { "Ref" : "AuthUserPool"},
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
      "no_of_stack":1,
      "stack_names":["emailAuth"],
      "stack_resources":{
          "emailAuth":{
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
                              "TableName": { "Ref" : "UserTabel"}
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
                    "name":"PostAuthentication",
                    "type":"lambda",
                    "config":{
                        "Role":  {"Fn::GetAtt": [ "PostAuthenticationRole","Arn"]},
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
                        "SourceArn":  {"Fn::GetAtt": [ "AuthUserPool","Arn"]}
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
                      "SourceArn":  {"Fn::GetAtt": [ "AuthUserPool","Arn"]}
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
                    "SourceArn":  {"Fn::GetAtt": [ "AuthUserPool","Arn"]}
                  },
                  "logic":false
                  },
                  {
                "name":"PostAuthenticationInvocationPermission",
                "type":"lambdaPermission",
                "config":{
                    "Principal": "cognito-idp.amazonaws.com",
                    "Action": "lambda:InvokeFunction",
                    "FunctionName": {"Fn::GetAtt": ["PostAuthentication","Arn"]},
                    "SourceArn":  {"Fn::GetAtt": [ "AuthUserPool","Arn"]}
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
                "SourceArn":  {"Fn::GetAtt": [ "AuthUserPool","Arn"]}

                 
              },
              "logic":false
                  },
                  {
                      "name":"AuthUserPool",
                      "type":"cognitoUserPool",
                      "config":{
                          UserPoolName: "Auth-User-Pool",
                          MfaConfiguration: "OFF",
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
                            "CreateAuthChallenge":  {"Fn::GetAtt": [ "CreateAuthChallenge","Arn"]},
                            "DefineAuthChallenge":  {"Fn::GetAtt": [ "DefineAuthChallenge","Arn"]},
                            "PreSignUp":  {"Fn::GetAtt": [ "PreSignUp","Arn"]},
                            "VerifyAuthChallengeResponse":  {"Fn::GetAtt": [ "VerifyAuthChallengeResponse","Arn"]},
                            "PostAuthentication":  {"Fn::GetAtt": [ "PostAuthentication","Arn"]}
                          }
                        },
                      "logic":false
                  },
                  {
                      "name":"AuthUserPoolClient",
                      "type":"userPoolClient",
                      "config":{
                          "UserPoolId": { "Ref" : "AuthUserPool"},
                          "ClientName": "email-auth-client",
                          "GenerateSecret": false,
                          
                          "ExplicitAuthFlows": [
                            "CUSTOM_AUTH_FLOW_ONLY"
                          ]
                          
                        },
                      "logic":false
                  },
                  {
                      "name":"PostAuthenticationRoles",
                      "type":"iamrole",
                      "config":{
                       "iamservice":["AWSLambdaBasicExecutionRole"]
                          
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
                                "Resource":   {"Fn::GetAtt": [ "AuthUserPool","Arn"]},
                                "Effect": "Allow"
                            }
                       
                        ],
                        "Roles": [{"Ref" : "PostAuthenticationRole"}],
                        "PolicyName": "AllowSetUserAttributespolicy"
                    },
                    "logic":false
                  },
                  {
                    "name":"EmailAuthAPIs",
                    "type":"apigateway",
                    "config":{
                        "objects":[
                        {
                          "name":"SignUp",
                          "methods":["post"],
                          "resource":"PostSignup",
                          "iamservices":[],
                          "path":"/signup",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"SignIn",
                          "methods":["post"],
                          "resource":"PostSignup",
                          "iamservices":[],
                          "path":"/signin",
                          "resourcetype":"lambda"
                        },
                        {
                          "name":"ResetPassword",
                          "methods":["post"],
                          "resource":"PostSignup",
                          "iamservices":[],
                          "path":"/resetpassword",
                          "resourcetype":"lambda"
                        }
                        ]
                      },
                    "logic":false
                  },
              ]
          
          }
      }
  }
}

    