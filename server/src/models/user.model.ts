import mongoose, { Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullname: string;
  img?: string;
  bio?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  location?: string;
  inOnboarded?: boolean;
  friends?: string[];
}

export interface IUserMethods {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullname: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
    },
    img: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    nativeLanguage: {
      type: String,
      default: '',
    },
    learningLanguage: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    inOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// TODO: hash password before update into db
//pre hooks
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
