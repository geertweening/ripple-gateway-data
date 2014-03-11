var adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter').externalTransactions;
var assert = require('assert');

describe('External Transactions', function(){
  var opts;

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
      adapter.create(opts, function(err, external_transaction){
        assert(external_transaction.id);  
        assert(external_transaction.currency == 'cupsofcoffee');  
        assert(external_transaction.deposit);  
        assert(!err);
        fn();
      });
    });

    it('should create a withdrawal', function(fn){
      opts.deposit = false;
      adapter.create(opts, function(err,external_transaction){
        assert(external_transaction.id);  
        assert(external_transaction.amount == 10);  
        assert(!external_transaction.deposit);  
        assert(!err);
        fn();
      });
    });

    it('should require an amount and currency', function(fn){
      delete opts.amount;
      delete opts.currency;
      adapter.create(opts, function(err,external_transaction){
        assert(err.amount);
        assert(err.currency);
        fn();
      });
    });

    it('should require a valid external account id', function(fn){
      delete opts.external_account_id;
      adapter.create(opts, function(err,external_transaction){
        assert(err.external_account_id);
        fn();
      });
    });
  });
  
  describe('reading external transactions', function(){
    it('should retrieve a single external transaction', function(fn){
      adapter.read(opts, function(err, external_transaction){
        fn();
      });
    });

    it('should retrieve a list of all pending withdrawals', function(fn){
      opts = {};
      adapter.readAllPending(opts, function(err, pending_withdrawals){
        assert(pending_withdrawals.length >= 0);
        fn();
      });
    });
    
    it('should retrieve a list of pending withdrawals for an account', function(fn){
      opts = { external_account_id: 1 };
      adapter.readAllPending(opts, function(err, pending_withdrawals){
        assert(pending_withdrawals.length >= 0);
        fn();
      });
    });
  });

  describe('updating external transactions', function(){
    it('should update pending withdrawals upon completion', function(fn){
      opts = { 
        external_account_id: 1,
        amount: 10,
        currency: 'cupsofcoffee',
        deposit: true
      };
      adapter.create(opts, function(err, external_transaction){
        opts.id = external_transaction.id;
        opts.status = 'complete';
        adapter.update(opts, function(err, external_transaction){
          assert(external_transaction.status == 'complete');
          fn();
        });
      });
    });

    it('should add a ripple transaction id', function(fn){
      opts = { 
        external_account_id: 1,
        amount: 10,
        currency: 'cupsofcoffee',
        deposit: true
      };
      adapter.create(opts, function(err, external_transaction){
        opts.id = external_transaction.id;
        opts.ripple_transaction_id = 1;
        adapter.update(opts, function(err, external_transaction){
          assert(external_transaction.ripple_transaction_id == 1);
          fn();
        });
      });
    });
  });

  describe('deleting external transactions', function(){
    it('should destroy a record with its id', function(fn){
      opts = { 
        external_account_id: 1,
        amount: 10,
        currency: 'cupsofcoffee',
        deposit: true
      };
      adapter.create(opts, function(err, external_transaction){
        var id = external_transaction.id;
        adapter.delete({ id: id }, function(err, external_transaction){
          adapter.read({ id: id }, function(err, external_transaction){
            assert(err.id);
            fn();
          });
        });
      });
    }); 
  });

});
