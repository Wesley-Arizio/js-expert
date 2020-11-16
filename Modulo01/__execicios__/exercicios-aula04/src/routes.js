const { Router } = require('express');

const { default_list } = require('./cars')

const routes = Router();

routes.get('/cars', (request, response) => {
    return response.status(200).send( default_list );
});

routes.get('/cars-by-year/:year', (request, response) => {
    const { year } = request.params;

    const filteredByYear = default_list.filter(item => {
        return item.ano == year ? item : false
    });

    if(filteredByYear.length === 0) {
        return response.status(204).send();
    }

    return response.status(200).send(filteredByYear);
});

routes.use((request, response) => {
    response.send(404).send()
})

module.exports = routes;