const Period = require('../model/period.model');
const Class = require('../model/class.model');
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

// Controller to create a period
exports.createPeriod = async (req, res) => {
  const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ success: false, message: "Form parsing error" });
      }

      const { class_num, class_section } = fields;
      console.log(class_num, class_section)
      const uploadedFile = files.file?.[0];
      if (!uploadedFile) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      try {
        const foundClass = await Class.findOne({ class_num: Number(class_num), class_section: class_section });
        if (!foundClass) {
          return res.status(404).json({ success: false, message: "Class not found" });
        }

        const uploadFolder = path.join(__dirname, '../../frontend/public/images/uploaded/period');

        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder, { recursive: true });
        }

        const originalFileName = uploadedFile.originalFilename.replace(/\s+/g, "_");
        const savePath = path.join(uploadFolder, originalFileName);

        // Save uploaded file in folder(later on change it to cloudinary/s3/google drive)
        const fileData = fs.readFileSync(uploadedFile.filepath);
        fs.writeFileSync(savePath, fileData);

        // Save record in database
        const newSchedule = new Period({
          file: `/images/uploaded/period/${originalFileName}`,//only the path is saved in the database🥴
          class: foundClass._id,
        });

        await newSchedule.save();
        res.status(201).json({ success: true, message: "Schedule uploaded successfully", data: newSchedule });

      } catch (error) {
        console.error("Upload syllabus error:", error);
        res.status(500).json({ success: false, message: "Server error while uploading schedule" });
      }
    });
};

// Controller to get periods for a specific teacher
exports.getTeacherPeriods = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const periods = await Period.find({ teacher: teacherId}).populate('class').populate('subject');
    res.status(200).json({ periods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching periods', error });
  }
};

exports.getPeriodsWithId = async (req, res) => {
    try {
      const { id } = req.params;
      const period = await Period.findById(id).populate('class').populate('subject').populate('teacher');
      res.status(200).json({ period });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods by id', error });
    }
  };

// Controller to get periods for a specific CLASS
exports.getClassPeriods = async (req, res) => {
    
    try {
      const { classId } = req.params;
      const periods = await Period.find({class:classId}).populate('subject').populate('teacher');
      console.log(classId)
      res.status(200).json({ periods });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods', error });
    }
  };

  // all periods
exports.getPeriods = async (req, res) => {
  try {
    const periods = await Period.find({})
      .populate('class')
    res.status(200).json({
      success: true,
      message: 'Fetched periods successfully',
      data: periods,
    })
  }catch (error) {
    res.status(500).json({ message: 'Error fetching periods', error });
  }
};


// Update period
exports.updatePeriod = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ success: false, message: "Form parsing error" });
      }

      const { class_num } = fields;
      const { id } = req.params;
      const uploadedFile = files.file?.[0]; 

      try {
        const period = await Period.findById(id);
        if (!period) {
          return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        period.class_num = class_num?.[0] || period.class_num;

        if (uploadedFile) {
          const uploadFolder = path.join(__dirname, '../../frontend/public/images/uploaded/period');

          if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder, { recursive: true });
          }

          const originalFileName = uploadedFile.originalFilename.replace(/\s+/g, "_");
          const savePath = path.join(uploadFolder, originalFileName);

          const fileData = fs.readFileSync(uploadedFile.filepath);
          fs.writeFileSync(savePath, fileData);

          period.file = `/images/uploaded/period/${originalFileName}`;
        }

        await period.save();
        res.status(200).json({ success: true, message: "Schedule updated successfully", data: period });

      } catch (error) {
          console.error("Error updating period:", error);
          res.status(500).json({ success: false, message: "Server error while updating period" });
      }
  });
};

// Delete period
exports.deletePeriod = async (req, res) => {
  try {
    const periodId = req.params.id;
    await Period.findByIdAndDelete(periodId);
    res.status(200).json({ message: 'Period deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting period', error });
  }
};
