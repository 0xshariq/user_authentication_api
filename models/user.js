import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    apiKey: {
      key: {
        type: String,
        unique: true,
        sparse: true,
      },
      requestCount: {
        type: Number,
        default: 0,
      },
      requestLimit: {
        type: Number,
        default: 1000,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true },
)

const User = mongoose.model("User", UserSchema)
export default User