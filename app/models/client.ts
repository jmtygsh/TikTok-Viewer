import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

// Export the model
export default mongoose.models.Client || mongoose.model("Client", clientSchema);
