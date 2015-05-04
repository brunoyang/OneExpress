var nodejieba = require("nodejieba");
nodejieba.queryLoadDict('./node_modules/nodejieba/dict/jieba.dict.utf8', './node_modules/nodejieba/dict/hmm_model.utf8', 4);
module.exports = nodejieba;