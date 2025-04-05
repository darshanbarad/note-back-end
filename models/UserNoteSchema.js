import mongoose from "mongoose";

const { Schema, model } = mongoose;

const noteSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    category: {
      type: String,
      enum: ["Work", "Personal", "Study", "Other"],
      default: "Other",
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    isPublic: { type: Boolean, default: false },

    // 👇 Reminder date (for notification etc.)
    reminder: { type: Date, default: null },

    // 👇 Manual note date for filtering
    noteDate: { type: String }, // Will store YYYY-MM-DD format (e.g. 2025-04-05)
  },
  { timestamps: true }
);

const NoteModel = model("Note", noteSchema);

export default NoteModel;
