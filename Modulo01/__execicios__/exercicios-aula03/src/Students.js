const { readFile, writeFile } = require('fs/promises');

const Grade = require('./Grades');

class Student {
    async getStudents(){
        const students = (await readFile('./mocks/initial.json')).toString('utf-8');

        return JSON.parse(students)
    }

    async setGrade(){
        const students = await this.getStudents();
        const grade = new Grade();

        let userWithGrade = [];

        for await (const student of students){
            const { grade1, grade2, grade3 } = grade.getGrades(3)

            userWithGrade.push({
                ...student,
                grades: {
                    grade1,
                    grade2, 
                    grade3,
                    finalGrade: grade.calculateFinalGrade({grade1, grade2, grade3})
                }
            });
        }   

        const data = this.setIsApproved(userWithGrade);

        this.writeStudentsGrade(data);
    }

    async writeStudentsGrade(students){ 
        writeFile('./mocks/students.json', JSON.stringify(students, null, 2), (err,) => {
            if(err){
                throw new Error('Cannot write the students grade');
            }
        })
    }

    setIsApproved([...students]){
        return students.map(item => {
           return {
               ...item,
               isApproved: item.grades.finalGrade >= 7.5 ? true : false
           }
        });
    }
}

module.exports = Student;

