const fs = require('fs')
const chokidar = require('chokidar')
const EventEmitter = require('events').EventEmitter;
const { read } = require('./readLastLines');

class App extends EventEmitter{
    constructor(){
        super();
    }
    fileView(targetFile){
        try{
            console.log(`Watching over the file${targetFile}`);
            var watcher = chokidar.watch(targetFile, {
                persistent: true,
                usePolling: false
            });
            watcher.on('change', async filePath => {
                console.log(`[${new Date().toLocaleString()}] ${filePath} has been updated `);
                var updateData = await read(filePath, 10);    // last 10 lines  
                updateData = updateData.toString();
                console.log("updateData is", updateData);      
                this.emit('file-updated', {
                    message: updateData
                });
            })
        } catch(err){
            console.log(err);   // in case of error
        }
    }
}

module.exports = App;