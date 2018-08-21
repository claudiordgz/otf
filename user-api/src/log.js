module.exports = {
  log: (x) => console.log(Object.assign({
    AWS_LAMBDA_LOG_GROUP_NAME: process.env.AWS_LAMBDA_LOG_GROUP_NAME,
    AWS_LAMBDA_LOG_STREAM_NAME: process.env.AWS_LAMBDA_LOG_STREAM_NAME,
    AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME
  }, x)) 
}
