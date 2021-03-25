const util = require('util');
const spawn = require('child_process').spawn;
const path = require('path');
const mypath = path.join(__dirname, "param.ps1");


const args = '-test myvalue';

let value = 'VALUE'
let myjson = { "maven": "MAVEN" }
let command = `-test ${myjson.maven}`;

//child = spawn("powershell.exe", [mypath, "-test", "myvalue"]);
child = spawn("powershell.exe", [mypath, command]);

child.stdout.on("data", function (data) {
    console.log("Powershell Data: " + data);
});
child.stderr.on("data", function (data) {
    console.log("Powershell Errors: " + data);
});
child.on("exit", function () {
    console.log("Powershell Script finished");
});
child.stdin.end();