import SellingInfo from "../models/sellinginfo.model.js"
import path from "path";
import fs from 'fs';

export const getSellingInfo = async (req, res) => {
    try {
        const sellinginfo = await SellingInfo.find({}).sort({ updatedAt: -1 });
        res.status(200).json({sellinginfo});
    } catch (error) {
        console.error("Error in getProperties controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSellingInfoCount = async (req, res) => {
    try {
        const count = await SellingInfo.countDocuments();
        res.status(200).json({count})
    } catch (error) {
        console.error("Error in getPropertiesCount controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addSellingData = async (req, res) => {
    try {
        const {
            fullName,
            phoneNumber,
            propertyType,
            propertyName,
            numOfRooms,
            numOfBedRooms,
            commercialType,
            rentalType,
            numOfToilets,
            locationDetails,
            plotSize,
            budget,
            description,
            villaRooms
        } = req.body;

        console.log("Request Body Raw:", req.body);
        console.log("Request Files:", req.files);
                      

        const files = req.files;
        if (!fullName || !phoneNumber || !propertyType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const imageUrls = files ? files.map(file => path.posix.join("uploads", "selling", file.filename)) : [];

        const newSellingInfo = new SellingInfo({
            fullName,
            phone: phoneNumber,
            propertyType,
            propertyName,
            numOfRooms: numOfRooms ? parseInt(numOfRooms, 10) : null,
            numOfToilets: numOfToilets ? parseInt(numOfToilets, 10) : null,
            locationDetails,
            plotSize,
            budget,
            imageUrls,
            description,
            numOfBedRooms: numOfBedRooms ? parseInt(numOfBedRooms, 10) : null,
            commercialType,
            rentalType,
            villaRooms
        });

        await newSellingInfo.save();

        res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
        console.error("Error in addSellingData controller:", error.message);
        res.status(500).json({ message: "An error occurred while saving the form. Please try again." });
    }
};

export const deleteSellingInfo = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Invalid or empty ID list" });
        }

        const sellingRecords = await SellingInfo.find({ _id: { $in: ids } });

        if (!sellingRecords.length) {
            return res.status(404).json({ error: "No matching records found" });
        }

        const imagePaths = sellingRecords.flatMap(record => record.imageUrls || []);

        imagePaths.forEach(imageUrl => {
            const localImagePath = path.join(process.cwd(), imageUrl);
            fs.unlink(localImagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${localImagePath}`, err);
                }
            });
        });

        await SellingInfo.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "Items and images deleted successfully" });

    } catch (error) {
        console.error("Error deleting items:", error.message);
        res.status(500).json({ error: "Failed to delete items" });
    }
};