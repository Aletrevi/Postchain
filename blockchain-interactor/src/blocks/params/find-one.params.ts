import { IsMongoId } from 'class-validator';
 
export class FindOneParams {
  @IsMongoId({
    message: 'Invalid id'
  })
  id: string;
}