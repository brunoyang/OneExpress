var mongoose = require('mongoose');

var BillSchema = new mongoose.Schema({
  sendname: String,
  sendareacode: String,
  sendtelephone: String,
  sendcellphone: String,
  sendprovince: String,
  sendcity: String,
  sendcounty: String,
  sendaddr: String,
  delivername: String,
  deliverareacode: String,
  delivertelephone: String,
  delivercellphone: String,
  deliverprovince: String,
  delivercity: String,
  delivercounty: String,
  deliveraddr: String,
  weight: Number,
  freight: Number,
  fragile: Boolean,
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

BillSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

BillSchema.statics = {
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
  }
};

module.exports = BillSchema;