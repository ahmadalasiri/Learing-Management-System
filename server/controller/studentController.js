const asyncHandler = require("express-async-handler");

const connection = require("../database/dbConnection");
const ApiError = require("../utils/apiError");

/**
 *  @description Get available courses
 *  @route       POST /api/v1/student/courses
 *  @access      Private/student
 */
exports.getAvailableCourses = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const query = `SELECT * FROM courses WHERE status = 'active'`;

    const [courses] = await conn.query(query);

    res.status(200).json({ result: courses.length, data: courses });
});

/**
 *  @description Get my grades
 *  @route       POST /api/v1/student/grades
 *  @access      Private/student
 */

exports.GetMyGrades = asyncHandler(async (req, res, next) => {
    const studentId = req.user.id;

    // Get the connection object
    const conn = await connection();

    // Check if the student exists
    query = `SELECT * FROM users WHERE id = ${studentId} AND type = 'student'`;
    const [studentRows] = await conn.query(query);
    if (!studentRows[0]) {
        return next(
            new ApiError(`There is no student with this id  ${studentId}`, 404)
        );
    }

    // Retrieve the grades
    query = `SELECT courses.*, student_course.grade FROM courses INNER JOIN student_course ON student_course.course_id = courses.id
    WHERE student_course.student_id = ${studentId}`;
    const [grades] = await conn.query(query);

    return res.status(200).json(grades);
});

/**
 *  @description Register for a course
 *  @route       POST /api/v1/student/courses/:id/register
 *  @access      Private/student
 */
exports.registerCourse = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Get the connection object
    const conn = await connection();

    // Check if the course exists
    let query = `SELECT * FROM courses WHERE id = ${courseId}`;
    const [courseRows] = await conn.query(query);
    if (!courseRows[0]) {
        return next(
            new ApiError(`There is no course with this id  ${courseId}`, 404)
        );
    }

    // Check if the student exists
    query = `SELECT * FROM users WHERE id = ${studentId} AND type = 'student'`;
    const [studentRows] = await conn.query(query);
    if (!studentRows[0]) {
        return next(
            new ApiError(`There is no student with this id  ${studentId}`, 404)
        );
    }

    // Insert the student-course assignment
    query = `INSERT INTO student_course  (student_id, course_id) VALUES (${studentId}, ${courseId})`;
    await conn.query(query);
    return res
        .status(200)
        .json({ message: `Course registration successful. ID: ${studentId}` });
});
