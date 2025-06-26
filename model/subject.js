import { Schema, model } from 'mongoose';

const SubjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },

    departments: {
      type: [String],
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    uploadedDate: {
      type: Date,
      default: Date.now(),
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Subject = model('subject', SubjectSchema);
export default Subject;
