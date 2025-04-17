import { User } from "./User.ts"
import { Post } from "./Post.ts"

export interface Comment { 
  userId: string; // See: User.js  
  userName: string; // See: User.js  
  userPronouns: string; // See: User.js  
  iconBgColor: string; // See: User.js  
  iconContent: string; // See: User.js  

  postId: string; // See: Post.js
  commentId: string; 
  message: string;
  timeStamp: Date;
}
