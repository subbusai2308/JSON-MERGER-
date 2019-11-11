const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const inputFolder = readline.question('Enter the Folder Path Where JSON Files Are Stored: ');
const inputFileBaseName = readline.question('Enter the inputFile Base Name(prefix name): ');
const outputFileBaseName = readline.question('Enter the outputFile Base Name(prefix name): ');
const maxFileSize = readline.question('Enter the maxFileSize: ');
var count = 1;
var outputFileName = inputFolder + outputFileBaseName + count + ".json"
var data1 = null, data2 = null, jsonObj1 = null, jsonObj2 = null, MergerObj = null;

//To get the file size in Bytes
function getSizeOfFile(filename) {
    var stats = fs.statSync(filename)
    var bytes = stats["size"]
    return bytes
}
//To Merge Two JSON Object 
function mergeJson(target) {
    for (var argi = 1; argi < arguments.length; argi++) {
        var source = arguments[argi];
        for (var key in source) {
            if (!(key in target)) {
                target[key] = [];
            }
            for (var i = 0; i < source[key].length; i++) {
                target[key].push(source[key][i]);
            }
        }
    }
    return target;
}
fs.readdir(inputFolder, (err, files) => {
    fs.appendFileSync(outputFileName, fs.readFileSync(files[1]));//copying the first file data entirely to outputfile
    files.forEach(file => {
        if (files[1].localeCompare(file) != 0) {
            if (file.indexOf(inputFileBaseName) != -1) {//checking if basename and filename of are equal
                if (getSizeOfFile(outputFileName) + getSizeOfFile(inputFolder + file) < maxFileSize) {//checking if the file size exceed maxFileSize
                    data1 = fs.readFileSync(outputFileName);
                    jsonObj1 = JSON.parse(data1);
                    data2 = fs.readFileSync(inputFolder + file);
                    jsonObj2 = JSON.parse(data2);
                    MergerObj = JSON.stringify(mergeJson(jsonObj1, jsonObj2));
                    if (count == 1)
                        fs.writeFileSync(outputFileName, MergerObj);
                    else
                        fs.appendFileSync(outputFileName, MergerObj);
                } else {//if if exceeds the maxFileSize,increament the counter
                    count = count + 1;
                    outputFile = inputFolder + outputFileBaseName + count + ".json";
                    data2 = fs.readFileSync(testFolder + file);
                    fs.appendFileSync(outputFileName, data2);
                }
            }
        }
    });
})