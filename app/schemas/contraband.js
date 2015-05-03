var mongoose = require('mongoose');

var ContrabandSchema = new mongoose.Schema({
  name: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

ContrabandSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

ContrabandSchema.statics = {
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
  findByName: function(name, cb) {
    return this
      .findOne({
        name: name
      })
      .exec(cb);
  },
  search: function(wordlist, cb) {
    return this
      .find({
        name: {
          $all: wordlist
        }
      })
      .sort('-meta.updateAt')
      .exec(cb);
  }
};

module.exports = ContrabandSchema;