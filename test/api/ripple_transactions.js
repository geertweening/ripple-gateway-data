var assert = require("assert");

describe('APi for Ripple Transactions', function(){

  describe('creating a ripple transaction', function(){

    it('should require a ripple address id of the recipient user', function(fn){
      
    });

    it('should require a ripple address id of the sending user', function(fn){
      
    });

    it('should require ripple address id of the recipient be in the database', function(fn) {

    });

    it('should require ripple address id of the sender be in the database', function(fn) {

    });
  });

  describe('updating a ripple transaction', function() {

    it('should be able able to update the transaction hash', function(fn){

    });

    it('should be able to update the transaction state', function(fn) {

    });

    it('should not be able to update any other attributes', function(fn){

    });

  });

  describe('retrieving ripple transaction records', function(){

    it('should be able to get a single ripple transaction using its id', function(fn){

    });
    
    it('should be able to get multiple ripple transactions using an array of ids', function(fn){

    });

    it('should be able to get all ripple transactions', function(fn){

    });

  });

  describe('deleting a ripple transaction record', function(){
    
    it('should be able to delete a single transaction record with the transaction id', function(fn){

    });

    it('should be able to delete many transactions with an array of transaction ids', function(fn){

    });

  });

});
