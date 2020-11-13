const { deepStrictEqual } = require('assert')
const sinon = require('sinon');

const Person = require('./src/service');

const users_list = require('./mocks/persons.json');

;
(async () => {
    const person = new Person();
    const stub = sinon.stub(person, person.getUserContent.name) 
    // toda vez que a funçao getUserContent for chamada atravez de qualquer outra função.

    stub.resolves(users_list)

    {
        // showd return specific user
        const expected = {
            "name": "wesley arizio",
            "age": 19,
            "qualities": {
                "funny": true,
                "smart": true,
                "curious": false,
                "idontKnowMoreThanThat": true
            },
        }

        const [response] = await person.getUserByName("wesley arizio")
        deepStrictEqual(response, expected);
    }
    {
        // showd return users with age === 19
        const expected = [
            {
                "name": "wesley arizio",
                "age": 19,
                "qualities": {
                    "funny": true,
                    "smart": true,
                    "curious": false,
                    "idontKnowMoreThanThat": true
                }
            },
            {
                "name": "bruno",
                "age": 19,
                "qualities": {
                    "funny": true,
                    "smart": true,
                    "curious": false,
                    "idontKnowMoreThanThat": true
                }
            },
            {
                "name": "alex",
                "age": 19,
                "qualities": {
                    "funny": false,
                    "smart": false,
                    "curious": false,
                    "idontKnowMoreThanThat": false
                }
            }
        ];

        const response = await person.getUserByAge(19);
        deepStrictEqual(response, expected);
    }

})();
