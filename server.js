const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

dotenv.config({ path: "config.env" });
const ApiError = require("./server/utils/apiError");
const globalError = require("./server/middleware/errorMiddleware");

//  Routes
const mountRoutes = require("./server/routes");

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// Compress all responses
app.use(compression());

// for security
app.use(helmet());

// Middlewares
app.use(express.json());

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

// Handling error ouside express
process.on("unhandledRejection", (err) => {
    console.log("#".repeat(33));
    console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error("Shutting down....");
        process.exit(1);
    });
});
