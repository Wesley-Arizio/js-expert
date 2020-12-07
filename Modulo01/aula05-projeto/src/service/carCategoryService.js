const BaseRepository = require('../repository/base/baseRepository');


class CarCategories {
    constructor({ categories, cars }){
        this.carCategoriesService = new BaseRepository({ file: categories });
        this.carService = new BaseRepository({ file: cars });
    }

    async getAllCategories(){
        const categories = await this.carCategoriesService.find();

        const categoriesWithCarsLength = []
        
        for await (const categorie of categories){
            const categoriesFormatted = {
                ...categorie,
                cars: categorie.carIds.length
            }
            categoriesWithCarsLength.push(categoriesFormatted)
        } 

        return categoriesWithCarsLength;
    }

    async getCarsFromCarCategoryByIds(data){
        const cars = [];

        for await (const car of data) {
            cars.push(await this.carService.find(car));
        }
    
        return cars;
    }

    async getCarCategoryWithCarsList(carCategoryId) {
        const categories = await this.carCategoriesService.find(carCategoryId);
        const cars = await this.getCarsFromCarCategoryByIds(categories.carIds)

        delete categories.carIds;
        return {
            ...categories,
            cars: cars
        }
    }
}

module.exports = CarCategories;