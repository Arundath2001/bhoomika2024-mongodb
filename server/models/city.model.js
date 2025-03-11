import mongoose from "mongoose";

const citySchema = mongoose.Schema({
    cityName:{
        type: String,
        required: true,
    },
    availableProperties:{
        type: Number,
        required: true
    },
    updatedDate:{
        type: Date,
        default: Date.now 
    },
    imageUrl:{
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const City = mongoose.model('City', citySchema);

export default City;