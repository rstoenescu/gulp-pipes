# Gulp Pipes

<a href="https://badge.fury.io/js/gulp-pipes"><img src="https://badge.fury.io/js/gulp-pipes.svg"></a>
<a href="https://circleci.com/gh/rstoenescu/gulp-pipes/tree/master"><img src="https://circleci.com/gh/rstoenescu/gulp-pipes/tree/master.svg?style=shield"></a>

<a href="https://david-dm.org/rstoenescu/gulp-pipes" title="Dependency status"><img src="https://david-dm.org/rstoenescu/gulp-pipes.svg"/></a>
<a href="https://david-dm.org/rstoenescu/gulp-pipes#info=devDependencies" title="devDependency status"><img src="https://david-dm.org/rstoenescu/gulp-pipes/dev-status.svg"/></a>

<a href="https://codecov.io/github/rstoenescu/gulp-pipes"><img src="http://codecov.io/github/rstoenescu/gulp-pipes/coverage.svg" alt="Coverage via Codecov"></a>
<a href="https://codeclimate.com/github/rstoenescu/gulp-pipes"><img src="https://codeclimate.com/github/rstoenescu/gulp-pipes/badges/gpa.svg" /></a>
<a href="https://www.bithound.io/github/rstoenescu/gulp-pipes"><img src="https://www.bithound.io/github/rstoenescu/gulp-pipes/badges/score.svg" alt="bitHound Score"></a>

## Description

Opinionated reusable Gulp pipes for handling CSS, JS and HTML files.

## To-do
* `preview` pipes (live reload on your browsers).

## Usage

Just an example:
``` js
var gulp = require('gulp');
var pipes = require('gulp-pipes'); <<<<<<<<

gulp.task('some-task', function() {
  return gulp.src('./some-file.css')
    .pipe(pipes.css.lint())
    .pipe(pipes.css.compile())
});
```





### CSS
* Supports **only** Stylus files.

#### Linter
* Method: .css.lint()
* Parameters: *none*

``` js
return gulp.src('./some-file.css')
  .pipe(pipes.css.lint())
```

#### Compiler
* Method: .css.compile()
* Parameters:
  * (optional) Object - with properties:
    * (optional) Boolean `prod` - production or not (dev)
    * (optional) Object `autoprefixer` - gulp-autoprefixer options

Development mode does:
  * Compiles Stylus files with [NIB](http://tj.github.io/nib/)
  * Auto prefixes properties for cross-browser compatibility
  * Adds sourcemaps

Production mode does:
  * Compiles Stylus files with [NIB](http://tj.github.io/nib/)
  * Auto prefixes properties for cross-browser compatibility
  * Minifies

#### Dependencies Compiler
* Method: .css.deps()
* Parameters:
  * (optional) Object - with properties:
    * (optional) Boolean `prod` - production or not (dev)

Development mode does:
  * Concats files
  * Adds sourcemaps

Production mode does:
  * Concats files
  * Minifies





### JS
* Uses [Webpack](https://webpack.github.io/)

#### Linter
* Method: .js.lint()
* Parameters: *none*

``` js
return gulp.src('./some-file.js')
  .pipe(pipes.js.lint())
```

#### Compiler
* Method: .js.compile()
* Parameters:
  * (optional) Object - with properties:
    * (optional) Boolean `prod` - production or not (dev)
    * (optional) Object `pack` - Webpack configuration

Development mode does:
  * Compiles with Webpack
  * Adds sourcemaps

Production mode does:
  * Compiles with Webpack
  * Minifies

#### Dependencies Compiler
* Method: .js.deps()
* Parameters:
  * (optional) Object - with properties:
    * (optional) Boolean `prod` - production or not (dev)

Development mode does:
  * Concats files
  * Adds sourcemaps

Production mode does:
  * Concats files
  * Minifies





### HTML
* Uses [Webpack](https://webpack.github.io/)

#### Linter
* Method: .html.lint()
* Parameters: *none*

``` js
return gulp.src('./some-file.js')
  .pipe(pipes.html.lint())
```

#### Compiler
* Method: .html.compile()
* Parameters:
  * (optional) Object - with properties:
    * (optional) Boolean `prod` - production or not (dev)

Development mode does:
  * Nothing :) - added here so you can reuse Gulp tasks for both PROD and DEV ;)

Production mode does:
  * Minifies




## License

Copyright (c) 2015 Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
