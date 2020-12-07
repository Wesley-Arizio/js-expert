const { join } = require('path')

const { describe, it, before, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');

const { deepStrictEqual } = require('assert')

const request = require('supertest');


const mocks = {
    car: require('../mocks/car/valid/car.json'),
    validCarList: require('../mocks/car/valid/car.json'),
    validCarcategoryWithoutCarsLength: require('../mocks/carCategory/valid/categoryWithoutCarsLength.json'),
    validCarCategoryWithoutCarsIds: require('../mocks/carCategory/valid/categoryListWithoutCarsIds.json'),
    validCategoriesList: require('../mocks/carCategory/valid/categoriesList.json'),
    validCategory: require('../mocks/carCategory/valid/category.json'),
    validCategoryAndCars: require('../mocks/carCategory/valid/categoryAndCars.json'),
    validCategoriesWithCarIds: require('../mocks/carCategory/valid/categoryWithCarIds.json'),
    validCustomer: require('../mocks/customer/valid/customer.json')
}

// Class
const Api =require('../../web/index');
const CarService = require('../../src/service/carService');
const CarCategories = require('../../src/service/carCategoryService');


// path to the database
const categoryDatabase = join(__dirname, '../', '../', 'database', 'carCategories.json');
const carDatabase = join(__dirname, '../', '../', 'database', 'cars.json');

describe("Web layer test", () => {

    let sandBox = {};

    let api = {}
    let app = {}

    before(() => {
        const carServiceInstance = new CarService({cars: carDatabase});
        const carCategoriesIntance = new CarCategories({
            categories: categoryDatabase,
            cars: carDatabase
        });

        api = new Api(
            carServiceInstance,
            carCategoriesIntance
        );

        app = api.app();
    });

    beforeEach(() => {
        sandBox = sinon.createSandbox();
    });

    afterEach(() => {
        sandBox.restore()
    });

    describe('default route', () => {
        it('should request the default route and return http status code 404 and a message NOT FOUND', async () => {
            const response = await request(app).get('/validCarCategoryWith')

            deepStrictEqual(response.status, 404);
            deepStrictEqual(response.text, "NOT FOUND");
        });
    });

    describe('/cars', () => {
        it('should request the /cars and return a car', async () => {
            const id = mocks.car.id;

            sandBox.stub(
                api.carService.carRepository,
                api.carService.carRepository.find.name
            ).withArgs(id)
            .returns(mocks.car)

            const response = await request(app).get(`/cars/${id}`);

            deepStrictEqual(JSON.parse(response.text), mocks.car)
        });
        
        it('should request the /cars with an invalid id and return http status code 400 with a message INVALID CAR ID', async () => {
            const id = 1

            const response = await request(app)
                .get(`/cars/${id}`)
                .expect(400)

            deepStrictEqual(response.text, 'Invalid Car Id')
        }); 
    }); 

    describe('/car-categories', () => {
        it('should request /car-categories and return a categories list without carIds', async () => {
            const expected = mocks.validCarCategoryWithoutCarsIds;

            sandBox.stub(
                api.carCategoryService,
                api.carCategoryService.getAllCategories.name
            ).resolves(mocks.validCategoriesList)

            const response = await request(app)
                .get('/car-categories')
                .expect(200);

            deepStrictEqual(JSON.parse(response.text), expected);
        });
    })

    describe('/cars-by-categories', () => {
        it('should request /cars-by-categories and return http status code 200 and the category with their cars', async () => {
            const category = { ...mocks.validCategoriesWithCarIds }
            const expected = { ...mocks.validCategoryAndCars };

            const categoryId = category.id;

            const carIds = category.carIds;
            const cars = [...expected.cars ]

            sandBox.stub(
                api.carCategoryService.carCategoriesService,
                api.carCategoryService.carCategoriesService.find.name
            )
            .withArgs(categoryId)
            .resolves(category);

            sandBox.stub(
                api.carCategoryService,
                api.carCategoryService.getCarsFromCarCategoryByIds.name
            )
            .withArgs(carIds)
            .resolves(cars)
            
            const response = await request(app)
                .get(`/cars-by-categories/${categoryId}`)
                .expect(200);
            
            deepStrictEqual(JSON.parse(response.text), expected)

            deepStrictEqual(
                api.carCategoryService.carCategoriesService.find.calledWithExactly(categoryId),
                true
            )
            
            deepStrictEqual(
                api.carCategoryService.getCarsFromCarCategoryByIds.calledWithExactly(carIds),
                true
            )
        });
        it("should request /cars-by-categories and return http status code 400 and a message invalid categorie id", async () => {
            const invalidId = 1;
            const response = await request(app)
                .get(`/cars-by-categories/${invalidId}`)
                .expect(400);

            deepStrictEqual(response.text, 'Invalid Category Id')
        })
    });

    describe('/calculate-final-price', () => {
        it('should request /calculate-final-price with necessary data and calculate final amount in real', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 50
            };
            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: 37.6 
            }

            const numberOfDays = 5;

            const body = {
                customer,
                carCategory,
                numberOfDays
            }

            const response = await request(app)
                .post('/calculate-final-price')
                .send(body)
                .expect(200)
            
            const expected = api.carService.currencyFormat.format(244.40);
            deepStrictEqual(JSON.parse(response.text), expected);
        });
        it('should request /calculate-final-price with invalid customer age and return http status code 400 with an invalid customer age message', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 'Cinquenta'
            };
            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: 37.6 
            }

            const numberOfDays = 5;

            const body = {
                customer,
                carCategory,
                numberOfDays
            }

            const response = await request(app)
                .post('/calculate-final-price')
                .send(body)
                .expect(400)

            const expected_error = [ '"age" must be a number' ];

            deepStrictEqual(JSON.parse(response.text), expected_error);
        });
        it('should request /calculate-final-price with invalid car category price and return http status code 400 with an invalid car category price message', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 50
            };
            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: NaN
            }

            const numberOfDays = 5;

            const body = {
                customer,
                carCategory,
                numberOfDays
            }

            const response = await request(app)
                .post('/calculate-final-price')
                .send(body)
                .expect(400)

            const expected_error = [ '"price" must be a number' ];

            deepStrictEqual(JSON.parse(response.text), expected_error);
        });
        it("should request /calculate-final-price with invalid number of days and return htttp status code 400 with error message", async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 50
            };
            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: 37.6 
            }

            const numberOfDays = 0;

            const body = {
                customer,
                carCategory,
                numberOfDays
            }

            const response = await request(app)
                .post('/calculate-final-price')
                .send(body)
                .expect(400)
            
            const expected = {
                error: 'Number of days must be equal to or greater than 1'
            }
            deepStrictEqual(JSON.parse(response.text), expected);
        })
    });

    describe('/get-available-car', () => {
        it('should request /get-available-car and return a random car ', async () =>{
            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
            }

            const body = {
                carCategory
            }

            sandBox.stub(
                api.carService.carRepository,
                api.carService.carRepository.find.name
            ).resolves(mocks.car)

            const response = await request(app)
                .post('/get-available-car')
                .send(body)
                .expect(200)

            const expected = mocks.car;

            deepStrictEqual(JSON.parse(response.text), expected);
        })
        it('should request /get-available-car with invalid body and return http status 400 with message', async () => {
            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                id: 1234,
                name: '123',
                price: NaN
            }

            const body = {
                carCategory
            }

            const response = await request(app)
                .post('/get-available-car')
                .send(body)
                .expect(400)

            const expected_error = [
                '"id" must be a string',
                '"name" length must be at least 4 characters long',
                '"price" must be a number'
            ];

            deepStrictEqual(JSON.parse(response.text), expected_error)
        });
    })

    describe('/rent', () => {
        it('should request /rent and return a transaction receipt and http status code 200', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 20
            };

            const car = { ...mocks.car };

            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: 37.6 
            }

            const numberOfDays = 5;

            const body = {
                customer,
                carCategory,
                numberOfDays
            };

            const expectedAmount = api.carService.currencyFormat.format(206.8)
            const dueDate = "10 de novembro de 2020"

            const now = new Date(2020, 10, 5)
            sandBox.useFakeTimers(now.getTime())

            sandBox.stub(
                api.carService.carRepository,
                api.carService.carRepository.find.name
            ).resolves(mocks.car)

            const expected = {
                customer,
                car,
                amount: expectedAmount,
                dueDate,
            }

            const response = await request(app)
                .post('/rent')
                .send(body)
                .expect(200)

            deepStrictEqual(JSON.parse(response.text), expected);
        });
        it('should request /rent with invalid customer and return http status code 400 with message', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 15 
            };

            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: 37.6 
            }

            const numberOfDays = 5;

            const body = {
                customer,
                carCategory,
                numberOfDays
            };

            const expected_error = ["\"age\" must be greater than or equal to 18"]

            const response = await request(app)
                .post('/rent')
                .send(body)
                .expect(400)

            deepStrictEqual(JSON.parse(response.text), expected_error);
        });
        it('should request /rent with invalid car category and return http status code 400 with message', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 20 
            };

            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: -10 
            }

            const numberOfDays = 5;

            const body = {
                customer,
                carCategory,
                numberOfDays
            };

            const expected_error = ["\"price\" must be greater than or equal to 10"]

            const response = await request(app)
                .post('/rent')
                .send(body)
                .expect(400)

            deepStrictEqual(JSON.parse(response.text), expected_error);
        });
        it('should request /rent with invalid number of days and return http status code 400 with error message', async () => {
            const customer = { 
                ...mocks.validCustomer,
                age: 20
            };

            const car = { ...mocks.car };

            const carCategory = { 
                ...mocks.validCategoriesWithCarIds,
                price: 37.6 
            }

            const numberOfDays = 0;

            const body = {
                customer,
                carCategory,
                numberOfDays
            };

            const expectedAmount = api.carService.currencyFormat.format(206.8)
            const dueDate = "10 de novembro de 2020"

            const now = new Date(2020, 10, 5)
            sandBox.useFakeTimers(now.getTime())

            sandBox.stub(
                api.carService.carRepository,
                api.carService.carRepository.find.name
            ).resolves(mocks.car)

            const expected = {
                error: 'Number of days must be equal to or greater than 1'
            }

            const response = await request(app)
                .post('/rent')
                .send(body)
                .expect(400)

            deepStrictEqual(JSON.parse(response.text), expected);
        });
    });
});