import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Board', boardSchema);