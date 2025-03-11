import express from "express";
import { addCity, deleteCity, editCity, getCity, getCityCount } from "../controllers/city.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadCityImage } from "../lib/multer.js";

const router = express.Router();

router.get("/", getCity);
router.post('/', uploadCityImage, addCity);
router.get("/count", getCityCount);
router.delete("/", deleteCity);
router.put("/:id", uploadCityImage, editCity);

export default router;