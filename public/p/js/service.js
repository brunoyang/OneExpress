var socket = io();
var $chat = $('#chat');
var $message = $('#message');
var uid = $.cookie('uid');

if (!uid) {
  OE.PopOut.alert('请重新登录');
  location.href = '/signin'
}

function addToMsg(msg) {
  $message.append($('<li class="clearfix"><span class="to">' + msg + '</span></li>'));
}

function addFromMsg(msg) {
  $message.append($('<li class="clearfix"><span class="from">' + msg + '</span></li>'));
}

socket.emit('welcome', uid);
$chat.on('submit', function(e) {
  e.preventDefault();

  var $input = $('#m');
  var msg = $input.val();
  socket.emit('say', msg);
  $input.val('');
  addFromMsg(msg);
  $input.focus();
});

socket.on('message', function(msg) {
  addToMsg(msg)
});

socket.on('welcome', function(msg) {
  addToMsg(msg);
});