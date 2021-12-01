/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: November 4 2021
 * Author: Ivy Lee A01048709
 * 
 */

const unzipper = require('unzipper'),
  fs = require("fs"),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  fs.createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut }));
};

/**
 * Description: read only the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  var picList = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.slice(file.length - 3) == "png") {
      picList.push(file);
    } else {
      continue
    }
  }
  return picList;
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  var fs = require("fs"),
    PNG = require("pngjs").PNG;

  fs.createReadStream(pathIn)
    .pipe(
      new PNG({
        filterType: 4,
      })
    )
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;

          // invert color
          this.data[idx] = 255 - this.data[idx];
          this.data[idx + 1] = 255 - this.data[idx + 1];
          this.data[idx + 2] = 255 - this.data[idx + 2];

          // and reduce opacity
          this.data[idx + 3] = this.data[idx + 3] >> 1;
        }
      }

      this.pack().pipe(fs.createWriteStream(pathOut));
    });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};