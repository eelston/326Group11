export const MockUser = {
    userId: "user123",
    name: "Erika",
    email: "secret@email.com",
    password: "secret",
    
    pronouns: "she/her",
    iconContent: ":P",

    settings: {
        iconColor: "#5CA832",
        displayPronouns: true,
        displayMajor: true,
        
        receiveEmailNotifications: true,
    },
    profileContent: {
        about: [
            { factName: "Major", factAnswer: "Electrical Engineering" },
            { factName: "Favorite Study Spot", factAnswer: "Science and Engineering Library" },
            { factName: "Another Fact", factAnswer: "Another Answer" }
        ],
        blurb: "I am writing this as a test. I hope this works.", 
        courses: "ECE 311, CS 326",
    },

    authoredPosts: [],
} 