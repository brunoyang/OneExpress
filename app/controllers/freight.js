exports.detail = function(req, res, next) {
  res.render('frontend/tools/freight', {
    title:  '运费查询 - 一通快递',
    toolsTitle: '运费查询',
    first: 'tools'
  });
};