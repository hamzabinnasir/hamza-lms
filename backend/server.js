import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routers
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import courseProgressRouter from "./routes/courseProgressRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";

dotenv.config();

//initialize express
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// CONNECTIONS
connectDB();
connectCloudinary();

app.get("/", (req, res) => {
    res.send("API Working");
});

// Routes
app.use("/api", userRouter);
app.use("/api", courseRouter);
app.use("/api/progress", courseProgressRouter);
app.use("/api/dashboard", dashboardRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});