const Course = require("../Models/course");
const Enrollment = require("../Models/enrollment");
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, isFree } = req.body;
    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ message: "Please provide Title , description and price" });
    }
    const newCourse = new Course({
      title,
      description,
      price: isFree ? 0 : price,
      isFree: isFree ? true : false,
      instructor: req.user.id,
    });
    await newCourse.save();
    return res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide course id" });
    }
    const course = await Course.findById(id).populate("instructor", "name");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({ course });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user.id,
    })
      .populate("course", "title price description instructor")
      .sort({ createdAt: -1 });
    return res.status(200).json({ enrollments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
