const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: true,
        trim: true,
    },
    busNumber: {
        type: String,
        required: true,
        trim: true,
    },
    stops: [
        {
            stopName: {
                type: String,
                required: true,
                trim: true,
            },
            arrivalTime: {
                type: String,
                required: true,
            },
        },
    ],
    driverName: {
        type: String,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const BusRoute = mongoose.model('BusRoute', busRouteSchema);

module.exports = BusRoute;