require("dotenv").config();

const Entrance = require("../model/entrance.model");

module.exports = {
    addNewEntrance: async (req, res) => {
        const newEntrance = new Entrance({ ...req.body });
        newEntrance.save().then(savedData => {
            console.log("Date saved", savedData);
            res.status(200).json({ success: true, data: savedData, message: "Class is Created Successfully." })
        }).catch(e => {
            console.log("ERROR in Register", e)
            res.status(500).json({ success: false, message: "Failed Creation of Class." })
        })
    }
}