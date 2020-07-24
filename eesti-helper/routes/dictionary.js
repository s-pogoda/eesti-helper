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

const getDefinitionBlock = ($, word) => {
    let definitions = $('.m').filter((i, e) => $(e).text().trim() === word).get();
    if (!definitions.length) {
        definitions = $('.d').filter((i, e) => $(e).text().trim() === word).get();
    }
    return $(definitions[0]).parent();
};

const validateCases = (word) => {
    if (word.firstCase === "" || word.secondCase === "" || word.thirdCase === "")
        throw new Error("Cases validation failed. " + JSON.stringify(word));
}

async function findTranslation(word) {
    const _options = getOptions(findTranslation.name, word);

    try {
        const $ = await request(_options);
        // find definitions without prefixes and suffixes
        const _definition = getDefinitionBlock($, word);

        if (_definition) {
            const _list = $(_definition).find('.x').map((i, e) => $(e).text().trim()).get();
            // return only unique values
            return [...new Set(_list)];

        } else
            throw new Error("word translation not found");
    } catch (e) {
        throw new Error("Can't get word translation correctly: " + e.message);
    }
}

async function findWord(id, words, isComplex) {
    const _options = getOptions(findWord.name, id);

    try {
        const $ = await request(_options);

        let _word = { failed: false };
        _word.type = $('.my-1').map((i, e) => { return $(e).text(); }).get().join();

        const _cases = parseWordTitles(_word.type);
        for (const field in _cases) {
            const _case = $('.morph-word').filter((i, e) => $(e).attr('title').trim().startsWith(_cases[field]));

            if (field === "thirdCase") {
                _word[field] = isComplex ? [$(_case[0]).text(), words[0]].join(' ') : $(_case[0]).text();
            } else {
                _word[field] = isComplex ? [words[0], $(_case[0]).text()].join(' ') : $(_case[0]).text();
            }
        }
        validateCases(_word);
        _word.translation = await findTranslation(_word.firstCase);

        return _word;
    } catch (e) {
        throw new Error("Can't generate word: " + e.message);
    }
}

async function searchInDictionary(term) {

    let _options;

    // http://sonaveeb.ee not always include three cases for complex terms (that contain 2 words)
    // in case with complex word we need to find three main cases 
    // only for changeble word, which is on _words[1] position 
    let _complexity = false;
    const _words = term.split(' ');

    if (_words.length > 1) {
        _options = getOptions(searchInDictionary.name, _words[1]);
        _complexity = !_complexity;
    } else {
        _options = getOptions(searchInDictionary.name, term);
    }
    try {

        const $ = await request(_options);
        const _id = $('input[name=word-id]').attr('value');

        if (_id) {
            return await findWord(_id, _words, _complexity);
        } else {
            throw new Error("404 - Not Found.");
        }
    } catch (e) {
        throw e;
    }
}

module.exports = searchInDictionary;