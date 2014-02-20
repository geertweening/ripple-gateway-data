var Adapter = require('../../adapters/'+(process.env.GATEWAY_DATA_ADAPTER || 'test_adapter'));
var assert = require('assert');

describe('External Transactions', function(){
  before(function(){
    adapter = new Adapter();
  });

  describe('creating external transactions', function(){
    beforeEach(function(){
      opts = { 
        external_account_id: 1,
        amount: 10,
        currency: 'cupsofcoffee'
      };
    });

    it('should create a deposit', function(fn){
      opts.deposit = true;
      adapter.createExternalTransaction(opts, function(err, external_transaction){
        assert(external_transaction.id);  
        assert(external_transaction.currency == 'cupsofcoffee');  
        assert(external_transaction.deposit);  
        assert(!err);
      });
    });

    it('should create a withdrawal', function(fn){
      opts.deposit = false;
      adapter.createExternalTransaction(opts, function(err,deposit){
        assert(external_transaction.id);  
        assert(external_transaction.amount == 10);  
        assert(!external_transaction.deposit);  
        assert(!err);
      });
    });

    it('should require an amount and currency', function(fn){
      delete opts.amount;
      delete opts.currency;
      adapter.createExternalTransaction(opts, function(err,deposit){
        assert(err.amount);
        assert(err.currency);
        assert(!external_transasction);
      });
    });

    it('should require a valid external account id', function(fn){
      delete opts.external_account_id;
      adapter.createExternalTransaction(opts, function(err,deposit){
        assert(err.external_account_id);
        assert(!external_transasction);
      });
    });
  });
  
  describe('reading external transactions', function(){
    it('should retrieve a single external transaction', function(fn){
      fn();
    });

    it('should retrieve a list of all pending withdrawals', function(fn){
      fn();
    });
    
    it('should retrieve a list of pending withdrawals for an account', function(fn){
      fn();
    });
  });

  describe('updating external transactions', function(){
    it('should update pending withdrawals upon completion', function(fn){
      fn();      
    });

    it('should add a ripple transaction id', function(fn){
      fn();
    });
  });

  describe('deleting external transactions', function(){
    it('should destroy a record with its id', function(fn){
      fn();
    }); 
  });

});
