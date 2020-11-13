class Grade {
    generateGrade(){
        const max = 10;
        const min = 0.5;
        
        const grade = (Math.random() * (max - min) + min).toFixed(2);
        return parseFloat(grade);
    }

    calculateFinalGrade({grade1, grade2, grade3}){
        const media = ((grade1 + grade2 + grade3) / 3).toFixed(2);

        return parseFloat(media);
    }

    getGrades(input, current = 0, next = 1){
        if(input == 0){
            return 0;
        }
        
        this.generateGrade(input - 1, current + 1, next + 1);

        return {
            grade1: this.generateGrade(),
            grade2: this.generateGrade(),
            grade3: this.generateGrade()
        }
    }
}

module.exports = Grade;