const express = require("express");

const router = express.Router();

const authController = require("../controller/authController");

const {
    getAvailableCourses,
    registerCourse,
    GetMyGrades,
} = require("../controller/studentController");

// Student
router.use(authController.protect);
router.use(authController.allowedTo("student"));

// Coureses
router.get("/courses", getAvailableCourses);
router.get("/grades", GetMyGrades);
router.post("/courses/:courseId/register", registerCourse);

module.exports = router;
