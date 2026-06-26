const express = require("express");
const router = express.Router();
const {
  studentRegister,
  instructorRegister,
  loginUser,
  getUserProfile,
  getAllUsersByAdmin,
  toggleAdmin,
  deleteUserByAdmin,
} = require("../Controllers/user.controllers");
const {
  createCourse,
  getCourses,
  getCourseById,
  getMyCourses,
  getInstructorCourses,
  deleteCourse,
  getCourseStudents,
  getCourseByAdmin,
  deleteCourseByAdmin,
} = require("../Controllers/course.controllers");
const {
  createLesson,
  getLessons,
  markLessonCompleted,
} = require("../Controllers/lesson.controllers");
const {
  createPayment,
  getStudentPayments,
  getAdminOrders,
  approvePayment,
  rejectPayment,
} = require("../Controllers/payment.controllers");
const { createEnrollment } = require("../Controllers/enrollment.controllers");
const { authCheck } = require("../Auth/index");
const { roleMiddleware } = require("../Middleware/index");
const {
  chatWithAI,
  getChatHistory,
  clearChatHistory,
} = require("../Controllers/ai.controllers");
// User Routes
router.get("/profile", authCheck, getUserProfile);
// Student Routes
router.post("/register", studentRegister);
// Instructor Routes
router.post("/register/instructor", instructorRegister);
router.get(
  "/instructor-courses",
  authCheck,
  roleMiddleware("instructor"),
  getInstructorCourses,
);
router.delete(
  "/instructor-course/:id",
  authCheck,
  roleMiddleware("instructor"),
  deleteCourse,
);
router.get(
  "/instructor-courses-users",
  authCheck,
  roleMiddleware("instructor"),
  getCourseStudents,
);
// Login Routes
router.post("/login", loginUser);
// Course Routes
router.post("/course", authCheck, roleMiddleware("instructor"), createCourse);
router.get("/courses", authCheck, getCourses);
router.get("/course/:id", authCheck, getCourseById);
router.get("/my-courses", authCheck, getMyCourses);
// Lesson Routes
router.post(
  "/course/:courseId/lessons",
  authCheck,
  roleMiddleware("instructor"),
  createLesson,
);
router.patch(
  "/lesson/:lessonId/complete",
  authCheck,
  roleMiddleware("student"),
  markLessonCompleted,
);
//Student Enrollment Routes
router.post(
  "/enroll/:courseId",
  authCheck,
  roleMiddleware("student"),
  createEnrollment,
);
//Get Course Lessons
router.get("/course/:courseId/lessons", authCheck, getLessons);
// AI Chat Route
router.post("/ai/chat", authCheck, chatWithAI);
router.get("/ai/history", authCheck, getChatHistory);
router.delete("/ai/history", authCheck, clearChatHistory);
// Payment Routes
router.post("/payment", authCheck, roleMiddleware("student"), createPayment);
router.get(
  "/my-orders",
  authCheck,
  roleMiddleware("student"),
  getStudentPayments,
);
// Admin Routes
router.get(
  "/admin/payments",
  authCheck,
  roleMiddleware("admin"),
  getAdminOrders,
);
router.patch(
  "/admin/payments/:paymentId/approve",
  authCheck,
  roleMiddleware("admin"),
  approvePayment,
);
router.patch(
  "/admin/payments/:paymentId/reject",
  authCheck,
  roleMiddleware("admin"),
  rejectPayment,
);
router.get(
  "/admin/courses",
  authCheck,
  roleMiddleware("admin"),
  getCourseByAdmin,
);
router.delete(
  "/admin/courses/:id",
  authCheck,
  roleMiddleware("admin"),
  deleteCourseByAdmin,
);
router.get(
  "/admin/users",
  authCheck,
  roleMiddleware("admin"),
  getAllUsersByAdmin,
);
router.patch(
  "/admin/users/:userId/toggle-admin",
  authCheck,
  roleMiddleware("admin"),
  toggleAdmin,
);
router.delete(
  "/admin/users/:userId",
  authCheck,
  roleMiddleware("admin"),
  deleteUserByAdmin,
);
module.exports = router;
