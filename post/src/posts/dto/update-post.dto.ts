export class UpdatePostDto {
  readonly _id: string;
  readonly status: string;
  readonly title: string;
  readonly body: string;
  readonly author: string;
  readonly isChecked: boolean;
  readonly isPublished: boolean;
}
