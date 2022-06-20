export let SkeletonConfig={}
SkeletonConfig["template_version"]="2010-09-09"
SkeletonConfig["sam_transform_version"]="AWS::Serverless-2016-10-31"

export let SAMInitBase="sam init --no-interactive "
export let SAMLanguage=" -r "
export let SAMDependency=" -d "
export let SAMAppName=" -n "
export let SAMAppTemplate=" --app-template hello-world"
export let ForceRemove = "rm -rf "
export let LambdaDemo = "/lambda_demo"
export let StepfunctionStateTypes=["Succeed","Fail","Parallel","Map","Pass","Wait","Task","Choice"]

export let StepfunctionStates={
      "Type" : "",
      "Resource": "",
      "Next": "",
      "Comment": ""
}
export let StepfunctionStatesTypeSkeletons={
      "Task": {
        "Comment": "Task State example",
        "Type": "Task",
        "Resource": "arn:aws:states:us-east-1:123456789012:task:HelloWorld",
        "Next": "NextState",
        "TimeoutSeconds": 300,
        "HeartbeatSeconds": 60
      },
      "Pass":{
        "Type": "Pass",
        "Result": {},
        "ResultPath": "$.coords",
        "Next": "End"
      },
      "Choice":{
        "Type" : "Choice",
        "Choices":[],
        "Default": "RecordEvent"
          
      },
      "Wait":{
            "Type" : "Wait",
            "Seconds" : 10,
            "Timestamp": "",
            "Next": "NextState"
      },
      "SuccessState": {
        "Type": "Succeed"
      },
      "FailState": {
        "Type": "Fail",
        "Error": "ErrorA",
        "Cause": "Kaiju attack"
      },
      "Parallel":{
        "Type": "Parallel",
        "Branches": [],
        "Next": "NextState"
      },
      "Map":{
        "Type": "Map",
        "InputPath": "",
        "ItemsPath": "",
        "MaxConcurrency": 0,
        "Parameters": {
          "parcel.$": "",
          "courier.$": ""
        },
        "Iterator": {
          
        },
        "ResultPath": "",
        "End": true
      }
}
export let PolicySkeleton={
    "PolicyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [],
          "Resource": []
        }
      ]
    },
   
}

export let APIAuthorizerARN={
    
    "lambda":"arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:FunctionName/invocations",
    "cognito":"arn:aws:cognito-idp:{region}:{account_id}:userpool/{UserPoolID}"
}

export let CognitoAllowedOAuthScopes= [
    "phone",
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
]
export let CognitoExplicitAuthFlows=[
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
]
export let CognitoSupportedIdentityProviders=[
    "COGNITO", 
    "Facebook", 
    "SignInWithApple", 
    "Google" ,
    "LoginWithAmazon"
]
export let CognitoAllowedOAuthFlows=[
    "code",
    "implicit",
    "client_credentials"
]
export let CognitoAutoVerifiedAttributes=[
    "email", 
    "phone_number"
]
export let CognitoAliasAttributes=[
    "email", 
    "phone_number",
    "preferred_username"
]
let  IAMRoleSkeleton= {
          "ManagedPolicyArns": [
            "arn:aws:iam::aws:policy/service-role/"
          ],
          "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Principal": {
                  "Service": [
                    "apigateway.amazonaws.com"
                  ]
                },
                "Action": [
                  "sts:AssumeRole"
                ]
              }
            ]
          },
          "Path": "/",
          "Policies": []
}
export {IAMRoleSkeleton}
export let APIGatewaySkeleton={
    "Fn::Transform": {
      "Name": "AWS::Include",
      "Parameters": {
          "Location":""
      }
    }
  }
export let LanguageSupport={
"node":{
    "version":"nodejs14.x",
    "dependency":"npm",
    "extension":".js"
},
"python":{
    "version":"python3.9",
    "dependency":"pip3",
    "extension":".py"
}
}
export let AWSResourcesTypes={
    "stack":"AWS::CloudFormation::Stack",
    "lambda":"AWS::Serverless::Function",
    "dynamoDB":"AWS::DynamoDB::Table",
    "cognitoUserPool":"AWS::Cognito::UserPool",
    "lambdaPermission":"AWS::Lambda::Permission",
    "userPoolClient":"AWS::Cognito::UserPoolClient",
    "iamrole":"AWS::IAM::Role",
    "iampolicy":"AWS::IAM::Policy",
    "apigateway": "AWS::Serverless::Api",
    "stepfunction":"AWS::Serverless::StateMachine",
    "s3bucket":"AWS::S3::Bucket",
    "apikey": "AWS::ApiGateway::ApiKey",
    "usageplankey":"AWS::ApiGateway::UsagePlanKey",
    "usageplan":"AWS::ApiGateway::UsagePlan"
  
}
export let AWSResources={
    "stack":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["TemplateURL"],
            "Optional":["NotificationARNs","Parameters" ,"Tags"  ,"TemplateURL" ,"TimeoutInMinutes"]
        },
        
    },
    "lambda":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["FunctionName","CodeUri","Runtime"],
            "Optional":["Events","Environment","Policies","Role"],
            "Default":{
                "Handler":{
                    "Key":"Handler",
                    "Value":"app.lambdaHandler"
                }
            }
        }
    },
    "dynamoDB":{
            "attributes":["Type","Properties","DependsOn"],
            "Properties":{
                "Base":["TableName","KeySchema"],
                "Optional":[
                    "AttributeDefinitions", 
                    "BillingMode",
                    "ContributorInsightsSpecification",
                    "GlobalSecondaryIndexes" ,
                    "KinesisStreamSpecification",
                    "LocalSecondaryIndexes",
                    "PointInTimeRecoverySpecification",
                    "ProvisionedThroughput",
                    "SSESpecification",
                    "StreamSpecification" ,
                    "TableClass",
                    "Tags",
                    "TimeToLiveSpecification"]
            }

    },
    "cognitoUserPool":{
            "attributes":["Type","Properties","DependsOn"],
            "Properties":{
                "Base":["UserPoolName"],
                "Optional":[
                    "AccountRecoverySetting" ,
                    "AdminCreateUserConfig" ,
                    "AliasAttributes" ,
                    "AutoVerifiedAttributes",
                    "DeviceConfiguration" ,
                    "EmailConfiguration" ,
                    "EmailVerificationMessage" ,
                    "EmailVerificationSubject",
                    "EnabledMfas" ,
                    "LambdaConfig" ,
                    "MfaConfiguration"  ,
                    "Policies" ,
                    "Schema" ,
                    "SmsAuthenticationMessage" ,
                    "SmsConfiguration" ,
                    "SmsVerificationMessage",
                    "UsernameAttributes" ,
                    "UsernameConfiguration" ,
                    "UserPoolAddOns" ,
                    "UserPoolTags" ,
                    "VerificationMessageTemplate" ]
            }

    },
    "userPoolClient":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["UserPoolId"],
            "Optional":[
                "AccessTokenValidity"  ,
                "AllowedOAuthFlows", 
                "AllowedOAuthFlowsUserPoolClient"  ,
                "AllowedOAuthScopes", 
                "AnalyticsConfiguration"  ,
                "CallbackURLs", 
                "ClientName"  ,
                "DefaultRedirectURI"  ,
                "EnableTokenRevocation"  ,
                "ExplicitAuthFlows", 
                "GenerateSecret"  ,
                "IdTokenValidity"  ,
                "LogoutURLs"   ,
                "PreventUserExistenceErrors"  ,
                "ReadAttributes"   ,
                "RefreshTokenValidity"  ,
                "SupportedIdentityProviders"   ,
                "TokenValidityUnits"  ,
                "WriteAttributes" ]
        }
    },
    "lambdaPermission":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["FunctionName","Principal"],
            "Optional":[
                "EventSourceToken" ,
                "SourceAccount" ,
                "SourceArn"  ],
                "Default":{
                    "Action":{
                        "Key":"Action",
                        "Value":"lambda:InvokeFunction"
                    }
                }
        }
    },
    "iamrole":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["AssumeRolePolicyDocument"],
            "Optional":[
                "Description" ,
                "ManagedPolicyArns",
                "MaxSessionDuration" ,
                "Path" ,
                "PermissionsBoundary" ,
                "Policies" ,
                "RoleName" ,
                "Tags"
                ],
                "Default":{
                    "AssumeRolePolicyDocument":{
                        "Key":"AssumeRolePolicyDocument",
                        "Value":IAMRoleSkeleton["AssumeRolePolicyDocument"]
                    },"ManagedPolicyArns":{
                        "Key":"ManagedPolicyArns",
                        "Value":IAMRoleSkeleton["ManagedPolicyArns"]
                    }
                }
        }
    },
    "iampolicy":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["PolicyName"],
            "Optional":[
                "Roles" ,
                "Users",
                "Groups" 
                ],
                "Default":{
                }
        }
    },
    "apigateway":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":[ "Name"],
            "Optional":[
                "StageName",
                "AccessLogSetting", 
                "Auth", 
                "BinaryMediaTypes", 
                "CacheClusterEnabled", 
                "CacheClusterSize", 
                "CanarySetting", 
                "Cors",  
                "DefinitionBody", 
                "DefinitionUri",  
                "Description", 
                "DisableExecuteApiEndpoint", 
                "Domain", 
                "EndpointConfiguration", 
                "GatewayResponses", 
                "MethodSettings", 
                "MinimumCompressionSize", 
                "Mode", 
                "Models", 
                "Name", 
                "OpenApiVersion",  
                "Tags", 
                "TracingEnabled", 
                "Variables"
                ],
                "Default":{}
        }
    },
    "stepfunction":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":[ "Definition", "DefinitionUri"],
            "Optional":[
                "Definition", 
                "DefinitionSubstitutions", 
                "DefinitionUri", 
                "Events", 
                "Logging", 
                "Name", 
                "PermissionsBoundary", 
                "Policies",  
                "Role", 
                "Tags", 
                "Tracing", 
                "Type" 
                ],
                "Default":{}
        }
    },
    "s3bucket":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":[ "BucketName"],
            "Optional":[
                "AccelerateConfiguration", 
                "AccessControl", 
                "AnalyticsConfigurations", 
                "BucketEncryption", 
                "CorsConfiguration", 
                "IntelligentTieringConfigurations", 
                "InventoryConfigurations", 
                "LifecycleConfiguration", 
                "LoggingConfiguration" ,
                "MetricsConfigurations"  ,
                "NotificationConfiguration" ,
                "ObjectLockConfiguration" ,
                "ObjectLockEnabled" ,
                "OwnershipControls" ,
                "PublicAccessBlockConfiguration" ,
                "ReplicationConfiguration", 
                "Tags" ,
                "VersioningConfiguration" ,
                "WebsiteConfiguration",
                ],
                "Default":{}
        }
    },
    "apikey":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":[ "Name"],
            "Optional":[
                "CustomerId",
                "Description",
                "Enabled" ,
                "GenerateDistinctId" ,
                "StageKeys", 
                "Tags",
                "Value"
                ],
                "Default":{}
        }
    },
    "usageplan":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":[ "UsagePlanName"],
            "Optional":[
                "ApiStages",
                "Description",
                "Quota",
                "Tags",
                "Throttle"
                ],
                "Default":{}
        }
    },
    "usageplankey":{
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":["KeyId" ,"KeyType" ,"UsagePlanId" ],
            "Optional":[],
                "Default":{}
        }
    }

}
export let APIGatewayURI={
    "lambda":"lambda:path/2015-03-31/functions/${lambda.Arn}/invocations",
    "stepfunction":"states:action/StartSyncExecution"
}
export let SwaggerSkeleton={
    "openapi": "3.0.1",
    "info": {
        "title": "user-api",
        "version": "2021-11-22T07:01:12Z"
    },
    "paths": {},
    "components": {
        "schemas": {
            "Empty": {
                "title": "Empty Schema",
                "type": "object"
            }
        }
    }
}
export let SwaggerPathSkeleton=  {
    "get": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": {"Fn::Sub":"arn:aws:apigateway:${AWS::Region}:"},
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                      }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "post": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": {"Fn::Sub":"arn:aws:apigateway:${AWS::Region}:"},
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                      }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "delete": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": {"Fn::Sub":"arn:aws:apigateway:${AWS::Region}:"},
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                      }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "put": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": {"Fn::Sub":"arn:aws:apigateway:${AWS::Region}:"},
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                      }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "options": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                      }
                }
            },
            "requestTemplates": {
                "application/json": "{\"statusCode\": 200}"
            },
            "passthroughBehavior": "when_no_match",
            "type": "mock"
        }
    }
}

    


