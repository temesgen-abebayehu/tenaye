import Appointment from '../models/Appointment.model.js';


export const createAppointment = async (req, res) => {
    const { doctor, appointmentType, phoneNumber, email, date, time } = req.body;
    
    try {
      // Verify that req.user is set by protectRoute (authenticated user)
      const existingPatient = req.user;
  
      if (!existingPatient) {
        return res.status(404).json({ message: "User not found." });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          setErrorMessage("Please enter a valid email address.");
          setIsSubmitting(false);
          return;
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
          setErrorMessage("Please enter a valid 10-digit phone number.");
          setIsSubmitting(false);
          return;
      }
  
      // Create a new appointment with patient info from req.user
      const newAppointment = new Appointment({
        doctor,
        patientName: existingPatient.fullName,
        phoneNumber,
        email,
        createdBy: existingPatient._id,
        appointmentType,
        date,
        time,
      });
  
      await newAppointment.save();
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error(`Error in createAppointment: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({createdBy: req.user._id});
        res.status(200).json(appointments);
    } catch (error) {
        console.log(`Error in getAppointments: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

export const getAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findById({createdBy: req.user._id, _id: id});
        res.status(200).json(appointment);
    } catch (error) {
        console.log(`Error in getAppointment: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.log(`Error in updateAppointment: ${error.message}`);
        res.status(409).json({ message: error.message });
    }
};

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await Appointment.findByIdAndDelete(id);
        res.status(200).json({ message: "Appointment deleted successfully." });
    } catch (error) {
        console.log(`Error in deleteAppointment: ${error.message}`);
        res.status(409).json({ message: error.message });
    }
};