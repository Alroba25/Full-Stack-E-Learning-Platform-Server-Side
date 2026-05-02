const Lesson = require("../Models/leasson");
const Course = require("../Models/course");
const Enrollment = require("../Models/enrollment");
exports.createLesson = async (req, res) => {
  try {
    const { title, type, videoUrl, content, order } = req.body;
    if (!title || !type || (!videoUrl && !content) || !order) {
      return res.status(400).json({
        message: "Please provide title, type, order and (videoUrl or content)",
      });
    }
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Please provide course id" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to add lessons to this course",
      });
    }
    const newLesson = new Lesson({
      title,
      type,
      videoUrl,
      content,
      order,
      course: courseId,
    });
    await newLesson.save();
    return res
      .status(201)
      .json({ message: "Lesson created successfully", lesson: newLesson });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Please provide course id" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
    return res.status(200).json({ lessons });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.markLessonCompleted = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!lessonId) {
      return res.status(400).json({ message: "Lesson id is required" });
    }
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: lesson.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }
    if (enrollment.completedLessons.includes(lessonId)) {
      return res.status(400).json({
        message: "Lesson already completed",
      });
    }

    enrollment.completedLessons.push(lessonId);

    const totalLessons = await Lesson.countDocuments({
      course: lesson.course,
    });

    enrollment.progress =
      (enrollment.completedLessons.length / totalLessons) * 100;

    await enrollment.save();

    return res.status(200).json({
      message: "Lesson marked as completed",
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
