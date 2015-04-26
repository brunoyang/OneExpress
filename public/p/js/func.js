$(function() {
  $('.go-top').on('click', function() {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  });

  $('.news-del, .ad-del, .site-del, .user-del').on('click', function(e) {
    var target = $(e.target),
      id = target.data('id'),
      item = null;
    if ($(this).attr('class').indexOf('news') !== -1) {
      item = 'news';
    } else if ($(this).attr('class').indexOf('ad') !== -1) {
      item = 'ad';
    } else if ($(this).attr('class').indexOf('site') !== -1) {
      item = 'site';
    } else if($(this).attr('class').indexOf('user') !== -1) {
      item = 'user';
    }
    var tr = $('.' + item + '-id-' + id);
    var confirm = window.confirm('确认删除吗?');
    if (confirm) {
      $.ajax({
          type: 'DELETE',
          url: '/admin/' + item + '/list?id=' + id
        })
        .done(function(result) {
          if (result.success === 1) {
            if (tr.length) {
              tr.remove();
            }
          }
        });
    } else {
      return false;
    }
  });
});