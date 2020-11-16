const { describe, it } = require('mocha');
const request = require('supertest');

const { deepStrictEqual } = require('assert');

const app = require('./src/server');

const { default_list, filteredByYear} = require('./src/cars');

describe('API Suit Test', () => {
    describe('GET: /cars', () => {
        it('should request a list of cars and return http status code 200', async () => {
            const response = await request(app)
                .get('/cars')
                .expect(200);

            deepStrictEqual(response.body,  default_list);
        });

    });

    describe('GET: /cars-by-year', () => {
        it('should request a list of cars filtered by year and return http status code 200', async () => {
            const response = await request(app)
                .get(`/cars-by-year/${2012}`)
                .expect( 200)
        
            deepStrictEqual(response.body,  filteredByYear);
        });

        it('should return an empty array if there is no car from that year and return http status code 204', async () => {
            const response = await request(app)
                .get(`/cars-by-year/${1960}`)
                .expect(204)
        
            deepStrictEqual(response.noContent, true);
        });
    });

    describe('Default page', () => {
        it('should request an inexistent route and return the default route with status code 404', async () => {
            await request(app)
                .get('/inexistent-route')
                .expect(404)
        })
    });
})