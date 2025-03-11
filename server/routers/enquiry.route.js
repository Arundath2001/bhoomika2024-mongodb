import express from "express";
import { addEnquiry, deleteEnquiry, getEnquiry, getEnquiryCount } from "../controllers/enquiry.controller.js";
import { uploadCityImage } from "../lib/multer.js";

const router = express.Router();

router.get('/', getEnquiry);
router.post('/', uploadCityImage,  addEnquiry);
router.delete('/', deleteEnquiry);
router.get('/count', getEnquiryCount )

export default router;