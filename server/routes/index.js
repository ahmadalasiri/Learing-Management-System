// Routes
const adminRoute = require("./adminRoute");
const instructorRoute = require("./instructorRoute");
const studentRoute = require("./studentRoute");
const authRoute = require("./authRoute");

const mountRoutes = (app) => {
    app.use("/api/v1/admin", adminRoute);
    app.use("/api/v1/instructor", instructorRoute);
    app.use("/api/v1/student", studentRoute);
    app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;
