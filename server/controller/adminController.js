const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const connection = require("../database/dbConnection");
const ApiError = require("../utils/apiError");

//=========================  Courses  ================================//

/**
 *  @description Get list of courses
 *  @route       GET /api/v1/admin/courses
 *  @access      Private/Admin/
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
    // Get the connection object
    const conn = await connection();

    const query = `select * from courses`;
    const [coruses] = await conn.query(query);

    res.status(200).json({ results: coruses.length, data: coruses });
});

/**
 *  @description Get Course
 *  @route       GET /api/v1/admin/courses/:id
 *  @access      Private/Admin
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { id } = req.params;
    const query = `SELECT * FROM courses WHERE id = ${id}`;
    const [course] = await conn.query(query);
    if (!course[0]) {
        return next(new ApiError(`No Course with this id ${id}`, 404));
    }

    res.status(200).json({ data: course[0] });
});

/**
 *  @description Create Course
 *  @route       POST /api/v1/admin/courses
 *  @access      Private/Admin
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { name, code, status } = req.body;
    const query = `INSERT INTO courses (name, code, status) VALUES ('${name}', '${code}', '${status}')`;

    await conn.query(query);

    res.status(201).json({ message: "Course created successfully" });
});

/**
 *  @description Update Course
 *  @route       PUT /api/v1/admin/courses/:id
 *  @access      Private/Admin
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { id } = req.params;
    const { name, code, status } = req.body;

    const query = `UPDATE courses SET name = '${name}', code = '${code}', status = '${status}' WHERE id = ${id}`;
    const [result] = await conn.query(query);

    if (result.affectedRows === 0) {
        return next(new ApiError(`Course with ID ${id} not found`, 404));
    }
    res.status(200).json({ message: "Course updated successfully" });
});

/**
 *  @description Delete Course
 *  @route       DELETE /api/v1/admin/courses/:id
 *  @access      Private/Admin
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { id } = req.params;
    const query = `DELETE FROM courses WHERE id = ${id}`;
    const [result] = await conn.query(query);
    if (result.affectedRows === 0) {
        return next(new ApiError(`Course with ID ${id} not found`, 404));
    }
    res.status(204).send();
});

//=========================//  Courses  //================================//

//=========================  Users  ================================//

/**
 *  @description Get list of users
 *  @route       GET /api/v1/admin/users
 *  @access      Private/Admin/
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const query = `select * from users`;
    const [user] = await conn.query(query);

    res.status(200).json({ results: user.length, data: user });
});

/**
 *  @description Get User
 *  @route       GET /api/v1/admin/users/:id
 *  @access      Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = ${id}`;
    const [user] = await conn.query(query);
    if (!user[0]) {
        return next(new ApiError(`No user for this id ${id}`, 404));
    }

    res.status(200).json({ data: user[0] });
});

/**
 *  @description Create user
 *  @route       POST /api/v1/admin/users
 *  @access      Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { status, email, phone, type } = req.body;
    let { password } = req.body;

    password = await bcrypt.hash(password, 5);

    const query = `INSERT INTO users (status, password, email, phone, type) VALUES ('${status}', '${password}', '${email}', '${phone}', '${type}')`;

    await conn.query(query);
    res.status(201).json({ message: "user created successfully" });
});

/**
 *  @description Update Course
 *  @route       PUT /api/v1/admin/users/:id
 *  @access      Private/Admin
 */

exports.updateUser = asyncHandler(async (req, res, next) => {
    const conn = await connection();
    console.log("i am here...");
    const { id } = req.params;
    const { status, email, phone } = req.body;

    let { password } = req.body;

    password = await bcrypt.hash(password, 5);
    const query = `UPDATE users SET status = '${status}', password = '${password}', email = '${email}', phone = '${phone}' WHERE id = ${id}`;
    const [result] = await conn.query(query);

    if (result.affectedRows === 0) {
        return next(new ApiError(`User with ID ${id} not found`, 404));
    }
    res.status(200).json({ message: "User updated successfully" });
});

/**
 *  @description Delete Course
 *  @route       DELETE /api/v1/admin/users/:id
 *  @access      Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { id } = req.params;
    const query = `DELETE FROM users WHERE id = ${id}`;
    const [result] = await conn.query(query);
    if (result.affectedRows === 0) {
        return next(new ApiError(`User with ID ${id} not found`, 404));
    }
    res.status(204).send();
});

//=========================//  Users  //================================//

// =========================  Students  ================================//

/**
 *  @description Get list of Students
 *  @route       GET /api/v1/admin/students
 *  @access      Private/Admin
 */
exports.getStudents = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const query = `SELECT * FROM users WHERE type = 'student'`;
    const [student] = await conn.query(query);

    res.status(200).json({ results: student.length, data: student });
});
// =========================//  Students  //================================//

// =========================  Instructor  ================================//

/**
 *  @description Get list of Instructor
 *  @route       GET /api/v1/admin/Instructor
 *  @access      Private/Admin
 */
exports.getInstructors = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const query = `SELECT * FROM users WHERE type = 'instructor'`;
    const [studnet] = await conn.query(query);

    res.status(200).json({ results: studnet.length, data: studnet });
});

/**
 *  @description Assign Instructor To a course
 *  @route       POST /api/v1/admin/courses/:id/assign
 *  @access      Private/Admin
 */

exports.assignInstructor = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const { instructorId } = req.body;

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

    // Insert the instructor-course assignment
    query = `INSERT INTO instructor_course (instructor_id, course_id) VALUES (${instructorId}, ${courseId})`;
    await conn.query(query);
    return res.status(200).json({ message: "Instructor assigned to course" });
});
// =========================//  Instructor  //================================//
