import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  fields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Field' }],
  __v: { type: Number, select: false },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export { Client };
