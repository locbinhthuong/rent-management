import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'Admin' | 'CTV' | 'Customer' | 'Landlord';
  wallet_balance: number;
  password?: string;
  phone?: string;
  ref_code?: string;
  bank_account?: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  status: 'Pending' | 'Active' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Admin', 'CTV', 'Customer', 'Landlord'], default: 'Customer' },
    wallet_balance: { type: Number, default: 0 },
    password: { type: String },
    phone: { type: String },
    ref_code: { type: String, unique: true, sparse: true },
    bank_account: {
      bank_name: { type: String },
      account_number: { type: String },
      account_name: { type: String },
    },
    status: { type: String, enum: ['Pending', 'Active', 'Rejected'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
