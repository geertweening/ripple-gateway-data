var Adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter');

describe('Hosted Wallet Balances', function(){

  before(function(){
    var adapter = new Adapter();
  });

  it('should be able to retrieve all the balances with a user id', function(fn) {
    fn();
  });

  it('should be able to retrieve all balances of a particular currency/issuer', function(fn) {
    fn();
  });

  it('should retrieve all balances of a particular currency/issuer and user id combination', function(fn){
    fn();
  });

  it('should be able to retrieve a single balance given its id', function(fn){
    fn();
  });

});
