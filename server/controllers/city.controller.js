import City from "../models/city.model.js"
import path from 'path';
import Property from "../models/property.model.js";
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCity = async (req, res) => {
    try {
        const cities = await City.find({}).sort({ updatedDate: -1 });
        res.status(200).json({cities});
    } catch (error) {
        console.log("Error in getCity controller", error.message);
        res.status(500).json({message : "Inernal server error"});
    }
}

export const addCity = async (req, res) => {
    const { cityName } = req.body;
    const file = req.file;

    if (!file) {
        console.log('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        console.log('Received city name:', cityName);
        console.log('Uploaded file:', file);

        const imageUrl = path.normalize(path.join('uploads', 'cities', file.filename)).replace(/\\/g, '/');
        console.log('Image URL:', imageUrl);

        const availableProperties = await Property.countDocuments({
            $or: [
                { locationdetails: { $regex: cityName, $options: 'i' } },
                { description: { $regex: cityName, $options: 'i' } }
            ]
        });
        console.log('Available properties count:', availableProperties);

        const newCity = new City({
            cityName,
            availableProperties,
            imageUrl,
            updatedDate: new Date()
        });

        console.log('New city object:', newCity);

        await newCity.save();
        console.log('City added successfully');

        res.status(201).json({ message: 'City added successfully' });
    } catch (err) {
        console.error("Error in addCity controller", err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCityCount = async (req, res) => {
    try {
        const count = await City.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.log("Error in getCityCount controller", error.message);
        res.status(500).json({message : "Inernal server error"});
    }
}

export const deleteCity = async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No IDs provided' });
    }

    try {
        const cities = await City.find({ _id: { $in: ids } });

        for (const city of cities) {
            const imageUrl = city.imageUrl;

            if (imageUrl) {
                const fileName = path.basename(imageUrl);
                const filePath = path.join(__dirname, '..', 'uploads', 'cities', fileName);

                console.log("Attempting to delete file at path:", filePath);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); 
                    console.log("File deleted:", filePath);
                } else {
                    console.warn("Image file not found at path:", filePath);
                }
            } else {
                console.warn("No image URL found for city:", city);
            }
        }

        await City.deleteMany({ _id: { $in: ids } });

        res.status(200).send('Cities deleted successfully');
    } catch (error) {
        console.error("Error deleteCity Controller", error.message);
        res.status(500).send('Server error');
    }
};

export const editCity = async (req, res) => {
    const { id } = req.params;
    const { cityName } = req.body;
    const file = req.file;

    console.log("Received cityName:", cityName);
    console.log("Received req.body:", req.body);
    
    
    

    try {
        const availableProperties = await Property.countDocuments({
            $or: [
                { locationdetails: { $regex: cityName, $options: 'i' } },
                { description: { $regex: cityName, $options: 'i' } }
            ]
        });

        const city = await City.findById(id);

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        city.cityName = cityName;
        city.availableProperties = availableProperties;

        if (file) {
            const fileName = path.basename(file.filename);
            const filePath = path.join('uploads', 'cities', fileName).replace(/\\/g, '/');

            if (city.imageUrl) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', 'cities', path.basename(city.imageUrl));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            city.imageUrl = filePath;
        }

        await city.save();

        res.status(200).json({ message: 'City updated successfully' });
    } catch (err) {
        console.error("Error in editCity controller", err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};