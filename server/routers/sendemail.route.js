import express from "express";
import { sendEmail } from "../controllers/sendemail.controller.js";

const router = express.Router();

router.post('/', sendEmail);

export default router;