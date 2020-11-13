const sinon = require('sinon');

const { deepStrictEqual } = require('assert');

const Service = require('./service');

const base_url1 = "https://swapi.dev/api/planets/1/";
const base_url2 = "https://swapi.dev/api/planets/2/";

const mocks = {
    tatooine: require('./mocks/tatooine.json'),
    alderaan: require('./mocks/alderaan.json')
}

;
(async () => {
    const service = new Service();
    const stub = sinon.stub(service, service.makeRequest.name);

    stub
        .withArgs(base_url1)
        .resolves(mocks.tatooine);

    stub
        .withArgs(base_url2)
        .resolves(mocks.alderaan);

    {
        const expected = {
            "name": "Tatooine",
            "surfaceWater": "1",
            appearedIn: 5
        }

        const response = await service.getPlanets(base_url1);
        deepStrictEqual(response, expected);
    }

    {
        const expected = {
            "name": "Alderaan",
            "surfaceWater": "40",
            appearedIn: 2
        }

        const response = await service.getPlanets(base_url2);
        deepStrictEqual(response, expected);
    }
})()