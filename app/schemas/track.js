var mongoose = require('mongoose');

var TrackSchema = new mongoose.Schema({
  billnumber: String,
  trackinfo: {
    type: Array,
    default: []
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
  }
});

TrackSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

TrackSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({
        billnumber: id
      })
      .exec(cb);
  },
  fetchLimit: function(start, limit, cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .skip(start)
      .limit(limit)
      .exec(cb);
  }
};

module.exports = TrackSchema;