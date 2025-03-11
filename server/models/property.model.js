import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  propertyType: { type: String, default: null },
  fullName: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  propertyName: { type: String, default: null },
  numOfBedRooms: { type: Number, default: null },
  numOfToilets: { type: Number, default: null },
  locationDetails: { type: String, default: null },
  plotSize: { type: String, default: null },
  budget: { type: String, default: null },
  imageurl: { type: String, default: null },
  updateddate: { type: Date, default: Date.now },
  imageUrls: { type: Array, default: [] }, 
  description: { type: String, default: null },
  commercialType: { type: String, default: null },
  rentalType: { type: String, default: null },
  numOfRooms: { type: Number, default: null },
  villaRooms: { type: String, default: null },
  propertyNumber: {type: Number}
}, { timestamps: true });

const Property = mongoose.model("Property", PropertySchema);

export default Property;
