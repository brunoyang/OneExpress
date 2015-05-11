var crypto = require('crypto');
var bcrypt = require('bcryptjs');

function getRandomEmail(len) {
  if (!len) {
    len = 16;
  }
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex') + '@gmail.com';
}

function getRandomUsername(len) {
  if (!len) {
    len = 16;
  }
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = require('../../app/models/user');

var user = null;

describe('Unit Test', function() {
  describe('Model User:', function() {
    before(function(done) {
      user = {
        name: getRandomUsername(),
        email: getRandomEmail(),
        password: 'password'
      };
      done();
    });


    describe('Before Method Save', function() {
      it('should begin without test user', function(done) {
        User.find({
          email: user.email
        }, function(err, users) {
          users.should.have.length(0);

          done();
        });
      });
    });

    describe('User Save', function() {
      it('should save without problems', function(done) {
        var _user = new User(user);
        _user.save(function(err) {
          should.not.exist(err);
          _user.remove(function(err) {
            should.not.exist(err);
            done();
          });
        });
      });

      it('should password be hashed correctly', function(done) {
        var password = user.password;
        var _user = new User(user);

        _user.save(function(err) {
          should.not.exist(err);
          _user.password.should.not.have.length(0);

          bcrypt.compare(password, _user.password, function(err, isMatch) {
            isMatch.should.equal(true);
            _user.remove(function(err) {
              should.not.exist(err);
              done();
            });
          });
        });
      });

      it('should have role equal 0', function(done) {
        var _user = new User(user);

        _user.save(function(err) {
          should.not.exist(err);
          _user.role.should.equal(0);

          _user.remove(function(err) {
            should.not.exist(err);
            done();
          });
        });
      });

      it('should fail when save an existing email', function(done) {
        var _user1 = new User(user);

        _user1.save(function(err) {
          should.not.exist(err);
          var _user2 = new User(user);

          _user2.save(function(err) {
            should.exist(err);

            _user1.remove(function(err) {
              if (!err) {
                _user2.remove(function(err) {
                  should.not.exist(err);
                  done();
                });
              }
            });
          });
        });
      });
    });
    
    after(function(done){
      done();
    });
  });
});