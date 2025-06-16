import { ProfileEnum } from "../enums/profile.enum";

export interface UserLoginI {
    token:   string;
    message: string;
    user:    UserI;
}

export interface UserI {
    id:         number;
    username:   string;
    email:      string;
    first_name: string;
    last_name:  string;
    groups:     string[];
}

export interface LoginCredentialsI {
  email: string;
  password: string;
}

export interface RegisterUserI {
  username: string;
  password: string;
  group: ProfileEnum;
}