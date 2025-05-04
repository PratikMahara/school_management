require("dotenv").config();
const Books = require("../model/books.model");
const Class = require("../model/class.model");
const Subject = require("../model/subject.model");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

module.exports = {
    getAllBooks: async (req, res) => {
        try {
            const books = await Books.find({})
            .populate("class")
            .populate("subject");
            res.status(200).json({
                success: true,
                message: "Fetched books successfully",
                data: books,
            });
        } catch (error) {
            console.error("Error in getting all books", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    },

    uploadBook: async (req, res) => {
        const { name, publication, class_num, subject_name } = req.body;

        try {
            const foundClass = await Class.findOne({ class_num: Number(class_num) });//converted to number on the go
            const foundSubject = await Subject.findOne({ subject_name: subject_name });
            if (!foundClass) {
                return res.status(404).json({ success: false, message: "Class not found" });
            }
            if (!foundSubject) {
                return res.status(404).json({ success: false, message: "Subject not found" });
            }
            // Save record in database
            const newBook = new Books({
                name: name,
                publication: publication,
                class: foundClass._id,
                subject: foundSubject._id,
            });

            await newBook.save();
            res.status(201).json({ success: true, message: "Book information uploaded successfully", data: newBook });

        } catch (error) {
            console.error("Error while uploading book information:", error);
            res.status(500).json({ success: false, message: "Server error while uploading syllabus" });
        }
    },

    updateBook: async (req, res) => {
        const { name, publication } = req.body;
        const { id } = req.params;

        try {
        const book = await Books.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        book.name = name || book.name;
        book.publication = publication || book.publication;

        await book.save();
        res.status(200).json({ success: true, message: "Books updated successfully", data: book });

        } catch (error) {
            console.error("Error updating Books:", error);
            res.status(500).json({ success: false, message: "Server error while updating books" });
        }
    },


    deleteBook: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedBook = await Books.findByIdAndDelete(id);

            if (!deletedBook) {
                return res.status(404).json({ success: false, message: "Book not found" });
            }

            res.status(200).json({ success: true, message: "Book deleted successfully" });
        } catch (error) {
            console.error("Error deleting Book:", error);
            res.status(500).json({ success: false, message: "Server error while deleting book" });
        }
    }
}
