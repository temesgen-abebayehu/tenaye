import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createAppointment, deleteAppointment, getAppointment, getAppointments, updateAppointment } from '../controllers/appointment.controller.js';


const router = express.Router();

router.post('/',protectRoute, createAppointment);
router.get('/:id', protectRoute, getAppointment);
router.get('/', protectRoute, getAppointments);
router.put('/:id',protectRoute, updateAppointment);
router.delete('/:id',protectRoute, deleteAppointment);

export default router;