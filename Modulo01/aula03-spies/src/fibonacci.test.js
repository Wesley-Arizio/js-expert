const { deepStrictEqual } = require('assert')

const Fibonacci = require('./fibonacci');

const sinon = require('sinon');

;
(async () => {
    {
        const fibonacci = new Fibonacci();
        const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    
        for await(const i of fibonacci.execute(3)){}
    
        const exepectedCallCount = 4;
        deepStrictEqual(spy.callCount, exepectedCallCount)
    }

    {
        const fibonacci = new Fibonacci();
        const spy = sinon.spy(fibonacci, fibonacci.execute.name);
        const [...response] = fibonacci.execute(5)

        const { args } = spy.getCall(2);
        // pega o retorno da segunda chamada.

        const expectedResponse = [0, 1, 1, 2, 3];
        const expectedParams = Object.values({
            input: 3,
            current: 1,
            next: 2
        });

        deepStrictEqual(args, expectedParams)
        deepStrictEqual(response, expectedResponse)
    }
})()