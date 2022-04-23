import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckerDto } from './create-checker.dto';

export class UpdateCheckerDto extends PartialType(CreateCheckerDto) {
  _id: string;
  postId: string;
  checked: boolean;
  title: string;
  body: string;
  author: string;
}
