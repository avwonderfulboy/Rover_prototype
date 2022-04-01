"use strict";
exports.__esModule = true;
exports.lambda_logics = void 0;
exports.lambda_logics = {
    "nodejs14.x": {
        "email_auth_app": {
            "PostSignup": "// DynamoDB Connection\n            const AWS = require(\"aws-sdk\");\n            const ddb = new AWS.DynamoDB.DocumentClient();\n            \n            // DynamoDB Tables\n            const userinfoTable = process.env.userinfoTable;\n            \n            // createUserInfo for first time users\n            const createUserInfo = async(userInfo) => {\n                var params = {\n                    TableName: userinfoTable,\n                    Item: userInfo,\n                };\n                let res = await ddb.put(params).promise();\n            };\n            \n            exports.lambdaHandler = async(event, context) => {\n                console.log(event);\n                try {\n                    await createUserInfo({\n                        email: event.request.userAttributes.email,\n                        log: [],\n                        leavesTaken: 0,\n                    });\n                } catch (err) {\n                    console.log(err);\n                    return err;\n                }\n            \n                return event;\n            };"
        }
    }
};
