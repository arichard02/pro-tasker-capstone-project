import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "To Do"
    },

    project: {
        type: mongoose.Schema.Types.ObjectId, ref: "Project"}
    },

    { timestamps: true}
});


export default mongoose.model("Task", taskSchema);
    

    