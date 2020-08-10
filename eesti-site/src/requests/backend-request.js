import axios from "axios";

//TODO: change
const url = "http://localhost:8081/words/";
const contentType = { 'Content-Type': 'application/json' };

async function insertMany(data) {
    return await axios.post(url + "insert", data, { headers: contentType });
}

async function updateTableRow(param, tags, translation) {
    return await axios.post(url + `update/${param}`,
        { translation: translation, tags: tags },
        { headers: contentType });
}

//TODO return put
async function quizResult(words, answers) {
    return await axios.post(url + "quiz-result", { words: words, answers: answers }, { headers: contentType });
}

async function findTags() {
    return await axios.get(url + "tags");
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
        case "tags":
            query = { tags: { $regex: opts[3] } };
            filter = { sort: { _id: -1 } };
            break;
        case "latest":
            query = opts[2] === "all" ? {} : { type: { $regex: opts[2] } };
            filter = { sort: { _id: -1 }, limit: parseInt(opts[1]) };
            break;
        default: break;
    }
    return await axios.get(url + "find", { params: { q: query, f: filter } });
}

export default {
    insertMany,
    quizResult,
    find,
    findTags,
    updateTableRow
};