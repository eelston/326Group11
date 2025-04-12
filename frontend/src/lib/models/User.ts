import { Post } from "./Post.ts"
import { Fact } from "./Fact.ts"

export interface User {
    userId: string // user_id, unique to account, public
    name: string; // display name, public
    email: string; // private/hashed
    password: string; // private/hashed
    
    pronouns: string; // private, only displayed if enabled in settings
    iconContent: string; // inner text for user icon

    settings: {
        iconColor: string; // hex code
        displayPronouns: boolean;
        displayMajor: boolean;
        
        receiveEmailNotifications: boolean; // for authored posts, posts commented on, mentions/replies
    };
    profileContent: {
        about: Fact[]; // user-input facts (e.g., *Favorite Study Spot:* SEL)
        blurb: string; 
        courses: string;
    }

    authoredPosts: Post[];
  }
