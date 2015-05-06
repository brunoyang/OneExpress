$(function() {
  //三级联动选择省市区
  $('#oe-city').on('click', function(e) {
    var $pro = $('#oe-province'),
      $input = $('#oe-city'),
      $sPro = $('#s-province'),
      $sCity = $('#s-city'),
      $sCounty = $('#s-county'),
      $select = [$sPro, $sCity, $sCounty],
      $siteValue = null,
      siteInfo = {},
      i = 0,
      rNum = /^[1-9][0-9]*$/;
    $pro.show();
    stopProp(e);

    $(document).on('click', function(e) {
      e.preventDefault();
      //$pro.hide();
    });

    $pro.on('click', function(e) {
      stopProp(e);
    });

    $.post('/api/query/site', function(data) {
      var data = data.data.object;
      $.each(data, function(index, site) {
        siteInfo[site.province] = {};
      });
      for (var i in siteInfo) {
        for (var j = 0; j < data.length; j++) {
          if (i === data[j].province) {
            siteInfo[i][data[j].city] = siteInfo[i][data[j].city] ? siteInfo[i][data[j].city] : [];
            siteInfo[i][data[j].city].push(data[j].county);
          }
        }
      }
      $sPro.find('option').not(':first').remove();
      handlerSite($sPro, siteInfo, 'province');
    });

    $sPro.on("change", function() {
      var val = $sPro.val();
      if (val) {
        val = val;
      } else {
        return false;
      }

      $sCity.find('option').not(':first').remove();
      $sCounty.find('option').not(':first').remove();
      handlerSite($sCity, siteInfo, 'city', val);
    });

    $sCity.on("change", function() {
      var proVal = $sPro.val();
      var cityVal = $sCity.val();
      if (proVal) {
        proVal = proVal;
      } else if (cityVal) {
        cityVal = cityVal;
      } else {
        return false;
      }

      $sCounty.find('option').not(':first').remove();
      handlerSite($sCounty, siteInfo, 'county', proVal, cityVal);
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
  });

  function handlerSite(ele, siteInfo, level, province, city) {
    var area = '';

    switch (level) {
      case 'province':
        $.each(siteInfo, function(index, site) {
          area += '<option value="' + index + '">' + index + '</option>';
        });
        break;
      case 'city':
        $.each(siteInfo[province], function(index, site) {
          area += '<option value="' + index + '">' + index + '</option>';
        });
        break;
      case 'county':
        $.each(siteInfo[province][city], function(index, site) {
          area += '<option value="' + site + '">' + site + '</option>';
        });
        break;
    }
    ele.append(area);
  }

  //insert text at cursor in textarea

  $(document).on('click', '.text-edit button', function(e) {
    var $t = $(this);
    var val = $t.data('val');
    insertAtCurcsor(val);
  });

  function insertAtCurcsor(val) {
    var t = $('#inputContent')[0];

    if (t.selectionStart || t.selectionStart === 0) {
      var range = {
        start: t.selectionStart,
        end: t.selectionEnd,
        top: t.scrollTop
      };
      var tValue = t.value;
      t.value = tValue.substring(0, range.start) + val + tValue.substring(range.end, tValue.length);
      if (range.top > 0) {
        t.scrollTop = range.top;
      }
      t.focus();
      t.selectionStart = range.start + val.length;
      t.selectionEnd = range.start + val.length;
    } else if (document.selection) {
      t.focus();
      sel = document.selection.createRange();
      sel.text = val;
      sel.select();
    } else {
      t.value += val;
      t.focus();
    }
  }
});