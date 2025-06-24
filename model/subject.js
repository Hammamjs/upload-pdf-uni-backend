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

    imgCover: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Subject = model('subject', SubjectSchema);
export default Subject;
