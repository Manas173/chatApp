var expect = require('expect')
var {generateMessage,generateLocationMessage} = require('./message.js')

describe('generateMessage',() => {
    it('should generate correct message object',() => {
        var from = 'Jen' ;
        var text = 'Hi! I am new here!';
        var obj = generateMessage(from,text)
    })
})

describe('createCurrentLocation',()=>{
    it('should generate correct location object',()=>{
        var from = 'Deb';
        var latitude = 15;
        var longitude = 19;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var message = generateLocationMessage(from,`${latitude},${longitude}`);
        expect(message.url).toBe(url);
    })
})