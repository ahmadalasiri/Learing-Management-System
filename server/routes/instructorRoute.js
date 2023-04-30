const express = require("express");

const router = express.Router();

const authController = require("../controller/authController");

const {
    getStudentEnrolledInCourse,
    setGradesForStudent,
    getCourses,
} = require("../controller/instructorController");

// Instructor
router.use(authController.protect);
router.use(authController.allowedTo("instructor"));

// Coureses
router.get("/courses/:courseId/students", getStudentEnrolledInCourse);
router.get("/courses", getCourses);
router.post(
    "/courses/:courseId/students/:studentId/grads",
    setGradesForStudent
);

module.exports = router;
