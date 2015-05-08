var mongoose = require('mongoose');

var SiteSchema = new mongoose.Schema({
  name: String,
  province: String,
  city: String,
  county: String,
  address: String,
  telephone: String,
  areacode: String,
  manager: String,
  X: Number,
  Y: Number,
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

SiteSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

SiteSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('-meta.updateAt')
      .exec(cb);
  },
  findByArea: function(arealevel, area, cb) {
    return this
      .findOne({
        county: area
      })
      .exec(cb);
  },
  findByAreas: function(arealevel, area, cb) {
    var obj = {};
    obj[arealevel] = area;
    return this
      .find(obj)
      .sort('meta.updateAt')
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

module.exports = SiteSchema;