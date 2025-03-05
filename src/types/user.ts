export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyRole: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInterface {
user: User;
tokens: Tokens;
}