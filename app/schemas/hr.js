var mongoose = require('mongoose');

var HrSchema = new mongoose.Schema({
  job: String,
  work: {
    type: Array,
    default: []
  },
  req: {
    type: Array,
    default: []
  },
  area: String,
  num: {
    type: Number,
    default: 1
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

HrSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

HrSchema.statics = {
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

module.exports = HrSchema;