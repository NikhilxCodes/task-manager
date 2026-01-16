import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'Pending' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: mongoose.Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, title: 'text' });

export default mongoose.model<ITask>('Task', TaskSchema);

