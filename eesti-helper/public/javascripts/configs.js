module.exports = {
    mongoUrl: () => {
        const host = process.env.MONGO_HOST || "localhost";
        const port = process.env.MONGO_PORT || "27017";
        return `mongodb://${host}:${port}`;
    },

    parseWordTitles: (type) => {
        switch (type) {
            case "tegusõna": return {
                firstCase: "ma-tegevusnimi",
                secondCase: "da-tegevusnimi",
                thirdCase: "kindla kõneviisi oleviku ainsuse 1.pööre"
            };

            default: return {
                firstCase: "ainsuse nimetav",
                secondCase: "ainsuse omastav",
                thirdCase: "ainsuse osastav"
            };
        }
    }
}