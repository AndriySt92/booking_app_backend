import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '../types/userTypes'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

const User = mongoose.model<IUser>('User', userSchema)

export default User
