var mongoose = require('mongoose');

var AdSchema = new mongoose.Schema({
  imgSrc: String,
  title: String,
  content: String,
  pv: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  },
  index: {
    type: Array,
    default: []
  }
});

AdSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

AdSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('-meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({
        _id: id
      })
      .exec(cb);
  },
  fetchLimit: function(start, limit, cb) {
    return this
      .find({})
      .sort('-meta.updateAt')
      .skip(start)
      .limit(limit)
      .exec(cb);
  },
  search: function(wordlist, cb) {
    return this
      .find({
        index: {$all: wordlist}
      })
      .sort('-meta.updateAt')
      .exec(cb);
  }
};

module.exports = AdSchema;