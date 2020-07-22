const cheerio = require('cheerio');
const Request = require('request-promise');
const request = Request.defaults( { jar: Request.jar() } );
const parseWordTitles = require('../public/javascripts/configs').parseWordTitles;

const uri = (func, param) => {
    switch(func) {
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
        const list = [];
        $('.x').each(
            (i, e) => list.push( $(e).text().trim() )
        );
        return list;
    } catch (e) {
        console.error(e.message);
        return [];
    }
}

async function findWord(wordId) {
    const options = getOptions(findWord.name, wordId);

    try {
        const $ = await request(options);
        
        let word = { failed: false };
        word.type = $('.my-1').text();
        
        const cases = parseWordTitles(word.type);
        for( const field in cases) {
            word[field] = $('.morph-word').filter((i, e) => $(e).attr('title').trim().startsWith(cases[field])).text(); 
        }

        word.translation = await findTranslation(word.firstCase);
        return word;
    } catch (e) {
        console.error(e.message);
        return {};
    }
}

async function searchInDictionary(word) {
    const options = getOptions(searchInDictionary.name, word);

    try {
        const $ = await request(options);

        const wordId = $('input[name=word-id]').attr('value');
        console.log(wordId);

        return await findWord(wordId);

    } catch (e) {
        console.error(e.message);
        return {};
    }
}

module.exports = searchInDictionary;