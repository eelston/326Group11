export const mockFeed = [
    {
        postId: "0000001",
        name: "Melissa",
        userId: "0000004",
        pronouns: "she/her",
        title: "Study buds for discrete exam coming up...",
        tags: [{
            color: "#5feee0",
            tag: "CS 250",
        }, {
            color: "#f76e50",
            tag: "Comp Sci"
        }, {
            color: "#bcff8f",
            tag: "Midterm"
        }, {
            color: "#ffa2ce",
            tag: "Floor 2",
        }],
        description: 
        `Hi everyone! My names Melissa and I am a cs major! I am looking to study with my
        fellow classmates for this upcoming CS 250 midterm. I am feeling honestly rlly 
        nervous and even with the SI sessions I'm still stressed. I am going to be at the
        library (floor 2) tomorrow at 9 am and gonna spend the entire day there studying up!
        Please join at any time even if you don't feel super ready (b/c im not either!). 
        I'd love to meet some of my classmates! Anyway good luck to everyone else taking this
        exam in two days. :P `,
        location: "Campus Library",
        startTime: {time:"9:00 A.M", date: "Tomorrow"},
        timeStamp: {time:"9:30 A.M", date: "9/26/2026"}, // will be updated in next milestone
        isExpired: false,
        postComments: [{
            userId: "0000003",
            commentId: "1",
            name: "Udella",
            iconBgColor: "#5ad8cc",
            iconContent: ":U",
            pronouns: "she/her",
            message: "Omg I'll show up! At 11 am tho prolly. See u then!",
            timeStamp: {time: "11:32 A.M.", date: "9/26/2026"},
        }, {
            userId: "0000004",
            commentId: "2",
            name: "Jessie",
            iconBgColor: "#5ad8cc",
            iconContent: ":J",
            pronouns: "She/her",
            message: "I'll be joining!",
            timeStamp: {time: "3:29 A.M.", date: "9/26/2026"},
        }]
    },
    {
        postId: "0000002",
        title: "Title Goes Here... ",
        tags: [{
            color: "#f76e50",
            tag: "Tags Go Here"
        }],
        description: `Some text goes here. A lot of varied text too. Of all various unique
        sizes. Maybe some expressions too as well. Agreed upon here.`,
        location: "Location here",
        startTime: {time:"Time", date: "Date"},
        timeStamp: {time:"TimePosted", date: "DatePosted"},
        isExpired: false, 
        postComments: [],
        userId: "0000000",
        name: "displayName",
        pronouns: "she/he/they"
    },
    {
        postId: "0000003",
        title: "Title Goes Here... ",
        tags: [{
            color: "#f76e50",
            tag: "Tags Go Here"
        }],
        description: `Some text goes here. A lot of varied text too. Of all various unique
        sizes. Maybe some expressions too as well. Agreed upon here.`,
        location: "Location here",
        startTime: {time:"Time", date: "Date"},
        timeStamp: {time:"TimePosted", date: "DatePosted"},
        isExpired: false, 
        postComments: [],
        userId: "0000000",
        name: "displayName",
        pronouns: "she/he/they"
    },
    {
        postId: "0000004",
        title: "Title Goes Here... ",
        tags: [{
            color: "#f76e50",
            tag: "Tags Go Here"
        }],
        description: `Some text goes here. A lot of varied text too. Of all various unique
        sizes. Maybe some expressions too as well. Agreed upon here.`,
        location: "Location here",
        startTime: {time:"Time", date: "Date"},
        timeStamp: {time:"TimePosted", date: "DatePosted"},
        isExpired: false, 
        postComments: [],
        userId: "0000000",
        name: "displayName",
        pronouns: "she/he/they"
    },
    {
        postId: "0000005",
        title: "Title Goes Here... ",
        tags: [{
            color: "#f76e50",
            tag: "Tags Go Here"
        }],
        description: `Some text goes here. A lot of varied text too. Of all various unique
        sizes. Maybe some expressions too as well. Agreed upon here.`,
        location: "Location here",
        startTime: {time:"Time", date: "Date"},
        timeStamp: {time:"TimePosted", date: "DatePosted"},
        isExpired: false, 
        postComments: [],
        userId: "0000000",
        name: "displayName",
        pronouns: "she/he/they"
    }
]