var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
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

NewsSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

NewsSchema.statics = {
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

module.exports = NewsSchema;