cd $1
sam build
sam deploy --no-confirm-changeset --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --stack-name roveremailTest --region ap-south-1 --resolve-s3
