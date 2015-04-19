$(function() {
  $('.go-top').on('click', function() {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  });

  $('.news-del', '.ad-del').on('click', function(e) {
    var target = $(e.target),
      id = target.data('id'),
      item = null;
    if($(this).attr('class').indexOf('news') !== -1){
      item = 'news';
    } else {
      item = 'ad';
    }
    var tr = $('.' + item + '-id-' + id);
    var confirm = confirm('确认删除吗?');
    if (confirm) {
      $.ajax({
          type: 'DELETE',
          url: '/admin/' + item + '/list?id=' + id
        })
        .done(function(result) {
          if (result.success === 1) {
            if (tr.length) {
              re.remove();
            }
          }
        });
    } else {
      return false;
    }
  });
});