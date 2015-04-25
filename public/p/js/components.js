function oeProvince() {
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

  $(document).on('click', function() {
    $pro.hide();
  });

  $pro.on('click', function(e) {
    stopProp(e);
  });

  $input.on('click', function(e) {
    $pro.show();
    stopProp(e);
  }).one('click', function(event) {
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
      handlerSite($sPro, siteInfo, 'province');
    });
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
}

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

oeProvince();