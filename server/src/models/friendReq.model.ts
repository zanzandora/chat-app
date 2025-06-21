import mongoose, { Schema } from 'mongoose';

const friendReqtSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const FriendReq = mongoose.model('FriendReq', friendReqtSchema);

export default FriendReq;
