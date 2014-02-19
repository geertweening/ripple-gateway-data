var assert = require("assert");
var Adapter = require('../../adapters/'+(process.env.GATEWAY_DATA_ADAPTER || 'test_adapter'));

describe('Ripple Transactions', function(){
  before(function(){
    adapter = new Adapter();
  });

  describe('creating a ripple transaction', function(){
    before(function(){
      validRipplePayment = {
        recipient_address_id: 1, 
        sender_address_id: 2,
        to_amount: 1,
        to_currency: 'xrp',
        from_amount: '1',
        from_currency: 'xrp'
      }
    });
    
    beforeEach(function(){
      opts = {};
    });

    it.skip('should fail without required parameters', function(fn){

      adapter.createRippleTransaction(opts, function(err, ripplePayment){
        assert(err.recipient_address_id);
        assert(err.sender_address_id);
        assert(err.to_amount);
        assert(err.to_currency);
        assert(err.to_issuer);
        assert(err.from_amount);
        assert(err.from_currency);
        assert(err.from_issuer);
        fn();
      });

    });

    it.skip('should create a ripple transaction', function(fn) {
      opts = {
        recipient_address_id: 1, 
        sender_address_id: 2,
        to_amount: 1,
        t9GCsXLiiZh2pk7bs8TDyYxzByqGKsdwo_currency: 'xrp',
        from_amount: '1',
        from_currency: 'xrp'
      }
      adapter.createRippleTransaction(opts,function(err, ripplePayment) {
        assert(ripplePayment);
        fn();
      });
    });

    it.skip('should not allow the same recipient and sender address ids', function(fn) {
      var opts = new Object(validRipplePayment);
      opts.sender_address_id = opts.recipient_address_id;
      adapter.createRippleTransaction(opts, function(err, ripplePayment) {
        assert(!ripplePayment);
        assert(err.sender_address_id);
        assert(err.recipient_address_id);
        fn();
      });
    });

    it.skip('should accept a simplified payment and populate the remaining fields', function(fn) {
      var issuer = 'rNa9GCsXLiiZh2pk7bs8TDyYxzByqGKsdw'
      opts = {
        recipient_address_id: 1,
        to_amount: 1,
        to_currency: 'xag',
        to_issuer: issuer
      };
      adapter.createRippleTransaction(opts, function(err, ripplePayment){
        assert(ripplePayment.from_amount == 1);
        assert(ripplePayment.from_currency == 'XAG');
        assert(ripplePayment.from_issuer == issuer);
        fn();
      });
    });

    it.skip('should translate all currencies to upper case', function(){
      var opts = new Object(validRipplePayment);
      opts.to_currency = 'xAg';
      adapter.createRippleTransaction(opts, function(err, ripplePayment){
        assert(ripplePayment.to_currency == 'XAG');
        fn();
      });
    });

    it.skip('should require ripple address id of the recipient be in the database', function(fn) {

    });

    it.skip('should require ripple address id of the sender be in the database', function(fn) {

    });
  });

  describe('updating a ripple transaction', function() {
    before(function(fn){
      var payment;
      var opts = new Object(validRipplePayment); 
      adapter.createRippleTransaction(opts, function(err, ripplePayment) {
        payment = ripplePayment;
        fn();
      });
    });

    it.skip('should be able able to update the transaction hash', function(fn){
      opts = {
        ripple_payment_id: payment.id,
        transaction_hash: '123456789'
      };
      adapter.updateRipplePayment(opts, function(err, ripplePayment){
        assert(ripplePayment.transaction_hash == '123456789');
      });
    });

    it.skip('should be able to update the transaction state', function(fn) {
      opts = {
        ripple_payment_id: payment.id,
        transaction_status: 'tesSUCCESS'
      }
      adapter.updateRipplePayment(opts, function(err, ripplePayment){
        assert(ripplePayment.transaction_status == 'tesSUCCESS');
      });
    });

    it.skip('should not be able to update any other attributes', function(fn){
      opts = {
        ripple_payment_id: payment.id,
        to_amount: 999
      }
      adapter.updateRipplePayment(opts, function(err, ripplePayment){
        assert(ripplePayment.to_amount == validRipplePayment.to_amount);
      });
    });

  });

  describe('retrieving ripple transaction records', function(){
    before(function(fn){
      var payment;
      var opts = new Object(validRipplePayment); 
      adapter.createRippleTransaction(opts, function(err, ripplePayment) {
        payment = ripplePayment;
        fn();
      });
    });

    it.skip('should be able to get a single ripple transaction using its id', function(fn){
      opts = {
        ripple_payment_id: payment.id    
      }
      adapter.getRipplePayment(opts, function(err, ripple_payment){
        assert(ripple_payment.id == ripple_payment_id); 
      });

    });
    
    it.skip('should be able to get multiple ripple transactions using an array of ids', function(fn){
      opts = {
        ripple_payment_ids: [1,2,3]
      };
      adapter.getRipplePayments(opts, function(err, ripple_payments){
        assert(ripple_payments.length == 3); 
        assert(ripple_payments[0].id == 1);
        assert(ripple_payments[1].id == 2);
        assert(ripple_payments[2].id == 3);
      });
    });

    it.skip('should be able to get all ripple transactions', function(fn){
      opts = {};
      adapter.getRipplePayments(opts, function(err, ripple_payment){
        assert(ripple_payments.length > -1); 
      }); 
    });
  });

  describe('deleting a ripple transaction record', function(){
    it.skip('should be able to delete a single transaction record with the transaction id', function(fn){
      opts = {
        ripple_payment_id: payment.id
      }
      adapter.destroyRipplePayment(opts, function(err, ripple_payment){
        assert(ripple_payment);
        adapter.getRipplePayment(opts, function(err, ripple_payment){
          assert(err);
          assert(err.id);
          assert(!ripple_payment);
        });
      }); 
    });
  });

});
