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
                user_id: "user123",
                score: 2,
                timestamp: Date.now()
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
                timestamp: Date.now()
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
                        timestamp: Date.now()
                    }
                ]
            }
        ]
    }
]