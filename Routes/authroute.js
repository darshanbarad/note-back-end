import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  searchUsers,
} from "../controller/userController.js";
import { authToken } from "../middleware/token.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuserData", authToken, getAllUsers);
router.get("/search", searchUsers);

export default router;
