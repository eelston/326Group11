import { Tag } from "./Tag.ts"
import { Comment } from "./Comment.ts"
import { User } from "./User.ts"

export interface Post {
    userId: string; // see: User.ts
    userName: string; // see: User.ts
    userPronouns: string; // see: User.ts
    
    postId: string; 
    title: string;
    tags: Tag[]; // see: Tag.js
    description: string;
    location: string;
    startTime: Date; // Parsed 
    timeStamp: Date; // Parsed
    isExpired: boolean; 
    
    comments: Comment[]; // see: Comment.js
}
