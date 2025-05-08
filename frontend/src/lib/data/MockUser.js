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
        courses: [
            {
                course_name: "Intermediate Electronics",
                course_subject: "ECE",
                course_number: "311"
            },
            {
                course_name: "Web Programming",
                course_subject: "CS",
                course_number: "326"
            }
        ],
    },

    authoredPosts: [],
}
