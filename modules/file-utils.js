var fs = require('fs');

var readFile = function (fileName) {
    console.log(`Try read ${fileName}`)
    fs.readFile(fileName, function callback(err, data) {
        if (err) {
            throw "Fail to read it";
        }
        console.log(data);
    });
};

module.exports = {
  readFile: readFile,
}