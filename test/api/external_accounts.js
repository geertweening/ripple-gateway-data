var Adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter');
var assert = require('assert');
var uuid = require('node-uuid');

describe('External Accounts', function() {

  var adapter;
  var opts;

  before(function(){
    adapter = new Adapter();
  });

  beforeEach(function(){
    opts = {};
  });
  
  describe('creating an external account', function(){
    it('should succeed with a valid account json', function(fn){
      opts.name = uuid.v1();
      opts.user_id = 1;
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(external_account.name == opts.name);
        assert(!err);
        fn();
      });
    });

    it('should require a name', function(fn){
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(err.name);
        assert(!external_account);
        fn();
      }); 
    });

    it('should allow accounts without a user id', function(fn){
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(err.name);
        assert(!err.user_id);
        assert(!external_account);
        fn();
      }); 
    });

    it('should not permit a redundant name/user id pair', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(external_account.name == opts.name);
        adapter.createExternalAccount(opts, function(err, external_account){
          assert(err.user_id);
          assert(err.name);
          assert(!external_account);
          fn();
        });
      });
    });
  });

  describe('reading an external account', function(){
    it('should retrieve an external account record', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        opts = { id: external_account.id };
        adapter.getExternalAccount(opts, function(err, external_account){
          assert(external_account.id, opts.id);
          assert(!err);
          fn();
        });
      });
    });
  });

  describe('listing external accounts', function(){
    it('should retrieve all the external accounts', function(fn){
      opts = {
        user_id: 1
      }
      adapter.getExternalAccounts(opts, function(err, external_accounts){
        assert(external_accounts.length >= 0);
        assert(!err);
        fn();
      });
    }); 
  });

  describe('updating an external account', function(){
    it('should update user id', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        opts.user_id = 2;
        opts.id = external_account.id
        adapter.updateExternalAccount(opts, function(err, external_account){
          assert(!err);
          assert(external_account.user_id == 2);
          fn();
        });
      });
    });

    it('should update the name of an account', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(external_account.name == opts.name);
        opts.name = uuid.v1();
        opts.id = external_account.id;
        adapter.updateExternalAccount(opts, function(err, external_account){
          assert(!err);
          assert(external_account.name == opts.name);
          fn();
        });
      });

    });

  });

  describe('deleting an external account', function(fn){
      
    var name;

    before(function(){
      name = uuid.v1();
    });

    it('should delete an external account', function(fn){
      var opts = {
        user_id: 1,
        name: name
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        opts = {
          id: external_account.id
        };
        adapter.deleteExternalAccount(opts, function(err, external_account){
          adapter.getExternalAccount(opts, function(err, external_account){
            assert(err.id);
            assert(!external_account);
            fn();
          });
        });
      });
    });
  });

});
