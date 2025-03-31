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
  },
  { timestamps: true }
);

const NoteModel = model("Note", noteSchema);

export default NoteModel; 
