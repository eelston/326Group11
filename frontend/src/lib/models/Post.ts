export interface Post {
    userId: string;
    userName: string;
    userPronouns: string;
    
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
