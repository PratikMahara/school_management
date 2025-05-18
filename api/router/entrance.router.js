const express = require("express")
const app = express();
const router = express.Router();
const { addNewEntrance } = require("../controller/entrance.controller")
const Entrance = require("../model/entrance.model");


app.get('/entrance' ,async(req,res) => {
    res.send("hello entrance");
})

router.post("/entrance", async (req, res) => {
    const { name, address, classId, email, phoneno, preschool } = req.body;
    const newEntrance = new Entrance({ 
        name,
        address,
        classId,
        email,
        phoneno,
        preschool,

     });
    newEntrance.save().then(savedData => {
        console.log("Date saved", savedData);
        res.status(200).json({ success: true, data: savedData, message: "Class is Created Successfully." })
    }).catch(e => {
        console.log("ERROR in Register", e)
        res.status(500).json({ success: false, message: "Failed Creation of Class." })
    })
}); 

module.exports = router;