const path = require('path')

const config = {
  mode: "development",
  entry: path.join(__dirname, 'src/index.js'),
  target: 'node',
  output: {
    filename: 'deploy/handler.js',
    libraryTarget: 'commonjs',
    path: path.join(__dirname)
  },
  externals: {
    'aws-sdk': 'aws-sdk'
  }
}

module.exports = config
