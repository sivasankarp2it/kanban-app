import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  position: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);