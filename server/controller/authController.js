const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const connection = require("../database/dbConnection");

/**
 *  @description   Signup
 *  @route         GET /api/v1/auth/signup
 *  @access        Public
 */
exports.signup = asyncHandler(async (req, res, next) => {
    const conn = await connection();
    const { email, phone } = req.body;
    let { password } = req.body;

    password = await bcrypt.hash(password, 5);

    // 1- Create user
    const query = `INSERT INTO users (password, email, phone) VALUES ( '${password}', '${email}', '${phone}')`;
    const [user] = await conn.query(query);

    // 2- Generate token
    const token = createToken(user.insertId);

    res.status(201).json({ message: "user created successfully", token });
});

/**
 *  @description   Login
 *  @route         GET /api/v1/auth/login
 *  @access        Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const [user] = await conn.query(query);

    if (!user[0] || !(await bcrypt.compare(password, user[0].password))) {
        return next(new ApiError(`Incorrect email or password`, 401));
    }
    //  Generate token
    const token = createToken(user[0].id);

    res.status(200).json({ data: user, token });
});

/**
 *  @description   make sure the user is logged in
 */
exports.protect = asyncHandler(async (req, res, next) => {
    const conn = await connection();

    // 1- Check if token exist
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split("  ")[1];
    }

    if (token === "null") {
        return next(
            new ApiError(
                `You are not authorized, you must login to get access this route`,
                401
            )
        );
    }

    // 2- Verify that the token has not changed
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3- Check if the user still exists
    const query = `SELECT * FROM users WHERE id = '${decoded.userId}'`;
    const [user] = await conn.query(query);
    if (!user[0]) {
        return next(
            new ApiError(
                "The user that belongs to this token no longer exists",
                401
            )
        );
    }

    req.user = user[0];
    next();
});

// Authorization (user permissions)
// ["admin", "manager",  "student"]
exports.allowedTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.type)) {
            return next(
                new ApiError("You are not allowed to access this route", 403)
            );
        }
        next();
    };
