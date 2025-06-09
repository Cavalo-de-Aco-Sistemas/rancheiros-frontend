export interface User {
  id: number;
  username: string;
  admin: boolean;
}

export interface UserDto {
  username: string;
  admin: boolean;
  password?: string;
  repeatPassword?: string;
}
