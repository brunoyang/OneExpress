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
    // $window.on('resize', function() {
    //   big();
    // })
  })

  // .get(0).onscroll = function(e){
  //  var e = e || window.event;
  //  this.scrollTop += e.wheelDelta > 0 ? -60 :  60;
  //  return false;
  // }
  $('.oe-close').on('click', function() {
    $('#s').removeClass('open');
    $search.animate({
      'min-height': $search_w
    }, 500);
    $window.scrollTop(-$('.header-container').height());
    $billList.removeClass('show');
  });

  function stopProp(ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true; //兼容IE
    }
  }

  function handlerSite(ele, data) {
    var proList = JSON.parse(data);
    for (var i = 0; i < proList.length; i++) {
      var option = document.createElement('option');
      option.innerHTML = proList[i].name;
      option.value = unescape(proList[i].value);
      ele.append(option);
    }
  }

  function oeProvince(id, input) {
    var $pro = $('#' + id),
      $input = $('#' + input),
      $sPro = $('#s-province'),
      $sCity = $('#s-city'),
      $sCounty = $('#s-county'),
      $select = [$sPro, $sCity, $sCounty],
      $siteValue = null,
      rNum = /^[1-9][0-9]*$/;

    document.onclick = function() {
      $pro.hide();
    }

    $pro.on('click', function(e) {
      stopProp(e);
    });

    $input.on('click', function(e) {
      $pro.show();
      stopProp(e);
    }).one('click', function(event) {
      $.get('api/returnSite.php' + '?id=0', function(data) {
        handlerSite($sPro, data)
      });
    });

    $sPro.on("change", function() {
      var val = $sPro.find('option:selected').val();
      if (rNum.test(val)) {
        val = val
      } else {
        return false
      };
      $.get('api/returnSite.php' + '?id=' + val, function(data) {
        $sCity.find('option:not(:first)').remove();
        handlerSite($sCity, data)
      });

      $sCity.find('option').not(':first').remove();
      $sCounty.find('option').not(':first').remove();
    });

    $sCity.on("change", function() {
      var val = $sCity.find('option:selected').val();
      if (rNum.test(val)) {
        val = val
      } else {
        return false
      };
      $.get('api/returnSite.php' + '?id=' + val, function(data) {
        $sCounty.find('option:not(:first)').remove();
        handlerSite($sCounty, data)
      });
    });
    $sCounty.on("change", function() {
      var arr = [],
        i = 0,
        len = $select.length;
      for (; i < len; i++) {
        arr.push($select[i].find('option:selected').html());
      }
      $siteValue = arr;
      $input.val(arr.join('-'));
      $pro.hide();
    });


    $('#pro-close').on('click', function() {
      $pro.hide();
    });
    $pro.css('left', $input.position().left);
  }

  function checkVal() {
    var $errInfo = $('.oe-err-info');
    $errInfo.empty();
    var val = $input.val().trim();

    if (val == '') {
      $errInfo.html("运单号不能为空哦！");
      return false;
    }

    var orderList = $.unique(val.replace(/\s\s+/g, ' ').split(' ').reverse());

    if (orderList.length > 3) {
      $errInfo.append($('<li></li>').html("一次最多只能查3个运单号啦~"));
      return false;
    }

    var msg = [],
      j = 0;
    for (var i = 0, l = orderList.length; i < l; i++) {
      var len = i + 1;
      var bill = orderList[i].trim();
      if (isNaN(bill)) {
        msg[j++] = '亲~第' + len + '个单号必须是数字，且为半角输入法~';
      } else if (bill.length !== 12 && bill.length !== 0) {
        msg[j++] = '亲~第' + len + '个运单号长度必须等于12~';
      }
    }
    if (j) {
      if (msg.length == 1) {
        $errInfo.append($('<li></li>').html(msg[0]));
        return false;
      } else {
        for (var i = 0, l = j; i < l; i++) {
          $errInfo.append($('<li></li>').html(msg[i]));
        }
        return false;
      }
    } else {
      return {
        "allow": true,
        "bills": orderList
      };
    }
  }

  function displayBillList(index, number, type, position, manager, time, receiver) {
    var i = 0,
      pLen = position.length,
      mLen = manager.length,
      tLen = time.length,
      $ul = $('<ul></ul>'),
      $billListContent = $(".bill-list-content");

    $billListContent.eq(index).append($("<h3>" + number + "</h3>"));

    for (; i < pLen; i++) {
      var $li = $("<li><div><span>" + position[i] + "</span>已收件 收件人是<span>" + manager[i] + "</span></div></li>");
      $ul.append($li)
    }

    if (type == 2 || type == 3) {
      $li = $("<li><div><span>" + manager[mLen - 1] + "</span>正在派件</div></li>");
      $ul.append($li);
      if (type == 3) {
        $li = $("<li><div>已签收 签收人是<span>" + receiver + "</span>正在派件</div></li>");
      }
      $ul.append($li);
    }
    $ul.appendTo($billListContent.eq(index));
  }

  function handleBills(data, number) {
    var billList = JSON.parse(data);
    var i = 0,
      len = billList.length;
    $billList.addClass('show');
    $('.bill-content').css({
      'height': $window.height() - $input.height() - 50
    });
    $(".bill-list-content").empty();

    for (; i < len; i++) {
      var type = billList[i].type,
        positionList = unescape(billList[i].position).split('-'),
        managerList = unescape(billList[i].manager).split('-');
      timeList = billList[i].time.split('/'),
        receiver = billList[i].receiver;
      displayBillList(i, number[i], type, positionList, managerList, timeList, receiver);
    }
  }

  $('#oe-submit').on('click', function(e) {
    e.preventDefault();
    var obj = checkVal(),
      i = 0,
      len = obj.bills.length,
      billList = {};

    for (; i < len; i++) {
      billList[i] = obj.bills[i];
    }
    billList['length'] = i;
    if (obj.allow) {
      $.post('api/querybills.php', billList, function(data) {
        handleBills(data, billList);
      });
    }
  });

  oeProvince('oe-province', 'oe-city');
});
