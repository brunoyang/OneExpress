var $signinDialog = $('.dialog-signin'),
  $signinWrong = $('.dialog-signin .dialog-msg p'),
  rUsername = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
  rEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
$('.dialog-show-password').on('mousedown', function() {
  $(this).prev('input').attr('type', 'text');
}).on('mouseup', function() {
  $(this).prev('input').attr('type', 'password');
});

$signinDialog
  .find('.dialog-email')
  .on('blur', function() {
    var $t = $(this);
    var $span = $t.next('.icon-check');
    var emailVal = $t.val();
    if (emailVal === '') {
      $span.addClass('h');
      return $signinWrong.html('邮箱不能为空');
    }
    if (!rEmail.test(emailVal)) {
      $span.addClass('h');
      return $signinWrong.html('邮箱格式好像有错误哦');
    }

    $.get('/api/check/email', {
        email: emailVal
      },
      function(data) {
        if (data.success) {
          $signinWrong.html('');
          $t.next('.icon-check').removeClass('h');
        } else {
          $span.addClass('h');
          $signinWrong.html(data.data.msg);
        }
      });
  });

var $signupDialog = $('.dialog-signup'),
  $signupWrong = $('.dialog-signup .dialog-msg p');
$signupDialog.find('.dialog-user').on('blur', function() {
    var $t = $(this);
    var $span = $t.siblings('.icon-check');
    var userVal = $t.val();
    if (userVal === '') {
      $span.addClass('h');
      return $signupWrong.html('用户名不能为空');
    }
    if (!rUsername.test(userVal)) {
      $span.addClass('h');
      return $signupWrong.html('用户名只能为汉字，数字，英文和下划线');
    }
    $span.removeClass('h');
    return $signupWrong.html('');
  })
  .end().find('.dialog-email').on('blur', function() {
    var $t = $(this);
    var $span = $t.siblings('.icon-check');
    var emailVal = $t.val();
    if (emailVal === '') {
      $span.addClass('h');
      return $signupWrong.html('邮箱不能为空');
    }
    if (!rEmail.test(emailVal)) {
      $span.addClass('h');
      return $signupWrong.html('邮箱格式好像有错误哦');
    }
    $.get('/api/check/email', {
        email: emailVal
      },
      function(data) {
        if (data.success) {
          $span.addClass('h');
          $signupWrong.html('已有该用户');
        } else {
          $span.removeClass('h');
          $signupWrong.html('');
        }
      });
  });