
const util = require('util');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);
const mypath = path.join(__dirname, "param.ps1");

let value = 'VALUE'
//let command = `-test ${value}`;
let myjson = { "maven": "MAVEN" }
let command = `-test ${myjson.maven}`;

async function main() {
    const { stdout, stderr } = await execFile("powershell.exe", [mypath, command]);
    if (stderr) {
        console.error(`error: ${stderr}`);
    }
    //console.log(`Output: ${stdout}`);
    console.log(stdout);
}
main();