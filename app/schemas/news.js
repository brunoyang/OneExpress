var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  title: String,
  author: String,
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
  findById: function(id, cb, ignore) {
    if (arguments.length === 2) {
      return this
        .findOne({
          _id: id
        })
        .exec(cb);
    } else if (arguments.length === 3) {
      var ignoreList = {};
      ignore.forEach(function(item, index) {
        ignoreList[item] = 0;
      });
      return this
        .findOne({
          _id: id
        }, ignoreList)
        .exec(cb);
    }
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
        index: {
          $all: wordlist
        }
      })
      .sort('-meta.updateAt')
      .exec(cb);
  }
};

module.exports = NewsSchema;