// Import Jest (optional)
const { describe, expect, test, afterAll } = require('@jest/globals');

// Import necessary modules
const request = require('supertest');
const { app: server, cleanupInterval } = require('../../src/app');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

let publicKey = '';
let privateKey = '';

// Set up the server for testing
const app = server.listen();

describe('File Sharing API', () => {
    afterAll(async () => {
        await app.close();
    });

    test('POST /files - Upload a file', async () => {
        const response = await request(app)
            .post('/files')
            .attach('file', 'test/sample-file.txt');

        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('publicKey');
        expect(response.body).toHaveProperty('privateKey');

        publicKey = response.body.publicKey;
        privateKey = response.body.privateKey;
    });

    test('GET /files/:publicKey - Download a file', async () => {
        const response = await request(app).get(`/files/${publicKey}`);

        expect(response.status).toEqual(200);
        expect(response.text).toEqual('This is a sample file created by Rui Hu (@logreg-n-coffee).\n');
    });

    test('DELETE /files/:privateKey - Delete a file', async () => {
        const response = await request(app).delete(`/files/${privateKey}`);

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('message');
    });
});
