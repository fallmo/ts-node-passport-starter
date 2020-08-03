import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  date: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<User>("User", UserSchema);
