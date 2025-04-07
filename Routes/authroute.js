import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  searchUsers,
  logoutUser,
  deleteAccount,
  changePassword,
  changeUserProfile,
} from "../controller/userController.js";
import { authToken } from "../middleware/token.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuserData", authToken, getAllUsers);
router.get("/search", searchUsers);
router.post("/logoutUser", logoutUser);
router.delete("/delete-account", deleteAccount);
router.patch("/change-password", changePassword);
router.patch("/change-profile", changeUserProfile);

export default router;
