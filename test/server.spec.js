const assert = require('chai').assert;
const expect = require('chai').expect;
const supertest = require('supertest');

const app = require('../index');

describe('Server Test', function() {
  let request = null;
  let server = null;

  before(function(done) {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  after(function(done) {
    server.close(done);
  });
  it('should return a 200 response', function(done) {
    request
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
