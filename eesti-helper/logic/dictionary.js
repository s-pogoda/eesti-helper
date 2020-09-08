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

const getOptions = (funcName, param) => ({
    uri: getURI(funcName, param),
    transform: (body) => cheerio.load(body)
});

const getDefinitions = ($, word) => {
    const firstLvlDefinitions = $('.m').filter((i, e) => $(e).text().replace(/\+/g, '').trim() === word).get();
    if (!firstLvlDefinitions.length) {
        // search and return definitions from second level
        return $('.d').filter((i, e) => $(e).text().replace(/\+/g, '').trim() === word).get();
    }
    return firstLvlDefinitions;
};

const validate = (word) => {
    if (word.firstCase === "" || word.secondCase === "" || word.thirdCase === "" || !word.translation.length) {
        throw new Error("404 - validation failed: " + JSON.stringify(word));
    }
};

async function findTranslation(word) {
    const options = getOptions(findTranslation.name, word);
    const $ = await request(options);

    // find definitions without prefixes and suffixes
    const definitions = getDefinitions($, word);

    if (definitions.length) {
        const list = [];
        definitions.forEach(element => {
            const blockTranslations = $(element).parent().find('.x').map((i, e) => $(e).text().trim()).get();
            list.push(...blockTranslations);
        });

        // return only unique values
        return [...new Set(list)];

    } else {
        throw new Error("404 - word translation not found.");
    }
}

async function findWord(id, words, isComplexWord) {
    const options = getOptions(findWord.name, id);
    const $ = await request(options);
    const word = { failed: false };

    word.type = $('.my-1').map((i, e) => $(e).text()).get().join();
    const cases = parseWordTitles(word.type);
    for (const field in cases) {
        const searchedCase = $('.morph-word').filter((i, e) => $(e).attr('title').trim().startsWith(cases[field]));

        // different processing for complex and simple words.
        if (field === "thirdCase") {
            word[field] = isComplexWord ? [$(searchedCase[0]).text(), words[0]].join(' ') : $(searchedCase[0]).text();
        } else {
            word[field] = isComplexWord ? [words[0], $(searchedCase[0]).text()].join(' ') : $(searchedCase[0]).text();
        }
    }
    word.translation = await findTranslation(word.firstCase);
    validate(word);
    return word;
}

async function searchInDictionary(term) {
    let options;

    // http://sonaveeb.ee not always include three cases for complex terms (that contain 2 words)
    // in case with complex word we need to find three main cases
    // only for changeble word, which is on words[1] position
    let isComplexWord = false;
    const words = term.split(' ');

    if (words.length > 1) {
        options = getOptions(searchInDictionary.name, words[1]);
        isComplexWord = true;
    } else {
        options = getOptions(searchInDictionary.name, term);
    }

    const $ = await request(options);
    const id = $('input[name=word-id]').attr('value');

    if (id) {
        return await findWord(id, words, isComplexWord);
    } else {
        throw new Error("404 - page not found.");
    }
}

module.exports = searchInDictionary;
