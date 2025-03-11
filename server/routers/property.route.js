import express from "express";
import { addProperty, deleteProperty, editProperty, getProperties, getPropertiesCount, getPropertyByCity } from "../controllers/property.controller.js";
import { uploadPropertyImages } from "../lib/multer.js";

const router = express.Router();

router.get('/', getProperties);
router.delete('/', deleteProperty);
router.get('/count', getPropertiesCount);
router.post('/', uploadPropertyImages, addProperty);
router.put('/:id', uploadPropertyImages, editProperty);
router.get('/city/:cityName', getPropertyByCity);

export default router;