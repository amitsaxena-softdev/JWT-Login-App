export interface UserData {
  _id: string;
  username: string;
  role: "user" | "admin";
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female" | "";
  phone: string;
  aboutUser?: string;
  settings?: {
    newsletter: boolean;
  };
  [key: string]: any;
}

export interface UserInfoProps {
  user: UserData | null;
  loading: boolean;
}

export type AdminPanelProps = {
  users: UserData[];
};
