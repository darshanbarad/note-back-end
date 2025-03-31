import express from "express";
import {
  createNote,
  getUserNote,
  getPublicNote,
  updateNote,
  deleteNote,
  deleteMultipleNotes,
} from "../controller/noteController.js";
import { authToken } from "../middleware/token.js";
const router = express.Router();

router.post("/createNote", authToken, createNote);
router.get("/getuserNote", authToken, getUserNote);
router.get("/getPublicNote", authToken, getPublicNote);
router.patch("/updateNote/:id", authToken, updateNote);
router.delete("/noteDelete/:id", authToken, deleteNote);
router.delete("/multipleNoteDelete", authToken, deleteMultipleNotes);

export default router;
