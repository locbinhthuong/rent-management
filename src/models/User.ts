import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'Admin' | 'CTV' | 'Customer';
  password?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  ref_code?: string;
  bank_account?: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  status: 'Pending' | 'Active' | 'Rejected' | 'Locked';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Admin', 'CTV', 'Customer'], default: 'Customer' },
    password: { type: String },
    phone: { type: String },
    avatar: { type: String },
    address: { type: String },
    ref_code: { type: String, unique: true, sparse: true },
    bank_account: {
      bank_name: { type: String },
      account_number: { type: String },
      account_name: { type: String },
    },
    status: { type: String, enum: ['Pending', 'Active', 'Rejected', 'Locked'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
