$(function() {
  var $slider = $('.bruno-slider'),
    $sliderUl = $slider.find('ul'),
    $index = 0;
  $span = $slider.find('.nav-dot span');
  $span.each(function(index) {
    $(this).data('index', index);
  });

  $span.first().addClass('active');

  var timer = null;

  timer = setInterval(next, 3000);

  $slider.on('mouseover', function() {
    clearInterval(timer);
  }).on('mouseout', function() {
    timer = setInterval(next, 3000);
  });

  $span.on('mouseover', function() {
    clearInterval(timer);
    next($(this).data('index'));
  });

  function next(index) {
    var index = index === undefined ? $index : index;
    $span.removeClass('active')
      .eq(index).addClass('active');
    $sliderUl.stop(true, false).animate({
      left: '-' + index * 100 + '%'
    });
    index = index >= $span.length - 1 ? 0 : ++index;
    $index = index;
  }
});