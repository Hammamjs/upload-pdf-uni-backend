import { compare, hash } from 'bcrypt';
import { Schema, model } from 'mongoose';

const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    studentIdx: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Student', 'Admin', 'SuperAdmin'],
      default: 'Student',
    },
    joinedIn: {
      type: Date,
      default: Date.now(),
    },
    year: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', '5th'],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    department: {
      type: String,
      enum: [
        'Networks',
        'Computer Science',
        'Math',
        'Statisitc',
        'Information Techenology',
      ],
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    refreshToken: String,
    passwordResetCode: String,
    passwordResetCodeExpiry: Date,
    passwordResetIsVerified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

StudentSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await hash(this.password, 12);
  }
  next();
});

StudentSchema.methods.comparePassword = async function (canidatePassword) {
  return await compare(canidatePassword, this.password);
};

const Student = model('Student', StudentSchema);

export default Student;
