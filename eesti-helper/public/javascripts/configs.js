module.exports = {
    mongoUrl: () => {
        const host = process.env.MONGO_HOST || "localhost";
        const port = process.env.MONGO_PORT || "27017";
        return `mongodb://${host}:${port}`;
    }
}