export let LambdaLogics={
    "nodejs14.x":{
        "email_auth_app":{
            
            "PreSignUp":`module.exports.handler = async event => {
                event.response.autoConfirmUser = true;
                event.response.autoVerifyEmail = true;
                return event;
            };`,
            "DefineAuthChallenge":`module.exports.handler = async event => {
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
            "CreateAuthChallenge":`const mongoose = require('mongoose');

            module.exports.handler = async event => {
                const connectionString = process.env.DB_CONNECTION_STRING
            
                try {
                    mongoose.connect(connectionString);
                } catch(err) {
                   
                }
                const { Schema } = mongoose;
                const userSchema = new Schema({
                    username: {
                        type: String,
                        required: true
                    },
                    password: {
                        type: String,
                        required: true
                    }
                });
            
                mongoose.models = {}
                const userModel = mongoose.model('User', userSchema);
            
                let password;
            
                if(!event.request.session || !event.request.session.length) {
                    // new session, so fetch password from the db
                    const username = event.request.userAttributes.email;
                    const user = await userModel.findOne({ "username": username});
                    password = user.password;
                } else {
                    // There's an existing session. Don't generate new digits but
                    // re-use the code from the current session. This allows the user to
                    // make a mistake when keying in the code and to then retry, rather
                    // the needing to e-mail the user an all new code again.    
                    const previousChallenge = event.request.session.slice(-1)[0];
                    password = previousChallenge.challengeMetadata.match(/PASSWORD-(\d*)/)[1];
                }
            
                // This is sent back to the client app
                event.response.publicChallengeParameters = { username: event.request.userAttributes.email };
            
                // Add the secret login code to the private challenge parameters
                // so it can be verified by the "Verify Auth Challenge Response" trigger
                event.response.privateChallengeParameters = { password };
            
                // Add the secret login code to the session so it is available
                // in a next invocation of the "Create Auth Challenge" trigger
                event.response.challengeMetadata = \`PASSWORD-\${password}\`;
            
                mongoose.connection.close()
                return event;
            
            }`,
            "VerifyAuthChallengeResponse":`const md5 = require('md5');
            module.exports.handler = async event => {
                const expectedAnswer = event.request.privateChallengeParameters.password; 
                if (md5(event.request.challengeAnswer) === expectedAnswer) {
                    event.response.answerCorrect = true;
                } else {
                    event.response.answerCorrect = false;
                }
                return event;
            };`,
            "PostAuthentication":``
        
    }
}
}