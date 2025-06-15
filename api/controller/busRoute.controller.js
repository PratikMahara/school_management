require("dotenv").config();
const BusRoute = require("../model/busRoute.model");

module.exports = {

    getAllRoutes: async(req,res)=>{
            try {
                const routes = await BusRoute.find({});
                res.status(200).json({success:true, message:"Success in fetching all bus routes", data: routes})
            } catch (error) {
                console.error("Error in getting all bus routes", error);
                res.status(500).json({success:false, message:"Server Error in all fetching bus routes."})
            }
    },
    registerBusRoute: async (req, res) => {
        const { routeName, busNumber, stops, driverName, contactNumber, active } = req.body;
        console.log(active)
        const newRoute = new BusRoute({
            routeName: routeName,
            busNumber: busNumber,
            stops: stops,
            driverName: driverName,
            contactNumber: contactNumber,
            active: active
        });

        newRoute.save().then(savedData => {
            res.status(200).json({ success: true, data: savedData, message:"The route is Registered Successfully." })
        }).catch(e => {
            console.log("Error registering", e)
            res.status(500).json({ success: false, message: "Failed Registration." })
        })
    },
    editBusRoute: async (req, res) => {
        const { routeName, busNumber, stops, driverName, contactNumber, active } = req.body;
        const { id } = req.params;
        console.log("Edit route", id)
        try {
            const updatedRoute = await BusRoute.findByIdAndUpdate(id, {
                routeName: routeName,
                busNumber: busNumber,
                stops: stops,
                driverName: driverName,
                contactNumber: contactNumber,
                active: active
            }, { new: true });

            res.status(200).json({ success: true, message: "Route updated successfully", data: updatedRoute });
        } catch (error) {
            console.log("Error in editing route", error);
            res.status(500).json({ success: false, message: "Failed to update route" });
        }
    },
    deleteBusRoute: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedRoute = await BusRoute.findByIdAndDelete(id);
            if (!deletedRoute) {
                return res.status(404).json({ success: false, message: "Route not found" });
            }
            res.status(200).json({ success: true, message: "Route deleted successfully" });
        } catch (error) {
            console.log("Error in deleting route", error);
            res.status(500).json({ success: false, message: "Failed to delete route" });
        }
    }
}