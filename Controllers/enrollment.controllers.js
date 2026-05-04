const Course = require("../Models/course");
const Enrollment = require("../Models/enrollment");
exports.createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Please provide course id" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const existEnrollment = await Enrollment.findOne({
      course: courseId,
      user: req.user.id,
    });
    if (existEnrollment) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }
    const enrollment = new Enrollment({
      course: courseId,
      user: req.user.id,
    });
    await enrollment.save();
    return res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// export const getEnrollments = async (req, res) => {
//   try {
//     const enrollments = await Enrollment.find({ user: req.user.id }).populate(
//       "course",
//     );
//     return res.status(200).json({ enrollments });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
