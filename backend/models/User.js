import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema
const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true 
    },


    email: { 
      type: String, 
      required: true, 
      unique: true 
    },


    password: { 
      type: String, 
      required: true 
    },
    
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err); 
  }
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export User model
export default mongoose.model("User", userSchema);