module.exports = Adapter = function() {

}

Adapter.prototype.createExternalAccount = function(opts, fn) {
  fn();
}

Adapter.prototype.createUser = function(opts, fn) {
  fn(null, { data: { phone_numbers: ['8675309', '8022222222'] } });
}

Adapter.prototype.createRippleAddress = function(opts, fn) {
  fn();
}

Adapter.prototype.createRipplePayment = function(opts, fn) {
  fn();
}
Adapter.prototype.getRippleAddress = function(opts, fn) {
  fn();
}
Adapter.prototype.createRippleAddress = function(opts, fn) {
  fn();
}
Adapter.prototype.createRippleTransaction = function(opts, fn) {
  fn();
}
