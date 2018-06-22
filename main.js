const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;
const d3 = require('d3');
'use strict';
const ioHook = require('iohook');

global.mainWindow;
global.mouseMovements;
global.keyPressDict = [];
global.keysActive = [];
global.keyCodeToAlphabet = {};


function createWindow() {
    mainWindow = new BrowserWindow({width: 1920, height: 1080})
   mainWindow.setMenu(null);
    mainWindow.maximize();
    setKeys();


    mainWindow.loadFile('index.html')
    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

app.commandLine.appendSwitch('remote-debugging-port', '9222');

function setKeys() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var keyCodeStart = 65;

    for (var loopCount = 0; loopCount < alphabet.length; loopCount++) {
        keyCodeToAlphabet[keyCodeStart] = alphabet.charAt(loopCount);
        keyCodeStart++;
    }
}

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

global.isStart = true;
ioHook.on('mousemove', event => {
    mainWindow.webContents.send('mouseMove', event);
    //   console.log(event);
});

ioHook.on('keyup', event => {
    transformKeyEvent(event);
});


ioHook.start();

function transformKeyEvent(event) {
    var currentKey = keyCodeToAlphabet[event.rawcode];
    if (currentKey != undefined && currentKey != null) {
        // If there's nothing there just plonk it in.
        if (keyPressDict.length < 1) {
            keyPressDict.push({
                key: currentKey,
                value: keyPressDict[currentKey] = 1
            });
        } else {
            // Check if the currey keyPress is already in the dict
            if (keyPressDict.some(e => e.key == currentKey)) {

                // Itterate through the array checking to see if the current item is the the array item
                for (var keyItem in keyPressDict) {
                    if (keyPressDict[keyItem].key == currentKey) {
                        keyPressDict[keyItem].value += 1;
                    }
                }
            } else {
                // Otherwise insert it in
                keyPressDict.push({
                    key: currentKey,
                    value: keyPressDict[currentKey] = 1
                });
            }
        }
        mainWindow.webContents.send('ping', keyPressDict);
    }
}