export let skeleton_config={}
skeleton_config["template_version"]="2010-09-09"
skeleton_config["sam_transform_version"]="AWS::Serverless-2016-10-31"

export let sam_init_base="sam init --no-interactive "
export let sam_language=" -r "
export let sam_dependency=" -d "
export let sam_app_name=" -n "
export let sam_app_template=" --app-template hello-world"
export let stepfunction_state_types=["Succeed","Fail","Parallel","Map","Pass","Wait","Task","Choice"]
export let stepfunction_states={
      "Type" : "",
      "Resource": "",
      "Next": "",
      "Comment": ""
}
export let stepfunction_states_type_skeletons={
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
export let policySkeleton={
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
    "PolicyName": "LambdaFunctionInvocation"
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
export let iamroleSkeleton= {
          "ManagedPolicyArns": [
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
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
    "apigateway": "AWS::Serverless::Api",
    "stepfunction":"AWS::Serverless::StateMachine",
    "s3bucket":"AWS::S3::Bucket"

  
}
export let AWSResources={
    "stack":{
        "attributes":["Type","Properties"],
        "Properties":{
            "Base":["TemplateURL"],
            "Optional":["NotificationARNs","Parameters" ,"Tags"  ,"TemplateURL" ,"TimeoutInMinutes"]
        },
        
    },
    "lambda":{
        "attributes":["Type","Properties"],
        "Properties":{
            "Base":["FunctionName","CodeUri","Runtime"],
            "Optional":["Events","Environment","Policies"],
            "Default":{
                "Handler":{
                    "Key":"Handler",
                    "Value":"app.lambdaHandler"
                }
            }
        }
    },
    "dynamoDB":{
            "attributes":["Type","Properties"],
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
            "attributes":["Type","Properties"],
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
        "attributes":["Type","Properties"],
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
        "attributes":["Type","Properties"],
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
        "attributes":["Type","Properties"],
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
                        "Value":iamroleSkeleton["AssumeRolePolicyDocument"]
                    },"ManagedPolicyArns":{
                        "Key":"ManagedPolicyArns",
                        "Value":iamroleSkeleton["ManagedPolicyArns"]
                    }
                }
        }
    },
    "apigateway":{
        "attributes":["Type","Properties"],
        "Properties":{
            "Base":[ "StageName"],
            "Optional":[
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
        "attributes":["Type","Properties"],
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
        "attributes":["Type","Properties"],
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
    }




     

}
export let APIGatewayURI={
    "lambda":"arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${lambda_arn.Arn}/invocations",
    "stepfunction":"arn:aws:apigateway:${AWS::Region}:states:action/StartSyncExecution"
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
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": "arn:aws:apigateway:ap-south-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-south-1:960351580303:function:get-user/invocations",
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
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
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": "arn:aws:apigateway:ap-south-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-south-1:960351580303:function:create-user/invocations",
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
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
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": "arn:aws:apigateway:ap-south-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-south-1:960351580303:function:get-user/invocations",
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
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
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": "arn:aws:apigateway:ap-south-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-south-1:960351580303:function:create-user/invocations",
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
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

    


