const Course = require("../Models/course");
const Enrollment = require("../Models/enrollment");
const Lesson = require("../Models/leasson");
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      isFree,
      lessons,
      imageUrl,
      category,
      level,
    } = req.body;
    if (!title || !description || (!isFree && price === null)) {
      return res
        .status(400)
        .json({ message: "Please provide title , description and price" });
    }
    const newCourse = new Course({
      title,
      description,
      price: isFree ? 0 : price,
      isFree: isFree ? true : false,
      instructor: req.user.id,
      imageUrl,
      category,
      level,
    });
    const newLessons = lessons.map((lesson) => ({
      ...lesson,
      course: newCourse._id,
    }));
    await Lesson.insertMany(newLessons);
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
    const { category, level, rating, sort } = req.query;

    let filter = {};

    if (category) {
      filter.category = {
        $in: category.split(","),
      };
    }

    if (level) {
      filter.level = {
        $in: level.split(","),
      };
    }

    if (rating) {
      filter.rating = {
        $gte: Number(rating),
      };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price-low") {
      sortOption = { price: 1 };
    }

    if (sort === "price-high") {
      sortOption = { price: -1 };
    }

    if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name")
      .sort(sortOption);

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });
    console.log(enrollments);

    return res.status(200).json({ enrollments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getInstructorCourses = async (req, res) => {
  const courses = await Course.find({ instructor: req.user.id });
  res.json({ courses });
};
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide course id" });
    }
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getCourseStudents = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.id,
    });
    const courseIds = courses.map((course) => course._id);
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    }).populate("user", "name email image");

    return res.status(200).json({
      students: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
