import { Ranch } from './ranch';

export interface Permissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface UserPermissions {
  members: Permissions;
  classes: Permissions;
  users: Permissions;
  enrollments: Permissions;
  locations: Permissions;
  ranches: Permissions;
  flow: Permissions;
}

export interface User {
  id: string;
  username: string;
  name: string;
  permissions: UserPermissions;
  ranches: Ranch[];
  super_admin: boolean;
}

export interface UserDto {
  username: string;
  name: string;
  password?: string;
  repeatPassword?: string;
  permissions: UserPermissions;
  ranches: string[];
  super_admin?: boolean;
}
