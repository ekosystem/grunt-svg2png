
"use strict";

var path = require("path");
var async = require("async");
var svg2png = require("svg2png");
var chalk = require("chalk");
var numCPUs = require("os").cpus().length;

module.exports = function (grunt) {

  grunt.registerMultiTask("svg2png", "Convert SVG to PNG", function () {
    var options = this.options({
      scale: 1.0,
      subdir: "",
      limit: Math.max(numCPUs, 2)
    });

    async.eachLimit(this.files, options.limit, function (el, next) {
      var src = Array.isArray(el.src) ? el.src.pop() : el.src;
      var rootdir = path.dirname(src);
      var pngFile = path.basename(src, ".svg") + ".png";
      var destDir = path.dirname(el.dest);
      
      var dest = path.join(rootdir, destDir, pngFile);
      
      svg2png(src, dest, options.scale, function (err) {
        if (err) {
          grunt.log.error("An error occurred converting %s in %s: %s", src, dest, err);
        }
        else {
          grunt.log.writeln(chalk.green("✔ ") + dest + chalk.gray(" (scale:", options.scale + ")"));
        }
        next();
      });
    }, this.async());
  });
};
