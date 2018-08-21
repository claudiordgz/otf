# Serverless CRUD API with data from randomuser.me

This example shows how to setup a RESTful Web Service that allows to Create, List, Get, Update, Delete Users. It has been built with the payload from randomuser.me in mind and another script copies data from the API into DynamoDB. 

## Setup

This repo assumes you have an AWS Profile and Serverless Framework installed and configured. Afterwards it is necessary to install the dependencies.

```
npm install
```

## Build

To build the bundle with no deployment use:

```
npm run build
```

It uses webpack to bundle the code and keeps `aws-sdk` outside of your bundles, keeping your lambdas under 200KB. It will only deploy 1 file to S3.

## Testing

Running tests will output a coverage report for you, if the tests fall below 90% Code Coverage they will fail.

```
npm run test
```

## Deploy

Builds and deploys the application using the serverless framework.

```
npm run deploy
```

The expected result should look like:

```
λ npm run deploy

> user-api-serverless@0.0.1 deploy D:\workspace\orange-theory-fitness\user-api
> npm run build && sls deploy


> user-api-serverless@0.0.1 build D:\workspace\orange-theory-fitness\user-api
> webpack

Hash: ed46ef69bfd29506f19c
Version: webpack 4.16.5
Time: 642ms
Built at: 08/21/2018 1:07:04 PM
            Asset     Size  Chunks             Chunk Names
deploy/handler.js  565 KiB    main  [emitted]  main
Entrypoint main = deploy/handler.js
[./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {main} [built]
[./src/dynamoObjToModel.js] 842 bytes {main} [built]
[./src/index.js] 765 bytes {main} [built]
[./src/log.js] 354 bytes {main} [built]
[./src/user.js] 5.26 KiB {main} [built]
[aws-sdk] external "aws-sdk" 42 bytes {main} [built]
[crypto] external "crypto" 42 bytes {main} [built]
    + 4 hidden modules
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (132.26 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
......................................
Serverless: Stack update finished...
Service Information
service: user-api
stage: dev
region: us-east-1
stack: user-api-dev
api keys:
  None
endpoints:
  POST - https://ghbrncxlqc.execute-api.us-east-1.amazonaws.com/dev/user
  GET - https://ghbrncxlqc.execute-api.us-east-1.amazonaws.com/dev/user
  GET - https://ghbrncxlqc.execute-api.us-east-1.amazonaws.com/dev/user/{id}
  PUT - https://ghbrncxlqc.execute-api.us-east-1.amazonaws.com/dev/user/{id}
  DELETE - https://ghbrncxlqc.execute-api.us-east-1.amazonaws.com/dev/user/{id}
functions:
  create: user-api-dev-create
  list: user-api-dev-list
  getById: user-api-dev-getById
  update: user-api-dev-update
  delete: user-api-dev-delete
Serverless: Removing old service artifacts from S3...
```
