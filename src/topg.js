var fs = require('fs')
const someFile = './src/console3.js'
const someFileOut = './src/console3-playground.js'
fs.readFile(someFile, 'utf8', function (err, data) {
  if (err) {
    return console.log('Error reading file', someFile, err)
  }
  var result = data.replace(/BABYLON_GUI/g, 'BABYLON.GUI')
  result = result.replace('exports.__esModule = true;', 'var exports = {};exports.__esModule = true;')
  result = result.replace('var BABYLON = require("babylonjs");', '')
  result = result.replace('var BABYLON.GUI = require("babylonjs-gui");', '')

  console.log('Replaced', result)
  fs.writeFile(someFileOut, result, 'utf8', function (err) {
    if (err) {
      return console.log('Error writing file', someFileOut, err)
    }
    return console.log('File written', someFileOut)
  })
})
