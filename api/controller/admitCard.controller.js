const Student = require('../model/student.model');
const Class = require('../model/class.model');
const jwt = require('jsonwebtoken');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const path = require('path');
const fs = require('fs').promises; // CHANGE THIS LINE: Import the promise-based fs module

module.exports = {

    createOrUpdateAdmitCard: async(req, res)=>{
        try {
            const { name, class: className, section, roll, exam, year } = req.body;
            // console.log(req.body);
            if (!name || !className || !roll) {
                return res.status(400).json({ message: "'name', 'class', and 'roll' are required." });
            }

            const classExists = await Class.findOne({class_num: className});
            // console.log(classExists);

            // console.log(className);
            // console.log(roll);
            const student = await Student.findOne({ student_class: classExists._id, roll }).select('-password');
            // console.log(student);
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
    },
    createAdmitCard: async(req, res)=> {
        try {
            const token = req.header('authorization');
            const decoded = jwt.decode(token, process.env.JWTSECRET);
            // console.log("Decoded JWT: ", decoded);
            const studentId = decoded.id;
            // Ensure student.student_class is populated if you need data from it
            const student = await Student.findById(studentId).populate('student_class');

            // console.log("Student : ", student);
            // console.log("student by id: ", student)
            // console.log("student name: ", student.name)

            // for class name/no
            // const classOfStudent = await Class.findById(student.student_class);
            // console.log(classOfStudent); 

            if (!student) {
                return res.status(404).json({ message: "Student not found." });
            }

            // 1. GENERATE PDF DOCUMENT FIRST
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595, 842]); // A4 size
            const { width, height } = page.getSize();

            // Get fonts (embed after pdfDoc is created)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Define colors
            const blackColor = rgb(0, 0, 0);
            const blueColor = rgb(0.2, 0.4, 0.8);
            const grayColor = rgb(0.5, 0.5, 0.5);

            // 2. LOAD AND EMBED LOGO (NOW pdfDoc exists)
            const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'static', 'school_management_system.png');
            // console.log("Attempting to load logo from:", logoPath);

            let logoImageBytes;
            let logoImage = null; // Initialize to null to ensure it's defined

            try {
                logoImageBytes = await fs.readFile(logoPath); // Now fs.promises.readFile will work
                if (logoPath.endsWith('.png')) {
                    logoImage = await pdfDoc.embedPng(logoImageBytes);
                } else if (logoPath.endsWith('.jpg') || logoPath.endsWith('.jpeg')) {
                    logoImage = await pdfDoc.embedJpg(logoImageBytes);
                } else {
                    console.warn("Unsupported logo image format. Only PNG and JPG are supported.");
                }
            } catch (logoError) {
                console.error("Error loading or embedding logo:", logoError.message);
                // logoImage remains null if an error occurs
            }

            // 3. DRAW LOGO ON PAGE
            const logoWidth = 100; // Adjust as needed
            const logoHeight = 100; // Adjust as needed
            const logoX = 50;       // X-coordinate (from left)
            const logoY = height - logoHeight - 50; // Y-coordinate (from bottom), adjusted to be near the top

            if (logoImage) { // Make sure logoImage was successfully embedded
                page.drawImage(logoImage, {
                    x: logoX,
                    y: logoY,
                    width: logoWidth,
                    height: logoHeight,
                });
                // console.log("Logo drawn successfully!");
            } else {
                console.warn("Logo not drawn because logoImage is null or undefined (due to load error or unsupported format).");
            }
            // --- END OF LOGO DRAWING BLOCK ---


            // Header (Adjust y-positions if logo is placed high up to prevent overlap)
            page.drawText("ADMIT CARD", {
                x: width / 2 - 80,
                y: height - 80, // Adjust this Y-position relative to logo placement
                size: 28,
                font: boldFont,
                color: blueColor,
            });

            page.drawText("Paramount Secondary School", {
                x: width / 2 - 100,
                y: height - 120, // Adjust this Y-position
                size: 16,
                font: regularFont,
                color: grayColor,
            });

            // Draw a line separator
            page.drawLine({
                start: { x: 50, y: height - 150 }, // Adjust this Y-position
                end: { x: width - 50, y: height - 150 },
                thickness: 2,
                color: blueColor,
            });

            // Student Information Section
            let yPosition = height - 200; // Start yPosition after header and logo
            const leftMargin = 80;
            const labelWidth = 120;

            // Student Name
            page.drawText("Student Name:", {
                x: leftMargin,
                y: yPosition,
                size: 14,
                font: boldFont,
                color: blackColor,
            });
            page.drawText(student.name || 'N/A', {
                x: leftMargin + labelWidth,
                y: yPosition,
                size: 14,
                font: regularFont,
                color: blackColor,
            });

            yPosition -= 40;

            // Class
            page.drawText("Class:", {
                x: leftMargin,
                y: yPosition,
                size: 14,
                font: boldFont,
                color: blackColor,
            });
            // Access class_num from the populated student_class, or fallback
            page.drawText(student.student_class?.class_num?.toString() || 'N/A', { // Added optional chaining and toString()
                x: leftMargin + labelWidth,
                y: yPosition,
                size: 14,
                font: regularFont,
                color: blackColor,
            });

            yPosition -= 40;

            // Roll Number
            page.drawText("Roll Number:", {
                x: leftMargin,
                y: yPosition,
                size: 14,
                font: boldFont,
                color: blackColor,
            });

            page.drawText(student.admitCard?.roll?.toString() || student.roll?.toString() || 'N/A', {
                x: leftMargin + labelWidth,
                y: yPosition,
                size: 14,
                font: regularFont,
                color: blackColor,
            });

            yPosition -= 60;

            // // Exam Details Section (only if student.admitCard is present)
            //  // Ensure admitCard sub-document exists
            //     page.drawText("EXAMINATION DETAILS", {
            //         x: leftMargin,
            //         y: yPosition,
            //         size: 16,
            //         font: boldFont,
            //         color: blueColor,
            //     });

            //     yPosition -= 40;

            //     // Exam Date
            //     page.drawText("Exam Date:", {
            //         x: leftMargin,
            //         y: yPosition,
            //         size: 12,
            //         font: boldFont,
            //         color: blackColor,
            //     });
            //     page.drawText(student.admitCard.examDate || 'N/A', { // later on can be removed as per requirement
            //         x: leftMargin + labelWidth,
            //         y: yPosition,
            //         size: 12,
            //         font: regularFont,
            //         color: blackColor,
            //     });

            //     yPosition -= 30;

            //     // Exam Center
            //     page.drawText("Exam Center:", {
            //         x: leftMargin,
            //         y: yPosition,
            //         size: 12,
            //         font: boldFont,
            //         color: blackColor,
            //     });
            //     page.drawText(student.admitCard.examCenter || 'N/A', { 
            //         x: leftMargin + labelWidth,
            //         y: yPosition,
            //         size: 12,
            //         font: regularFont,
            //         color: blackColor,
            //     });

            //     yPosition -= 30;

            //     // Exam Time
            //     page.drawText("Exam Time:", {
            //         x: leftMargin,
            //         y: yPosition,
            //         size: 12,
            //         font: boldFont,
            //         color: blackColor,
            //     });
            //     page.drawText(student.admitCard.examTime || 'N/A', {
            //         x: leftMargin + labelWidth,
            //         y: yPosition,
            //         size: 12,
            //         font: regularFont,
            //         color: blackColor,
            //     });

            //     yPosition -= 60;

                // Instructions
                page.drawText("INSTRUCTIONS:", {
                    x: leftMargin,
                    y: yPosition,
                    size: 14,
                    font: boldFont,
                    color: blueColor,
                });

                yPosition -= 30;

                const instructions = [
                    "• Bring printed copy of this admit card to the examination center",
                    "• Carry a valid school ID",
                    "• Report to the center 30 minutes before exam time",
                    "• Bring your own stationery items",
                    "• Mobile phones are strictly prohibited",
                ];

                instructions.forEach((instruction) => {
                    page.drawText(instruction, {
                        x: leftMargin,
                        y: yPosition,
                        size: 10,
                        font: regularFont,
                        color: blackColor,
                    });
                    yPosition -= 20;
                });
            //  // Optional: Draw a message if admitCard is not found
            //     page.drawText("No examination details available for this student.", {
            //         x: leftMargin,
            //         y: yPosition,
            //         size: 12,
            //         font: regularFont,
            //         color: grayColor,
            //     });
            //     yPosition -= 40; // Adjust yPosition after this message
            

            // Footer
            page.drawText("Generated on: " + new Date().toLocaleDateString(), {
                x: leftMargin,
                y: 80,
                size: 10,
                font: regularFont,
                color: grayColor,
            });

            page.drawText("This is a computer-generated document", {
                x: width - 250,
                y: 80,
                size: 10,
                font: regularFont,
                color: grayColor,
            });

            // Generate PDF bytes
            const pdfBytes = await pdfDoc.save();

            // Set response headers for PDF download
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="admit_card_${studentId}.pdf"`);
            res.setHeader("Content-Length", pdfBytes.length);

            // Send PDF
            res.send(Buffer.from(pdfBytes));
        } catch (error) {
            console.error("Error generating PDF:", error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: "Invalid token" });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Token expired" });
            }
            res.status(500).json({
                error: "Failed to generate PDF",
            });
        }
    }
};