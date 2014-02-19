var Adapter = require('../../adapters/'+(process.env.GATEWAY_DATA_ADAPTER || 'test_adapter'));
var assert = require('assert');
var uuid = require('node-uuid');

describe('External Accounts', function() {
  before(function(){
    adapter = new Adapter();
  });

  beforeEach(function(){
    opts = {};
  });
  
  describe('creating an external account', function(){
    it.skip('should require a name', function(fn){
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(err.name);
        assert(!external_account);
      }); 
    });

    it.skip('should not permit a redundant name/user id pair', function(fn){
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
        });
      });
    });
  });

  describe('reading an external account', function(){
    it.skip('should retrieve an external account record', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        opts = { id: external_account.id };
        adapter.getExternalAcccout(opts, function(err, external_account){
          assert(external_account.id, opts.id);
          assert(!err);
        });
      });
    });

  });

  describe('updating an external account', function(){
    it.skip('should update user id', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        opts.user_id = 2;
        adapter.updateExternalAccount(opts, function(err, external_account){
          assert(!err);
          assert(external_account.user_id == 2);
        });
      });
    });

    it.skip('should update the name of an account', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        assert(external_account.name == opts.name);
        opts.name = uuid.v1();
        adapter.updateExternalAccount(opts, function(err, external_account){
          assert(!err);
          assert(external_account.name == opts.name);
        });
      });

    });

  });

  describe('deleting an external account', function(fn){
    it.skip('should delete an external account', function(fn){
      opts = {
        user_id: 1,
        name: uuid.v1()
      }
      adapter.createExternalAccount(opts, function(err, external_account){
        opts = {
          id: external_account.id
        };
        adapter.destroyExternalAccount(opts, function(err, external_account){
          assert(!err);
          assert(external_account.name == opts.name);
          adapter.getExternalAccount(opts, function(err, external_account){
            assert(err.id);
            assert(!external_account);
          });
        });
      });
    });
  });

});
