module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/test/karma-entry.jsx', watched: false },
    ],
    preprocessors: {
      'src/test/karma-entry.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.js', '.jsx'],
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { browsers: 'last 2 Chrome versions' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [
                  ['istanbul', { exclude: ['**/src/test/**'] }],
                ],
              },
            },
          },
        ],
      },
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage-karma',
      subdir: 'html',
      reporters: [
        { type: 'text-summary' },
        { type: 'html' },
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 30000,
  })
}
