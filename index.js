import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authroute from "./Routes/authroute.js";
import noteroute from "./Routes/noteroute.js";
import authRoutes from "./middleware/token.js";
import "./connection/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authroute);
app.use("/note", noteroute);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
