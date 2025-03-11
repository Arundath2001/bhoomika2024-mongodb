import mongoose from "mongoose";

const VisitScheduleSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  visitDate: { type: Date, default: null },
  visitTime: { type: String, default: null },
  propertyName: { type: String, required: true },
  locationDetails: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, default: null },
  propertyNumber: { type: Number, default: null},
}, { timestamps: true });

const VisitSchedule = mongoose.model("VisitSchedule", VisitScheduleSchema);
export default VisitSchedule;
