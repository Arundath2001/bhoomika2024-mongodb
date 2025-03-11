import express from "express";
import { deleteVisit, getVisitSchedule, getVisitScheduleCount, scheduleVisit } from "../controllers/visitschedule.controller.js";

const router = express.Router();

router.get('/', getVisitSchedule);
router.post('/', scheduleVisit);
router.delete('/', deleteVisit);
router.get('/count', getVisitScheduleCount);

export default router;