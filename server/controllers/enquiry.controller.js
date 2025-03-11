import Enquiry from "../models/enquiry.model.js";

export const getEnquiry = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({}).sort({ submitteddate: -1 });
        res.status(200).json(enquiries);
    } catch (error) {
        console.error("Error in getEnquiry controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getEnquiryCount = async (req, res) => {
    try {
        const count = await Enquiry.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error in getEnquiryCount controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addEnquiry = async (req, res) => {
    const { 
        fullName, 
        phoneNumber, 
        propertyType, 
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

    console.log('Request Body:', req.body);

    if (!fullName || !phoneNumber || !propertyType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newEnquiry = new Enquiry({
            fullName,
            phoneNumber,
            propertyType,
            numOfRooms: numOfRooms ? parseInt(numOfRooms, 10) : null,
            numOfToilets: numOfToilets ? parseInt(numOfToilets, 10) : null,
            locationDetails,
            plotSize,
            budget,
            description,
            numOfBedRooms: numOfBedRooms ? parseInt(numOfBedRooms, 10) : null,
            commercialType,
            rentalType,
            villaRooms
        });

        await newEnquiry.save();

        res.status(201).json({ message: 'Enquiry submitted successfully' });
    } catch (error) {
        console.error("Error in addEnquiry controller:", error.message);
        res.status(500).json({ message: "An error occurred while saving the enquiry. Please try again." });
    }
};

export const deleteEnquiry = async (req, res) => {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid data format, ids must be an array' });
    }

    try {
        const result = await Enquiry.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No enquiries found with the provided IDs' });
        }

        res.status(200).json({ message: 'Items deleted successfully' });
    } catch (error) {
        console.error('Error deleting items:', error);
        res.status(500).json({ error: 'Failed to delete items' });
    }
};