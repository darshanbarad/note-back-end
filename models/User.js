import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minlength: [3, "firstName must be at least 3 characters long"],
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "lastName must be at least 3 characters long"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    Token: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
export default User;
