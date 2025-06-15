export type IUser = {
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
};
