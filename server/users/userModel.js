import mongoose from 'mongoose';

export const userViewFields = 'username isAdmin name';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    lowercase: true,
    unique: true,
    index: {
      unique: true,
      collation: {
        locale: 'en',
        strength: 2,
      },
    },
  },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  name: { type: String, trim: true }, // TODO: use user full name
  __v: { type: Number, select: false },
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);

export { User };
