export let LambdaLogics={
    "nodejs14.x":{
            
            "EmailAuthApp_PreSignUp":`exports.lambdaHandler = async event => {
                event.response.autoConfirmUser = false;
                event.response.autoVerifyEmail = false;
                return event;
            };`,
            "EmailAuthApp_DefineAuthChallenge":`exports.lambdaHandler = async event => {
                if (event.request.session &&
                    event.request.session.length >= 3 &&
                    event.request.session.slice(-1)[0].challengeResult === false) {
                    // The user provided a wrong answer 3 times; fail auth
                    event.response.issueTokens = false;
                    event.response.failAuthentication = true;
                } else if (event.request.session &&
                    event.request.session.length &&
                    event.request.session.slice(-1)[0].challengeResult === true) {
                    // The user provided the right answer; succeed auth
                    event.response.issueTokens = true;
                    event.response.failAuthentication = false;
                } else {
                    // The user did not provide a correct answer yet; present challenge
                    event.response.issueTokens = false;
                    event.response.failAuthentication = false;
                    event.response.challengeName = 'CUSTOM_CHALLENGE';
                }
            
                return event;
            };
            `,
            "EmailAuthApp_CreateAuthChallenge":`
                exports.lambdaHandler = async event => {
                const connectionString = process.env.DB_CONNECTION_STRING
                let password;
                if(!event.request.session || !event.request.session.length) {
                    // new session, so fetch password from the db
                    const username = event.request.userAttributes.email;
                    const user =event.request.userAttributes.username;
                    const password = event.request.userAttributes.password;
                } else {
                    const previousChallenge = event.request.session.slice(-1)[0];
                    password = previousChallenge.challengeMetadata.match(/PASSWORD-(d*)/)[1];
                }
                // This is sent back to the client app
                event.response.publicChallengeParameters = { username: event.request.userAttributes.email };
            
                // Add the secret login code to the private challenge parameters
                // so it can be verified by the "Verify Auth Challenge Response" trigger
                event.response.privateChallengeParameters = { password };
            
                // Add the secret login code to the session so it is available
                // in a next invocation of the "Create Auth Challenge" trigger
                event.response.challengeMetadata = \`PASSWORD-\${password}\`;    
                return event;
            
            }`,
            "EmailAuthApp_VerifyAuthChallengeResponse":`const md5 = require('md5');
            exports.lambdaHandler = async event => {
                const expectedAnswer = event.request.privateChallengeParameters.password; 
                if (md5(event.request.challengeAnswer) === expectedAnswer) {
                    event.response.answerCorrect = true;
                } else {
                    event.response.answerCorrect = false;
                }
                return event;
            };`,
            "EmailAuthApp_SignUpFunctions":`
            let response;
                const aws = require('aws-sdk');
                const UserPoolID = process.env.UserPoolID
                const UserPoolClientID = process.env.UserPoolClientID
                exports.lambdaHandler = async (event, context) => {
                    try {
                        if(event.body!==undefined){
                            event=JSON.parse(event.body)
                        }
                        // const ret = await axios(url);
                        const cognito = new aws.CognitoIdentityServiceProvider();
                        const params = {
                            ClientId: UserPoolID,
                            Username:event.emailId,
                            Password: event.Password,
                            UserAttributes:[
                            {
                    Name: 'email',
                    Value: event.emailId,
                    },
                    {
                    Name: "name",
                    Value: event.name
                    }]
                        };
                        console.log(params)
                        let res=await cognito.signUp(params).promise();
                        response = {
                            'statusCode': 200,
                            'body': JSON.stringify(res)
                        }
                    } catch (err) {
                        console.log(err);
                        response = {
                        'statusCode': 200,
                    'body': JSON.stringify(err)
                        }
                    }

                    return response
                };`,
            "EmailAuthApp_ResendCode":`
            let response;
            const aws = require('aws-sdk');
            const UserPoolID = process.env.UserPoolID
            const UserPoolClientID = process.env.UserPoolClientID
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    
                    var params = {
                                    ClientId: UserPoolID,
                                    Username: event.emailId
              }
              let res=await cognito.resendConfirmationCode(params).promise();
              
              
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            message: res,
                           
                        })
                    }
                } catch (err) {
                    console.log(err);
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify(err)
                        }
                }
            
                return response
            };
            `,
            "EmailAuthApp_ConfirmUser":`
            let response;
            const aws = require('aws-sdk');
            const dynamoDB = new aws.DynamoDB.DocumentClient();
            const UserTable = process.env.userinfoTable
            const UserPoolID = process.env.UserPoolID
            const UserPoolClientID = process.env.UserPoolClientID
            async function addUserData(userData) {
                try {
                        console.log("[INFO] addUserData input",userData)
                        const params = {
                                        TableName: UserTable,
                                        Item: userData
            
                        };
                        var Items  = await dynamoDB.put(params).promise();
                        console.log("[INFO] addUserData output",Items)
                        return Items
            
                } 
                catch (err) {
                        throw err;
                }
            }
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    var params = {
                                    ClientId: UserPoolID,
                                    ConfirmationCode: event.Code,
                                    Username: event.emailId
              }
                   let res=await cognito.confirmSignUp(params).promise();
                    
                    var params1 = {
                                    UserPoolId: "ap-south-1_1yC44cNIk",
                                   AttributesToGet: ["email","name","sub"],
                                   
              }
              
                    
                    res=await cognito.listUsers(params1).promise();
                    let user={}
                    let Attributes={}
                    res["Users"].map(ele=>{
                        
                        Attributes = ele["Attributes"].find(ele=>ele.Name==="email"&&ele.Value==event.emailId)
                        if (Attributes!==undefined) {
                            ele["Attributes"].map(ele=>{
                                user[ele.Name]=ele.Value
                            })
                        }
                        
            
                    })
                    console.log(user)
                    await addUserData(user)
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            message: res,
                           
                        })
                    }
                // await addUserData()
                } catch (err) {
                    console.log(err);
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify(err)
                        }
                }
            
                return response
            };
            `,
            "EmailAuthApp_ConfirmForgotPassword":`
            let response;
            const UserPoolID = process.env.UserPoolID
            const UserPoolClientID = process.env.UserPoolClientID
            const aws = require('aws-sdk');
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    var params = {
                                    ClientId: UserPoolID,
                                    ConfirmationCode: event.Code,
                                    Username: event.emailId,
                                    Password:  event.password, /* required */
              }
              let res=await cognito.confirmForgotPassword(params).promise();
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            message: res,
                           
                        })
                    }
                } catch (err) {
                    console.log(err);
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify(err)
                        }
                }
            
                return response
            };
            `,
            "EmailAuthApp_ForgotPassword":`
            let response;
            const UserPoolID = process.env.UserPoolID
            const UserPoolClientID = process.env.UserPoolClientID
            const aws = require('aws-sdk');
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    var params = {
                                    ClientId: UserPoolID,
                                    Username: event.emailId
                                }
              let res=await cognito.forgotPassword(params).promise();
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            message: res,
                           
                        })
                    }
                } catch (err) {
                    console.log(err);
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify(err)
                        }
                }
            
                return response
            };
            `,
            "EmailAuthApp_AuthorizerFunction":`
            import jwt from 'jsonwebtoken';

            // By default, API Gateway authorizations are cached (TTL) for 300 seconds.
            // This policy will authorize all requests to the same API Gateway instance where the
            // request is coming from, thus being efficient and optimising costs.
            const generatePolicy = (principalId, methodArn) => {
              const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';
            
              return {
                principalId,
                policyDocument: {
                  Version: '2012-10-17',
                  Statement: [
                    {
                      Action: 'execute-api:Invoke',
                      Effect: 'Allow',
                      Resource: apiGatewayWildcard,
                    },
                  ],
                },
              };
            };
            
            export async function handler(event, context) {
              if (!event.authorizationToken) {
                throw 'Unauthorized';
              }
            
              const token = event.authorizationToken.replace('Bearer ', '');
            
              try {
                const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
                const policy = generatePolicy(claims.sub, event.methodArn);
            
                return {
                  ...policy,
                  context: claims
                };
              } catch (error) {
                console.log(error);
                throw 'Unauthorized';
              }
            };`,
            "s3_lambda":`exports.lambdaHandler = async event => {
                if (event.request.session &&
                    event.request.session.length >= 3 &&
                    event.request.session.slice(-1)[0].challengeResult === false) {
                    // The user provided a wrong answer 3 times; fail auth
                    event.response.issueTokens = false;
                    event.response.failAuthentication = true;
                } else if (event.request.session &&
                    event.request.session.length &&
                    event.request.session.slice(-1)[0].challengeResult === true) {
                    // The user provided the right answer; succeed auth
                    event.response.issueTokens = true;
                    event.response.failAuthentication = false;
                } else {
                    // The user did not provide a correct answer yet; present challenge
                    event.response.issueTokens = false;
                    event.response.failAuthentication = false;
                    event.response.challengeName = 'CUSTOM_CHALLENGE';
                }
            
                return event;
            };
            `,

        
    
}
}