import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  readingTime: { type: Date, required: true },
  __v: { type: Number, select: false },
  // FIXME: remove this redundant field after fixing client.
  fieldName: { type: String, required: true }, // Just for filtering.
}, { strict: false, timestamps: true });

export const Reading = mongoose.model('Reading', readingSchema);

module.exports.Reading = Reading;
