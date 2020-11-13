const { readFile } = require('fs/promises');

// levando em consideração que testes nao devem depender
// de recursos externos, essas funçoes tem como objetivo
// testar requisições ao banco de dados e retornar usuarios de acordo
// com o tipo de filtro (idade, qualidades, ...)

class Person { 
    async getUserContent(){
        const users = (await readFile('./mocks/persons.json')).toString('utf-8');
        return JSON.parse(users);
    }

    async getUserByAge(age){
        const users = await this.getUserContent();

        return users
            .filter
                (user => user.age === age ? user : false );
    }

    async getUserByName(name){
        const users = await this.getUserContent();

        return users
            .filter
                (user => user.name.indexOf(name) !== -1 ? user : false );
    }
}

module.exports = Person;