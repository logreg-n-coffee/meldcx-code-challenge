const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');
const storageProvider = require('../../src/storage');

chai.use(chaiHttp);
const { expect } = chai;

// Implement the tests for POST /files, GET /files/:publicKey, and DELETE /files/:privateKey
