const express = require("express");

const router = express.Router();

const authController = require("../controller/authController");

const {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
    getStudents,
    getInstructors,
    assignInstructor,
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../controller/adminController");

const {
    createUserValidator,
    updateUserValidator,
} = require("../utils/validators/userValidator");

// Admin
router.use(authController.protect);
router.use(authController.allowedTo("admin"));

// Coureses
router.route("/courses").get(getCourses).post(createCourse);
router
    .route("/courses/:id")
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

// Users
router.route("/users").get(getUsers).post(createUserValidator, createUser);
router.route("/users/:id").get(getUser).put(updateUser).delete(deleteUser);

// Students
router.route("/students").get(getStudents);

// Instructors
router.route("/instructors").get(getInstructors);
router.route("/courses/:courseId/assign").post(assignInstructor);

module.exports = router;
