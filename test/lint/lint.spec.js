'use strict';

require('mocha-eslint')(
  // paths
  [
    'src/**/*.js',
    'test/**/*.spec.js'
  ],
  // options
  {
    formatter: 'compact',
    alwaysWarn: false
  }
);
