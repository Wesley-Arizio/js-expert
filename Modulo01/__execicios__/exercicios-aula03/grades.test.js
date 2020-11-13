const { deepStrictEqual } = require('assert');

const Student = require('./src/Students');
const Grade = require('./src/Grades');

const sinon = require('sinon');
const initial = require('./mocks/initial.json');

const default_students_list = [
    {
        "name": "Wesley",
        "age": 19,
        "grades": {

        },
        "isApproved": false
    },
    {
        "name": "Maria",
        "age": 19,
        "grades": {

        },
        "isApproved": false
    }
];

(async () => {
    const gradeRegex = /[0-9]\.[0-9][0-9]?/;

    const student = new Student();
    const grade = new Grade();

    const stub = sinon.stub(student, student.getStudents.name);

    stub.resolves(initial);

    {   
        // testando função de ler arquivo
        const expected = initial;

        const response = await student.getStudents()
        deepStrictEqual(response, expected);
    }   
    { 
        // testando a função de gerar notas usando regex

        const response = grade.generateGrade();
        const isEqual = gradeRegex.test(response);
        deepStrictEqual(isEqual, true)
    }
    {   
        // testando função de calcular a media,
        // se ta no padrao regex e se é igual ao resulado experado

        const response = grade.calculateFinalGrade({
            grade1: 9.30,
            grade2: 9.9,
            grade3: 8.90
        });

        const isEqual = gradeRegex.test(response);

        deepStrictEqual(isEqual, true)
        deepStrictEqual(response, 9.37)
    }
    {
        // Testar função de gerar todas as notas
        const expected = [true, true, true];

        const response = grade.getGrades(3)
 
        const isValid = Object.values(response).map(item => {
            return gradeRegex.test(item)
        });
        
        deepStrictEqual(isValid, expected);
    }
    {
        // deve testar a função de gerar notas para 2 usuarios em uma lista personalizada
        // usando o spy, verificar a segunda chamada do gerador de notas.        
        const expectedValueType = [true, true, true];

        const student = new Student()
        const stub = sinon.stub(student, student.getStudents.name)

        stub.resolves(default_students_list);

        const grade = new Grade();
        const spy = sinon.spy(grade, grade.getGrades.name);

        const response = await student.getStudents();

        const result = [];
        
        for await (const student of response) {
            const { grade1, grade2, grade3 } = await grade.getGrades(3);
            result.push({
                ...student,
                grades: {
                    grade1,
                    grade2, 
                    grade3,
                }
            });
        }

        const { returnValue } = spy.getCall(1);

        const isValid = Object.values(returnValue).map(item => {
            return gradeRegex.test(item)
        });

        deepStrictEqual(isValid, expectedValueType)
    }   
})()