$(function() {
  var $slider = $('.bruno-slider'),
    $sliderUl = $slider.find('ul'),
    $sliderLi = $slider.find('li'),
    $dot = $slider.find('.nav-dot'),
    $sliderLength = $sliderLi.length,
    $index = 0,
    timer = null;

  $sliderUl.width(($sliderLi.length * 100) + '%');
  $sliderLi.width((100 / $sliderLi.length) + '%');
  $dot.width(15 * $sliderLength);
  for (var i = 0; i < $sliderLength; i++) {
    $dot.append('<span>');
  }
  var $span = $dot.find('span');
  $span.first().addClass('active');
  $span.each(function(index) {
    $(this).data('index', index);
  });

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
    var i = index === undefined ? $index : index;
    $span.removeClass('active')
      .eq(i).addClass('active');
    $sliderUl.stop(true, false).animate({
      left: '-' + i * 100 + '%'
    });
    i = i >= $span.length - 1 ? 0 : ++i;
    $index = i;
  }
});