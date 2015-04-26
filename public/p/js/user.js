$(function() {
  var $signinDialog = $('.modal-dialog-signin'),
    $signupDialog = $('.modal-dialog-signup'),
    $modalDialogBg = $('.modal-dialog-bg'),
    $signupWrong = $('.modal-dialog-signup .modal-dialog-msg p'),
    $signinWrong = $('.modal-dialog-signin .modal-dialog-msg p'),
    rUsername = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
    rEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


  $('#signin-button').on('click', function() {
    $signinDialog.addClass('sign-dialog');
    $modalDialogBg.addClass('fade-in');
  });

  $('#signup-button').on('click', function() {
    $signupDialog.addClass('sign-dialog');
    $modalDialogBg.addClass('fade-in');
  });

  $('.modal-dialog-close').on('click', function() {
    $signinDialog.removeClass('sign-dialog');
    $signupDialog.removeClass('sign-dialog');
    $modalDialogBg.removeClass('fade-in');
  });

  $('.modal-dialog-show-password').on('mousedown', function() {
    $(this).prev('input').attr('type', 'text');
  }).on('mouseup', function() {
    $(this).prev('input').attr('type', 'password');
  });

  $signupDialog.find('.modal-dialog-user').on('blur', function() {
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
      $t.siblings('span').removeClass('h');
      return $signupWrong.html('');
    })
    .end().find('.modal-dialog-email').on('blur', function() {
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

  $signinDialog
    .find('.modal-dialog-email')
    .on('blur', function() {
      var $t = $(this);
      var $span = $t.siblings('.icon-check');
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
            $span.removeClass('h');
          } else {
            $span.addClass('h');
            $signinWrong.html(data.data.msg);
          }
        });
    });
});