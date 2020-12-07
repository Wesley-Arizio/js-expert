const DataValidator = require('../src/service/isValid');

class Routes {
    constructor({carService, carCategoryService}){
        this.carService = carService;
        this.carCategoryService = carCategoryService;
    }

    generateRoutes() {
        return {
            "/cars:get": async (request, response) => {
                const { id } = request.queryString;
        
                if(typeof id !== 'string'){
                    response.writeHead(400)
                    response.write('Invalid Car Id');
                    return response.end();
                }

                const car = await this.carService.carRepository.find(id);

                response.writeHead(200);
                response.write(JSON.stringify(car));
                return response.end();
            },
            
            '/car-categories:get': async(request, response) => {
                const categories = await this.carCategoryService.getAllCategories();

                const categoryWithoutCarIds = []
                for await (const category of categories) {
                    delete category.carIds;
                    categoryWithoutCarIds.push(category)
                }

                response.writeHead(200);
                response.write(JSON.stringify(categoryWithoutCarIds));
                return response.end();
            },
            
            '/cars-by-categories:get': async (request, response) => {
                const { id } = request.queryString;
                
                if(typeof id !== 'string'){
                    response.writeHead(400)
                    response.write('Invalid Category Id');
                    return response.end();
                }
        
                const categoryWithCars = await this.carCategoryService.getCarCategoryWithCarsList(id);
            
                response.writeHead(200);
                response.write(JSON.stringify(categoryWithCars));
                return response.end();
            },
            
            '/calculate-final-price:post': async (request, response) => {
                for await (const data of request) {
                    const { customer, carCategory, numberOfDays } = JSON.parse(data)

                    if(numberOfDays <= 1) {
                        response.writeHead(400);
                        response.write(JSON.stringify({error: 'Number of days must be equal to or greater than 1'}))
                        return response.end()
                    }

                    const dataValidator = new DataValidator();
                    const validatedCarCategory = dataValidator.isValidCarCategory(carCategory);
                        
                    if(validatedCarCategory.error) {
                        response.writeHead(400)
                        
                        const errors_message = validatedCarCategory.error.details
                            .map(item => item.message);
                        
                        response.write(JSON.stringify( errors_message ))
                        return response.end();
                    }

                    const validatedCustomer = dataValidator.isValidCustomer(customer);

                    if(validatedCustomer.error) {
                        response.writeHead(400);

                        const errors_message = validatedCustomer.error.details
                            .map(item => item.message);
                
                        response.write(JSON.stringify( errors_message ))
                        return response.end();
                    }
                        
                    const priceFormatted = await this.carService.calculateFinalPrice(customer, carCategory, numberOfDays)

                    response.writeHead(200)

                    response.write(JSON.stringify(priceFormatted))
                    response.end()
                }
            },

            '/get-available-car:post': async (request, response) => {
                for await (const data of request) {
                    const { carCategory } = JSON.parse(data)
                        
                    const dataValidator = new DataValidator();
                    const { value, error } = dataValidator.isValidCarCategory(carCategory);

                        
                    if(error) {
                        response.writeHead(400)

                        const errors_message = error.details
                            .map(item => item.message);

                        response.write(JSON.stringify(errors_message))
                        return response.end();
                    }

                    const result = await this.carService.getAvailableCar(value);

                    response.writeHead(200)

                    response.write(JSON.stringify(result))
                    response.end()
                }
            },

            '/rent:post': async (request, response) => {
                for await (const data of request) {
                    const { customer, carCategory, numberOfDays } = JSON.parse(data);

                    if(numberOfDays <= 1) {
                        response.writeHead(400);
                        response.write(JSON.stringify({error: 'Number of days must be equal to or greater than 1'}))
                        return response.end()
                    }

                    const dataValidator =  new DataValidator();

                    const validatedCustomer = dataValidator.isValidCustomer(customer);

                    if(validatedCustomer.error) {
                        response.writeHead(400);

                        const error_message = validatedCustomer.error.details
                            .map(item => item.message);

                        response.write(JSON.stringify(error_message))
                        return response.end();
                    }

                    const validatedCarCategory = dataValidator.isValidCarCategory(carCategory);
                    
                    if(validatedCarCategory.error) {
                        response.writeHead(400)
                        
                        const errors_message = validatedCarCategory.error.details
                            .map(item => item.message);
                    
                        response.write(JSON.stringify( errors_message ))
                        return response.end();
                    }

                    const result = await this.carService.rent(customer, carCategory, numberOfDays);

                    response.writeHead(200)
                    response.write(JSON.stringify(result))
                    return response.end();
                }
            },

            default: (request, response) => {
                response.writeHead(404);
                response.write("NOT FOUND"); 
                return response.end();
            }
        }
    }
}

module.exports = Routes;