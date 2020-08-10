const cheerio = require('cheerio');
const Request = require('request-promise');
const request = Request.defaults({ jar: Request.jar() });
const getURI = require('../config/configs').getDictionaryURI;

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

const getOptions = (funcName, param) => {
    return {
        uri: getURI(funcName, param),
        transform: function (body) {
            return cheerio.load(body);
        }
    };
};

const getDefinitions = ($, word) => {
    let definitions = $('.m').filter((i, e) => $(e).text().replace(/\+/g, '').trim() === word).get();
    if (!definitions.length) {
        definitions = $('.d').filter((i, e) => $(e).text().replace(/\+/g, '').trim() === word).get();
    }
    return definitions;
};

const validate = (word) => {
    if (word.firstCase === "" || word.secondCase === "" || word.thirdCase === "" || !word.translation.length)
        throw new Error("Validation failed. " + JSON.stringify(word));
}

async function findTranslation(word) {
    const _options = getOptions(findTranslation.name, word);

    try {
        const $ = await request(_options);
        // find definitions without prefixes and suffixes
        const _definitions = getDefinitions($, word);

        if (_definitions.length) {
            let _list = [];
            _definitions.forEach(element => {
                const blockTranslations = $(element).parent().find('.x').map((i, e) => $(e).text().trim()).get();
                _list = _list.concat(blockTranslations);
            });
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
        _word.translation = await findTranslation(_word.firstCase);

        validate(_word);
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