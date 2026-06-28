const Payment = require("../Models/payment");
const cloudinary = require("../Utils/cloudinary");
const Enrollment = require("../Models/enrollment");
const Notification = require("../Models/notification");
const User = require("../Models/user");
const Course = require("../Models/course");
exports.createPayment = async (req, res) => {
  try {
    const { courseId, phoneNumber, paymentMethod, paymentProof } = req.body;
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You are already enrolled in this course",
      });
    }
    const existingPendingPayment = await Payment.findOne({
      student: req.user.id,
      course: courseId,
      status: "pending",
    });

    if (existingPendingPayment) {
      return res.status(400).json({
        message:
          "You already submitted a payment for this course. Please wait for approval.",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(paymentProof, {
      folder: "payments",
    });
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const payment = new Payment({
      student: req.user.id,
      course: courseId,
      phoneNumber,
      paymentMethod,
      paymentProof: uploadedImage.secure_url,
    });

    await payment.save();
    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "New Payment",
        message: `${req.user.name} submitted a payment for ${course.title}`,
        type: "payment",
      });
    }
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
      .populate({
        path: "course",
        select: "title imageUrl price category rating lessonsCount instructor",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .select("-paymentProof")
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
    const course = await Course.findById(payment.course);
    await Notification.create({
      user: payment.student,
      title: "Payment Approved",
      message: `Your payment for "${course.title}" has been approved.`,
      type: "payment",
    });
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
    const course = await Course.findById(payment.course);
    await Notification.create({
      user: payment.student,
      title: "Payment Rejected",
      message: `Your payment for "${course.title}" has been rejected.`,
      type: "payment",
    });
    return res.status(200).json({
      message: "Payment rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
