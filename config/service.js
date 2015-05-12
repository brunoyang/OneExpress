var _ = require('underscore');
var User = require('../app/models/user');

var $MSG = {
  first: '欢迎咨询一通',
  admin: '您已上线，开始接受咨询',
  adminLeave: '客服暂时不在线，请稍后咨询',
  userLeave: '对方离开'
}

var users = {};
var admin = {};

module.exports = function(io) {
  io.on('connection', function(socket) {
    var socketId = socket.id;
    var admin_now = null;

    //customer
    socket.on('welcome', function(id) {
      var uid = id.substr(3, 24);

      if (_.keys(admin).length === 0) {
        socket.emit('message', $MSG.adminLeave);
      } else {
        admin_now = admin[_.keys(admin)[0]];
        socket.emit('message', $MSG.first);
      }
      users[socketId] = {
        socket: socket
      }

      User.findById(uid, function(err, user) {
        if (err) {
          console.log(err);

        } else {
          users[socketId].name = user.name;
          users[socketId].email = user.email;
        }
      })
    });

    socket.on('say', function(msg) {
      if (_.keys(admin).length === 0) {
        socket.emit('message', $MSG.adminLeave);
      } else {
        admin[_.keys(admin)[0]].socket.emit('admin_message', {
          msg: msg,
          name: users[socketId].name,
          id: socketId
        });
      }
    });

    //admin

    socket.on('admin_welcome', function(id) {
      var uid = id.substr(3, 24);
      admin[socketId] = {
        socket: socket
      }

      User.findById(uid, function(err, user) {
        if (err) {
          console.log(err);
        }
        admin[socketId].name = user.name;
        admin[socketId].email = user.email;
      })
      socket.emit('admin_welcome', $MSG.admin);
    });

    socket.on('admin_say', function(data) {
      var _socketId = data.id;
      users[_socketId].socket.emit('message', data.msg);
    });



    socket.on('disconnect', function() {
      if (admin[socketId] && admin[socketId].name) {
        socket.broadcast.emit('admin_message', $MSG.adminLeave);
        delete admin[socketId];
      } else if (users[socketId] && users[socketId].name) {
        socket.broadcast.emit('message', $MSG.userLeave);
        delete users[socketId];
      }
    });
  });
}