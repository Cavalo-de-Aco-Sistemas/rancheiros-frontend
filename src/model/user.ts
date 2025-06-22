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
}

export interface User {
  id: string;
  username: string;
  permissions: UserPermissions;
}

export interface UserDto {
  username: string;
  password?: string;
  repeatPassword?: string;
  permissions: UserPermissions;
}
