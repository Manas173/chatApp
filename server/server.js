const path = require('path');
const express = require('express');
var app = express();
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
var PORT = process.env.PORT || 3000;
var http = require('http');
var server = http.createServer(app);
var io = socketIO(server);
var moment = require('moment');
const {isRealString} = require('./utils/validation.js');
var {generateMessage,generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users.js');
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket) => {
	console.log('New user connected !');

	// socket.emit('newMessage',{
	// 	from: 'Admin',
	// 	text: 'Welcome to the chat App',
	// 	createdAt: moment().valueOf()
	// })
	socket.on('join',(params,callback) => {
		if(!isRealString(params.name)|| !isRealString(params.room)){
			callback('Username and roomname are required !');
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id,params.name,params.room);
		io.to(params.room).emit('updateUserList',users.getUserList(params.room))
		socket.emit('newMessage',{
			from: 'Admin',
			text: 'Welcome to the chat App',
			createdAt: moment().valueOf()
		})
		socket.broadcast.to(params.room).emit('newMessage',{
			from: 'Admin',
			text: `${params.name} has joined`,
			createdAt: moment().valueOf()
		})
		callback();
	})

	// socket.broadcast.emit('newMessage',{
	// 	from: 'Admin',
	// 	text: 'New user joined',
	// 	createdAt: moment().valueOf()
	// })

	socket.on('createLocationMessage',(coords,callback)=>{
		var user = users.getUser(socket.id);
		if(user){
			io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,`${coords.latitude},${coords.longitude}`))
		}
	})

	socket.on('createEmail',(email) => {
		console.log('Email arrived',email)
		io.emit('newMail',{
			from: email.from,
			text: email.text,
			createdAt : new Date().getTime()
		})
	})

	socket.on('createMessage',(message,callback) => {
			var user = users.getUser(socket.id);
			if(user && isRealString(message.text)){
			io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
		}
	})

	socket.on('disconnect',()	=>	{
		console.log('User was disconnected !')
		var user = users.removeUser(socket.id);
		if(user){
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
		}
	})

})

server.listen(PORT,()=>{
	console.log(`Server is up on PORT ${PORT} !`)
})