var adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter').users;
var assert = require('assert');
var crypto = require('crypto');

function random() { return crypto.randomBytes(16).toString('hex') };

describe('Users', function(){

  before(function(){
    opts = {};
  });

  var userId;
  var userName;

  describe('creating a user', function(){

    it('should succeed with a username and password', function(fn){
    
      opts = {
        name: random(),
        password: random()
      } 
      adapter.create(opts, function(err, user){
        assert(!err);
        assert(user.id > 0);
        assert(user.name == opts.name); 
        userId = user.id;
        userName = user.name;
        fn();
      });
    });

    it('should store a unique salt for every user', function(fn){
      opts = {
        name: random(), 
        password: random()
      }; 
      adapter.create(opts, function(err, user){
        assert(user.salt);
        var firstSalt = user.salt;
        opts = {
          name: random(), 
          password: random()
        };
        adapter.create(opts, function(err, user){
          assert(user.salt);
          assert(firstSalt != user.salt);
          fn();
        });
      });
    });

    it('should hash every password with the corresponding salt', function(fn) {
      opts = {
        name: random(), 
        password: random(),
      } 
      adapter.create(opts, function(err, user){
        assert(!err);
        assert(!user.password);
        assert(user.password_hash)
        fn();
      });

    });
  
    it('should not be able to create two users with the same name', function(fn){
      opts = {
        name: random(), 
        password: random()
      } 
      adapter.create(opts, function(err, user){
        adapter.create(opts, function(err, user){
          assert(err.name);
          assert(!user);
          fn();
        }); 
      }); 
    });

    it('should not be able to create a user named "admin"', function(fn){
      opts = {
        name: 'admin',
        password: random()
      } 
      adapter.create(opts, function(err, user){
        assert(err.name);
        assert(!user);
        fn();
      });

    }); 

  });


  describe('Retreiving a user', function() {

    it('should retreive a user by id', function(done) {
      adapter.read({id: userId}, function(err, user) {
        assert(user.id == userId);
        done();
      });
    });

    it('should retreive a user by username', function(done) {
      adapter.read({name: userName}, function(err, user) {
        assert(user.name == userName);
        done();
      });
    });

  });


  describe('Updating a user', function() {

    var external_id = random();

    it('should add an external_id to a user', function(done) {
      adapter.update({id: userId}, {external_id: external_id}, function(err, user) {
        assert(user.external_id == external_id);
        done();
      });
    });

    it('should retreive the user by updated external_id', function(done) {
      adapter.read({external_id: external_id}, function(err, user) {
        assert(user.external_id == external_id);
        assert(user.name == userName);
        done();
      });
    });

  });

  describe('Arbitrary key-value store for user data', function() {  

    var dataUserId;

    it('should create a user with arbitrary "data" key-value store', function(done) {

      opts = {
        name: random(),
        password: random(),
        data: {
          phone_numbers: [
            '8675309', '8022222222'
          ]
        }
      }

      adapter.create(opts, function(err, user){
        assert(user.data.phone_numbers[0] == '8675309');
        assert(user.id);
        dataUserId = user.id;
        done();
      });
    });

    it ('should add data to the data store', function(done) {

      opts = {
        data: {
          computers: {
            mac: {
              storage : '100gb',
              screens : [ '0123', '1234' ]
            },
            pc: {
              storage : [ 
                {
                  type: 'ssd',
                  size: '25gb'
                },
                {
                  type: 'hdd',
                  size: '100gb'
                }
              ]
            }
          }
        }
      };

      adapter.update({id: dataUserId}, opts, function(err, user) {
        assert(user.data.phone_numbers[0] == '8675309');
        assert(user.data.computers.mac.storage == '100gb');
        assert(user.data.computers.mac.screens[0] == '0123');
        assert(user.data.computers.pc.storage[0].type == 'ssd');
        assert(user.data.computers.pc.storage[1].size == '100gb');
        done();
      });

    });

    it ('should verify the added data is retrievable', function(done) {
      adapter.read({id: dataUserId}, function(err, user) {
        assert(user.data.phone_numbers[0] == '8675309');
        assert(user.data.computers.mac.storage == '100gb');
        assert(user.data.computers.mac.screens[0] == '0123');
        assert(user.data.computers.pc.storage[0].type == 'ssd');
        assert(user.data.computers.pc.storage[1].size == '100gb');
        done();
      });
    });

  });
});
