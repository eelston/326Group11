import { User } from "./User.ts"
import { Post } from "./Post.ts"

export interface Comment { 
  userId: string; // See: User.ts
  userName: string; // See: User.ts
  userPronouns: string; // See: User.ts  
  iconBgColor: string; // See: User.ts  
  iconContent: string; // See: User.ts  

  postId: string; // See: Post.ts
  commentId: string; 
  message: string;
  timeStamp: Date;
}
