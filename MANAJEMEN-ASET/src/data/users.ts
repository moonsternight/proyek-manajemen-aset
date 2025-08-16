export interface User {
  email: string;
  password: string;
  role: "admin" | "staff";
}

export const users: User[] = [
  {
    email: "fandi@cni.net.id",
    password: "cni123",
    role: "admin",
  },
  {
    email: "yehezkiel@cni.net.id",
    password: "cni111",
    role: "staff",
  },
];
