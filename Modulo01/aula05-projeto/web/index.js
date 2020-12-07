const { join } = require('path');
const http = require('http');

const Routes = require('./routes');
const CarService = require('../src/service/carService');
const CarCategories = require('../src/service/carCategoryService');

const carDatabase = join(__dirname, '../', 'database', 'cars.json');
const categoryDatabase = join(__dirname, '../', 'database', 'carCategories.json');

const carServiceInstance = new CarService({cars: carDatabase});
const carCategoriesIntance = new CarCategories({
    categories: categoryDatabase,
    cars: carDatabase
});

class Api {
    constructor(
        carService = carServiceInstance,
        carCategoryService = carCategoriesIntance
    ){
        this.carService = carService;
        this.carCategoryService = carCategoryService;
        
        this._routes = new Routes({
            carService: this.carService,
            carCategoryService: this.carCategoryService
        });

        this._PORT = 3000;
        this._DEFAULT_HEADER = {
            'Content-Type': 'application/json'
        }
    }

    handler(request, response) {
        const { url, method } = request;
        const [_, route, id] = url.split('/');
    
        request.queryString = {
            id: isNaN(id) ? id : Number(id)
        }
        
        const key = `/${route}:${method.toLowerCase()}`;
    
        response.writeHead(
            200,
            this._DEFAULT_HEADER
        )
        
        const routes = this._routes.generateRoutes();

        const currentRoute = routes[key] || routes.default;
        
        return currentRoute(request, response);
    }

    app(){
        return http.createServer(this.handler.bind(this))
            .listen(this._PORT, () => {
                console.log(`🔥 Server is running at ${this._PORT}`)
            });
    }
}
module.exports = Api;