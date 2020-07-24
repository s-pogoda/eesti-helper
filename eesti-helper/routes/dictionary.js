const cheerio = require('cheerio');
const Request = require('request-promise');
const request = Request.defaults({ jar: Request.jar() });

const parseWordTitles = (type) => {
    if (type.includes("tegusõna")) {
        return {
            firstCase: "ma-tegevusnimi",
            secondCase: "da-tegevusnimi",
            thirdCase: "kindla kõneviisi oleviku ainsuse 1.pööre"
        };
    }

    return {
        firstCase: "ainsuse nimetav",
        secondCase: "ainsuse omastav",
        thirdCase: "ainsuse osastav"
    };
};

const getURI = (func, param) => {
    switch (func) {
        case "findWord":
            return `http://sonaveeb.ee/worddetails/unif/${param}`;
        case "findTranslation":
            return `http://www.eki.ee/dict/evs/index.cgi?Q=${encodeURI(param)}&F=M&C06=en`;
        default:
            return `http://sonaveeb.ee/search/unif/dlall/dsall/${encodeURI(param)}/1`;
    }
};

const getOptions = (funcName, param) => {
    return {
        uri: getURI(funcName, param),
        transform: function (body) {
            return cheerio.load(body);
        }
    };
};

async function findTranslation(word) {
    const options = getOptions(findTranslation.name, word);

    try {
        const $ = await request(options);
        // find definitions without prefixes and suffixes
        const definitions = $('.m').filter((i, e) => $(e).text().trim() === word).get();

        const list = $(definitions[0]).parent().find('.x').map((i, e) => $(e).text().trim()).get();

        // return only unique values
        return [...new Set(list)];
    } catch (e) {
        throw new Error("Can't get word translation correctly: " + e.message);
    }
}

async function findWord(wordId) {
    const options = getOptions(findWord.name, wordId);

    try {
        const $ = await request(options);

        let word = { failed: false };
        word.type = $('.my-1').map((i, e) => { return $(e).text(); }).get().join();

        const cases = parseWordTitles(word.type);
        for (const field in cases) {
            const _case = $('.morph-word').filter((i, e) => $(e).attr('title').trim().startsWith(cases[field]));
            word[field] = $(_case[0]).text();
        }
        word.translation = await findTranslation(word.firstCase);

        return word;
    } catch (e) {
        throw new Error("Can't generate word: " + e.message);
    }
}

async function searchInDictionary(word) {
    const options = getOptions(searchInDictionary.name, word);

    try {
        const $ = await request(options);

        const wordId = $('input[name=word-id]').attr('value');

        if (wordId !== undefined) {
            return await findWord(wordId);
        } else {
            throw new Error("404 - Not Found.");
        }
    } catch (e) {
        throw e;
    }
}

module.exports = searchInDictionary;