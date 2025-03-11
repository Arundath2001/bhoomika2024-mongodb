import VisitSchedule from "../models/visitschedule.model.js";
import nodemailer from "nodemailer";

export const getVisitSchedule = async (req, res) => {
  try {
    const visitSchedule = await VisitSchedule.find({}).sort({ createdAt: -1 });
    res.status(200).json({ visitSchedule });
  } catch (error) {
    console.error("Error in getProperties controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getVisitScheduleCount = async (req, res) => {
  try {
    const count = await VisitSchedule.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in getPropertiesCount controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const scheduleVisit = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, visitDate, visitTime, visitTimePeriod, propertyName, locationDetails, description, propertyNumber } = req.body;

        console.log("Received Data:", req.body);

        const formattedVisitDate = visitDate && visitDate.trim() !== '' ? visitDate : null;

        let formattedVisitTime = null;
        if (visitTime && visitTime.trim() !== '') {
            let [hours, minutes] = visitTime.split(':');
            hours = parseInt(hours, 10);
            let period = visitTimePeriod || '';

            if (hours > 12) {
                hours -= 12;
            } else if (hours === 0) {
                hours = 12;
            }

            formattedVisitTime = `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
        }

        const newVisit = new VisitSchedule({
            fullName,
            email,
            phoneNumber,
            visitDate: formattedVisitDate,
            visitTime: formattedVisitTime,
            propertyName,
            locationDetails,
            description,
            propertyNumber
        });

        await newVisit.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: `"Bhoomika Real Estate Website" <dilna@bhoomikarealestate.com>`,
            to: "dilna@bhoomikarealestate.com",
            subject: "New Visit Scheduled",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                    <h3 style="background-color: #4CAF50; color: white; padding: 10px 15px; text-align: center; border-radius: 5px;">New Visit Scheduled</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr><td style="font-weight: bold; padding: 10px 0;">Full Name:</td><td>${fullName}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Email:</td><td>${email}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Phone Number:</td><td>${phoneNumber}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Visit Date:</td><td>${formattedVisitDate || "N/A"}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Visit Time:</td><td>${formattedVisitTime || "N/A"}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Property Name:</td><td>${propertyName}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Location Details:</td><td>${locationDetails}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Description:</td><td>${description}</td></tr>
                        <tr><td style="font-weight: bold; padding: 10px 0;">Property ID:</td><td>${propertyNumber}</td></tr>
                    </table>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Visit scheduled successfully!" });
    } catch (error) {
        console.error("Error in scheduleVisit controller:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteVisit = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        const result = await VisitSchedule.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No items found to delete" });
        }

        res.status(200).json({ message: "Items deleted successfully", deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Error deleting items:", error);
        res.status(500).json({ error: "Failed to delete items" });
    }
};