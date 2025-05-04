require("dotenv").config();
const Syllabus = require("../model/syllabus.model");
const Class = require("../model/class.model");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

module.exports = {
    getAllSyllabus: async (req, res) => {
        try {
            const syllabus = await Syllabus.find({}).populate("class");
            res.status(200).json({
                success: true,
                message: "Fetched syllabus successfully",
                data: syllabus,
            });
        } catch (error) {
            console.error("Error in getting all syllabus", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    },

    uploadSyllabus: async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form:", err);
                return res.status(500).json({ success: false, message: "Form parsing error" });
            }

            const { title, description, class_num } = fields;
            console.log(class_num)
            const uploadedFile = files.file?.[0];// formidable returns an array of files, even if only one file is uploaded
            if (!uploadedFile) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            try {
                const foundClass = await Class.findOne({ class_num: Number(class_num) });//converted to number on the go
                if (!foundClass) {
                    return res.status(404).json({ success: false, message: "Class not found" });
                }

                const uploadFolder = path.join(__dirname, '../../frontend/public/images/uploaded/syllabus');

                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }

                const originalFileName = uploadedFile.originalFilename.replace(/\s+/g, "_");
                const savePath = path.join(uploadFolder, originalFileName);

                // Save uploaded file in folder(later on change it to cloudinary/s3/google drive)
                const fileData = fs.readFileSync(uploadedFile.filepath);
                fs.writeFileSync(savePath, fileData);

                // Save record in database
                const newSyllabus = new Syllabus({
                  title: title?.[0],
                  description: description?.[0],
                  file: `/images/uploaded/syllabus/${originalFileName}`,//only the path is saved in the database🥴
                  class: foundClass._id,
                });

                await newSyllabus.save();
                res.status(201).json({ success: true, message: "Syllabus uploaded successfully", data: newSyllabus });

            } catch (error) {
                console.error("Upload syllabus error:", error);
                res.status(500).json({ success: false, message: "Server error while uploading syllabus" });
            }
        });
    },

    updateSyllabus: async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
            console.error("Error parsing form:", err);
            return res.status(500).json({ success: false, message: "Form parsing error" });
            }

            const { title, description } = fields;
            const { id } = req.params;
            const uploadedFile = files.file?.[0]; 

            try {
            const syllabus = await Syllabus.findById(id);
            if (!syllabus) {
                return res.status(404).json({ success: false, message: "Syllabus not found" });
            }

            syllabus.title = title?.[0] || syllabus.title;
            syllabus.description = description?.[0] || syllabus.description;

            if (uploadedFile) {
                const uploadFolder = path.join(__dirname, '../../frontend/public/images/uploaded/syllabus');

                if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder, { recursive: true });
                }

                const originalFileName = uploadedFile.originalFilename.replace(/\s+/g, "_");
                const savePath = path.join(uploadFolder, originalFileName);

                const fileData = fs.readFileSync(uploadedFile.filepath);
                fs.writeFileSync(savePath, fileData);

                syllabus.file = `/images/uploaded/syllabus/${originalFileName}`;
            }

            await syllabus.save();
            res.status(200).json({ success: true, message: "Syllabus updated successfully", data: syllabus });

            } catch (error) {
                console.error("Error updating syllabus:", error);
                res.status(500).json({ success: false, message: "Server error while updating syllabus" });
            }
        });
    },


    deleteSyllabus: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedSyllabus = await Syllabus.findByIdAndDelete(id);

            if (!deletedSyllabus) {
                return res.status(404).json({ success: false, message: "Syllabus not found" });
            }

            res.status(200).json({ success: true, message: "Syllabus deleted successfully" });
        } catch (error) {
            console.error("Error deleting syllabus:", error);
            res.status(500).json({ success: false, message: "Server error while deleting syllabus" });
        }
    }
}
