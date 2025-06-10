const Student = require('../model/student.model');
const Class = require('../model/class.model');

module.exports = {

    createOrUpdateAdmitCard: async(req, res)=>{
        try {
            const { name, class: className, section, roll, exam, year } = req.body;
            console.log(req.body);
            if (!name || !className || !roll) {
                return res.status(400).json({ message: "'name', 'class', and 'roll' are required." });
            }

            const classExists = await Class.findOne({class_num: className});
            console.log(classExists);

            console.log(className);
            console.log(roll);
            const student = await Student.findOne({ student_class: classExists._id, roll }).select('-password');
            console.log(student);
            if (!student) {
                return res.status(404).json({ message: "Student not found." });
            }

            student['admitCard'] = {
                name,
                class: className,
                section,
                roll,
                exam,
                year
            };

            await student.save();

            res.status(200).json({ message: "Admit card updated successfully.", admitCard: student['admitCard'] });
        } catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }
}