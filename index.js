var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nickNames=[];

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){

  /*
  socket.on('join', function(name){
  	people[socket.id] = name;
  	socket.emit("update", "You have connected to the server.");
  	io.emit("update", name + " has joined the server.")
    io.emit("update-people", people);
    
  });
  */
  socket.on('chat message', function(msg){
   
  	io.emit('chat message', {nickName: socket.nickName, message: msg });
  });

  // handle event of new user
  socket.on('new user', function(nickName, callback){

    if (nickNames.indexOf(nickName) != -1) {
        console.log("-1 name:" + nickName);
        callback(false);
    }
    else {
        
        console.log(" name:" + nickName);       
        callback(true);
        socket.nickName = nickName;
        nickNames.push(nickName);
        console.log("nickNames" + nickNames.toString());
        io.emit('usernames', nickNames);
       
    }
  });
  
  socket.on('disconnect', function(data){
     console.log('user disconnected');
     if (!socket.nickName) return;
     nickNames.splice(nickNames.indexOf(socket.nickName), 1);
     io.emit('usernames', nickNames);
       
  });
   
  

});

http.listen(3000, function() {
	console.log('listening on *:3000');
});


