export class CreatePostDto {
  readonly status: string;
  readonly title: string;
  readonly body: string;
  readonly author: string;
  readonly isChecked: boolean;
  readonly isPublished: boolean;
}
