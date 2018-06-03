const {app, BrowserWindow} = require('electron');
'use strict';
const ioHook = require('iohook');

let mainWindow;

console.log(process.versions.electron);

function createWindow() {

    mainWindow = new BrowserWindow({width: 800, height: 600})


    mainWindow.loadFile('index.html')
    mainWindow.on('closed', function () {
        mainWindow = null
    })
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

ioHook.on('mousemove', event => {
    console.log(event);
});

ioHook.on('keyup', event => {
    console.log(event);
});


ioHook.start();
ioHook.start(true);
