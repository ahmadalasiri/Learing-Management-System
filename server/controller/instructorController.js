const asyncHandler = require("express-async-handler");

const connection = require("../database/dbConnection");
const ApiError = require("../utils/apiError");

/**
 *  @description Get available courses
 *  @route       POST /api/v1/student/courses
 *  @access      Private/student
 */
exports.getStudentEnrolledInCourse = asyncHandler(async (req, res, next) => {
    const conn = await connection();
    const { courseId } = req.params;
    const { instructorId } = req.body;

    // Check if the course exists
    let query = `SELECT * FROM courses WHERE id = ${courseId}`;
    const [courseRows] = await conn.query(query);
    if (!courseRows[0]) {
        return next(
            new ApiError(`There is no course with this id  ${courseId}`, 404)
        );
    }

    // Check if the student exists
    query = `SELECT * FROM users WHERE id = ${instructorId} AND type = 'instructor'`;
    const [instructorRows] = await conn.query(query);
    if (!instructorRows[0]) {
        return next(
            new ApiError(
                `There is no instructor with this id  ${instructorId}`,
                404
            )
        );
    }

    query = `
    SELECT users.id, users.email, users.phone, student_course.grade, student_course.course_id, instructor_course.instructor_id
    FROM student_course
    JOIN users ON student_course.student_id = users.id
    JOIN instructor_course ON student_course.course_id = instructor_course.course_id
    WHERE instructor_course.instructor_id = ${instructorId} AND instructor_course.course_id = ${courseId}

    `;
    const [rows] = await conn.query(query);
    res.status(200).json({ result: rows.length, data: rows });
});

/**
 *  @description Set Grades for students
 *  @route       POST /api/v1/instructor/courses/:id/students/:studentId/grads
 *  @access      Private/instructor
 */
exports.setGradesForStudent = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { courseId, studentId } = req.params;
    const { instructorId, grade } = req.body;

    // Check if the student exists
    let query = `SELECT * FROM users WHERE id = ${studentId} AND type = 'student'`;
    const [studentRows] = await conn.query(query);
    if (!studentRows[0]) {
        return next(
            new ApiError(`There is no student with this id  ${studentId}`, 404)
        );
    }
    // Check if the course exists
    query = `SELECT * FROM courses WHERE id = ${courseId}`;
    const [courseRows] = await conn.query(query);
    if (!courseRows[0]) {
        return next(
            new ApiError(`There is no course with this id  ${courseId}`, 404)
        );
    }

    // Check if the instructor exists
    query = `SELECT * FROM users WHERE id = ${instructorId} AND type = 'instructor'`;
    const [instructorRows] = await conn.query(query);
    if (!instructorRows[0]) {
        return next(
            new ApiError(
                `There is no instructor with this id  ${instructorId}`,
                404
            )
        );
    }

    // Set Grades for students
    query = `
    UPDATE student_course
    JOIN instructor_course ON student_course.course_id = instructor_course.course_id
    SET student_course.grade = ${grade}
    WHERE instructor_course.instructor_id = ${instructorId} AND instructor_course.course_id = ${courseId} AND student_course.student_id = ${studentId}
    `;
    await conn.query(query);
    return res.status(200).json({ message: `Grade set successfully` });
});
