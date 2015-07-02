# grunt-minify-polymer
Grunt plugin for minifying Polymer Elements. This plugin has been created to combine functionalities of [grunt-minify-html](https://github.com/sindresorhus/grunt-minify-html), [gulp-minify-inline](https://github.com/shkuznetsov/gulp-minify-inline) and [vulcanize#0.7.11](https://github.com/Polymer/vulcanize) for Polymer v1.0 Elements.

This plugin is made to solve two issues:

1. Resolving issues with ':root' and '@apply' CSS rules found in Polymer. In css-clean:
   * ':root' minifies incorrectly, missing a closing brace.
   * '@apply' compiles incorrectly, either being ignored or being prepended with an invalid ':'.
2. Minifying inline CSS and JS in HTML.

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

## The "minifyPolymer" task
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

#### options.js

Type: `Object`

Object passed to UglifyJS when minifying inline JS.

##### options.js.mangle

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

#### Suggestions
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
    vulcanize: {
      default: {
        files: {
          // Where index.html includes bower_components imports
          'build.html': 'index.html'
        }
      }
    }
  });

  grunt.registerTask('default', ['minifyPolymer', 'vulcanize']);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
*(Nothing yet)*

## License
Copyright (c) 2015 Kevin Kwan. Licensed under the MIT license.

## Credits
HTML Minification: [Minimize](https://github.com/Moveo/minimize)

CSS Minification: Some Regex strings...

JS Minification: [UglifyJS](https://github.com/mishoo/UglifyJS2)

Test Source Files: [PolymerElements](https://github.com/PolymerElements)
