// Config the env and DB conncetion
import { config } from "dotenv";
import { connectToMongoDB } from "./config/DB.config.js";
config();
connectToMongoDB();

// Define the server with express library
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { socketEvents } from "./socket/index.js"; 

const app = express();
const port = Number(process.env.PORT) || 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8001"],
    credentials: true,
  },
});

// התחברות לאירועים של Socket.IO
socketEvents(io);

// ---------------- MIDDLEWARES ----------------
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
  next();
});

app.use(express.json());
app.use(cookieParser());

// ---------------- ROUTES ----------------
import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/user.route.js";
import householdRoutes from "./routes/household.route.js";
import shoppingCartRoutes from "./routes/shoppingCart.route.js";
import recipesRoutes from "./routes/recipe.route.js";

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/households", householdRoutes);
app.use("/shoppingCart", shoppingCartRoutes);
app.use("/recipes", recipesRoutes);

// ---------------- START SERVER ----------------
server.listen(port, () => {
  console.log(`Server + Socket.IO running on port ${port}...`);
});
