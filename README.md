# grunt-minify-polymer

[![Build Status](https://travis-ci.org/KK578/grunt-minify-polymer.svg?branch=master)](https://travis-ci.org/KK578/grunt-minify-polymer)

Grunt plugin for minifying Polymer Elements. This plugin has been created to combine functionalities of [grunt-minify-html](https://github.com/sindresorhus/grunt-minify-html), [gulp-minify-inline](https://github.com/shkuznetsov/gulp-minify-inline) and [vulcanize#0.7.11](https://github.com/Polymer/vulcanize) for Polymer v1.0 Elements.

This plugin is made to solve two issues:

1. Resolving issues with ':root' and '@apply' CSS rules found in Polymer.

   In css-clean:
   * ':root' minifies incorrectly, missing a closing brace.
   * '@apply' compiles incorrectly, either being ignored or being prepended with an invalid ':'.

   In general, CSS Parsers currently fail on these rules, producing errors whilst attempting to minify. Thus this plugin uses simple regex with the aim of simply removing comments and whitespace present in the CSS.
2. Minifying inline CSS and JS in element HTML.

   Polymer Elements contain their documentation inline the element HTML, JS and CSS. Vulcanize may not fully remove the documentation comments, and will not minify automatically.
   This plugin aims to bridge the step from source code to vulcanized production code by producing an intermediary step with minified source code for vulcanize.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-minify-polymer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-minify-polymer');
```

### ES6 Support

If you require support for minifying ES6, please target the ES6 build by installing as above, and appending `-es6` to the version in your `package.json`.

```json
...
"dependencies": {
  "grunt-minify-polymer": "vx.x.x-es6"
},
...
```

## The "minifyPolymer" task
Minifies HTML with any inline CSS and JS.

### Overview
In your project's Gruntfile, add a section named `minifyPolymer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  minifyPolymer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
})
```

### Options
See minimize [options](https://github.com/Moveo/minimize#options) for options to pass for HTML Minification.

#### options.jsCompress
Type: `Object`
Default Value : `{ warnings: false }`

Object passed to UglifyJS when compressing inline JS.

#### options.jsMangle
Type: `Boolean`
Default value: `true`

Allow UglifyJS to mangle function and local variable names.

### Usage Examples
#### Static File Bindings
```js
grunt.initConfig({
  minifyPolymer: {
    default: {
      files: {
        'dest/my-element.html': 'src/my-element.html',
        'dest/my-other-element.html': 'src/my-other-element.html'
      }
    }
  }
});
```

#### Dynamic File Bindings
```js
grunt.initConfig({
  minifyPolymer: {
    default: {
      files: [
        {
          expand: true,
          cwd: 'src/html/',
          src: ['**/*.html'],
          dest: 'build/'
        }
      ]
    }
  }
});
```

#### Minify Polymer-Elements from Bower
```js
grunt.initConfig({
  minifyPolymer: {
    default: {
      files: [
        {
          expand: true,
          cwd: 'bower_components/',
          src: ['**/*.html'],
          dest: 'build/bower_components/'
        }
      ]
    }
  }
});
```

## The "minifyPolymerCSS" task
Minifies CSS, works with Polymer CSS rules/selectors.

### Overview
In your project's Gruntfile, add a section named minifyPolymerCSS ot the data object passed into grunt.initConfig().

```js
grunt.initConfig({
  minifyPolymerCSS: {
    your_target: {
      // Target-specific file lists go here.
    }
  }
});
```

### Options
No options currently available for this task.

### Usage Examples
#### Static File Bindings
```js
grunt.initConfig({
  minifyPolymerCSS: {
    default: {
      files: {
        'dest/my-element.css': 'src/my-element.css',
        'dest/my-other-element.css': 'src/my-other-element.css'
      }
    }
  }
});
```

#### Dynamic File Bindings
```js
grunt.initConfig({
  minifyPolymerCSS: {
    default: {
      files: [
        {
          expand: true,
          cwd: 'src/stylesheets/',
          src: ['**/*.css'],
          dest: 'build/'
        }
      ]
    }
  }
});
```

#### Minify Polymer-Elements CSS from Bower
```js
grunt.initConfig({
  minifyPolymerCSS: {
    default: {
      files: [
        {
          expand: true,
          cwd: 'bower_components/',
          src: ['**/*.css'],
          dest: 'build/bower_components/'
        }
      ]
    }
  }
});
```

## Suggestions
Use with [grunt-vulcanize](https://github.com/Polymer/grunt-vulcanize) to minify your Polymer App.

```js
grunt.initConfig({
  minifyPolymer: {
    default: {
      files: [
        {
          expand: true,
          cwd: 'bower_components/',
          src: ['**/*.html'],
          dest: 'build/bower_components/'
        }
      ]
    }
  },
  minifyPolymerCSS: {
    default: {
      files: [
        {
          expand: true,
          cwd: 'bower_components/',
          src: ['**/*.css'],
          dest: 'build/bower_components/'
        }
      ]
    }
  },
  vulcanize: {
    default: {
      files: {
        // Where index.html includes bower_components imports
        'build/build.html': 'build/index.html'
      }
    }
  }
});

grunt.registerTask('default', ['minifyPolymer', 'minifyPolymerCSS', 'vulcanize']);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

Pull Requests will be built, using the test suite, on [Travis-CI](https://travis-ci.org/KK578/grunt-minify-polymer).

## License
Copyright (c) 2015 Kevin Kwan. Licensed under the MIT license.

## Credits
HTML Minification: [Minimize](https://github.com/Moveo/minimize)

CSS Minification: Some Regex strings...

JS Minification: [UglifyJS](https://github.com/mishoo/UglifyJS2)

Test Source Files: [PolymerElements](https://github.com/PolymerElements), [Bootstrap](http://getbootstrap.com/)
