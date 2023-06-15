// @flow
import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Field name is required',
    index: {
      unique: true,
      collation: {
        locale: 'en',
        strength: 2,
      },
    },
  },
  note: { type: String, default: '' },
  live: { type: mongoose.Schema.Types.ObjectId, ref: 'Reading' },
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  __v: { type: Number, select: false },
}, { timestamps: true });

export const Field = mongoose.model('Field', fieldSchema);
module.exports.Field = Field;
