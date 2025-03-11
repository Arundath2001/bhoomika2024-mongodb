import express from "express";
import { addSellingData, deleteSellingInfo, getSellingInfo, getSellingInfoCount } from "../controllers/sellinginfo.controller.js";
import { uploadSellingImages } from "../lib/multer.js";

const router = express.Router();

router.get('/', getSellingInfo);
router.post('/', uploadSellingImages, addSellingData);
router.delete('/', deleteSellingInfo);
router.get('/count', getSellingInfoCount);

export default router;