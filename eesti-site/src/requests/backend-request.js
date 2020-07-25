import axios from "axios";

//TODO: change
const url = "http://localhost:8081/words/";
const contentType = { 'Content-Type': 'application/json' };

async function insertMany(data) {
    return await axios.post(url + "insert", data, { headers: contentType });
}

//TODO return put
async function quizResult(words, answers) {
    return await axios.post(url + "quiz-result", { words: words, answers: answers }, { headers: contentType });
}

async function find(opts) {
    let query = {}, filter = {};
    switch (opts[0]) {
        case "all":
            filter = { sort: { _id: -1 } };
            break;
        case "failed":
            query = { failed: true };
            break;
        case "latest":
            filter = { sort: { _id: -1 }, limit: parseInt(opts[1]) };
            break;
        default: break;
    }

    return await axios.get(url + "find", { params: { q: query, f: filter } });
}

export default {
    insertMany,
    quizResult,
    find
};