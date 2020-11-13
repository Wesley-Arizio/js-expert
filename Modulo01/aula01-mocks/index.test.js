const { rejects, deepStrictEqual } = require('assert');

const { error } = require('./src/constants');
const File = require('./src/file');   

;
(async () => {
    {
        const filePath = './mocks/empty-user-invalid.csv';
        const expectedRejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
        const response = File.cvgToJson(filePath);
    
        await rejects(response, expectedRejection);
    }
    {
        const filePath = './mocks/five-users-invalid.csv';
        const expectedRejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
        const response = File.cvgToJson(filePath);
    
        await rejects(response, expectedRejection);
    }
    {
        const filePath = './mocks/valid-user.csv';
        const response = await File.cvgToJson(filePath);
        const expectedSuccessResponse = [
            {
              "id": 1,
              "name": "wesley"
            },
            {
              "id": 2,
              "name": "maria"
            },
            {
              "id": 3,
              "name": "joao"
            }
          ];

          deepStrictEqual(JSON.stringify(response), JSON.stringify(expectedSuccessResponse));
    }
})()