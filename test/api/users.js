var Adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter');
var assert = require('assert');
var crypto = require('crypto');

function random() { return crypto.randomBytes(16).toString('hex') };

describe('Users', function(){

  var adapter;

  before(function(){
    adapter = new Adapter();
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
      adapter.createUser(opts, function(err, user){
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
      adapter.createUser(opts, function(err, user){
        assert(user.salt);
        var firstSalt = user.salt;
        opts = {
          name: random(), 
          password: random()
        };
        adapter.createUser(opts, function(err, user){
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
      adapter.createUser(opts, function(err, user){
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
      adapter.createUser(opts, function(err, user){
        adapter.createUser(opts, function(err, user){
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
      adapter.createUser(opts, function(err, user){
        assert(err.name);
        assert(!user);
        fn();
      });

    }); 

  });


  describe('Retreiving a user', function() {

    it('should retreive a user by id', function(done) {
      adapter.getUser({id: userId}, function(err, user) {
        assert(user.id == userId);
        done();
      });
    });

    it('should retreive a user by username', function(done) {
      adapter.getUser({name: userName}, function(err, user) {
        assert(user.name == userName);
        done();
      });
    });

  });


  describe('Updating a user', function() {

    var external_id = random();

    it('should add an external_id to a user', function(done) {
      adapter.updateUser({id: userId}, {external_id: external_id}, function(err, user) {
        assert(user.external_id == external_id);
        done();
      });
    });

    it('should retreive the user by updated external_id', function(done) {
      adapter.getUser({external_id: external_id}, function(err, user) {
        assert(user.external_id == external_id);
        assert(user.name == userName);
        done();
      });
    });

  });
  

  it.skip('should allow storage of arbitrary "data" key-value store.', function(done){

    adapter.createUser({ 
      name: '12345lkjlk33',
      password: '88dkjkjiekkeoo',
      data: {
        phone_numbers: [
          '8675309', '8022222222'
        ]
      }
    }, function(err, user) {
      assert(user.data.phone_numbers[0] == '8675309');
      assert(user.data.id);
      userId = user.data.id;
      done();
    });
  });
});
