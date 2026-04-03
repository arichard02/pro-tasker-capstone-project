import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", 
    required: true
  
  },
});

export default mongoose.model("Project", projectSchema);
