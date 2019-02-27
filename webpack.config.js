const path = require('path');

module.exports = {
    entry: './src/script.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/public/',
        filename: 'bundle.js'
    },
    module: {
      
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {             
                loader: 'babel-loader',
              }
            }
          ]
    },
    mode: 'development'
   

};