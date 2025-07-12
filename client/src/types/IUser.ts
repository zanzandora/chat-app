export type IUser = {
  _id?: string;
  email: string;
  password: string;
  fullname: string;
  img?: string;
  bio?: string;
  nativeLanguage: string;
  learningLanguage: string;
  location?: string;
  inOnboarded?: boolean;
  friends?: string[];
};

export type IFriendReq = {
  _id?: string;
  sender: IUser;
  recipient: IUser;
  status: ['pending', 'accepted'];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type IFriendReqExtend = {
  incomingReqs: IFriendReq[];
  acceptedReqs: IFriendReq[];
  deniedReqs: IFriendReq[];
};
