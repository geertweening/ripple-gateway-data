var assert = require('assert');
var Adapter = require('../../adapters/'+(process.env.GATEWAY_DATA_ADAPTER || 'test_adapter'));
var crypto = require('crypto');

function rand() { return crypto.randomBytes(12).toString('hex') };

describe('Ripple Addresses', function(){
  before(function(){
    adapter = new Adapter();
  });
  describe('creating a ripple address', function(){
    beforeEach(function(){
      var opts = {};
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

    it.skip('should require a valid ripple address for address', function(fn) {

    });
  });

  describe('retrieving ripple addresses', function(){
    it('should get a ripple address', function(){
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

  describe('updating ripple addresses', function(){
    before(function(fn){
      opts = { id: 1 };
      adapter = new Adapter();
      adapter.getRippleAddress(opts, function(err, address){
        address = address;
        fn();
      });
    });

    it('should be able to add a secret key', function(fn){
      var secret = 'ssZWRZmYG9g1ZFcwd5UsRhsAx2yeV'
      opts = {
        id: ripple_address.id,
        secret: secret
      };
      adapter.updateRippleAddress(opts, function(err, ripple_address){
        assert(ripple_address.secret == secret);
        assert(!err);
      });
    });

    it('should be able to track the previously processed transaction hash for the address', function(fn){
      opts = {
        id: ripple_address.id,
        previous_transaction_hash: '12345678'
      };
      adapter.updateRippleAddress(opts, function(err, ripple_address){
        assert(ripple_address.previous_transaction_hash == '12345678');
        opts.previous_transaction_hash = '987654321';
        adapter.updateRippleAddress(opts, function(err, ripple_address){
          assert(ripple_address.previous_transaction_hash == '987654321');
          fn();
        });
      });
    });

  });

  describe('destroying ripple addresses', function(){

    it('should be able to destroy a single address with "ripple_address_id"', function(fn){
      opts = {
        id: ripple_address.id
      }
      adapter.destroyRippleAddress(opts, function(err, ripple_address){
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

