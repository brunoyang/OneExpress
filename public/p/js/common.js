function stopProp(ev) {
  if (ev.stopPropagation) {
    ev.stopPropagation();
  } else if (window.event) {
    window.event.cancelBubble = true; //兼容IE
  }
}

var OE = function() {
  return {
    PopOut: function(){
      return {
        WD: [400, 484, 660],
        alert: function(pm, s){
          var _t = this,
              $head = null,
              $body = null,
              size = s === 's' ? 0 : s === 'm' ? 1 : s === 'l' ? 2 : s;
          size = size || 0;

          if ($.type(pm) === 'string' || $.type(pm) === 'number') {
            pm = [null, pm];
          }

          var $alertBox = $('<div class="OE-alert"></div>');

          if (pm[0] !== null) {
            $head = $('<div class="OE-alert-title clearfix"><h3>' + pm[0] + '</h3><a href="javascript:;" onclick="OE.PopOut.close()" class="OE-alert-close">X</a></div>');
          }

          $body = $('<div class="OE-alert-content"><h2>' + pm[1] + '</h2><a href="javascript:;" onclick="OE.PopOut.close()" class="btn btn-success">关闭</a></div>');

          $alertBox.append($head);
          $alertBox.append($body);

          _t.mask();

          $('body').append($alertBox);
          $('.OE-alert').css('width', _t.WD[size]).show();
        },
        mask: function(){
          var _t = this;

          var mask = $('<div class="OE-mask"><div>');
          $('body').append(mask);
          $('.OE-mask').show();
        },
        close: function() {
          $('.OE-mask').hide();
          $('.OE-alert').hide();
        }
      };
    }()
  };
}()