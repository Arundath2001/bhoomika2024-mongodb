import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    propertyType: { type: String, required: true },
    numOfRooms: { type: Number, default: null },
    numOfToilets: { type: Number, default: null },
    locationDetails: { type: String, default: null },
    plotSize: { type: String, default: null },
    budget: { type: String, default: null },
    description: { type: String, default: null },
    numOfBedRooms: { type: Number, default: null },
    commercialType: { type: String, default: null },
    rentalType: { type: String, default: null },
    villaRooms: { type: Number, default: null },
    submitteddate: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
