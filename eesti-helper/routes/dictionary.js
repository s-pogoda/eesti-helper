const cheerio = require('cheerio');
const Request = require('request-promise');
const request = Request.defaults({ jar: Request.jar() });
const parseWordTitles = require('../public/javascripts/configs').parseWordTitles;

const uri = (func, param) => {
    switch (func) {
        case "findWord":
            return `http://sonaveeb.ee/worddetails/unif/${param}`;
        case "findTranslation":
            return `http://www.eki.ee/dict/evs/index.cgi?Q=${encodeURI(param)}&F=M&C06=en`;
        default:
            return `http://sonaveeb.ee/search/unif/dlall/dsall/${encodeURI(param)}/1`;
    }
};

function getOptions(funcName, param) {
    return {
        uri: uri(funcName, param),
        transform: function (body) {
            return cheerio.load(body);
        }
    };
}

async function findTranslation(word) {
    const options = getOptions(findTranslation.name, word);

    try {
        const $ = await request(options);
        const definitions = [];
        $('.m').each(
            (i, e) => {
                // find definitions without prefixes and suffixes
                if ($(e).text().trim() === word)
                    definitions.push($(e).parent());
            }
        );

        const list = [];
        $(definitions[0]).find('.x').each(
            (i, e) => list.push($(e).text().trim())
        );

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
        word.type = $('.my-1').text();

        const cases = parseWordTitles(word.type);
        for (const field in cases) {
            word[field] = $('.morph-word').filter((i, e) => $(e).attr('title').trim().startsWith(cases[field])).text();
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