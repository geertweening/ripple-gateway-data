var assert = require('assert');
var adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter');
var crypto = require('crypto');

function rand() { return crypto.randomBytes(12).toString('hex') };

describe('Ripple Addresses', function(){

  describe('creating a ripple address', function(){
    var opts;

    beforeEach(function(){
      opts = {};
    });

    it('should a type to be in ["hot", "cold", "hosted", "independent"]', function(fn){
      opts = {
        type: 'notHosted'
      }
      adapter.createRippleAddress(opts, function(err, ripple_address){
        assert(err.type);
        fn();
      });
    
    });

    it('should require the managed boolean flag to be specified', function(fn){
      opts = {
        type: 'independent',
        address: rand()
      };
      adapter.createRippleAddress(opts, function(err, ripple_address){
        assert(err.managed);
        opts.managed = true;
        opts.address = rand();
        adapter.createRippleAddress(opts, function(err, ripple_address){
          assert(!err);
          fn();
        });
      });
    });

    it('should accept a user id, but it is not required', function(fn) {
      opts = {
        type: 'independent',
        managed: false,
        address: 'r9YXGrd8X2AgRqFh1jV9fnE1YhDiSSepy3'
      }
      adapter.createRippleAddress(opts, function(err, ripple_address){
        assert(ripple_address);
        assert(!ripple_address.user_id);
        assert(!err);
        opts.user_id = 1; 
        adapter.createRippleAddress(opts, function(err, ripple_address){
          assert(ripple_address.user_id == 1);
          fn();
        });
      });

    }); 

    it('should require a tag for hosted addresses', function(fn) {
      opts = {
        type: 'hosted',
        managed: true,
        address: 'r9YXGrd8X2AgRqFh1jV9fnE1YhDiSSepy3'
      }
      adapter.createRippleAddress(opts, function(err, ripple_address){
        assert(err.tag);
        opts.tag = 111;
        adapter.createRippleAddress(opts, function(err, ripple_address){
          assert(ripple_address.tag == 111);
          fn();
        });
      });
    });

    it('should require a valid ripple address for address', function(fn) {
      // not implemented!
      fn();
    });
  });

  describe('retrieving ripple addresses', function(){
    var opts;

    it('should get a ripple address', function(fn){
      opts = {
        id: 1
      };
      adapter.getRippleAddress(opts, function(err, ripple_address){
        assert(ripple_address.id == 1);
        assert(!err);
        fn();
      });
    });

  });

  var ripple_address;

  describe('updating ripple addresses', function(){
    var opts;

    before(function(fn){
      opts = {
        type: 'independent',
        managed: false,
        address: rand()
      }
      adapter.createRippleAddress(opts, function(err, address){
        ripple_address = address;
        fn();
      });
    });

    it('should be able to add a secret key', function(fn){
      var secret = 'ssZWRZmYG9g1ZFcwd5UsRhsAx2yeV'
      opts = {
        id: ripple_address.id,
        secret: secret
      };
      adapter.updateRippleAddress(opts, function(err, address){
        assert(address.secret == secret);
        assert(!err);
        fn();
      });
    });

    it('should be able to track the previously processed transaction hash for the address', function(fn){
      opts = {
        id: ripple_address.id,
        previous_transaction_hash: '12345678'
      };
      adapter.updateRippleAddress(opts, function(err, address){
        assert(address.previous_transaction_hash == '12345678');
        fn();
      });
    });

  });

  describe('destroying ripple addresses', function(){
    var opts;

    it('should be able to destroy a single address', function(fn){
      opts = {
        id: ripple_address.id
      }
      adapter.deleteRippleAddress(opts, function(err, ripple_address){
        assert(!err);
        assert(ripple_address.id == opts.id);
        adapter.getRippleAddress(opts, function(err, ripple_address){
          assert(err.id);
          assert(!ripple_address);
          fn();
        });
      });
    });

  });
});

