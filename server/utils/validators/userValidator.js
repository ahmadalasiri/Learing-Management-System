const { check } = require("express-validator");

const connection = require("../../database/dbConnection");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createUserValidator = [
    check("email")
        .notEmpty()
        .withMessage("User email is required")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val, { req }) => {
            const conn = await connection();

            const query = `SELECT * FROM users WHERE email = '${val}'`;
            const [user] = await conn.query(query);
            if (user[0]) {
                throw new Error(`E-mail already in user`);
            }
        }),
    check("password")
        .notEmpty()
        .withMessage("password required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 charachters"),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check("email")
        .optional()
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val, { req }) => {
            const conn = await connection();
            const query = `SELECT * FROM users WHERE id = ${val}`;
            const [user] = await conn.query(query);
            if (user[0]) {
                throw new Error(`E-mail already in user`);
            }
        }),
    check("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 charachters"),
    validatorMiddleware,
];
