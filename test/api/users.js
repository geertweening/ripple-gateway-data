var Adapter = require(process.env.GATEWAY_DATA_ADAPTER || '../../adapters/test_adapter');
var assert = require('assert');

describe('Users', function(){

  var adapter;

  before(function(){
    adapter = new Adapter();
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
