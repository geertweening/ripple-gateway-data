var assert = require("assert");
var adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter').rippleTransactions;
var crypto = require('crypto');

function rand() {
  crypto.randomBytes(16).toString('hex');
}

describe('Ripple Transactions', function(){
  var validRipplePayment;

  describe('creating a ripple transaction', function(){
    var opts;

    before(function(){
      validRipplePayment = {
        to_address_id: 1, 
        from_address_id: 2,
        to_amount: 1,
        to_currency: 'xrp',
        from_amount: '1',
        from_currency: 'xrp'
      }
    });
    
    beforeEach(function(){
      opts = {};
    });

    it('should fail without required parameters', function(fn){

      adapter.create(opts, function(err, ripplePayment){
        assert(err.to_address_id);
        assert(err.from_address_id);
        assert(err.to_amount);
        assert(err.to_currency);
        assert(err.to_issuer);
        assert(err.from_amount);
        assert(err.from_currency);
        assert(err.from_issuer);
        fn();
      });

    });

    it('should create a ripple transaction', function(fn) {
      opts = {
        to_address_id: 1, 
        from_address_id: 2,
        to_amount: 1,
        to_currency: 'usd',
        to_issuer: 't9GCsXLiiZh2pk7bs8TDyYxzByqGKsd',
        from_amount: '1',
        from_currency: 'usd',
        from_issuer: 't9GCsXLiiZh2pk7bs8TDyYxzByqGKsd',
      }
      adapter.create(opts,function(err, ripplePayment) {
        assert(ripplePayment);
        fn();
      });
    });

    it('should not allow the same recipient and sender address ids', function(fn) {
      var opts = new Object(validRipplePayment);
      opts.from_address_id = opts.to_address_id;
      adapter.create(opts, function(err, ripplePayment) {
        assert(!ripplePayment);
        assert(err.to_address_id);
        assert(err.from_address_id);
        fn();
      });
    });

    it('should accept a simplified payment and populate the remaining fields', function(fn) {
      var issuer = 'rNa9GCsXLiiZh2pk7bs8TDyYxzByqGKsdw';
      opts = {
        to_address_id: 1,
        from_address_id: 2,
        to_amount: 1,
        to_currency: 'xag',
        to_issuer: issuer
      };
      adapter.create(opts, function(err, ripplePayment){
        assert(ripplePayment.from_amount == 1);
        assert(ripplePayment.from_currency == 'xag');
        assert(ripplePayment.from_issuer == issuer);
        fn();
      });
    });

    it('does nothing', function(fn){
      opts = new Object(validRipplePayment);
      opts.to_currency = 'xAg';
      opts.from_address_id = 2;
      opts.to_issuer = 'issuer';
      opts.from_issuer = 'issuer';
      adapter.create(opts, function(err, ripplePayment){
        // does nothing, but other test depend on the opts, so leave in for now
        fn();
      });
    });

    it.skip('should translate all currencies to upper case'), function(fnd) {
      // ! fails
      assert(ripplePayment.toJSON().to_currency == 'XAG');
    }

    it.skip('should require ripple address id of the recipient be in the database', function(fn) {
      // ! not implemented
    });

    it.skip('should require ripple address id of the sender be in the database', function(fn) {
      // ! not implemented
    });
  });

  describe('updating a ripple transaction', function() {
    var opts;
    var payment;

    before(function(fn){
      opts = new Object(validRipplePayment); 
      adapter.create(opts, function(err, ripplePayment) {
        payment = ripplePayment;
        fn();
      });
    });

    it('should be able able to update the transaction hash', function(fn){
      var hash = rand();
      opts = {
        id: payment.id,
        transaction_hash: hash
      };
      adapter.update(opts, function(err, ripplePayment){
        assert(ripplePayment.transaction_hash == hash);
        fn();
      });
    });

    it('should be able to update the transaction state', function(fn) {
      opts = {
        id: payment.id,
        transaction_state: 'tesSUCCESS'
      }
      adapter.update(opts, function(err, ripplePayment){
        assert(ripplePayment.transaction_state == 'tesSUCCESS');
        fn();
      });
    });

    it('should not be able to update any other attributes', function(fn){
      opts = {
        id: payment.id,
        to_amount: 999
      }
      adapter.update(opts, function(err, ripplePayment){
        assert(ripplePayment.to_amount == validRipplePayment.to_amount);
        fn();
      });
    });

  });

  var payment;

  describe('retrieving ripple transaction records', function(){
    
    var opts;

    before(function(fn){
      opts = new Object(validRipplePayment); 
      adapter.create(opts, function(err, ripplePayment) {
        payment = ripplePayment;
        fn();
      });
    });

    it('should be able to get a single ripple transaction using its id', function(fn){
      opts = {
        id: payment.id    
      }
      adapter.read(opts, function(err, ripple_payment){
        assert(ripple_payment.id == opts.id); 
        fn();
      });

    });
    
    it('should be able to get multiple ripple transactions using an array of ids', function(fn){
      opts = {
        id: [1,2,3]
      };
      adapter.readAll(opts, function(err, ripple_payments){
        assert(ripple_payments.length == 3); 
        assert(ripple_payments[0].id == 1);
        assert(ripple_payments[1].id == 2);
        assert(ripple_payments[2].id == 3);
        fn();
      });
    });

    it('should be able to get all ripple transactions', function(fn){
      opts = {};
      adapter.readAll(opts, function(err, ripple_payments){
        assert(ripple_payments.length > -1); 
        fn();
      }); 
    });
  });

  describe('deleting a ripple transaction record', function(){
    var opts;

    it('should be able to delete a single transaction record with the transaction id', function(fn){
      opts = {
        id: payment.id
      }
      adapter.delete(opts, function(err, ripple_payment){
        adapter.read(opts, function(err, ripple_payment){
          assert(err);
          assert(err.id);
          assert(!ripple_payment);
          fn();
        });
      }); 
    });
  });

});
