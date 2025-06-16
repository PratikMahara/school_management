require("dotenv").config();
const Calendar = require("../model/calendar.model");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

module.exports = {
    getLatestCalendar: async (req, res) => {
        try {
            const latestCalendar = await Calendar.findOne().sort({ createdAt: -1 });
            // console.log("Latest Calendar:", latestCalendar);
            
            return res.status(200).json({
                success: true,
                message: "Calender fetched successfully",
                data: latestCalendar,
            });
        } catch (error) {
            console.error("Error in getting calendar", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    },

    uploadCalendar: async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form:", err);
                return res.status(500).json({ success: false, message: "Form parsing error" });
            }

            const uploadedFile = files.file?.[0];// formidable returns an array of files, even if only one file is uploaded
            if (!uploadedFile) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            try {
                const uploadFolder = path.join(__dirname, '../../frontend/public/images/uploaded/calendar');

                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }

                const originalFileName = uploadedFile.originalFilename.replace(/\s+/g, "_");
                const savePath = path.join(uploadFolder, originalFileName);

                // Save uploaded file in folder(later on change it to cloudinary/s3/google drive)
                const fileData = fs.readFileSync(uploadedFile.filepath);
                fs.writeFileSync(savePath, fileData);

                // Save record in database
                const newCalendar = new Calendar({
                  file: `/images/uploaded/calendar/${originalFileName}`,
                });

                await newCalendar.save();
                res.status(201).json({ success: true, message: "Calendar uploaded successfully", data: newCalendar });

            } catch (error) {
                console.error("Upload calendar error:", error);
                res.status(500).json({ success: false, message: "Server error while uploading calendar" });
            }
        });
    },

    deleteCalendar: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedCalendar = await Calendar.findByIdAndDelete(id);

            if (!deletedCalendar) {
                return res.status(404).json({ success: false, message: "Calendar not found" });
            }

            res.status(200).json({ success: true, message: "Calendar deleted successfully" });
        } catch (error) {
            console.error("Error deleting calendar:", error);
            res.status(500).json({ success: false, message: "Server error while deleting calendar" });
        }
    }
}
