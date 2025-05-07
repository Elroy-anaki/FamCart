// Config the env and DB conncetion
import { config } from "dotenv";
import { connectToMongoDB } from "./config/DB.config.js";
config();
connectToMongoDB();

// Define the server with express library
import express from "express";
const app = express();
const port = Number(process.env.PORT) || 3001;

// Global Middlewares (imports + use)
import cors from "cors";
import cookieParser from "cookie-parser";


app.use(cors({
    optionsSuccessStatus: 200,
    credentials: true,
    origin: ["http://localhost:8001"]
}));


app.use((req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next(); // Proceed to the next middleware or route handler
});

app.use(express.json());
app.use(cookieParser());

// Routes (imports + use)
import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/user.route.js";
import householdRoutes from  "./routes/household.route.js"
import shoppingCartRoutes from "./routes/shoppingCart.route.js"

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/households", householdRoutes)
app.use("/shoppingCart", shoppingCartRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
