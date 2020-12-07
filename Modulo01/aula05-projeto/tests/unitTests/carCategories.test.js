const { expect } = require('chai');
const { describe, it, before, beforeEach, afterEach} = require('mocha');
const sinon = require('sinon');

const { join } = require('path');


const CarCategories = require('../../src/service/carCategoryService');
const carCategoryDatabase = join(__dirname, '../../', 'database', 'carCategories.json'); 
const carsDatabase = join(__dirname, '../../', 'database', 'cars.json');

const mocks = {
    validCar: require('../mocks/car/valid/car.json'),
    validCarCategoriesList: require('../mocks/carCategory/valid/categoriesList.json'),
    validCarCategory: require('../mocks/carCategory/valid/category.json'),
    validCarCategoryWithCarIds: require('../mocks/carCategory/valid/categoryWithCarIds.json'),
    validCarsAndCarCategory: require('../mocks/carCategory/valid/categoryAndCars.json'),
    validCarCategoryWithoutCarsLength: require('../mocks/carCategory/valid/categoryWithoutCarsLength.json')
}

describe('Car Categories test', () => {

    let carCategory = {};
    let sandBox = {};
    
    before(() => {
        carCategory = new CarCategories({
            categories: carCategoryDatabase,
            cars: carsDatabase
        });
    })

    beforeEach(() => {
        sandBox = sinon.createSandbox();
    });

    afterEach(() => {
        sandBox.restore()
    });

    it('Should return all categories', async () => {
        const expected = mocks.validCarCategoriesList;
        const carCategoryWithoutCarsLenght = mocks.validCarCategoryWithoutCarsLength;

        sandBox.stub(
            carCategory.carCategoriesService,
            carCategory.carCategoriesService.find.name
        ).resolves(carCategoryWithoutCarsLenght);

        const response = await carCategory.getAllCategories();
 
        expect(carCategory.carCategoriesService.find.calledOnce).to.be.ok;
        expect(response).to.be.deep.equal(expected);
    });

    it('Should return car information according to the category provided', async () => {
        const arrayOfCarIds = mocks.validCarCategoryWithCarIds.carIds;
        const expected = mocks.validCarsAndCarCategory.cars;

        const carServiceStub = sandBox.stub(
            carCategory.carService,
            carCategory.carService.find.name
        );

        carServiceStub.withArgs(arrayOfCarIds[0]).returns(expected[0]);
        carServiceStub.withArgs(arrayOfCarIds[1]).returns(expected[1]);
        carServiceStub.withArgs(arrayOfCarIds[2]).returns(expected[2]);

        const response = await carCategory.getCarsFromCarCategoryByIds(arrayOfCarIds);

        expect(carCategory.carService.find.calledWithExactly(arrayOfCarIds[0])).to.be.ok;
        expect(carCategory.carService.find.calledWithExactly(arrayOfCarIds[1])).to.be.ok;
        expect(carCategory.carService.find.calledWithExactly(arrayOfCarIds[2])).to.be.ok;
        expect(response).to.be.deep.equal(expected)
    });

    it('Should return category information and their cars', async () => {
        const initialCarCategory = mocks.validCarCategory;
        const expected = mocks.validCarsAndCarCategory;

        sandBox.stub(
            carCategory.carCategoriesService,
            carCategory.carCategoriesService.find.name
        ).withArgs(initialCarCategory.id)
        .resolves(initialCarCategory);

        sandBox.stub(
            carCategory,
            carCategory.getCarsFromCarCategoryByIds.name
        ).returns(expected.cars)

        const response = await carCategory.getCarCategoryWithCarsList(initialCarCategory.id);

        expect(carCategory.getCarsFromCarCategoryByIds.calledOnce).to.be.ok;
        expect(carCategory.carCategoriesService.find.calledWithExactly(initialCarCategory.id)).to.be.ok;
        expect(response).to.be.deep.equal(expected);
    }); 
});