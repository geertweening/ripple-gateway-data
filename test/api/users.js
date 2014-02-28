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
      done();
    });
  })
});
