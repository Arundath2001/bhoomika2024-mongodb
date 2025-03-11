import City from "../models/city.model.js";
import Property from "../models/property.model.js";
import fs from "fs";
import path from "path";

export const getProperties = async (req, res) => {
    try {
        const properties = await Property.find({}).sort({ updateddate: -1 });
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error in getProperties controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPropertiesCount = async (req, res) => {
    try {
        const count = await Property.countDocuments();
        res.status(200).json({count});
    } catch (error) {
        console.error("Error in getPropertiesCount controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addProperty = async (req, res) => {
    try {
        const {
            propertyType, fullName, phoneNumber, propertyName, numOfBedRooms,
            numOfRooms, numOfToilets, locationDetails, plotSize,
            budget, description, commercialType, rentalType, villaRooms
        } = req.body;
        const files = req.files;

        if (!propertyType || !phoneNumber || !locationDetails || !plotSize || !budget) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (propertyType === 'Land' && !description) {
            return res.status(400).json({ error: 'Description is required for Land properties' });
        }

        const imageUrls = files.map(file => 
            path.normalize(path.join('uploads', 'properties', file.filename)).replace(/\\/g, '/')
        );

        const lastProperty = await Property.findOne().sort({ updateddate: -1 }).select('propertyNumber');
        const nextPropertyNumber = lastProperty ? lastProperty.propertyNumber + 1 : 147;

        const newProperty = new Property({
            propertyType,
            fullName,
            phoneNumber,
            propertyName,
            numOfRooms: numOfRooms ? parseInt(numOfRooms, 10) : null,
            numOfToilets: numOfToilets ? parseInt(numOfToilets, 10) : null,
            locationDetails,
            plotSize,
            budget,
            description,
            imageUrls,
            numOfBedRooms: numOfBedRooms ? parseInt(numOfBedRooms, 10) : null,
            commercialType,
            rentalType,
            villaRooms,
            propertyNumber: nextPropertyNumber, 
        });

        await newProperty.save();

        const citiesFromLocation = locationDetails.split(',').map(city => city.trim());
        const citiesFromDescription = description ? description.split(/,\s*/).map(city => city.trim()) : [];
        const allCities = [...new Set([...citiesFromLocation, ...citiesFromDescription])];

        for (const city of allCities) {
            const existingCity = await City.findOne({ cityName: new RegExp(`^${city}$`, 'i') });

            if (existingCity) {
                const availableProperties = await Property.countDocuments({
                    $or: [
                        { locationDetails: { $regex: city, $options: 'i' } },
                        { description: { $regex: city, $options: 'i' } }
                    ]
                });

                await City.updateOne(
                    { cityName: new RegExp(`^${city}$`, 'i') },
                    { availableProperties }
                );
            }
        }

        res.status(201).json({ message: 'Property added and city counts updated', propertyNumber: nextPropertyNumber });
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Invalid or empty ID list" });
        }

        const properties = await Property.find({ _id: { $in: ids } });

        if (!properties.length) {
            return res.status(404).json({ error: "No matching properties found" });
        }

        const imagePaths = properties.flatMap(property => property.imageUrls || []);

        imagePaths.forEach(imageUrl => {
            const localImagePath = path.join(process.cwd(), imageUrl);
            fs.unlink(localImagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${localImagePath}`, err);
                }
            });
        });

        await Property.deleteMany({ _id: { $in: ids } });

        const citiesFromProperties = properties.flatMap(property => {
            const citiesFromLocation = property.locationDetails ? property.locationDetails.split(',').map(city => city.trim()) : [];
            const citiesFromDescription = property.description ? property.description.split(/,\s*/).map(city => city.trim()) : [];
            return Array.from(new Set([...citiesFromLocation, ...citiesFromDescription]));
        });

        for (const city of citiesFromProperties) {
            const availableProperties = await Property.countDocuments({
                $or: [
                    { locationDetails: { $regex: city, $options: 'i' } },
                    { description: { $regex: city, $options: 'i' } }
                ]
            });

            await City.updateOne(
                { cityName: new RegExp(`^${city}$`, 'i') },
                { availableProperties }
            );
        }

        res.status(200).json({ message: "Properties and images deleted successfully, city counts updated" });

    } catch (error) {
        console.error("Error deleting properties:", error.message);
        res.status(500).json({ error: "Failed to delete properties" });
    }
};

export const editProperty = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Property ID:", id);

        const {
            propertyType, fullName, phoneNumber, propertyName, numOfRooms,
            numOfToilets, locationDetails, plotSize, budget, rentalType,
            commercialType, numOfBedRooms, description, villaRooms, removedImages
        } = req.body;
        const files = req.files;

        console.log("Request Body:", req.body);
        console.log("Files:", files);

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found");
            return res.status(404).json({ error: "Property not found" });
        }

        console.log("Existing Property Data:", property);

        let existingImageUrls = property.imageUrls || [];
        console.log("Existing Image URLs:", existingImageUrls);

        const normalizedRemovedImages = JSON.parse(removedImages || "[]").map(url => {
            return url.replace(/^http:\/\/localhost:5000\//, '').replace(/\\/g, '/');
        });
        console.log("Normalized Removed Images:", normalizedRemovedImages);

        existingImageUrls = existingImageUrls.filter(url => !normalizedRemovedImages.includes(url));
        console.log("Updated Existing Image URLs after Removal:", existingImageUrls);

        const newImageUrls = files.map(file => path.join("uploads", "properties", file.filename).replace(/\\/g, "/"));
        console.log("New Image URLs:", newImageUrls);

        property.imageUrls = [...new Set([...existingImageUrls, ...newImageUrls])];
        console.log("Final Image URLs:", property.imageUrls);

        property.propertyType = propertyType || property.propertyType;
        property.fullName = fullName || property.fullName;
        property.phoneNumber = phoneNumber || property.phoneNumber;
        property.propertyName = propertyName || property.propertyName;
        property.numOfRooms = numOfRooms ? parseInt(numOfRooms, 10) : property.numOfRooms;
        property.numOfToilets = numOfToilets ? parseInt(numOfToilets, 10) : property.numOfToilets;
        property.locationDetails = locationDetails || "";
        property.plotSize = plotSize || property.plotSize;
        property.budget = budget || property.budget;
        property.description = description || "";
        property.numOfBedRooms = numOfBedRooms ? parseInt(numOfBedRooms, 10) : property.numOfBedRooms;
        property.rentalType = rentalType || property.rentalType;
        property.commercialType = commercialType || property.commercialType;
        property.villaRooms = villaRooms || property.villaRooms;

        console.log("Updated Property Data:", property);

        await property.save();
        console.log("Property Saved");

        const citiesFromLocation = locationDetails ? locationDetails.split(",").map(city => city.trim()) : [];
        console.log("Cities from Location Details:", citiesFromLocation);

        const citiesFromDescription = description ? description.split(/,\s*/).map(city => city.trim()) : [];
        console.log("Cities from Description:", citiesFromDescription);

        const allCities = [...new Set([...citiesFromLocation, ...citiesFromDescription])];
        console.log("All Cities:", allCities);

        for (const city of allCities) {
            console.log("Processing City:", city);

            const availableProperties = await Property.countDocuments({
                $or: [
                    { locationDetails: { $regex: city, $options: "i" } },
                    { description: { $regex: city, $options: "i" } }
                ]
            });
            console.log("Available Properties for City:", city, availableProperties);

            await City.updateOne(
                { cityName: new RegExp(`^${city}$`, "i") },
                { availableProperties }
            );
            console.log("City Updated:", city);
        }

        res.json({ message: "Property updated and city counts recalculated" });
    } catch (err) {
        console.error("Error updating property:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getPropertyByCity = async (req, res) => {
    const { cityName } = req.params;
    console.log(`Received cityName: ${cityName}`);
  
    try {
      const properties = await Property.find({
        $or: [
          { "locationDetails": { $regex: cityName, $options: "i" } },
          { "description": { $regex: cityName, $options: "i" } }
        ]
      });
  
      console.log("Query result:", properties);
      res.json(properties);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  };