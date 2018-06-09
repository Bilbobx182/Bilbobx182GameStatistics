const {app, BrowserWindow} = require('electron');
const d3 = require('d3');
'use strict';
const ioHook = require('iohook');

let mainWindow;
global.mouseMovements;
global.keyPressDict = {};
global.keyCodeToAlphabet = {};


function createWindow() {

    mainWindow = new BrowserWindow({width: 800, height: 600})
    setKeys();

    mainWindow.loadFile('index.html')
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

function setKeys() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var keyCodeStart = 65;

    for(var loopCount = 0; loopCount<alphabet.length; loopCount++)
    {
        keyCodeToAlphabet[keyCodeStart] = alphabet.charAt(loopCount);
        keyCodeStart++;
    }
}
app.commandLine.appendSwitch('remote-debugging-port', '9222');


app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

ioHook.on('mousemove', event => {
 //   console.log(event);
});

ioHook.on('keyup', event => {
    transformKeyEvent(event);
});


ioHook.start();

function rawToAlpha(rawCode) {
    s
}

function transformKeyEvent(event) {
    var key = keyCodeToAlphabet[event.rawcode];
    if(key  in keyPressDict){
        keyPressDict[key] =  keyPressDict[key] +=1;
    }
    else {
        keyPressDict[key] = 1;
    }

    console.log(key + keyPressDict[key]);
}