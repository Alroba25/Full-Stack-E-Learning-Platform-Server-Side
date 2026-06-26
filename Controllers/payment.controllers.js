const Payment = require("../Models/payment");
const cloudinary = require("../Utils/cloudinary");
const Enrollment = require("../Models/enrollment");
exports.createPayment = async (req, res) => {
  try {
    const { courseId, phoneNumber, paymentMethod, paymentProof } = req.body;
    const uploadedImage = await cloudinary.uploader.upload(paymentProof, {
      folder: "payments",
    });
    const payment = new Payment({
      student: req.user.id,

      course: courseId,

      phoneNumber,

      paymentMethod,

      paymentProof: uploadedImage.secure_url,
    });

    await payment.save();

    return res.status(201).json({
      success: true,
      message: "Payment Submitted Successfully And Is Pending Approval",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate("course", "title imageUrl price")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.getAdminOrders = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("course", "title imageUrl price")
      .populate("student", "name email image")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.approvePayment = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }
    if (payment.status === "approved") {
      return res.status(400).json({
        message: "Payment is already approved",
      });
    }
    const existingEnrollment = await Enrollment.findOne({
      user: payment.student,
      course: payment.course,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        message: "Student is already enrolled in this course",
      });
    }
    payment.status = "approved";
    const enrollment = new Enrollment({
      user: payment.student,
      course: payment.course,
    });
    await enrollment.save();
    await payment.save();
    return res.status(200).json({
      message: "Payment approved and student enrolled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.rejectPayment = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }
    if (payment.status === "rejected") {
      return res.status(400).json({
        message: "Payment is already rejected",
      });
    }
    payment.status = "rejected";
    await payment.save();
    return res.status(200).json({
      message: "Payment rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
