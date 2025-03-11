import mongoose from "mongoose";

const SellingInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  propertyType: { type: String, required: true },
  propertyName: { type: String, default: null },
  numOfRooms: { type: Number, default: null },
  numOfToilets: { type: Number, default: null },
  locationDetails: { type: String, required: true },
  plotSize: { type: String, required: true },
  budget: { type: String, required: true },
  imageUrls: { type: Array, default: [] }, 
  updateddate: { type: Date, default: Date.now },
  description: { type: String, default: null },
  numOfBedRooms: { type: Number, default: null },
  rentalType: { type: String, default: null },
  commercialType: { type: String, default: null },
  villaRooms: { type: String, default: null },
}, { timestamps: true });

const SellingInfo = mongoose.model("SellingInfo", SellingInfoSchema);
export default SellingInfo;
