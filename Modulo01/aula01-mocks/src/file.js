const { readFile } = require('fs/promises');
const User = require('./user');

const  { error } = require('./constants')

const default_options = {
    max_lines: 4,   
    fields: ["id", "name"]
}

class File {
    static async cvgToJson(filePath) {
        const content = await File.getFileContent(filePath);

        const validation = File.isValid(content)
        if(!validation.valid){
            throw new Error(validation.error);
        }

        const users = File.parseCSVToJson(content);
        return users;
    }

    static async getFileContent(filePath) {
        return (await readFile(filePath)).toString('utf-8');
    }

    static isValid(csvString, options = default_options) {
        const [header, ...fileWithoutHeader] = csvString.split('\n');
        const isHeaderValid = header === options.fields.join(',');

        if(!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false    
            }
        }

        const isContentLengthIsAccepted = (
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.max_lines
        );

        if(!isContentLengthIsAccepted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }
        
        return {
            error: null,
            valid: true
        }
    }

    static parseCSVToJson(csvString) {
        const lines = csvString.split('\n');
        
        const firstLine = lines.shift();
        const header = firstLine.split(',');

        return lines.map(line => {
            const columns = line.split(',');

            let user = {}

            for(const index in columns) {
                user[header[index]] = columns[index];
            }
            return new User(user);
        });
    }
}

module.exports = File;