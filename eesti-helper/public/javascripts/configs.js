module.exports = {
    mongoUrl: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,

    parseWordTitles: (type) => {
        switch(type) {
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