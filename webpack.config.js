const path = require('path');

module.exports = {
  entry: './app/index.tsx',  // Apunta a tu archivo index.tsx
  output: {
    path: path.resolve(__dirname, 'build'),  // Carpeta de salida donde se empaquetará todo
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],  // Asegúrate de que Webpack pueda manejar archivos .tsx
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Transpila archivos .tsx
        use: 'babel-loader',  // Asegúrate de tener configurado Babel para TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),  // Directorio desde donde el servidor sirve los archivos
    historyApiFallback: true,  // Redirige todas las rutas a index.html (para React Router)
  },
  devtool: 'source-map',  // Opcional: para facilitar el debugging
};
