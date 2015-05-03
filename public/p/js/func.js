$(function() {
  $('.go-top').on('click', function() {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  });

  $('#contraband-search').on('submit', function(e) {
    e.preventDefault();
    var $t = $(this);
    var name = $t.find('input.contraband').val();
    var $icon = $t.find('.icon-contraband');
    if (name !== '') {
      $.get('/api/query/contraband', {
        name: name
      }, function(data) {
        if (data.success) {
          var isCon = data.data.object;
          console.log(isCon);
          if (isCon) {
            $icon.removeClass('h').html('&#xea10;').css('color', '#3498DB');
          } else {
            $icon.removeClass('h').addClass('icon-wrong').html('&#xea0d;').css('color', '#F0553A');
          }
        } else {
          //OE.alert(data.data.msg);
        }
      });
    } else {
      return false;
    }
  }).on('input', function() {
    var $icon = $(this).find('.icon-contraband');
    $icon.addClass('h').html('');
  });

  $('.news-del, .ad-del, .site-del, .user-del, .contraband-del').on('click', function(e) {
    var target = $(e.target),
      id = target.data('id'),
      item = $(this).attr('class').split(' ')[2].split('-')[0];
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

function searchList(cb) {
  var $search = $('#search');
  $search.on('submit', function(e) {
    e.preventDefault();
    var val = $search.find('input').val();
    if (val === '') {
      return false;
    }
    var word = {
      word: val,
      type: location.pathname.split('/')[2]
    };
    $.get('/api/query/search', word, function(data) {
      console.log(data);
      var obj = data.data.object;
      $modal = $('#search-modal');
      $modal.find('.modal-header h4 span').html(word.word);
      $modalUl = $modal.find('.modal-body ul');
      $modalUl.empty();
      cb(obj, $modalUl);
    });
  });
}