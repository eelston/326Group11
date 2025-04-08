export const MockUser = {
    userId: "user123",
    name: "Erika",
    email: "secret@email.com",
    password: "secret",
    
    pronouns: "she/her",
    iconContent: ":P",

    settings: {
        displayPronouns: true,
        displayMajor: true,
        
        receiveEmailNotifications: true,
    },
    profileContent: {
        about: [
            { factName: "Major", factContent: "Electrical Engineering" },
            { factName: "Favorite Study Spot", factContent: "Science and Engineering Library" },
            { factName: "Another Fact", factContent: "Another Answer" }
        ],
        blurb: "I am writing this as a test. I hope this works.", 
        courses: "ECE 311, CS 326",
    },

    authoredPosts: [],
} 