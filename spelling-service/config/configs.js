module.exports = {
    mongoUrl: () => {
        const host = process.env.MONGO_HOST || "localhost";
        const port = process.env.MONGO_PORT || "27017";
        return `mongodb://${host}:${port}`;
    },

    getDictionaryURI: (func, param) => {
        switch (func) {
            case "findWord":
                return `http://sonaveeb.ee/worddetails/unif/${param}`;
            case "findTranslation":
                return `http://www.eki.ee/dict/evs/index.cgi?Q=${encodeURI(param)}&F=M&C06=en`;
            //search
            default:
                return `http://sonaveeb.ee/search/unif/dlall/dsall/${encodeURI(param)}/1`;
        }
    }
};