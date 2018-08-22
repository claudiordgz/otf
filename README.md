# Build a Restful API using AWS API Gateway, DynamoDB and Serverless

Here lies the code to create an API similar to the one in randomuser.me

### [`user-api`](./user-api)

Contains everything related to DynamoDB, API Gateway, and Serverless

### [`user-api-migrations`](./user-api-migrations)

Script to move data from randomuser.me to DynamoDB using the API created

## Tools Used

  1. Serverless Framework and Webpack to create functions of less than 200kb
  2. Lambdas in Node 8.10
  3. Jest Framework with 90% test coverage configured and 100% test coverage coded
  4. Use of ES6 features
  5. [API Documented in postman file](./user-api/otf-user-api.postman_collection.json)
  6. Built under 8 hours
  7. Migrated over 10000 users in minutes from API using Dynamo's Scaling features
