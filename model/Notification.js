import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Notifications = model('Notification', NotificationSchema);
export default Notifications;
