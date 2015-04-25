var mongoose = require('mongoose');

var AreaSchema = new mongoose.Schema({
  province: String,
  city: String,
  county: String,
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

AreaSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

AreaSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findByArea: function(areaname, cb) {
    // arealevel province, city, county
    return this
      .findOne({
        province: areaname
      })
      .exec(cb);
  },
  findByAllArea: function(area, cb) {
    return this
      .findOne({
        province: area.province,
        city: area.city,
        county: area.county
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

module.exports = AreaSchema;