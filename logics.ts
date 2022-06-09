export let LambdaLogics={
    "nodejs14.x":{
        "email_auth_app":{
            
            "PreSignUp":`exports.lambdaHandler = async event => {
                event.response.autoConfirmUser = false;
                event.response.autoVerifyEmail = false;
                return event;
            };`,
            "DefineAuthChallenge":`exports.lambdaHandler = async event => {
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
            "CreateAuthChallenge":`
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
            "VerifyAuthChallengeResponse":`const md5 = require('md5');
            exports.lambdaHandler = async event => {
                const expectedAnswer = event.request.privateChallengeParameters.password; 
                if (md5(event.request.challengeAnswer) === expectedAnswer) {
                    event.response.answerCorrect = true;
                } else {
                    event.response.answerCorrect = false;
                }
                return event;
            };`,
            "SignUpFunctions":`
            let response;
                const aws = require('aws-sdk');

                exports.lambdaHandler = async (event, context) => {
                    try {
                        if(event.body!==undefined){
                            event=JSON.parse(event.body)
                        }
                        // const ret = await axios(url);
                        const cognito = new aws.CognitoIdentityServiceProvider();
                        const params = {
                            ClientId: "3p6cqj50cvn3596p44c8ck1s1e",
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
            "ResendCode":`
            let response;
            const aws = require('aws-sdk');
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    
                    var params = {
                                    ClientId: "3p6cqj50cvn3596p44c8ck1s1e",
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
            "ConfirmUser":`let response;
            const aws = require('aws-sdk');
            const dynamoDB = new aws.DynamoDB.DocumentClient();
            const UserTable = process.env.userinfoTable
            
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
                                    ClientId: "3p6cqj50cvn3596p44c8ck1s1e",
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
            "ConfirmForgotPassword":`
            let response;
            const aws = require('aws-sdk');
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    var params = {
                                    ClientId: "3p6cqj50cvn3596p44c8ck1s1e",
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
            "ForgotPassword":`
            let response;
            const aws = require('aws-sdk');
            exports.lambdaHandler = async (event, context) => {
                try {
                    if(event.body!==undefined){
                        event=JSON.parse(event.body)
                    }
                    const cognito = new aws.CognitoIdentityServiceProvider();
                    var params = {
                                    ClientId: "3p6cqj50cvn3596p44c8ck1s1e",
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
            `

        
    }
}
}