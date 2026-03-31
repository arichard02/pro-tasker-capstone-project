import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: "user"}
    },

     timestamps: true 
});

export default mongoose.model("Project", projectSchema);