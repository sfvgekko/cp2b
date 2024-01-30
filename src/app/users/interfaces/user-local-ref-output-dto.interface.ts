import { UserOutputDto } from './user-output-dto.interface';

export interface UserLocalRefOutputDto {
  id: string;
  role: string;
  localId: number;
  user: UserOutputDto;
}
