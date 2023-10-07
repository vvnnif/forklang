// This is the literal dictionary data unprocessed.
// TODO: Verb args

class BaseWord {

    /** Creates an unconjugated dictionary word.
     *  @param {string} saia
     *  @param {WordType} wordType */
    constructor(saia, wordType) {
        /** The transcription of the conlang word.
         *  @type {string} */
        this.saia = saia;
        /** The wordtype of this word.
         *  @type {WordType} */
        this.wordType = wordType;
        /** If it exists, what this word means as an adjective. 
         * @type {?string[]} */
        this.asAdjective = undefined;
        /** If it exists, what this word means as an adverb. 
         * @type {?string[]} */
        this.asAdverb = undefined;
        /** If it exists, what this word means as a verb. 
         * @type {?string[]} */
        this.asVerb = undefined;
        /** If it exists, what this word means as a noun. 
         * @type {?string[]} */
         this.asNoun = undefined;
        /** All remarks about this word. 
         * @type {string[]} */
        this.notes = [];
    }

    /** Adds a noun meaning to this word.
     *  @param {string} interpretation 
     *  @returns {BaseWord} */
    withNoun(interpretation) {
        this.asNoun = this.sanitizeDef(interpretation);
        return this;
    }

    /** Adds an adjective meaning to this word.
     *  @param {string} interpretation
     *  @returns {BaseWord}  */
    withAdj(interpretation) {
        this.asAdjective = this.sanitizeDef(interpretation);
        return this;
    }

    /** Adds an adverb meaning to this word.
     *  @param {string} interpretation
     *  @returns {BaseWord}  */
    withAdv(interpretation) {
        this.asAdverb = this.sanitizeDef(interpretation);
        return this;
    }

    /** Adds a verb meaning to this word.
     *  @param {string} interpretation
     *  @returns {BaseWord}  */
    withVerb(interpretation) {
        this.asVerb = this.sanitizeDef(interpretation);
        return this;
    }

    /** Adds (not 'overrides') a note to this word.
     *  @param {string} note */
    withNote(note) {
        this.notes.push(note);
        return this;
    }

    /** Turns a comma-separated list into an array.
     *  @param {string} input
     *  @returns {string[]}
     */
    sanitizeDef(input) {
        return input.split(',').map(s => s.trim());
    }
}

class WordType {
    /** Do not use.
     *  @param {string} wordType */
    constructor(wordType) {
        /** @type {string} */
        this.wordType = wordType;
        Object.seal(this);
    }
    static AdjectiveType = new WordType("Adjective");
    static NounBodyType = new WordType("Noun[Body]");
    static NounSpiritType = new WordType("Noun[Spirit]");
    static NounSoulType = new WordType("Noun[Soul]");
    static ExceptionalType = new WordType("Exception");
}


/** @type {{version: string, words: BaseWord[], exampleSentences: null}} */
var dictionary = {
    version: "2022-07-16.1",
    words: [
        new BaseWord("aa", WordType.AdjectiveType)
        .withAdj("young, new, fresh")
        .withVerb("make anew, renew, found, create, be new"),
    new BaseWord("abhài", WordType.NounBodyType)
        .withNoun("apathy")
        .withAdj("apathetic")
        .withAdv("apathetically")
        .withVerb("be apathetic"),
    new BaseWord("nhàsha", WordType.NounSoulType)
        .withNoun("ascension")
        .withAdj("ascending")
        .withVerb("ascend, dream"),
    new BaseWord("àleisha", WordType.AdjectiveType)
        .withAdj("black")
        .withVerb("blacken"),
    new BaseWord("àsara", WordType.AdjectiveType)
        .withAdj("red")
        .withVerb("redden, bleed"),
    new BaseWord("àsarei", WordType.AdjectiveType)
        .withAdj("pink")
        .withVerb("pinken"),
    new BaseWord("àzaare", WordType.NounSpiritType)
        .withNoun("lust")
        .withAdj("lustful")
        .withAdv("lustfully")
        .withVerb("lust"),
    new BaseWord("àzaashàbaa", WordType.NounSoulType)
        .withNoun("lust for spiritual wisdom")
        .withAdj("having lust for spiritual wisdom")
        .withAdv("like someone lusting for spiritual wisdom")
        .withVerb("lust for spiritual wisdom"),
    new BaseWord("àzajhòn", WordType.NounSoulType)
        .withNoun("judge")
        .withAdj("judgemental")
        .withAdv("judgingly")
        .withVerb("judge"),
    new BaseWord("àzajh", WordType.NounSoulType)
        .withNoun("severity")
        .withAdj("severe")
        .withAdv("severely")
        .withVerb("punish justly, restrain from doing good to those who do not deserve it"),
    new BaseWord("dhàzhònh", WordType.NounSpiritType)
        .withNoun("architect")
        .withAdv("like an architect")
        .withVerb("design architecture"),
    new BaseWord("dhàzhe", WordType.NounSpiritType)
        .withNoun("building")
        .withAdj("built")
        .withAdv("like a building")
        .withVerb("build"),
    new BaseWord("azòrài", WordType.NounSoulType)
        .withNoun("country, kingdom")
        .withAdj("national")
        .withAdv("nationally, nation-wide"),
    new BaseWord("beida", WordType.NounSoulType)
        .withNoun("lesson")
        .withAdj("taught, teached")
        .withAdv("teaching")
        .withVerb("teach"),
    new BaseWord("beidaòa", WordType.NounSoulType)
        .withNoun("teacher")
        .withAdj("taught, teached")
        .withAdv("like a teacher")
        .withVerb("teach"),
    new BaseWord("bho", WordType.NounSpiritType)
        .withNoun("rain")
        .withAdj("rain-soaked, berained")
        .withAdv("like rain")
        .withVerb("rain"),
    new BaseWord("dai", WordType.NounBodyType)
        .withNoun("body, flesh")
        .withAdj("embodied")
        .withVerb("embody"),
    new BaseWord("adaia", WordType.NounBodyType)
        .withNoun("people"),
    new BaseWord("daidheola", WordType.NounBodyType)
        .withNoun("ugliness")
        .withAdj("ugly")
        .withVerb("make ugly"),
    new BaseWord("dòei", WordType.NounBodyType)
        .withNoun("stone")
        .withAdj("stone")
        .withAdv("like stone"),
    new BaseWord("edhe", WordType.AdjectiveType)
        .withAdj("sad"),
    new BaseWord("edheola", WordType.NounSpiritType)
        .withNoun("sadness")
        .withAdj("sad")
        .withAdv("sadly")
        .withVerb("cry"),
    new BaseWord("eie", WordType.NounSpiritType)
        .withNoun("spirit, mind")
        .withAdj("spirited")
        .withVerb("give (deep) thought to, philosophize"),
    new BaseWord("eiedeia", WordType.NounSoulType)
        .withNoun("harmony, order")
        .withAdj("harmonious")
        .withAdv("harmoniously")
        .withVerb("harmonize, be in harmony with oneself"),
    new BaseWord("eiedheola", WordType.NounBodyType)
        .withNoun("dissonance, chaos")
        .withAdj("chaotic")
        .withAdv("chaotically")
        .withVerb("be chaotic, not be in harmony with oneself"),
    new BaseWord("eiedòei", WordType.NounSpiritType)
        .withNoun("salt")
        .withAdj("salty")
        .withVerb("salt"),
    new BaseWord("eieshiò", WordType.NounSpiritType)
        .withNoun("milk")
        .withAdj("milky")
        .withAdv("like milk")
        .withVerb("drink (milk)"),
    new BaseWord("eioba", WordType.NounSoulType)
        .withNoun("fire, blaze")
        .withAdj("burned")
        .withAdv("like fire")
        .withVerb("burn"),
    new BaseWord("eiòzàza", WordType.NounSoulType)
        .withNoun("sulfur")
        .withAdj("sulfur")
        .withVerb("smell of sulfur"),
    new BaseWord("efòeida", WordType.NounSpiritType)
        .withNoun("melancholy")
        .withAdj("melancholic")
        .withAdv("melancholically")
        .withVerb("be melancholic"),
    new BaseWord("fia", WordType.NounSoulType)
        .withNoun("life")
        .withAdj("living")
        .withVerb("live"),
    new BaseWord("ishaa", WordType.NounSoulType)
        .withNoun("mercy")
        .withAdj("merciful")
        .withAdv("mercifully")
        .withVerb("have mercy"),
    new BaseWord("nàdhiràn", WordType.NounSpiritType)
        .withNoun("promise")
        .withAdj("promised")
        .withVerb("promise"),
    new BaseWord("maola", WordType.NounSoulType)
        .withNoun("descent")
        .withAdj("descending")
        .withVerb("descend, have a nightmare"),
    new BaseWord("maole", WordType.NounSoulType)
        .withNoun("death")
        .withAdj("dead")
        .withVerb("die"),
    new BaseWord("medei", WordType.NounSpiritType)
        .withNoun("forest, grove")
        .withAdj("overgrown"),
    new BaseWord("mòen", WordType.NounSoulType)
        .withNoun("music")
        .withAdj("musical")
        .withAdv("musically")
        .withVerb("play music"),
    new BaseWord("noedhe", WordType.NounBodyType)
        .withNoun("hatred")
        .withAdj("hated")
        .withAdv("hating")
        .withVerb("hate"),
    new BaseWord("oàn", WordType.NounBodyType)
        .withNoun("warrior, strong person")
        .withAdj("strong, fighting, warrior-like")
        .withAdv("like a warrior")
        .withVerb("fight"),
    new BaseWord("qàndàn", WordType.NounSoulType)
        .withNoun("all")
        .withAdj("whole")
        .withAdv("whole, wholly")
        .withVerb("make whole, enrich"),
    new BaseWord("qàndànàn", WordType.NounSoulType)
        .withNoun("nothing")
        .withAdj("empty")
        .withVerb("make empty"),
    new BaseWord("lhamiànòn", WordType.NounSoulType)
        .withNoun("enlightened, buddha")
        .withAdj("enlightened")
        .withAdv("like an enlightened being")
        .withVerb("make enlightened"),
    new BaseWord("qàjhia", WordType.NounSoulType)
        .withNoun("spiritual beauty")
        .withAdj("beautiful")
        .withAdv("beautifully")
        .withVerb("beautify"),
    new BaseWord("qàjhiò", WordType.NounSoulType)
        .withNoun("prayer, research, art")
        .withAdj("researched")
        .withVerb("pray, do research"),
    new BaseWord("qànhàsha", WordType.NounSoulType)
        .withNoun("theurgy")
        .withVerb("practice theurgy"),
    new BaseWord("qàjhamaola", WordType.NounSoulType)
        .withNoun("demonology")
        .withVerb("summon, enshrine (from Hell)"),
    new BaseWord("qàjhamaolaòa", WordType.NounSoulType)
        .withNoun("demonologer")
        .withVerb("summon, enshrine (from Hell)"),
    new BaseWord("qàjhiòqa", WordType.NounSoulType)
        .withNoun("priest, philosopher, theurge")
        .withAdv("priesterly, like a priest")
        .withVerb("pray, do research, practice theurgy (professionally)"),
    new BaseWord("lhoa", WordType.AdjectiveType)
        .withAdj("old")
        .withAdv("elderly")
        .withVerb("make old"),
    new BaseWord("lhoànha", WordType.AdjectiveType)
        .withAdj("very old")
        .withAdv("older elderly")
        .withVerb("make older"),
    new BaseWord("rei", WordType.NounSoulType)
        .withNoun("lady (polite)")
        .withAdj("lady-like")
        .withAdv("lady-like, like a lady"),
    new BaseWord("roàn", WordType.NounSoulType)
        .withNoun("king")
        .withAdj("king-like")
        .withAdv("king-like, like a king"),
    new BaseWord("shàbaa", WordType.NounSoulType)
        .withNoun("wisdom (intuitive, instinctive)")
        .withAdj("wise")
        .withAdv("wisely")
        .withVerb("act wisely"),
    new BaseWord("shài", WordType.AdjectiveType)
        .withAdj("false, wrong")
        .withAdv("falsely")
        .withVerb("lie"),
    new BaseWord("sàia", WordType.NounSoulType)
        .withNoun("language")
        .withAdj("told")
        .withAdv("conversationally")
        .withVerb("say, tell, talk"),
    new BaseWord("shaòa", WordType.NounSpiritType)
        .withNoun("physical beauty")
        .withAdj("beautiful")
        .withAdv("beautifully")
        .withVerb("beautify"),
    new BaseWord("sabhei", WordType.NounSoulType)
        .withNoun("sky")
        .withAdj("celestial"),
    new BaseWord("saroah", WordType.NounSoulType)
        .withNoun("Saroah"),
    new BaseWord("shei", WordType.NounSpiritType)
        .withNoun("reverence")
        .withAdj("revered")
        .withAdv("reveringly")
        .withVerb("revere"),
    new BaseWord("sheishianàn", WordType.NounSoulType)
        .withNoun("Sheishianan"),
    new BaseWord("shi", WordType.AdjectiveType)
        .withAdj("evil")
        .withAdv("evilly, maliciously")
        .withVerb("do evil"),
    new BaseWord("sio", WordType.NounSpiritType)
        .withNoun("water")
        .withAdj("watery")
        .withAdv("like water, fluid")
        .withVerb("drink (water)"),
    new BaseWord("soeise", WordType.NounSpiritType)
        .withNoun("Soeise, fantastical light blue flower"),
    new BaseWord("soelò", WordType.NounSoulType)
        .withNoun("love")
        .withAdj("loving, loved")
        .withAdv("lovingly")
        .withVerb("love"),
    new BaseWord("dhaa", WordType.NounSoulType)
        .withNoun("rose")
        .withVerb("develop, grow"),
    new BaseWord("dhaa", WordType.NounSoulType)
        .withNoun("dhaa (currency), rose"),
    new BaseWord("dhài", WordType.NounSpiritType)
        .withNoun("value")
        .withAdj("valued")
        .withVerb("value"),
    new BaseWord("dhàiqa", WordType.NounBodyType)
        .withNoun("trade, economy")
        .withAdj("traded")
        .withAdv("economically")
        .withVerb("trade, contemplate the economy"),
    new BaseWord("dhàiòei", WordType.NounBodyType)
        .withNoun("trader, merchant")
        .withAdv("like a merchant, like a trader")
        .withVerb("trade"),
    new BaseWord("dhaòlò", WordType.NounSoulType)
        .withNoun("creation, flowering")
        .withAdj("created")
        .withVerb("create, form"),
    new BaseWord("dhaòlòqe", WordType.NounBodyType)
        .withNoun("gardener, worker")
        .withAdv("like a worker, like a gardener")
        .withVerb("garden, cultivate, make money"),
    new BaseWord("dàl", WordType.NounSoulType)
        .withNoun("shrine, home of something spiritual")
        .withAdj("enshrined")
        .withAdv("like an enshrined")
        .withVerb("enshrine"),
    new BaseWord("dàl fia", WordType.NounSoulType)
        .withNoun("heaven, paradise, life-shrine")
        .withAdj("heavenly")
        .withAdv("heavenly")
        .withVerb("become in harmony with oneself"),
    new BaseWord("dàl maole", WordType.NounSoulType)
        .withNoun("hell, underworld, death-shrine")
        .withAdj("hellish")
        .withAdv("hellish")
        .withVerb("lose touch with oneself"),
    new BaseWord("foeia", WordType.NounSoulType)
        .withNoun("movement, action")
        .withAdj("moving, moved")
        .withVerb("move, come, go"),
    new BaseWord("foera", WordType.NounBodyType)
        .withNoun("robbery, theft")
        .withAdj("stolen")
        .withVerb("steal, rob"),
    new BaseWord("zhaa", WordType.NounSoulType)
        .withNoun("god")
        .withAdj("divine")
        .withAdv("like a god")
        .withVerb("pray"),
    new BaseWord("zhaadha", WordType.NounSoulType)
        .withNoun("Zhaadha"),
    new BaseWord("zàjhia", WordType.NounSoulType)
        .withNoun("wisdom (analytical, technical)")
        .withAdj("wise")
        .withAdv("wisely")
        .withVerb("act wisely"),
    new BaseWord("zaqadài", WordType.NounBodyType)
        .withNoun("meat")
        .withAdj("meaty")
        .withAdv("raw"),
    new BaseWord("zàqia", WordType.NounSoulType)
        .withNoun("end")
        .withAdj("ended")
        .withVerb("end"),
    new BaseWord("zàqiaanàn", WordType.AdjectiveType)
        .withAdj("immortal, everlasting")
        .withAdv("forever, unendingly"),
    new BaseWord("zàqio", WordType.NounSoulType)
        .withNoun("beginning, start")
        .withAdj("began")
        .withVerb("begin, start"),
    new BaseWord("zàqioànàn", WordType.AdjectiveType)
        .withAdj("ancient, without beginning")
        .withAdv("even older elderly")
        .withVerb("make ancient"),
    new BaseWord("zàza", WordType.NounSoulType)
        .withNoun("soul, star")
        .withAdv("like a soul, like a star")
        .withVerb("glimmer, shine"),
    new BaseWord("zejhòa", WordType.NounSoulType)
        .withNoun("victory")
        .withAdj("victorious")
        .withAdv("victoriously")
        .withVerb("win"),
    new BaseWord("nàdhiràn", WordType.NounSoulType)
        .withNoun("vow")
        .withAdj("avowed")
        .withVerb("vow"),
    new BaseWord("àdhàn", WordType.NounSpiritType)
        .withNoun("time")
        .withAdj("temporal")
        .withAdv("timely")
        .withVerb("pass (of time)"),
    new BaseWord("dhào", WordType.NounSpiritType)
        .withNoun("eye")
        .withAdj("seen")
        .withVerb("see, view, watch"),
    new BaseWord("àmeiòn", WordType.NounSoulType)
        .withNoun("travel, journey")
        .withAdj("travelling, traveling")
        .withVerb("make a long journey, travel"),
    new BaseWord("màjha", WordType.NounBodyType)
        .withNoun("city")
        .withAdj("bustling"),
    new BaseWord("àjha", WordType.NounSpiritType)
        .withNoun("loudness")
        .withAdj("loud")
        .withAdv("loudly")
        .withVerb("make a loud sound"),
    new BaseWord("ineira", WordType.NounSpiritType)
        .withNoun("silence")
        .withAdj("silent")
        .withAdv("silently")
        .withVerb("don't make a sound"),
    new BaseWord("jhàse", WordType.NounSoulType)
        .withNoun("temple"),
    new BaseWord("bhàjade", WordType.NounBodyType)
        .withNoun("contagion")
        .withAdj("contagious"),
    new BaseWord("lhaore", WordType.NounBodyType)
        .withNoun("staff, armament, sword"),
    new BaseWord("bham", WordType.NounSpiritType)
        .withNoun("tear"),
    new BaseWord("deidòa", WordType.NounBodyType)
        .withNoun("fang"),
    new BaseWord("zàzadòe", WordType.NounSoulType)
        .withNoun("grave"),
    new BaseWord("jàlha", WordType.NounBodyType)
        .withNoun("speed, haste")
        .withAdj("quick"),
    new BaseWord("òzhòàm", WordType.NounSpiritType)
        .withNoun("connection, synergy")
        .withAdj("connected"),
    new BaseWord("zhafàfài", WordType.NounBodyType)
        .withNoun("shield"),
    new BaseWord("jheiqaore", WordType.NounSpiritType)
        .withNoun("oblivion"),
    new BaseWord("zhàdeidòa", WordType.NounSoulType)
        .withNoun("lightning"),
    new BaseWord("fàndhe", WordType.NounSoulType)
        .withNoun("essence"),
    new BaseWord("mbishò", WordType.NounSoulType)
        .withNoun("revelation"),
    new BaseWord("lhamiàn", WordType.NounSoulType)
        .withNoun("enlightenment"),
    new BaseWord("nàdhi", WordType.NounSpiritType)
        .withNoun("faith, trust (in someone)"),
    new BaseWord("ràn", WordType.NounSpiritType)
        .withNoun("speech"),
    new BaseWord("qeiobha", WordType.NounBodyType)
        .withNoun("nigredo, sacred form of \"black\""),
    new BaseWord("mbòji", WordType.NounSpiritType)
        .withNoun("albedo, sacred form of \"white\""),
    new BaseWord("jheisiò", WordType.NounSpiritType)
        .withNoun("citrinitas, sacred form of \"yellow\""),
    new BaseWord("àzhàlha", WordType.NounSoulType)
        .withNoun("rubedo, sacred form of \"red\""),
    new BaseWord("nhaobe", WordType.NounSoulType)
        .withNoun("mountain"),
    new BaseWord("eiòqe", WordType.NounSpiritType)
        .withNoun("mask"),
    ],
    exampleSentences: null
}