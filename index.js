module.exports = (function(){
  function AdapterTest() {
    
  }

  AdapterTest.prototype.run = function() {
    console.log('test that data adapter is complete');
  }

  return {
    AdapterTest: AdapterTest
  }
})();
