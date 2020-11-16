const { describe, it } = require('mocha');
const request = require('supertest');

const { deepStrictEqual } = require('assert');

const app = require('./api');

describe('API suit test',  () => {
    describe('/contact', () => {
        it('shoud request the contact us page and return HTTP status 200', async () => {
            const response = await request(app)
                        .get('/contact')
                        .expect(200);

            deepStrictEqual(response.text,  'Hello World Contact page')

            // console.log("Response", response)
        });
    });

    describe('/hello', () => {
        it('should request an inexistent /hello route and redirect to /hello', async () => {
            const response = await request(app)
                        .get('/hello')
                        .expect(200);

            deepStrictEqual(response.text,  'Hello World');

        });
    });

});
