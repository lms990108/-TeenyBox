// 게시글 생성을 위한 DTO
export class CreatePostDTO {
  post_number!: number; // `!`는 해당 변수가 나중에 초기화될 것임을 나타냄 (non-null assertion)
  user_id!: string;
  title!: string;
  content!: string;
}

// 게시글 수정을 위한 DTO
export class UpdatePostDTO {
  title!: string;
  content!: string;
}

// ... 나머지 DTO들도 필요에 따라 추가적으로 정의
