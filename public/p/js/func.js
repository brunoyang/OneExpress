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
          if (isCon) {
            $icon.removeClass('h').addClass('icon-wrong').html('&#xea0d;').css('color', '#F0553A');
          } else {
            $icon.removeClass('h').html('&#xea10;').css('color', '#3498DB');
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

  $('#complaint').on('submit', function(e){
    e.preventDefault();
    $t = $(this);
    var email = $t.serializeArray();
    $.post('/api/save/complaint', email, function(data){
      if (data.success) {
        //OE.alert('发送成功');
      } else {
        //OE.alert('发送失败，请重新发送')
      }
    });
  });

  $('#bill-query').on('submit', function(e){
    e.preventDefault();
    $t = $(this);
    var number = $t.find('input').val();
    if(number !== '') {
      $.get('/api/query/bills',{0:number}, function(data){
        var obj = data.data.object[0];
        var tpl = $('#bill-content').html();
        var template = Handlebars.compile(tpl);
        var content = {
          sendname: obj.sendname,
          sendprovince: obj.sendprovince,
          sendcity: obj.sendcity,
          sendcounty: obj.sendcounty,
          sendaddr: obj.sendaddr,
          sendcellphone: obj.sendcellphone,
          delivername: obj.delivername,
          deliverprovince: obj.deliverprovince,
          delivercity: obj.delivercity,
          delivercounty: obj.delivercounty,
          deliveraddr: obj.deliveraddr,
          delivercellphone: obj.delivercellphone
        };
        var html = template(content);
        $('#bill-info').html(html);
      });
    } else {
      return false;
    }
  });

  $('.news-del, .ad-del, .site-del, .user-del, .contraband-del, .hr-del').on('click', function(e) {
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
      var obj = data.data.object;
      $modal = $('#search-modal');
      $modal.find('.modal-header h4 span').html(word.word);
      $modalUl = $modal.find('.modal-body ul');
      $modalUl.empty();
      cb(obj, $modalUl);
    });
  });
}