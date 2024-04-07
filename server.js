const App = require('./app')
var appClass = new App();
const file1 = 'Logs/info.log';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path'); 
const { read } = require('./readLastLines');
appClass.fileView(file1);
app.get('/log', (req, res) => {
    console.log("request received");
    const options = {
        root: path.join(__dirname)
    };
    const fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
})

io.on('connection', async function(socket){
    console.log("new connection established:"+socket.id);
    appClass.on('file-updated', log =>{
        console.log("log.message is ", log.message);
        socket.emit("file-updated",log.message);
    });
    let initialData = await read(file1, 10);    // last 10 lines  
    initialData = initialData.toString();
    console.log("initialData is", initialData); 
    socket.emit("init",initialData);
});

http.listen(3000, function(){
    console.log('listening on localhost:3000');
});
