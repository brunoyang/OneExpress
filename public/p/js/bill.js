jQuery(document).ready(function($) {
  var $input = $('#oe-input');
  var $search = $('.search');
  var $search_w = $('.search').height();
  var $window = $(window);
  var $billList = $('.bill-list');
  var $billContent = $('.bill-content');

  function big() {
    $search.css('min-height', $window.height());
    $window.scrollTop($('.header-container').height());
  }

  $input.on('focus', function() {
    $('#s').addClass('open');
    big();
  });

  $('.oe-close').on('click', function() {
    $('#s').removeClass('open');
    $search.animate({
      'min-height': $search_w
    }, 500);
    $window.scrollTop(-$('.header-container').height());
    $billList.removeClass('show');
  });

  function checkVal() {
    var $errInfo = $('.oe-err-info');
    var val = $input.val().trim();
    $errInfo.empty();

    if (val === '') {
      $errInfo.html('运单号不能为空哦！');
      return false;
    }

    var orderList = $.unique(val.replace(/\s\s+/g, ' ').split(' '));

    if (orderList.length > 3) {
      $errInfo.append($('<li></li>').html('一次最多只能查3个运单号啦~'));
      return false;
    }

    var msg = [],
      j = 0;
    for (var i = 0, l = orderList.length; i < l; i++) {
      var len = i + 1;
      var bill = orderList[i].trim();
      if (bill.length !== 24 && bill.length !== 0) {
        msg[j++] = '亲~第' + len + '个运单号长度必须等于24~';
      }
    }
    if (j) {
      if (msg.length === 1) {
        $errInfo.append($('<li></li>').html(msg[0]));
        return false;
      } else {
        for (var _i = 0, _l = j; _i < _l; _i++) {
          $errInfo.append($('<li></li>').html(msg[_i]));
        }
        return false;
      }
    } else {
      return orderList;
    }
  }

  function displayBillList(data) {
    var $billListContent = $('.bill-list-content');

    $.each(data, function(trackindex, trackinfo) {
      $billListContent.eq(trackindex).find('h3').html(trackinfo.billnumber);
      var li = '';
      $.each(trackinfo.trackinfo, function(index, track) {
        li += '<li>' + track + '</li>';
      });
      $billListContent.eq(trackindex).find('ul').append($(li));
    });
  }

  function handleBills(data) {
    var obj = data.data.object;
    $billList.addClass('show');
    // $('.bill-content').css({
    //   'height': $window.height() - $input.height() - 50
    // });
    $('.bill-list-content').css({
      'max-height': $window.height() - $input.height() - 50
    });
    $('.bill-list-content ul, .bill-list-content h3').empty();

    $('.bill-list-content').on('DOMMouseScroll', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    displayBillList(obj);
  }

  $('#s-form').on('submit', function(e) {
    e.preventDefault();
    var billList = checkVal(),
      bills = {};

    if (billList) {
      $.each(billList, function(index, bill) {
        bills[index] = bill;
      });

      if (bills) {
        $.get('/api/query/track', bills, function(data) {
          handleBills(data);
        });
      }
    }
  });

  var $form = $('#bill');

  $form.on('submit', function(e) {
    var $t = $(this);
    var illegalInput = [];
    e.preventDefault();

    $t.find('textarea, input').each(function(index) {
      if ($(this).val().trim() === '') {
        OE.PopOut.alert('不能为空');
        illegalInput.push($(this).attr('name'));
      }
    });

    if (illegalInput.length === 0) {
      var params = $t.serializeArray();

      $.post('/api/save/bill', params, function(data) {
        if (data.success) {
          OE.PopOut.alert('提交成功');
          setTimeout(location.reload, 2000);
        }
      });
    } else {

      return false;
    }
  });

  function billQuery(number){
    if (number !== '') {
      $.get('/api/query/bills', {
        0: number
      }, function(data) {
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
      $.get('/api/query/track', {
        0: number
      }, function(data) {
        if (data.success) {
          var list = data.data.object[0].trackinfo;
          var tpl = $('#bill-list-tpl').html();
          var template = Handlebars.compile(tpl);
          var content = {list: list};
          var html = template(content);
          $('#bill-track').html(html);
        }
      });
    } else {
      return false;
    }
  }

  billQuery($('#bill').val());

  $('#bill-query').on('submit', function(e) {
    e.preventDefault();
    var $t = $(this);
    var number = $t.find('input').val();
    billQuery(number);
  });
});