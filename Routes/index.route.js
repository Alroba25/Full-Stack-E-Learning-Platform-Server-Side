const express = require("express");
const router = express.Router();
const {
  studentRegister,
  instructorRegister,
  loginUser,
  getUserProfile,
} = require("../Controllers/user.controllers");
const {
  createCourse,
  getCourses,
  getCourseById,
  getMyCourses,
  getInstructorCourses,
  deleteCourse,
  getCourseStudents,
} = require("../Controllers/course.controllers");
const {
  createLesson,
  getLessons,
  markLessonCompleted,
} = require("../Controllers/lesson.controllers");
const { createEnrollment } = require("../Controllers/enrollment.controllers");
const { authCheck } = require("../Auth/index");
const { roleMiddleware } = require("../Middleware/index");
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
module.exports = router;
