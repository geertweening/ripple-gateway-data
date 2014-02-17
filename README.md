Ripple Gateway Data
===================

Interface specification and tests for Ripple Gateway Data Adapter impementations.

The [Ripple Gateway API Server](https://github.com/ripple/ripple-gateway) software
provides a HTTP server interface that maps URLs to Ripple Gateway API calls.

In order to abstract the datastore backend and to generalize the HTTP API server
this interface is defined, which the HTTP API will call into. Any complete 
implementation of a Ripple Gateway Data Adapter must provide a node.js interface
to the Ripple Gateway Data Test suite. This repository is the official interface
definition provider, and all HTTP API calls should map urls one-to-one to Gateway
Data Adapter functions.

### Test Suite

The test suite provided represents the Ripple Gateway API, and each complete
implementation must pass it. 

Configure the test suite:

    // test/test_adapter.js

    var GatewayData = require('ripple-gateway-data');
    var SqlServerAdapter = require('./lib/sql_server_adapter.js');

    var adapter = new SqlServerAdapter(); 
    var test = new GatewayData.Test(adapter);

    test.run();

Run the test suite on your custom adapter:

    mocha test/adapter.js

