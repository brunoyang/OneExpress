var $table = $('table');
var oldValue = [];
var tr = '<tr><td><input type="text" id="inputSite"></td><td><input type="text" id="inputManager"></td><td><select id="inputStatus"><option value="1">已收入</option><option value="2" selected>已发出</option><option value="3">正在派件</option><option value="4">已签收</option></select></td><td><button id="inputSubmit" class="btn btn-success">提交</button><button style="margin-left: 10px;" id="inputCancelSubmit" class="btn btn-danger">取消</button></td></tr>'

if(!$table.find('tbody tr').length) {
  $table.hide();
}

$(document)
.on('click', '#inputSubmit', function(e){
  var $t = $(this);
  var track = {
    'track[type]': 'save',
    'track[id]': $('#inputBill').val(),
    'track[site]': $('#inputSite').val(),
    'track[manager]': $('#inputManager').val(),
    'track[status]': $('#inputStatus').val()
  };
  $.post('/api/save/track', track, function(data){
    OE.PopOut.alert('保存成功')
  });
  var $td = $t.parents('tr').find('td');
  $('.modify').attr('disabled', false);
  $td.eq(0).html($td.eq(0).find('input').val());
  $td.eq(1).html($td.eq(1).find('input').val());
  $td.eq(2).html($td.eq(2).find('select').val());
  $td.eq(3).html('<button class="btn btn-default modify">修改</button>');
})
.on('click', '#inputCancelSubmit', function(e){
  $table.find('tbody tr').first().remove();
})
.on('click', '#inputSubmitModify', function(e){
  var $t = $(this);
  var track = {
    'track[index]': $('tbody tr').index($t.parents('tr')),
    'track[type]': 'update',
    'track[id]': $('#inputBill').val(),
    'track[site]': $('#inputSiteModify').val(),
    'track[manager]': $('#inputManagerModify').val(),
    'track[status]': $('#inputStatusModify').val()
  };

  $.post('/api/save/track', track, function(data){
     OE.PopOut.alert('保存成功');
  });
  
  var $td = $t.parents('tr').find('td');
  $('.modify').attr('disabled', false);
  $td.eq(0).html($td.eq(0).find('input').val());
  $td.eq(1).html($td.eq(1).find('input').val());
  $td.eq(2).html($td.eq(2).find('select').val());
  $td.eq(3).html('<button class="btn btn-default modify">修改</button>');
})
.on('click', '#inputCancelModify', function(e){
  var $t = $(this);
  var $td = $t.parents('tr').find('td');
  
  $('.modify').attr('disabled', false);
  $td.eq(0).html(oldValue[0]);
  $td.eq(1).html(oldValue[1]);
  $td.eq(2).html(oldValue[2]);
  $td.eq(3).html('<button class="btn btn-default modify">修改</button>');

})
.on('click', '#add-track', function(e){
  e.preventDefault();
  $table.show().find('tbody').prepend(tr);
})
.on('click', '.modify', function(e){
  var target = $(e.target);
  var $td = target.parents('tr').find('td');

  $('.modify').attr('disabled', true);
  target.attr('disabled', false);
  oldValue = [$td.eq(0).html(), $td.eq(1).html(), $td.eq(2).html()]


  $td.eq(0).html('<input required id="inputSiteModify" type="text" value='+$td.eq(0).html()+'>');
  $td.eq(1).html('<input required id="inputManagerModify" type="text" value='+$td.eq(1).html()+'>');
  $td.eq(2).html('<select required id="inputStatusModify"><option value="1">已收入</option><option value="2" selected>已发出</option><option value="3">正在派件</option><option value="4">已签收</option></select>');
  $td.eq(3).html('<button id="inputSubmitModify" class="btn btn-success">提交</button><button id="inputCancelModify" class="btn btn-danger" style="margin-left:10px;">取消</button>');
});