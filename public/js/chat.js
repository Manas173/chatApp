var socket = io();
socket.on('connect',function () {
    console.log('Connected to server !')
    var params = jQuery.deparam(window.location.search)
    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else{
            console.log('No error');
        }
    });
});
socket.on('disconnect',function() {
    console.log('Disconnected from server !')
    var li= jQuery('<li> </li>');
    li.text('You got disconnected from the server !');
    jQuery(`#messages`).append(li);
})
socket.on('newMail',function(email) {
    var li= jQuery('<li> </li>');
    li.text(email.text);
    jQuery(`#messages`).append(li);
})

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation is supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },function(){
            alert('Unable to fetch location')
        })
    })
})

socket.on('newLocationMessage',function(message){
    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    })
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `)
    // a.attr('href',message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    var text = jQuery('[name=message').val();
    $('#message-form').children('#message-input').val('');
    socket.emit('createMessage',{
        from:'User',
        text
    },function(){

    })
})

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var newMessageHeight = newMessage.innerHeight();
    var prevMessageHeight = newMessage.prev().innerHeight();
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');

    if(clientHeight+scrollTop+newMessageHeight+prevMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li= jQuery('<li> </li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery(`#messages`).append(li);
})

socket.on('updateUserList',function(users){
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    })
    jQuery('#users').html(ol);
    console.log('User\'s list',users);
})