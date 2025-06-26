import { Schema, model } from 'mongoose';

const PDFSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    uploader: {
      ref: 'Student',
      type: Schema.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
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
    uploadedAt: {
      type: Date,
      default: Date.now(),
    },

    departments: {
      type: [String],
      enum: [
        'Networks',
        'Computer Science',
        'Math',
        'Statistic',
        'Information Technology',
      ],
      required: true,
    },
    view: String,
    content: String,
    fileId: String,
    size: Number,
  },
  { timestamps: true, versionKey: false }
);

PDFSchema.pre(/^find/, function () {
  this.populate('uploader');
});

export default model('PDF', PDFSchema);
