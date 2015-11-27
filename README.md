# Gulp Pipes
> Opinionated, reusable Gulp pipes for handling CSS, JS, HTML, image files and more.

<a href="https://badge.fury.io/js/gulp-pipes"><img src="https://badge.fury.io/js/gulp-pipes.svg"></a>
<a href="https://circleci.com/gh/rstoenescu/gulp-pipes/tree/master"><img src="https://circleci.com/gh/rstoenescu/gulp-pipes/tree/master.svg?style=shield"></a>

<a href="https://david-dm.org/rstoenescu/gulp-pipes" title="Dependency status"><img src="https://david-dm.org/rstoenescu/gulp-pipes.svg"/></a>
<a href="https://david-dm.org/rstoenescu/gulp-pipes#info=devDependencies" title="devDependency status"><img src="https://david-dm.org/rstoenescu/gulp-pipes/dev-status.svg"/></a>

<a href="https://codecov.io/github/rstoenescu/gulp-pipes"><img src="http://codecov.io/github/rstoenescu/gulp-pipes/coverage.svg" alt="Coverage via Codecov"></a>
<a href="https://codeclimate.com/github/rstoenescu/gulp-pipes"><img src="https://codeclimate.com/github/rstoenescu/gulp-pipes/badges/gpa.svg" /></a>
<a href="https://www.bithound.io/github/rstoenescu/gulp-pipes"><img src="https://www.bithound.io/github/rstoenescu/gulp-pipes/badges/score.svg" alt="bitHound Score"></a>


## Installation

``` bash
$ npm install --save-dev gulp-pipes
```

## Usage Example

``` js
var gulp = require('gulp');
var pipes = require('gulp-pipes'); <<<<<<<<

gulp.task('some-task', function() {
  return gulp.src('./some-file.css')
    .pipe(pipes.css.lint())
    .pipe(pipes.css.compile())
});
```

> **IMPORTANT**

> All pipes take only one parameter, which is an Object containing configuration. Let's call it **config object** from now on.
> This parameter can be omitted (it is optional).
> All config object's properties are optional.


## Jump to Point of Interest

* [Banner pipes](#banner)
* [CSS file pipes](#css)
* [Javascript file pipes](#js)
* [HTML file pipes](#html)
* [Image file pipes](#images)


## Banner
* Method: `pipes.banner(configObject);`
* Adds a banner as header for files
* Comes with a default template file which takes information from your package.json

``` js
return gulp.src(...)
  .pipe(pipes.banner(configObject))
```

Config object properties:

| Name | Type | Description |
| --- | --- | --- |
| templatePath | String | Full path to template file |
| variables | Object | Variables to use on the template; gets populated automatically with `pkg` property which is your package.json file |

Template file example (this is the default supplied one):
``` text
/* <%= pkg.name %> v<%= pkg.version %>
 * <%= pkg.homepage ? pkg.homepage + ' ' : '' %><%= pkg.license ? pkg.license + ' license' : '' %>
 * (c) <%= year %> <%= pkg.author.name || pkg.author %>
 */
```
All variables from above are taken from `variables` object.



## CSS
* Supports **only** Stylus files.

### Linter
* Method: `pipes.css.lint(configObject)`
* Config object parameter's (which is optional) properties:

| Name | Type | Description |
| --- | --- | --- |
| fail | Boolean | Fail on error |

``` js
return gulp.src('./some-file.css')
  .pipe(pipes.css.lint());

// or fail on Error
return gulp.src('./some-file.js')
  .pipe(pipes.css.lint({fail: true}));
```

### Compiler
* Method: `pipes.css.compile(configObject)`
* Config object parameters:

| Name | Type | Description |
| --- | --- | --- |
| prod | Boolean | Compile for production |
| base64 | Object | [gulp-css-base64](https://www.npmjs.com/package/gulp-css-base64) options |
| extmin | Boolean | Adds '.min' to extension (use in conjunction with `prod` only) |

|  | Development Mode | Production Mode |
| --- | --- | --- |
| Compile Stylus files with [NIB](http://tj.github.io/nib/) | * | * |
| Auto prefixes properties for cross-browser compatibility | * | * |
| Auto embeds small images with base64 encoding | * | * |
| Adds sourcemaps | * |  |
| Minifies |  | * |

### Dependencies Compiler
* Method: `pipes.css.deps(configObject)`
* Config object parameters:

| Name | Type | Description |
| --- | --- | --- |
| prod | Boolean | Compile for production |

|  | Development Mode | Production Mode |
| --- | --- | --- |
| Concats files | * | * |
| Adds sourcemaps | * |  |
| Loads & merges existing sourcemaps | * |  |
| Minifies |  | * |





## JS
* Uses [Webpack](https://webpack.github.io/)

### Linter
* Method: `pipes.js.lint(configObject)`
* Config object parameter's (which is optional) properties:

| Name | Type | Description |
| --- | --- | --- |
| fail | Boolean | Fail on error |

``` js
return gulp.src('./some-file.js')
  .pipe(pipes.js.lint())

// or fail on Error
return gulp.src('./some-file.js')
  .pipe(pipes.js.lint({fail: true}));
```

### Compiler
* Method: `pipes.js.compile(configObject)`
* Config object parameters:

| Name | Type | Description |
| --- | --- | --- |
| prod | Boolean | Compile for production |
| pack | Object | Webpack configuration |
| retainPath | Boolean | makes webpack use the same *path* + *name* as source files; by default, only *name* is retained |
| extmin | Boolean | Adds '.min' to extension (use in conjunction with `prod` only) |

|  | Development Mode | Production Mode |
| --- | --- | --- |
| Compiles with Webpack | * | * |
| Adds sourcemaps | * |  |
| Minifies |  | * |

If you want your compiled file to contain assets, then in your .js file to be compiled:
``` js
var content = require('raw!./template.html');

// BUT make sure you npm install raw-loader
// (Cannot include it in this package because Webpack will try to
// require it from your project folder's node_modules)
```
Your compiled file will contain:
``` js
var content = '<html></html>';
```

> **IMPORTANT**

> Also good to know that you can also use *{base: 'base/path'}* as option for your gulp.src().

``` js
gulp.task('some-task', function() {
  return gulp.src('path/to/script.js', {base: 'path'})
    .pipe(pipes.js.compile({
      retainPath: true
    }))
    .pipe(gulp.dest('dest/path'));
})
```

> **NOTE**

> Webpack configuration supplied gets merged with a default one which adds sourcemaps on development mode



### Dependencies Compiler
* Method: `pipes.js.deps(configObject)`
* Config object parameters:

| Name | Type | Description |
| --- | --- | --- |
| prod | Boolean | Compile for production |
| extmin | Boolean | Adds '.min' to extension (use in conjunction with `prod` only) |

|  | Development Mode | Production Mode |
| --- | --- | --- |
| Compiles with Webpack | * | * |
| Adds sourcemaps | * |  |
| Loads & merges existing sourcemaps | * |  |
| Minifies |  | * |




## HTML
You can include other HTMLs within your .html file like this:
``` html
<!DOCTYPE html>
<html>
  <body>
  @@include('./view.html')     <<<<<<<<<<<<
  @@include('./var.html', {    <<<<<<<<<<<<
    "name": "rstoenescu",
    "age": 12345,
    "socials": {
      "fb": "facebook.com/include",
      "tw": "twitter.com/include"
    }
  })
  </body>
</html>
```

view.html
``` html
<h1>view</h1>
```

var.html
``` html
<label>@@name</label>
<label>@@age</label>
<strong>@@socials.fb</strong>
<strong>@@socials.tw</strong>
```

... and it gets compiled to:
``` html
<!DOCTYPE html>
<html>
  <body>
    <h1>view</h1>
    <label>rstoenescu</label>
    <label>12345</label>
    <strong>facebook.com/include</strong>
    <strong>twitter.com/include</strong>
  </body>
</html>
```

### Linter
* Method: `pipes.html.lint()`
* Parameters: *none*

``` js
return gulp.src('./some-file.js')
  .pipe(pipes.html.lint())
```

### Compiler
* Method: `pipes.html.compile(configObject)`
* Config object parameters:

| Name | Type | Description |
| --- | --- | --- |
| prod | Boolean | Compile for production |
| include | Object | Include configuration (see below) |

|  | Development Mode | Production Mode |
| --- | --- | --- |
| Includes HTMLs | * | * |
| Minifies |  | * |

Example for `include` object (below is the default config supplied):
``` js
prefix: '@@',
basepath: '@file'
```
More details on how it works can be found [here](https://www.npmjs.com/package/gulp-file-include).


## Images

* Uses [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)
* Method: `pipes.image.optimize(configObject)`

You can override any of the following default properties for the configuration object:
``` js
{
  progressive: true,
  svgoPlugins: [{removeViewBox: false}],
  use: [pngquant()]
}
```

Handles the following file types:
 * GIF
 * JPEG
 * PNG
 * SVG

You can feed any types of files as it will filter and optimize only image ones.


## License

Copyright (c) 2015 Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
