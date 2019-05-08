const expect = require('expect');
const {Users} = require('./users');

describe('Users',()=>{
    it('should add new user',()=>{
        var users = new Users();
        beforeEach(()=>{
            users = new Users();
            users.users= [{
            id: '1',
            name: 'King',
            room: 'Eleven punjab'
        },{
            id: '2',
            name: 'Andrew',
            room: 'The Office Fans'
        },{
            id:' 3',
            name: 'Kaiel',
            room: 'The Office Fans'
        }]
    // var resUser = users.addUser(user.id,user.name,user.room);
    // expect(users.users).toEqual([user]);
        })
    })
})