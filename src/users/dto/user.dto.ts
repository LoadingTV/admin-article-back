// src/users/dto/user.dto.ts
import { RoleDto } from './role.dto';

export class UserDto {
  user_id: number;
  name: string;
  surname: string;
  email: string;
  role: RoleDto;
}
