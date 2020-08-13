import axios from "axios";

const url = "http://localhost:8081/words/";
const contentType = { 'Content-Type': 'application/json' };

async function insertMany(data) {
    return axios.post(url + "insert", data, { headers: contentType });
}

async function updateTableRow(param, tags, translation) {
    return axios.post(url + `update/${param}`,
        { translation: translation, tags: tags },
        { headers: contentType });
}

//TODO return put
async function quizResult(words, answers) {
    return axios.post(url + "quiz-result", { words: words, answers: answers }, { headers: contentType });
}

async function findTags() {
    return axios.get(url + "tags");
}

async function findWords() {
    return axios.get(url + "find");
}

async function quizList(options) {
    const query = {}, filter = {};
    if (options) {
        switch (options.selector) {
            case "failed":
                query.failed = true;
                break;
            case "tags":
                query.tags = { $regex: options.tags };
                break;
            case "latest":
                if (options.type !== "all") {
                    query.type = { $regex: options.type };
                }
                filter.limit = parseInt(options.limit);
                break;
            default: break;
        }
    }
    return axios.get(url + "quiz-list", { params: { q: query, f: filter } });
}

export default {
    insertMany,
    quizList,
    quizResult,
    findWords,
    findTags,
    updateTableRow
};