var mongoose = require('mongoose');

var SiteSchema = new mongoose.Schema({
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
  findByArea: function(area, cb) {
    return this
      .findOne({
        county: area
      })
      .exec(cb);
  },
  findByAreas: function(area, cb) {
    return this
      .find({
        county: area
      })
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
  }
};

module.exports = SiteSchema;