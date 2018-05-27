const {app, BrowserWindow} = require('electron')
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

console.log("lu");


ioHook.on('mousemove', event => {
    console.log(event);
});


// Register and start hook
ioHook.start();

// Alternatively, pass true to start in DEBUG mode.
ioHook.start(true);
