import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    systemPrompt: {
      type: String,
      default: "You are a helpful AI assistant."
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    files: [
  {
    name: String,
    openaiFileId: String
  }
]
  },
  { timestamps: true },
  
);

export default mongoose.model("Project", projectSchema);
