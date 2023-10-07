// Small bit of documentation.
// Apart from manipulating the page on load, this also defines methods:
//
// parseSaiaElement(element: HTMLElement | null): void
//      Converts an element or the full document from <human-readable-saia> to
//      <conlang-saia> (or <failed-saia>).
//
// function toggleRuby(): void
//      Toggles whether any existing saia on the page has its reading ruby'd
//      or not. For new elements, use `applyRubySetting(element)`.
//
// function applyRubySetting(element: HTMLElement): void
//      Applies the existing ruby setting to an element or the full document.
//      Basically made for newly created DOM elements with saia.
//
// function toggleDictionary(): void
//      Toggles whether the dictionary is shown or not.
//
// function search(): void
//      Reads the dictionary input search field, searches, and updates the
//      dictionary search results.
//
// function setPage(page: Number): void
//      Sets the currently shown page in the dictionary search results.

const RUBY_ATTRIBUTE = "has-ruby";
const HUMAN_READABLE_SAIA_TAG = "human-readable-saia";
const SAIA_TAG = "conlang-saia";
const FAILED_SAIA_TAG = "failed-saia";

const SAIA_CHARSEP = "";
const SAIA_SPACE = "";
const SAIA_WORD_START = "";
const SAIA_WORD_END = "";

/** @type {HTMLElement} */
let saia_dict;
/** @type {HTMLElement} */
let search_results;
/** @type {HTMLElement} */
let result_count;
/** @type {HTMLInputElement} */
let search_input;
/** @type {HTMLElement} */
let page_counter;
/** @type {HTMLElement} */
let dict_scroll_anchor;

window.addEventListener("DOMContentLoaded", () => {
    saia_dict = document.getElementById("saia-dict");
    search_results = document.getElementById("search-results");
    result_count = document.getElementById("result-count");
    search_input = /** @type {HTMLInputElement} */ (document.getElementById("search-input"));
    page_counter = document.getElementById("page-counter");
    dict_scroll_anchor = document.getElementById("dict-scroll-anchor");

    parseSaiaElement();
    if (localStorage.getItem("rubyOn") === "true")
        toggleRuby();
    if (localStorage.getItem("dictOn") === "true")
        toggleDictionary();
    
    // History may remember input
    if (search_input.value)
        search();
});

/** @param {HTMLElement} element */
function toggleOpenEle(element) {
    if (element.hasAttribute("open-ele"))
        element.removeAttribute("open-ele");
    else
        (element.setAttribute("open-ele", ""));
}

//#region dictionary lookup

/** @type {DictionaryMatch[]} */
let searchResults = [];
let page = 1;
let maxPage = 1;
/** Searches the dictionary and updates the DOM. */
function search() {
    sanitizeInput();
    searchResults = searchDictionary(search_input.value);
    result_count.innerHTML = `${searchResults.length} results`;

    page = 1;
    maxPage = Math.ceil(searchResults.length / 5);
    if (maxPage == 0)
        page = 0;
    fillSearchPage();
}

function sanitizeInput() {
    let raw = search_input.value;
    let sanitized = "";
    let current = "";
    let currentTransformed = "";
    let pipes = 0;
    for (let i = 0; i < raw.length; i++) {
        if (raw[i].trim() === "") {
            if (pipes > 0 && pipes + 1 >= current.length / 2)
                sanitized += currentTransformed;
            else
                sanitized += current;
            
            sanitized += raw[i];
            current = "";
            currentTransformed = "";
            pipes = 0;
        } else {
            current += raw[i];
            if (readingTable[raw[i]])
                currentTransformed += readingTable[raw[i]];
            if (raw[i] === SAIA_CHARSEP)
                pipes++;
        }
    }
    if (pipes > 0 && pipes + 1 >= current.length / 2)
        sanitized += currentTransformed;
    else
        sanitized += current;

    search_input.value = sanitized;
}

function fillSearchPage() {
    let limit = Math.min(5 * page, searchResults.length);

    let listHTML = "";
    if (maxPage != 0) {
        for (let i = 5 * (page - 1); i < limit; i++) {
            listHTML += dictionaryMatchToHTML(searchResults[i]);
        }
    }
    
    search_results.innerHTML = listHTML;
    page_counter.innerHTML = ` ${page}/${maxPage}`;
    parseSaiaElement(search_results);
    applyRubySetting(search_results);
}

/** Updates the dictionary page.
 *  @param {Number} to - Integer specifying target page. Clamped to valid values. */
function setPage(to) {
    let from = page;
    if (to < 1)
        to = 1;
    if (to > maxPage)
        to = maxPage;

    if (to != from) {
        page = to;
        fillSearchPage();
        dict_scroll_anchor.scrollIntoView({block: "nearest", inline: "nearest"});
    }
}

class DictionaryMatch {
    /** Creates a match.
     *  @param {BaseWord} baseWord - The unconjugated word this result references.
     *  @param {number} complexity - How far-fetched this result is. Lower values are better. In (0,∞].
     *  @param {string[]} query - The strings that found this match.*/
    constructor(baseWord, complexity, query) {
        /** @type {BaseWord} */
        this.baseWord = baseWord;
        /** @type {Number} */
        this.complexity = complexity;
        /** @type {string[]} */
        this.query = query;
        Object.seal(this);
    }
}

let dictOn = false;
/** Toggles the visibility of the dictionary. */
function toggleDictionary() {
    saia_dict.classList.add("nopc");
    dictOn = !dictOn;
    if (dictOn) {
        saia_dict.classList.remove("nopc");
        saia_dict.setAttribute("open-ele", "");
        localStorage.setItem("dictOn", "true");
    } else {
        saia_dict.removeAttribute("open-ele");
        localStorage.setItem("dictOn", "false");
    }
}

/** Turns a dictionary match into some html. The outer HTML consists of
 * `<search-result> .. </search-result>`, ready to be put into the final list.
 *  (This final list still needs to parse the `<human-readable-saia>`s.)
 *  @param {DictionaryMatch} match
 *  @returns {string} */
function dictionaryMatchToHTML(match) {
    let word = match.baseWord;
    let saia = word.saia;
    let query = match.query;
    // Header
    let res = `<search-result><word-header><strong><human-readable-saia>${saia}</human-readable-saia></strong>`;

    res += ` <word-meta>(${mark(saia, query)})</word-meta></word-header>`;
    // All bodies
    let check = [word.asNoun, word.asAdjective, word.asAdverb, word.asVerb];
    let checkTypes = ["noun", "adj.", "adv.", "verb"];
    for (let i = 0; i < 4; i++) {
        let arr = check[i];
        if (arr) {
            let type = checkTypes[i];
            let descr = arr.map(s => {
                return mark(s, query);
            }).join("; ");

            let meta = type;
            if (type === "noun")
                if (word.wordType === WordType.NounBodyType)
                    meta += " (body)";
                else if (word.wordType === WordType.NounSpiritType)
                    meta += " (spirit)";
                else if (word.wordType === WordType.NounSoulType)
                    meta += " (soul)";
            
            res += `<word-explanation><word-meta>${meta}</word-meta> ${descr}</word-explanation>`;
        }
    }
    res += "</search-result>";
    return res;
}

/** Marks all query parts within a string with `<mark>` tags.
 *  @param {string} str - The string to put markings into.
 *  @param {string[]} query - All strings to mark. */
function mark(str, query) {
    // @ts-ignore
    query.forEach(q => str = str.replaceAll(q, `「${q}」`));
    // @ts-ignore
    return str.replaceAll("「", "<mark>").replaceAll("」", "</mark>");
}

/** Searches the dictionary (both languages) for a string.
 *  Returns all matches, sorted by likelihood.
 *  If there are spaces, it only includes those results that contain all words.
 *  @param {string} str
 *  @returns {DictionaryMatch[]} */
function searchDictionary(str) {
    // The most basic way -- use like tries when it's slow.
    // Current likelihood calculation: the fraction of the non-result.
    // In the future: also take into account conjugation.
    let ret = [];

    let query = str.split(' ').filter(s => s);
    // The empty query is fun because it includes the full dict.
    if (query.length == 0)
        query = [""];

    let profile_t0 = performance.now();

    for(let i = 0; i < dictionary.words.length; i++) {
        let word = dictionary.words[i];
        /** @type {Number[]} */
        let bestComplexities = Array(query.length).fill(Infinity);
        for (let ii = 0; ii < query.length; ii++) {
            let q = query[ii];
            let bestComplexity = Infinity;
            if (word.saia.includes(q))
                bestComplexity = Math.min(bestComplexity, 1 - ((q.length + 1) / (word.saia.length + 1)));
            let check = [word.saia, word.asNoun, word.asAdjective, word.asAdverb, word.asVerb].flat();
            check.forEach(s => {
                if (s && s.includes(q)) {
                    // Matching a larger part of an expression means it's more likely
                    let currentComplexity = 1 - (q.length / s.length);
                    // Matching a full word means it's more likely than a part
                    // The magic number is arbitrary.
                    if (new RegExp(`\\b${q}\\b`, "i").test(s))
                        currentComplexity *= 0.6;
                    // Matching not the whole word but only the start also means
                    // it's more likely than arbitrarily within.
                    // Again, magic number arbitrary.
                    else if (new RegExp(`\\n${q}`, "i").test(s))
                        currentComplexity *= 0.8;
                    // All else equal, prefer short words above long words
                    // The magic number is arbitrary.
                    currentComplexity += 0.01 * word.saia.length;

                    bestComplexity = Math.min(bestComplexity, currentComplexity);
                }
            });
            bestComplexities[ii] = bestComplexity;
            if (bestComplexity === Infinity)
                break;
        }
        let complexity = bestComplexities.reduce((a,b)=>a+b) / query.length;
        if (complexity != Infinity)
            ret.push(new DictionaryMatch(word, complexity, query));
    }

    ret.sort((m1, m2) => m1.complexity - m2.complexity);
    
    let profile_t1 = performance.now();
    console.log(`Dictionary lookup took ${(profile_t1 - profile_t0)} ms`);

    return ret;
}

//#endregion

//#region human to font

/** Converts written text inside an element (and its children) into visible
 *  saia (i.e. transform the text and change the font).
 *  Any failed elements will have the failure simply be displayed on the page
 *  with an error logged.
 *  If no `element` is passed, goes through the full document.
 *  @param {?HTMLElement} [element] */
function parseSaiaElement(element) {
    /** @type {HTMLCollectionOf<Element>} */
    let parse_elements;
    if (element)
        parse_elements = element.getElementsByTagName(HUMAN_READABLE_SAIA_TAG);
    else
        parse_elements = document.getElementsByTagName(HUMAN_READABLE_SAIA_TAG);

    while(parse_elements[0]) {
        let ele = parse_elements[0];
        let res = parseSaiaText(ele.innerHTML);
        let tag = SAIA_TAG;
        let onclick = "";
        if (!res.success) {
            tag = FAILED_SAIA_TAG;
            onclick = ` onClick="toggleOpenEle(this);"`;
        }
        ele.outerHTML = `<${tag}${onclick}>${res.result}<${tag}>`;

        if (!res.success)
            console.error("An element on the page failed saia conversion. Search DOM for 'ERROR: Parsing'.");
    }
}

/** Converts written text into the font mapping.
 *  If it succeeds, `success` is true and `result` contains the parse result.
 *  If it fails, `success` is false and `result` contains the failure reason.
 *  @param {string} str
 *  @returns {{success: boolean, result: string}} */
function parseSaiaText(str) {
    let parsed = "";
    let words = str.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
        let res = parseSaiaWord(words[i]);
        if (!res.success)
            return {
                success: false,
                result: `ERROR: Parsing of word #${i+1} "${words[i]}" of text "${str}" failed: ${res.result}`
            };
        let word_start = `${SAIA_WORD_START}${SAIA_CHARSEP}`;
        let word_end = `${SAIA_CHARSEP}${SAIA_WORD_END}`;
        if (words[i].startsWith("-"))
            word_start = "";
        if (words[i].endsWith("-"))
            word_end = "";
        // Put the word start/end inside any outer tags.
        let result = res.result;
        if (word_start) {
            result = result.replace(/^((<[^>]*>)*)/g, `$1${word_start}`);
        }
        if (word_end) {
            let len = result.length;
            result = result.replace(/((<[^>]*>)*)$/g, `${word_end}$1`);
            // The regexp also matches the end of the string which may be one too many
            if (result.length > len + word_end.length)
                result = result.substr(0, result.length - word_end.length);
        }
        parsed += `${result} `;
    }
    return {
        success: true,
        result: parsed.trim()
    };
}

/** See the {@link parseSaiaText} method for more information.
 *  @param {string} str
 *  @returns {{success: boolean, result: string}} */
function parseSaiaWord(str) {
    // Delimited phones, e.g. `soeise` => `s|oei|s|e`
    let parseInfo = "";
    let attempts = "";
    // Resulting mapped string
    let parsed = "";

    for (let start = 0; start < str.length; ) {
        // Ignore HTML
        if (str[start] === "<") {
            while (str[start] !== ">") {
                parsed += str[start];
                start++;
            }
            parsed += str[start];
            start++;
            if (start >= str.length)
                break;
        }

        // First try larger bits, then try smaller bits.
        // Be careful not to index past the end.
        let found = false;
        let max = Math.min(3, str.length - start);
        attempts = "";

        for (let len = max; len > 0; len--) {
            let attempt = str.substr(start, len);
            let char = reverseReadingTable[attempt];
            if (char !== undefined) {
                parseInfo += `${attempt}|`;
                if (char)
                    parsed += `${char}${SAIA_CHARSEP}`;
                start += len;
                found = true;
                break;
            }
            attempts += `${attempt} `;
        }
        if (!found) {
            return {
                success: false,
                result: `None of "${attempts.trim()}" are valid/known characters. Be sure to only make use of lowercase letters, even for proper nouns. Delineation of "${str}" so far: "${parseInfo}"`
            };
        }
    }
    if (parsed[parsed.length - 1] === SAIA_CHARSEP)
        parsed = parsed.substr(0, parsed.length - 1);
    return {
        success: true,
        result: parsed
    };
}

//#endregion

//#region ruby (aka font to human)

let rubyOn = false;
function toggleRuby() {
    removeRuby();
    rubyOn = !rubyOn;
    if (rubyOn) {
        localStorage.setItem("rubyOn", "true");
        addRuby();
    } else {
        localStorage.setItem("rubyOn", "false");
    }
}

/** Applies the current ruby setting (on/off) to the given element.
 *  @param {HTMLElement} element */
function applyRubySetting(element) {
    if (rubyOn)
        addRuby(element);
    else
        removeRuby(element);
}

/** Removes all ruby from a root element, and children.
 *  If none is specified, it handles the entire document.
 *  @param {?HTMLElement} [element] */
function removeRuby(element) {
    /** @type {HTMLCollectionOf<Element>} */
    let saia_elements;
    if (element)
        saia_elements = element.getElementsByTagName(SAIA_TAG);
    else
        saia_elements = document.getElementsByTagName(SAIA_TAG);
    
    for (let i = 0; i < saia_elements.length; i++) {
        let saia_element = saia_elements[i];

        if (!saia_element.hasAttribute(RUBY_ATTRIBUTE))
            continue;
        saia_element.removeAttribute(RUBY_ATTRIBUTE);

        let rubies = saia_element.getElementsByTagName("ruby");
        while (rubies[0]) {
            let ruby = rubies[0];
            let rts = ruby.getElementsByTagName("rt");
            while (rts[0]) {
                let rt = rts[0];
                rt.parentNode.removeChild(rt);
            }
            ruby.outerHTML = ruby.innerHTML;
        }
    }
}

/** If applicable, adds ruby to a root element, and children.
 *  If none is specified, it handles the entire document.
 *  @param {?HTMLElement} [element] */
function addRuby(element) {
    /** @type {HTMLCollectionOf<Element>} */
    let saia_elements;
    if (element)
        saia_elements = element.getElementsByTagName(SAIA_TAG);
    else
        saia_elements = document.getElementsByTagName(SAIA_TAG);
    
    for (let i = 0; i < saia_elements.length; i++) {
        let saia_element = saia_elements[i];

        if (saia_element.hasAttribute(RUBY_ATTRIBUTE))
            continue;
        saia_element.setAttribute(RUBY_ATTRIBUTE, "");

        let saia = saia_element.innerHTML;
        let result = "<ruby>";
        let ruby_text = "";
        let insideHTMLTag = false;
        // The approach of "insideHTMLTag when <, and outside when >" is *mostly* correct.
        // It fails with weird attributes or comments.
        // Note: We want per-word, not per-character, ruby.
        for (let ii = 0; ii < saia.length; ii++) {
            let char = saia[ii];
            if (char === "<")
                insideHTMLTag = true;

            if (!insideHTMLTag) {
                if (char === " " && ruby_text !== "") {
                    // Ruby doesn't allow breaks, so separate ruby tag for each word.
                    result += `<rt>${ruby_text}</rt></ruby> <ruby>`;
                    ruby_text = "";
                }
                if (readingTable[char])
                    ruby_text += readingTable[char];
            }
            if (char !== " ")
                result += char;

            if (char === ">")
                insideHTMLTag = false;
        }
        if (ruby_text !== "")
            result += `<rt>${ruby_text}</rt>`;
        result += "</ruby>";
        saia_element.innerHTML = result;
    }
}

//#endregion

//#region data

/** Transforms the character assignment of the font into the actual reading
 *  instead of gibberish.
 * @type {Object.<string,string>} */
 var readingTable = {
    "\ue041": "×",
    "\ue042": "i",
    "\ue043": "o",
    "\ue044": "a",
    "\ue045": "ei",
    "\ue046": "ò",
    "\ue047": "à",
    "\ue048": "e",
    "\ue049": "io",
    "\ue04a": "oi",
    "\ue04b": "ia",
    "\ue04c": "ai",
    "\ue04d": "iò",
    "\ue04e": "òi",
    "\ue04f": "ià",
    "\ue050": "ài",
    "\ue051": "ao",
    "\ue052": "oa",
    "\ue053": "eio",
    "\ue054": "oei",
    "\ue055": "ào",
    "\ue056": "oà",
    "\ue057": "eo",
    "\ue058": "oe",
    "\ue059": "aò",
    "\ue05a": "òa",
    "\ue05b": "eiò",
    "\ue05c": "òei",
    "\ue05d": "àò",
    "\ue05e": "òà",
    "\ue05f": "eò",
    "\ue060": "òe",
    "\ue061": "m",
    "\ue062": "n",
    "\ue063": "nh",
    "\ue064": "q",
    "\ue065": "qh",
    "\ue066": "s",
    "\ue067": "sh",
    "\ue068": "jh",
    "\ue069": "z",
    "\ue06a": "zh",
    "\ue06b": "j",
    "\ue06c": "f",
    "\ue06d": "l",
    "\ue06e": "lh",
    "\ue06f": "r",
    "\ue070": "×",
    "\ue071": "d",
    "\ue072": "b",
    "\ue073": "dh",
    "\ue074": "bh",
    "": "-"
}

/** Transforms a written phone into its character.
 * @type {Object.<string,string>} */
 var reverseReadingTable = Object.fromEntries(Object.entries(readingTable).map(entry => entry.reverse()));

//#endregion
