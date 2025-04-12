export const MockLocations = [
    {
        "name": "Science & Engineering Library",
        "address": "740 N Pleasant St #273, Amherst, MA 01003",
        "type": "Multi-Floor",
        "floors": [
            {
                "name": "2",
                "reports": [
                    {
                        user_id: "user123",
                        score: 4,
                        timestamp: Date.now()
                    }
                ]
            },
            {
                "name": "3",
                "reports": [
                    {
                        user_id: "user123",
                        score: 1,
                        timestamp: Date.now()
                    }
                ]
            }
        ]
    },

    {
        "name": "CEI Hub",
        "address": "100 Natural Resources Rd, Amherst, MA 01003",
        "type": "Single-Floor",
        "reports": [
            {
                user_id: "user789",
                score: 3,
                timestamp: Date.now()
            },
            
            {
                user_id: "user789",
                score: 3,
                timestamp: Date.now()
            },
            
            {
                user_id: "user123",
                score: 2,
                timestamp: Date.parse(new Date("April 10, 2025 12:34:05"))
            }
        ]
    },

    {
        "name": "Courtside Cafe",
        "address": "161 Commonwealth Ave, Amherst, MA 01003",
        "type": "Single-Floor",
        "reports": [
            {
                user_id: "user123",
                score: 3,
                timestamp: Date.parse(new Date("May 21, 2024 03:20:21"))
            }
        ]
    },

    {
        "name": "Student Union",
        "address": "41 Campus Center Way, Amherst, MA 01002",
        "type": "Multi-Floor",
        "floors": [
            {
                "name": "2",
                "reports": [
                    {
                        user_id: "user123",
                        score: 5,
                        timestamp: Date.now()
                    }
                ]
            },
            {
                "name": "3",
                "reports": [
                    {
                        user_id: "user123",
                        score: 3,
                        timestamp: Date.parse(new Date("December 19, 2025 12:24:00"))
                    }
                ]
            }
        ]
    },

    {
        "name": "Isenberg Hub",
        "address": "121 Presidents Dr, Amherst, MA 01003",
        "type": "Single-Floor",
        "reports": [
            {
                user_id: "user123",
                score: 3,
                timestamp: Date.now()
            },

            {
                user_id: "user456",
                score: 1,
                timestamp: Date.now()
            }
        ]
    }
]