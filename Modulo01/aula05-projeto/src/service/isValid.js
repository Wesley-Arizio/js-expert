const Joi = require('joi');

class DataValidator{
    constructor(){
    }

    isValidCustomer(customer) {
        const schema = Joi.object({
            id: Joi.string()
                .required(),

            name: Joi.string()
                .required()
                .min(4)
                .max(30),

            age: Joi.number()
                .min(18)
                .max(100)
                .required()
        });

        return schema.validate(customer, {
            abortEarly: false
        })
    }

    isValidCarCategory(carCategory){
        const schema = Joi.object({
            id: Joi.string()
                .required(),

            name: Joi.string()
                .required()
                .min(4)
                .max(30),

            carIds: Joi.array()
                .items(Joi.string())
                .required(),

            price: Joi.number()
                .required()
                .min(10)
                .max(1000)
        });

        return schema.validate(carCategory, {
            abortEarly: false
        })
    }
}

module.exports = DataValidator;