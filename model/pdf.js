import { Schema, model } from 'mongoose';

const PDFSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    pdfCover: {
      type: String,
    },
    year: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      enum: ['1st', '2nd'],
      default: '1st',
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },

    department: {
      type: [String],
      enum: [
        'Networks',
        'Computer Science',
        'Math',
        'Statisitc',
        'Information Techenology',
      ],
      required: true,
    },
    view: String,
    content: String,
    fileId: String,
  },
  { timestamps: true, versionKey: false }
);

export default model('PDF', PDFSchema);
