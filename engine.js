/* ==========================================================================
   engine.js — Parser, resolver, state manager, renderer, game loop.

   Data-driven: all room/item/NPC/score/hint data lives in world.js; all
   long-form prose lives in content.js. The engine never hard-codes world
   content. To add rooms, items, NPCs: edit world.js + content.js only.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  Constants & tables                                                 */
  /* ------------------------------------------------------------------ */

  const DIRECTIONS = {
    n: "north", s: "south", e: "east", w: "west",
    ne: "northeast", nw: "northwest", se: "southeast", sw: "southwest",
    u: "up", d: "down",
    north: "north", south: "south", east: "east", west: "west",
    northeast: "northeast", northwest: "northwest",
    southeast: "southeast", southwest: "southwest",
    up: "up", down: "down",
    in: "inside", inside: "inside", into: "inside",
    out: "outside", outside: "outside"
  };

  const VERB_SYNONYMS = {
    // movement
    "go": "GO", "walk": "GO", "move": "GO", "head": "GO",
    "travel": "GO", "run": "GO", "proceed": "GO", "continue": "GO",
    "enter": "GO", "exit": "GO", "leave": "GO",

    // take
    "take": "TAKE", "get": "TAKE", "grab": "TAKE", "pickup": "TAKE",
    "acquire": "TAKE", "snag": "TAKE", "collect": "TAKE", "pocket": "TAKE",

    // drop
    "drop": "DROP", "discard": "DROP", "toss": "DROP", "throw": "DROP",
    "putdown": "DROP", "setdown": "DROP", "place": "DROP",

    // look
    "look": "LOOK", "l": "LOOK", "examine": "LOOK", "x": "LOOK",
    "inspect": "LOOK", "check": "LOOK", "study": "LOOK",
    "observe": "LOOK", "read": "LOOK", "peer": "LOOK", "search": "LOOK",

    // use
    "use": "USE", "apply": "USE", "insert": "USE",
    "activate": "USE", "flip": "USE", "press": "USE", "turnon": "USE",

    // give
    "give": "GIVE", "offer": "GIVE", "hand": "GIVE", "trade": "GIVE",
    "show": "GIVE", "present": "GIVE", "feed": "GIVE",

    // talk
    "talk": "TALK", "speak": "TALK", "ask": "TALK", "say": "TALK",
    "chat": "TALK", "tell": "TALK", "greet": "TALK", "yell": "TALK",
    "shout": "TALK",

    // open
    "open": "OPEN", "unlock": "OPEN", "pry": "OPEN", "force": "OPEN",

    // attack / pet
    "attack": "ATTACK", "hit": "ATTACK", "fight": "ATTACK",
    "punch": "ATTACK", "kick": "ATTACK", "strike": "ATTACK", "break": "ATTACK",
    "pet": "PET", "stroke": "PET",

    // meta
    "inventory": "INVENTORY", "i": "INVENTORY", "inv": "INVENTORY",
    "items": "INVENTORY",
    "help": "HELP", "hint": "HINT",
    "wait": "WAIT", "z": "WAIT",
    "save": "SAVE", "load": "LOAD", "restore": "LOAD", "saves": "SAVES",
    "score": "SCORE", "points": "SCORE",
    "quit": "QUIT", "restart": "RESTART",
    "undo": "UNDO", "again": "AGAIN", "g": "AGAIN",
    "map": "MAP",

    // easter-egg / atmosphere
    "sing": "_SING", "dance": "_DANCE", "pray": "_PRAY",
    "swim": "_SWIM", "jump": "_JUMP", "fly": "_FLY",
    "scream": "_SCREAM", "sleep": "_SLEEP", "eat": "_EAT",
    "hello": "_HELLO", "hi": "_HELLO",
    "diagnose": "_DIAGNOSE",
    "xyzzy": "_XYZZY", "plugh": "_PLUGH", "plover": "_PLOVER",

    // new verbs
    "push": "PUSH", "shove": "PUSH", "slide": "PUSH",
    "buy": "BUY", "purchase": "BUY", "pay": "BUY", "order": "BUY",
    "smell": "SMELL", "sniff": "SMELL",
    "listen": "LISTEN", "hear": "LISTEN",
    "call": "CALL", "phone": "CALL", "dial": "CALL",
    "kiss": "KISS", "hug": "KISS",
    "undress": "UNDRESS", "strip": "UNDRESS",
    "examine self": "_SELF", "look self": "_SELF",
    // additional natural synonyms
    "wear": "USE", "put": "USE", "attach": "USE", "combine": "USE",
    "connect": "USE", "tie": "USE", "thread": "USE", "fasten": "USE",
    "unlock": "OPEN", "knock": "OPEN",
    "remove": "DROP", "unwear": "DROP", "doff": "DROP",
    "climb": "GO", "approach": "GO", "enter": "GO",
    "touch": "LOOK", "feel": "LOOK",
    "tip": "GIVE", "offer": "GIVE",
    "selfexamine": "_SELF"
  };

  // Multi-word verb phrases collapsed before tokenization.
  const MULTIWORD_VERBS = [
    ["pick up", "pickup"],
    ["put down", "putdown"],
    ["put away", "putdown"],
    ["set down", "setdown"],
    ["turn on", "turnon"],
    ["look at", "look"],
    ["look in", "look"],
    ["look under", "look"],
    ["look around", "look"],
    ["look at me", "selfexamine"],
    ["look at myself", "selfexamine"],
    ["examine me", "selfexamine"],
    ["examine myself", "selfexamine"],
    ["what do i have", "inventory"],
    ["check pockets", "inventory"],
    ["what am i carrying", "inventory"],
    ["what do i do", "help"],
    ["how do i", "help"],
    ["go inside", "enter inside"],
    ["go in", "enter inside"],
    ["go out", "leave"],
    ["step out", "leave"],
    ["step into", "enter inside"],
    ["climb up", "go up"],
    ["climb down", "go down"],
    // "talk to/with NPC" — strip "to"/"with" so "about" can split correctly
    ["talk to", "talk"],
    ["talk with", "talk"],
    ["speak to", "speak"],
    ["speak with", "speak"],
    ["chat with", "chat"],
    // "where am i" etc → bare look
    ["where am i", "look"],
    ["where are we", "look"],
    ["what do i see", "look"],
    ["what is here", "look"],
    ["what's here", "look"]
  ];

  const PREPOSITIONS = [
    "on", "at", "to", "with", "into", "in",
    "from", "about", "through", "under", "behind", "over"
  ];

  const ARTICLES = ["the", "a", "an", "some", "my"];

  const CONTRACTIONS = {
    "don't": "do not", "can't": "cannot", "won't": "will not",
    "it's": "it is", "i'm": "i am", "i've": "i have",
    "you're": "you are", "that's": "that is", "isn't": "is not",
    "doesn't": "does not", "didn't": "did not"
  };

  const PROFANITY = [
    "fuck", "shit", "damn", "bitch", "asshole", "hell", "crap"
  ];

  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */

  const W = window.WORLD;
  const C = window.CONTENT;

  let STATE = null;
  let PREV_STATE = null;
  let LAST_COMMAND = null;
  let FAILURE_CURSORS = {};
  let CURRENT_PARSED = null;   // set by dispatch(), read by printAmbiguous()
  let PENDING_DISAMBIG = null; // set when player must clarify an ambiguous noun

  /* Typewriter */
  const TYPE_DELAY = 4;               // ms per character
  const PRINT_QUEUE = [];
  let TYPING = false;
  let SKIP_ALL = false;

  /* Save slots */
  const SAVE_SLOTS = ["1", "2", "3"];
  const DEFAULT_SLOT = "1";

  function freshState() {
    const roomStates = {};
    for (const rid of Object.keys(W.rooms)) {
      const r = W.rooms[rid];
      roomStates[rid] = {
        visited: false,
        items: Array.isArray(r.items) ? [...r.items] : [],
        npcs: Array.isArray(r.npcs) ? [...r.npcs] : [],
        flags: Object.assign({}, r.flags || {})
      };
    }
    return {
      currentRoom: W.meta.startRoom,
      previousRoom: null,
      inventory: Array.isArray(W.meta.startInventory) ? [...W.meta.startInventory] : [],
      money: W.meta.startMoney !== undefined ? W.meta.startMoney : 20,
      score: 0,
      maxScore: computeMaxScore(),
      moves: 0,
      flags: {},
      scoredEvents: {},
      hintLevel: {},
      talkCount: {},
      spawned: {},
      roomTurns: {},
      roomStates,
      history: []
    };
  }

  function computeMaxScore() {
    let sum = 0;
    for (const k in (W.scoreEvents || {})) sum += W.scoreEvents[k];
    return sum || W.meta.maxScore || 0;
  }

  /* ------------------------------------------------------------------ */
  /*  DOM hooks                                                          */
  /* ------------------------------------------------------------------ */

  const outEl = document.getElementById("output");
  const inputEl = document.getElementById("input");
  const formEl = document.getElementById("input-form");
  const scoreEl = document.getElementById("score");
  const maxScoreEl = document.getElementById("max-score");
  const movesEl = document.getElementById("moves");

  function escHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  /* ------------------------------------------------------------------ */
  /*  Typewriter-aware output                                            */
  /* ------------------------------------------------------------------ */

  function enqueuePrint(html, cls) {
    PRINT_QUEUE.push({ html, cls, instant: false });
    if (!TYPING) drainQueue();
  }
  function enqueuePrintInstant(html, cls) {
    PRINT_QUEUE.push({ html, cls, instant: true });
    if (!TYPING) drainQueue();
  }
  function drainQueue() {
    if (!PRINT_QUEUE.length) { TYPING = false; SKIP_ALL = false; return; }
    TYPING = true;
    const job = PRINT_QUEUE.shift();
    if (job.instant || SKIP_ALL) {
      renderInstant(job.html, job.cls);
      drainQueue();
    } else {
      typewriteLine(job.html, job.cls, drainQueue);
    }
  }
  // Scroll #output just enough to reveal the bottom of `div`.
  // Never scrolls backward — only advances if the div is below the fold.
  function scrollToReveal(div) {
    const bottom = div.offsetTop + div.offsetHeight;
    const needed = bottom - outEl.clientHeight;
    if (needed > outEl.scrollTop) outEl.scrollTop = needed;
  }

  function renderInstant(html, cls) {
    const div = document.createElement("div");
    div.className = "line" + (cls ? " " + cls : "");
    div.innerHTML = html;
    outEl.appendChild(div);
    if (cls === "echo") {
      // Anchor view so the player's command is at the top and the
      // response builds downward into the readable area.
      outEl.scrollTop = Math.max(0, div.offsetTop - 8);
    } else {
      scrollToReveal(div);
    }
  }
  function typewriteLine(html, cls, done) {
    const div = document.createElement("div");
    div.className = "line typing" + (cls ? " " + cls : "");
    div.innerHTML = html;
    outEl.appendChild(div);
    // Reveal the start of this line before typing begins.
    scrollToReveal(div);

    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
      nodes.push({ node: n, full: n.textContent });
      n.textContent = "";
    }
    if (!nodes.length) { div.classList.remove("typing"); done(); return; }

    let i = 0, j = 0;
    function finishAll() {
      for (const nd of nodes) nd.node.textContent = nd.full;
      div.classList.remove("typing");
      scrollToReveal(div);
      done();
    }
    function step() {
      if (SKIP_ALL) { finishAll(); return; }
      if (i >= nodes.length) { div.classList.remove("typing"); done(); return; }
      const cur = nodes[i];
      if (j >= cur.full.length) { i++; j = 0; step(); return; }
      cur.node.textContent += cur.full[j++];
      scrollToReveal(div);
      setTimeout(step, TYPE_DELAY);
    }
    step();
  }

  function print(text, cls) {
    const lines = String(text).split(/\n/);
    for (const ln of lines) enqueuePrint(escHTML(ln), cls);
  }
  function printInstant(text, cls) {
    const lines = String(text).split(/\n/);
    for (const ln of lines) enqueuePrintInstant(escHTML(ln), cls);
  }
  function printRaw(html, cls) { enqueuePrint(html, cls); }
  function printEcho(cmd) { enqueuePrintInstant(escHTML(cmd), "echo"); }
  function printRoomName(name) { enqueuePrint(escHTML(name), "room-name"); }
  function printRoomDesc(text) {
    let html = escHTML(text);
    const rs = currentRoomState();
    const itemIds = (rs && rs.items) || [];
    const npcIds = (rs && rs.npcs) || [];
    for (const iid of itemIds) {
      const it = W.items[iid]; if (!it) continue;
      const names = [it.name].concat(it.aliases || []);
      for (const nm of names) {
        const pat = new RegExp("\\b(" + escapeRegex(nm) + ")\\b", "i");
        html = html.replace(pat, '<span class="item-word">$1</span>');
      }
    }
    for (const nid of npcIds) {
      const np = W.npcs[nid]; if (!np) continue;
      const names = [np.name].concat(np.aliases || []);
      for (const nm of names) {
        const pat = new RegExp("\\b(" + escapeRegex(nm) + ")\\b", "i");
        html = html.replace(pat, '<span class="npc-word">$1</span>');
      }
    }
    const parts = html.split(/\n/);
    for (const p of parts) enqueuePrint(p, "room-desc");
  }
  function updateHUD() {
    scoreEl.textContent = STATE.score;
    maxScoreEl.textContent = STATE.maxScore;
    movesEl.textContent = STATE.moves;
  }

  /* ------------------------------------------------------------------ */
  /*  Pool cycler                                                        */
  /* ------------------------------------------------------------------ */

  function pool(name, subs) {
    const arr = C.pools[name] || [];
    if (!arr.length) return "";
    const i = (FAILURE_CURSORS[name] || 0) % arr.length;
    FAILURE_CURSORS[name] = i + 1;
    let s = arr[i];
    if (subs) {
      for (const k in subs) s = s.replace(new RegExp("\\{" + k + "\\}", "g"), subs[k]);
    }
    return s;
  }

  /* ------------------------------------------------------------------ */
  /*  Fuzzy matching (Levenshtein)                                       */
  /* ------------------------------------------------------------------ */

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0]; dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        dp[j] = Math.min(
          dp[j] + 1,
          dp[j - 1] + 1,
          prev + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
        prev = tmp;
      }
    }
    return dp[n];
  }

  function fuzzyBest(word, candidates) {
    if (!word || word.length < 4) return null;
    // Tighter threshold for short words: distance-1 for ≤5 chars, distance-2 for longer.
    // This prevents e.g. "glass" (distance-2 from "brass") wrongly matching brass_key.
    const maxDist = word.length <= 5 ? 1 : 2;
    let best = null, bestD = maxDist + 1;
    for (const c of candidates) {
      if (!c || c.length < 3) continue;
      const d = levenshtein(word, c);
      if (d < bestD || (d === bestD && c.length < (best || "").length)) {
        best = c; bestD = d;
      }
    }
    return bestD <= 2 ? best : null;
  }

  /* ------------------------------------------------------------------ */
  /*  Parser                                                             */
  /* ------------------------------------------------------------------ */

  function normalize(raw) {
    let s = (raw || "").toLowerCase().trim();
    if (!s) return "";
    s = s.replace(/[.!?,;:"()]/g, " ");
    for (const k in CONTRACTIONS) {
      s = s.replace(new RegExp("\\b" + escapeRegex(k) + "\\b", "g"), CONTRACTIONS[k]);
    }
    s = s.replace(/\s+/g, " ").trim();
    for (const [phrase, token] of MULTIWORD_VERBS) {
      s = s.replace(new RegExp("\\b" + escapeRegex(phrase) + "\\b", "g"), token);
    }
    return s;
  }

  function stripArticles(tokens) {
    return tokens.filter(t => !ARTICLES.includes(t));
  }
  function isDirectionToken(tok) {
    return Object.prototype.hasOwnProperty.call(DIRECTIONS, tok);
  }

  function parse(raw) {
    const norm = normalize(raw);
    if (!norm) return { verb: null, empty: true };

    for (const w of PROFANITY) {
      if (norm.split(/\s+/).includes(w)) return { verb: "_PROFANITY" };
    }

    let tokens = stripArticles(norm.split(/\s+/));
    if (!tokens.length) return { verb: null, empty: true };

    // Bare direction
    if (tokens.length === 1 && isDirectionToken(tokens[0])) {
      return { verb: "GO", direction: DIRECTIONS[tokens[0]] };
    }

    const head = tokens[0];
    let verb = VERB_SYNONYMS[head] || null;
    let verbWordUsed = head;

    // Fuzzy verb
    if (!verb) {
      const match = fuzzyBest(head, Object.keys(VERB_SYNONYMS));
      if (match) {
        verb = VERB_SYNONYMS[match];
        verbWordUsed = match;
        print("(Assuming: " + match + ")", "system");
      }
    }

    const rest = tokens.slice(1);

    if (verb === "GO") {
      if (rest.length === 0) return { verb: "GO", direction: null };
      const dirTok = rest[0];
      if (isDirectionToken(dirTok)) return { verb: "GO", direction: DIRECTIONS[dirTok] };
      // "enter inside" → direction: inside
      const joined = rest.join(" ");
      if (isDirectionToken(joined)) return { verb: "GO", direction: DIRECTIONS[joined] };
      return { verb: "GO", direction: null, stray: joined };
    }

    if (!verb) {
      return { verb: "_UNKNOWN", word: head };
    }

    // Split by preposition
    let prepIdx = -1, prepWord = null;
    for (let i = 0; i < rest.length; i++) {
      if (PREPOSITIONS.includes(rest[i])) { prepIdx = i; prepWord = rest[i]; break; }
    }

    let directRaw, indirectRaw = null;
    if (prepIdx >= 0) {
      directRaw = rest.slice(0, prepIdx).join(" ").trim();
      indirectRaw = rest.slice(prepIdx + 1).join(" ").trim();
    } else {
      directRaw = rest.join(" ").trim();
    }

    if (!directRaw && indirectRaw) {
      directRaw = indirectRaw;
      indirectRaw = null;
    }

    return {
      verb,
      direct: directRaw || null,
      indirect: indirectRaw || null,
      prep: prepWord,
      rawRest: rest.join(" ")
    };
  }

  /* ------------------------------------------------------------------ */
  /*  World queries                                                      */
  /* ------------------------------------------------------------------ */

  function currentRoom() { return W.rooms[STATE.currentRoom]; }
  function currentRoomState() { return STATE.roomStates[STATE.currentRoom]; }

  function accessibleEntityIds() {
    const ids = new Set();
    for (const id of STATE.inventory) ids.add(id);
    const rs = currentRoomState();
    for (const id of rs.items) ids.add(id);
    for (const id of rs.npcs) ids.add(id);
    // scenery in room description via room.scenery list (optional)
    const r = currentRoom();
    if (r && Array.isArray(r.scenery)) for (const id of r.scenery) ids.add(id);
    return Array.from(ids);
  }

  function entityById(id) { return W.items[id] || W.npcs[id] || null; }

  function resolveNoun(phrase, opts) {
    opts = opts || {};
    if (!phrase) return { notFound: true };
    const want = phrase.toLowerCase();

    const pools = [];
    if (opts.inventoryOnly) {
      pools.push({ ids: STATE.inventory, where: "inv" });
    } else {
      pools.push({ ids: STATE.inventory, where: "inv" });
      pools.push({ ids: currentRoomState().items, where: "room" });
      pools.push({ ids: currentRoomState().npcs, where: "npc" });
      // room scenery
      const r = currentRoom();
      if (r && Array.isArray(r.scenery)) pools.push({ ids: r.scenery, where: "scenery" });
    }

    const matches = [];
    const matchedIds = new Set();

    for (const p of pools) {
      for (const id of p.ids) {
        const e = entityById(id);
        if (!e) continue;
        const names = [e.name].concat(e.aliases || []);
        for (const nm of names) {
          const ln = nm.toLowerCase();
          if (
            ln === want ||
            ln.split(/\s+/).includes(want) ||
            want.split(/\s+/).every(w => ln.includes(w))
          ) {
            if (!matchedIds.has(id)) {
              matches.push({ id, where: p.where });
              matchedIds.add(id);
            }
            break;
          }
        }
      }
    }

    if (matches.length === 1) return { id: matches[0].id, where: matches[0].where };
    if (matches.length > 1) return { ambiguous: matches.map(m => m.id) };

    // Fuzzy against accessible entity aliases/names
    const candidates = [];
    const idByCand = {};
    for (const id of accessibleEntityIds()) {
      const e = entityById(id); if (!e) continue;
      const names = [e.name].concat(e.aliases || []).map(n => n.toLowerCase());
      for (const nm of names) {
        for (const tok of nm.split(/\s+/)) {
          if (tok.length >= 4) { candidates.push(tok); idByCand[tok] = id; }
        }
        candidates.push(nm); idByCand[nm] = id;
      }
    }
    const fz = fuzzyBest(want, candidates);
    if (fz && idByCand[fz]) {
      return { id: idByCand[fz], where: "fuzzy", fuzzy: fz };
    }

    // Global check — does entity exist at all, just not here?
    const globalMatch = findGlobalEntity(want);
    if (globalMatch) return { notHere: true, id: globalMatch };
    return { notFound: true };
  }

  function findGlobalEntity(want) {
    for (const id in W.items) {
      const e = W.items[id];
      const names = [e.name].concat(e.aliases || []).map(n => n.toLowerCase());
      if (names.includes(want) || names.some(n => n.split(/\s+/).includes(want))) return id;
    }
    for (const id in W.npcs) {
      const e = W.npcs[id];
      const names = [e.name].concat(e.aliases || []).map(n => n.toLowerCase());
      if (names.includes(want) || names.some(n => n.split(/\s+/).includes(want))) return id;
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /*  Darkness & light                                                   */
  /* ------------------------------------------------------------------ */

  function evaluateDarkness() {
    const room = currentRoom();
    if (!room) return false;
    if (room.dark === true) return true;
    if (room.flags && room.flags.dark) return true;
    return false;
  }
  function playerHasLight() {
    for (const id of STATE.inventory) {
      const it = W.items[id];
      if (it && (it.isLight || it.isLightSource)) return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ */
  /*  Room rendering                                                     */
  /* ------------------------------------------------------------------ */

  function renderRoom(forceFull) {
    const room = currentRoom();
    const rs = currentRoomState();
    if (!room) { print("[Missing room: " + STATE.currentRoom + "]", "error"); return; }

    const isDark = evaluateDarkness();
    const lit = playerHasLight();

    if (isDark && !lit) {
      printRoomName(room.name + " (dark)");
      printRoomDesc(room.descriptions.dark || pool("dark"));
      // No item list, no NPC list, no exits in the dark.
      // Allow exits labeled with `alwaysVisible: true` (e.g., the way back up)
      const exitDirs = Object.keys(room.exits || {}).filter(d => {
        const ex = room.exits[d];
        return ex && ex.alwaysVisible;
      });
      if (exitDirs.length) printInstant("Exits: " + exitDirs.join(", ") + ".", "system");
      return;
    }

    printRoomName(room.name);

    let desc;
    if (isDark && lit && room.descriptions.with_light) {
      desc = room.descriptions.with_light;
    } else {
      desc = room.descriptions.default || "";
      if (!forceFull && rs.visited && room.descriptions.short) {
        desc = room.descriptions.short;
      }
      for (const key of Object.keys(room.descriptions)) {
        if (["default", "short", "dark", "with_light"].includes(key)) continue;
        if (STATE.flags[key]) desc = room.descriptions[key];
      }
    }
    printRoomDesc(desc);

    const visible = rs.items.map(id => W.items[id]).filter(it => it && !it.scenery);
    if (visible.length) {
      const names = visible.map(it => aOrThe(it.name));
      printInstant("You can see " + joinList(names) + " here.", "item");
    }

    for (const nid of rs.npcs) {
      const n = W.npcs[nid]; if (!n) continue;
      printInstant(capitalize(n.name) + " is here.", "npc");
    }

    // Only list exits that actually go somewhere (have `to`) or trigger an
    // in-world interaction (e.g. the lighthouse finale). Pure blocked exits
    // exist only to give a flavor failMessage when attempted — don't advertise
    // them as real options.
    const exitDirs = Object.keys(room.exits || {}).filter(d => {
      const ex = room.exits[d];
      return ex && (ex.to || ex.interaction);
    });
    if (exitDirs.length) printInstant("Exits: " + exitDirs.join(", ") + ".", "system");
  }

  function joinList(arr) {
    if (arr.length <= 1) return arr.join("");
    if (arr.length === 2) return arr[0] + " and " + arr[1];
    return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
  }
  function aOrThe(name) {
    if (/^a |^an |^the |^some /i.test(name)) return name;
    return (/^[aeiou]/i.test(name) ? "an " : "a ") + name;
  }
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ------------------------------------------------------------------ */
  /*  Scoring                                                            */
  /* ------------------------------------------------------------------ */

  function awardScore(eventId) {
    if (!eventId) return;
    if (STATE.scoredEvents[eventId]) return;
    const pts = (W.scoreEvents || {})[eventId];
    if (!pts) return;
    STATE.scoredEvents[eventId] = true;
    STATE.score += pts;
    printInstant("[Your score just went up by " + pts + " points.]", "system");
    updateHUD();
  }

  /* ------------------------------------------------------------------ */
  /*  Event & flag plumbing                                              */
  /* ------------------------------------------------------------------ */

  function setFlag(name) {
    if (!name) return;
    STATE.flags[name] = true;
    checkSpawns();
    checkEndings();
  }

  function applyEventBlock(ev) {
    if (!ev) return;
    if (typeof ev === "string") { print(ev, "room-desc"); return; }
    if (ev.message) print(ev.message, "room-desc");
    if (ev.setFlag) setFlag(ev.setFlag);
    if (ev.setFlag2) setFlag(ev.setFlag2);
    if (Array.isArray(ev.setFlags)) for (const f of ev.setFlags) setFlag(f);
    if (ev.clearFlag) STATE.flags[ev.clearFlag] = false;
    if (ev.grantsItem) {
      STATE.inventory.push(ev.grantsItem);
      printInstant("(You now have " + aOrThe(W.items[ev.grantsItem].name) + ".)", "system");
    }
    if (ev.scoreEvent) awardScore(ev.scoreEvent);
    if (ev.setsMoney !== undefined) {
      STATE.money = ev.setsMoney;
      printInstant("(You now have $" + STATE.money + ".)", "system");
    }
    if (ev.addMoney !== undefined) {
      STATE.money += ev.addMoney;
      printInstant("(You now have $" + STATE.money + ".)", "system");
    }
    if (ev.movesTo) {
      STATE.previousRoom = STATE.currentRoom;
      STATE.currentRoom = ev.movesTo;
      currentRoomState().visited = true;
      renderRoom(true);
    }
    if (ev.showsMap) handleMap();
    if (ev.finale) runFinale(ev.finale);
  }

  function checkSpawns() {
    const spawns = W.spawns || {};
    for (const flag in spawns) {
      if (!STATE.flags[flag]) continue;
      const list = Array.isArray(spawns[flag]) ? spawns[flag] : [spawns[flag]];
      for (const spec of list) {
        const spawnId = spec.item || spec.npc;
        const key = flag + "::" + spec.room + "::" + spawnId;
        if (STATE.spawned[key]) continue;
        STATE.spawned[key] = true;
        const rs = STATE.roomStates[spec.room];
        if (!rs) continue;
        if (spec.item && !rs.items.includes(spec.item)) rs.items.push(spec.item);
        if (spec.npc  && !rs.npcs.includes(spec.npc))  rs.npcs.push(spec.npc);
        if (spec.announce) printInstant(spec.announce, "system");
      }
    }
  }

  function checkEndings() {
    const endings = W.endings || {};
    for (const key in endings) {
      const e = endings[key];
      if (STATE.flags["_ended_" + key]) continue;
      let fire = false;
      if (e.flag && STATE.flags[e.flag]) fire = true;
      if (Array.isArray(e.allFlags) && e.allFlags.every(f => STATE.flags[f])) fire = true;
      if (!fire) continue;
      STATE.flags["_ended_" + key] = true;
      if (e.finale) runFinale(e.finale);
      else if (e.message) print(e.message, "room-desc");
      if (e.scoreEvent) awardScore(e.scoreEvent);
      STATE.flags.game_won = (key === "win" || e.win === true);
      STATE.flags.game_over = true;
    }
  }

  function runFinale(key) {
    const f = (C.finale && C.finale[key]) || null;
    if (!f) return;
    for (const line of f) print(line, "room-desc");
  }

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                           */
  /* ------------------------------------------------------------------ */

  function exitPasses(ex) {
    if (!ex.requires) return { ok: true };
    const req = ex.requires;
    if (req.item && !STATE.inventory.includes(req.item)) return { ok: false };
    if (req.flag && !STATE.flags[req.flag]) return { ok: false };
    if (Array.isArray(req.items)) {
      for (const it of req.items) {
        if (!STATE.inventory.includes(it)) return { ok: false };
      }
    }
    if (Array.isArray(req.flags)) {
      for (const f of req.flags) if (!STATE.flags[f]) return { ok: false };
    }
    return { ok: true };
  }

  function handleGo(dir, stray) {
    if (!dir) {
      if (stray) return handlePush(stray);
      print("Which direction?", "error"); return false;
    }
    const room = currentRoom();
    const ex = (room.exits || {})[dir];
    if (!ex) { print("You can't go that way.", "error"); return false; }

    // Interaction-gated exit (e.g., lighthouse interior)
    if (ex.interaction) {
      const interactions = room.interactions || {};
      const inter = interactions[ex.interaction];
      if (!inter) { print("That way leads nowhere.", "error"); return false; }
      const pass = exitPasses({ requires: inter.requires });
      if (!pass.ok) {
        print(inter.failMessage || "You can't do that yet.", "error");
        return false;
      }
      if (inter.message) print(inter.message, "room-desc");
      if (inter.finale) runFinale(inter.finale);
      if (inter.setsFlag) setFlag(inter.setsFlag);
      if (Array.isArray(inter.setsFlags)) for (const f of inter.setsFlags) setFlag(f);
      if (inter.scoreEvent) awardScore(inter.scoreEvent);
      return true;
    }

    if (ex.blocked) { print(ex.failMessage || "You can't go that way.", "error"); return false; }

    const pass = exitPasses(ex);
    if (!pass.ok) {
      print(ex.failMessage || "Something blocks your way.", "error");
      return false;
    }
    if (ex.consumesItem && ex.requires && ex.requires.item) {
      removeFromInventory(ex.requires.item);
    }
    if (!ex.to) { print(ex.failMessage || "That way leads nowhere.", "error"); return false; }

    if (ex.scoreEvent) awardScore(ex.scoreEvent);
    if (ex.message) printInstant(ex.message, "system");

    STATE.previousRoom = STATE.currentRoom;
    STATE.currentRoom = ex.to;
    const rs = currentRoomState();
    const firstVisit = !rs.visited;
    rs.visited = true;

    const dest = currentRoom();
    if (firstVisit && dest.onEnterFirst) applyOnEnter(dest.onEnterFirst);
    if (dest.onEnter) applyOnEnter(dest.onEnter);

    renderRoom(firstVisit);
    checkEndings();
    return true;
  }

  function applyOnEnter(ev) {
    if (typeof ev === "string") {
      print(ev, "room-desc");
      return;
    }
    applyEventBlock(ev);
  }

  function handleLook(obj) {
    if (!obj) { renderRoom(true); return false; }
    // Self-examination special case
    const selfWords = ["self", "yourself", "me", "myself", "mirror"];
    if (selfWords.includes((obj || "").toLowerCase())) {
      print((C.specials && C.specials.self) || "You look fine.", "room-desc");
      return false;
    }
    const res = resolveNoun(obj);
    if (res.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (res.notHere) { print(pool("notAccessible", { noun: obj }), "error"); return false; }
    if (res.ambiguous) { printAmbiguous(res.ambiguous); return false; }
    const e = entityById(res.id);
    print(e.examine || e.description || "You see nothing special.", "room-desc");
    // onExamine: fire once, guarded by doneFlag
    if (e.onExamine && (!e.onExamine.doneFlag || !STATE.flags[e.onExamine.doneFlag])) {
      applyEventBlock(e.onExamine);
      if (e.onExamine.doneFlag) STATE.flags[e.onExamine.doneFlag] = true;
    }
    return false;
  }

  function handleTake(obj) {
    if (!obj) { print(pool("missingObject", { verb: "take" }), "error"); return false; }
    if (obj === "all" || obj === "everything") {
      const rs = currentRoomState();
      const ids = rs.items.filter(id => {
        const it = W.items[id];
        return it && it.takeable !== false && it.portable !== false && !it.scenery;
      });
      if (!ids.length) { print("There's nothing here to take.", "error"); return false; }
      for (const id of ids) takeById(id);
      return true;
    }
    const res = resolveNoun(obj);
    if (res.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (res.ambiguous) { printAmbiguous(res.ambiguous); return false; }
    if (STATE.inventory.includes(res.id)) {
      print(pool("alreadyHave", { noun: shortName(res.id) }), "error"); return false;
    }
    return takeById(res.id);
  }

  function takeById(id) {
    const it = W.items[id];
    if (!it) { print("You can't take that.", "error"); return false; }
    if (it.scenery) { print(pool("cantTake", { noun: shortName(id) }), "error"); return false; }
    if (it.takeable === false || it.portable === false) {
      print(pool("cantTake", { noun: shortName(id) }), "error"); return false;
    }
    if (it.tooHeavy) { print(pool("tooHeavy", { noun: shortName(id) }), "error"); return false; }

    const rs = currentRoomState();
    const idx = rs.items.indexOf(id);
    if (idx >= 0) rs.items.splice(idx, 1);
    STATE.inventory.push(id);
    printInstant(pool("taken", { noun: shortName(id) }), "system");

    if (it.scoreOnTake) awardScore(it.scoreOnTake);
    const conv = "took_" + id;
    if ((W.scoreEvents || {})[conv]) awardScore(conv);
    return true;
  }

  function handleDrop(obj) {
    if (!obj) { print(pool("missingObject", { verb: "drop" }), "error"); return false; }
    const res = resolveNoun(obj, { inventoryOnly: true });
    if (res.notFound) { print(pool("dontHave", { noun: obj }), "error"); return false; }
    if (res.ambiguous) { printAmbiguous(res.ambiguous); return false; }
    removeFromInventory(res.id);
    currentRoomState().items.push(res.id);
    printInstant(pool("dropped", { noun: shortName(res.id) }), "system");
    return true;
  }

  function handleInventory() {
    if (!STATE.inventory.length) {
      printInstant("You are carrying nothing.", "system");
    } else {
      printInstant("You are carrying:", "system");
      for (const id of STATE.inventory) {
        const it = W.items[id]; if (!it) continue;
        enqueuePrintInstant("  " + escHTML(it.name), "item");
      }
    }
    if (STATE.money !== undefined && STATE.money > 0) {
      printInstant("Cash: $" + STATE.money, "system");
    }
    return false;
  }

  function handleUse(direct, indirect) {
    if (!direct) { print(pool("missingObject", { verb: "use" }), "error"); return false; }
    const a = resolveNoun(direct, { inventoryOnly: true });
    if (a.notFound) { print(pool("dontHave", { noun: direct }), "error"); return false; }
    if (a.ambiguous) { printAmbiguous(a.ambiguous); return false; }
    const itemA = W.items[a.id];

    if (!indirect) {
      if (itemA.useAlone) {
        const rule = itemA.useAlone;
        print(rule.message, "room-desc");
        if (rule.setsFlag) setFlag(rule.setsFlag);
        if (rule.showsMap) handleMap();
        if (rule.scoreEvent) awardScore(rule.scoreEvent);
        if (rule.consumesItem) removeFromInventory(a.id);
        return true;
      }
      print("You'd have to use it on something. Try USE " + direct.toUpperCase() + " ON ...", "error");
      return false;
    }

    const b = resolveNoun(indirect);
    if (b.notFound) { print(pool("unknownNoun", { noun: indirect }), "error"); return false; }
    if (b.notHere) { print(pool("notAccessible", { noun: indirect }), "error"); return false; }
    if (b.ambiguous) { printAmbiguous(b.ambiguous); return false; }

    return applyUseInteraction(a.id, b.id);
  }

  function applyUseInteraction(aId, bId) {
    const itemA = W.items[aId];
    const itemB = W.items[bId] || W.npcs[bId];
    const rule = (itemA.useWith || {})[bId] ||
                 (itemB && itemB.useWith && itemB.useWith[aId]);
    // Also check NPC interactions for "give X"
    if (!rule && W.npcs[bId]) {
      const npc = W.npcs[bId];
      const give = (npc.interactions || {})["give " + aId];
      if (give) return applyNpcRule(npc, give, aId);
    }
    if (!rule) {
      // When showing/giving an item to an NPC with no specific interaction,
      // show character-appropriate flavor rather than a generic error.
      if (W.npcs[bId]) {
        const npc = W.npcs[bId];
        const itemName = (W.items[aId] || {}).name || aId;
        const fallbacks = npc.showFallback;
        if (fallbacks) {
          const lines = Array.isArray(fallbacks) ? fallbacks : [fallbacks];
          print(lines[Math.floor(Math.random() * lines.length)], "npc");
        } else {
          printInstant("They glance at " + aOrThe(itemName) + " without much reaction.", "system");
        }
        return false;
      }
      print(pool("cantDoThat"), "error");
      return false;
    }
    if (rule.success === false) {
      if (rule.message) print(rule.message, "error");
      return false;
    }
    if (rule.message) print(rule.message, "room-desc");
    if (rule.consumesItem) removeFromInventory(aId);
    if (rule.consumesTarget) removeFromInventory(bId);
    if (rule.grantsItem) {
      STATE.inventory.push(rule.grantsItem);
      printInstant("(You now have " + aOrThe(W.items[rule.grantsItem].name) + ".)", "system");
    }
    if (rule.setsFlag) setFlag(rule.setsFlag);
    if (Array.isArray(rule.setsFlags)) for (const f of rule.setsFlags) setFlag(f);
    if (rule.scoreEvent) awardScore(rule.scoreEvent);
    if (rule.movesTo) {
      STATE.previousRoom = STATE.currentRoom;
      STATE.currentRoom = rule.movesTo;
      currentRoomState().visited = true;
      renderRoom(true);
    }
    if (rule.finale) runFinale(rule.finale);
    return true;
  }

  function applyNpcRule(npc, rule, aId) {
    if (rule.success === false) {
      if (rule.message) print(rule.message, "error");
      return false;
    }
    if (rule.message) print(rule.message, "npc");
    if (rule.consumesItem) removeFromInventory(aId);
    if (rule.grantsItem) {
      STATE.inventory.push(rule.grantsItem);
      printInstant("(You now have " + aOrThe(W.items[rule.grantsItem].name) + ".)", "system");
    }
    if (rule.setsFlag) setFlag(rule.setsFlag);
    if (rule.setFlag2) setFlag(rule.setFlag2);
    if (rule.scoreEvent) awardScore(rule.scoreEvent);
    return true;
  }

  function handleGive(direct, indirect) {
    if (!direct || !indirect) { print("Give what to whom?", "error"); return false; }
    const a = resolveNoun(direct, { inventoryOnly: true });
    if (a.notFound) { print(pool("dontHave", { noun: direct }), "error"); return false; }
    if (a.ambiguous) { printAmbiguous(a.ambiguous); return false; }

    const b = resolveNoun(indirect);
    if (b.notFound) { print(pool("unknownNoun", { noun: indirect }), "error"); return false; }
    if (b.notHere) { print(pool("notAccessible", { noun: indirect }), "error"); return false; }
    if (b.ambiguous) { printAmbiguous(b.ambiguous); return false; }

    return applyUseInteraction(a.id, b.id);
  }

  function handleTalk(direct, topic) {
    if (!direct) { print("Talk to whom?", "error"); return false; }
    const r = resolveNoun(direct);

    // "ask about leo" with no explicit NPC → if one NPC is here, ask them
    if ((r.notFound || (r.id && !W.npcs[r.id])) && !topic) {
      const roomNpcs = currentRoomState().npcs;
      if (roomNpcs.length === 1) return handleTalk(roomNpcs[0], direct);
    }

    if (r.notFound) { print(pool("unknownNoun", { noun: direct }), "error"); return false; }
    if (r.notHere) { print(pool("notAccessible", { noun: direct }), "error"); return false; }
    if (r.ambiguous) { printAmbiguous(r.ambiguous); return false; }

    const npc = W.npcs[r.id];
    if (!npc) { print("You can't talk to that.", "error"); return false; }

    if (topic) {
      const topicKey = normalizeTopicKey(topic);
      const rule =
        (npc.interactions || {})["ask about " + topicKey] ||
        (npc.dialogue || {})["ask about " + topicKey];
      if (rule) {
        if (typeof rule === "string") {
          print(rule, "npc");
          return true;
        }
        if (rule.requiresFlag && !STATE.flags[rule.requiresFlag]) {
          print(npc.dialogue.default || "They shrug.", "npc");
          return false;
        }
        print(rule.message, "npc");
        if (rule.setsFlag) setFlag(rule.setsFlag);
        if (rule.scoreEvent) awardScore(rule.scoreEvent);
        if (rule.setsMoney !== undefined) {
          STATE.money = rule.setsMoney;
          printInstant("(You now have $" + STATE.money + ".)", "system");
        }
        return true;
      }
      print(npc.unknownTopicResponse || "\"I don't know anything about that.\"", "npc");
      return false;
    }

    // Plain TALK — pick dialogue variant + track talk count + onDialogue hooks
    STATE.talkCount[npc.id] = (STATE.talkCount[npc.id] || 0) + 1;

    let variant = "default";
    // Priority flag list (multi-level trust, etc.)
    if (npc.dialogueFlagPriority && npc.dialogueFlagPriorityMap) {
      for (const flagName of npc.dialogueFlagPriority) {
        if (STATE.flags[flagName]) {
          const key = npc.dialogueFlagPriorityMap[flagName];
          if (key && npc.dialogue[key]) { variant = key; break; }
        }
      }
    } else if (npc.dialogueFlagKey && npc.dialogueFlagMap) {
      const v = !!STATE.flags[npc.dialogueFlagKey];
      const key = npc.dialogueFlagMap[String(v)];
      if (key && npc.dialogue[key]) variant = key;
    }
    const line = npc.dialogue[variant] || npc.dialogue.default;
    print(line || "They have nothing to say.", "npc");

    if (npc.onDialogue && npc.onDialogue[variant]) {
      applyEventBlock(npc.onDialogue[variant]);
    }
    return false;
  }

  function normalizeTopicKey(s) {
    const toks = stripArticles(s.toLowerCase().split(/\s+/));
    const id = findGlobalEntity(toks.join(" "));
    if (id) return id;
    return toks.join(" ");
  }

  function handleOpen(obj, instrument) {
    // "open/unlock door with key" → remap to USE key ON door
    if (instrument) return handleUse(instrument, obj);
    if (!obj) { print(pool("missingObject", { verb: "open" }), "error"); return false; }
    const r = resolveNoun(obj);
    if (r.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (r.ambiguous) { printAmbiguous(r.ambiguous); return false; }
    if (!tryRoomOverride("OPEN", r.id, null)) print(pool("cantDoThat"), "error");
    return false;
  }

  function handleAttack(obj) {
    if (!obj) { print("Attack what?", "error"); return false; }
    const r = resolveNoun(obj);
    if (r.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (r.notHere) { print(pool("notAccessible", { noun: obj }), "error"); return false; }
    if (r.ambiguous) { printAmbiguous(r.ambiguous); return false; }

    const npc = W.npcs[r.id];
    if (npc && npc.interactions && npc.interactions.attack) {
      print(npc.interactions.attack.message, "npc");
      return false;
    }
    if (tryRoomOverride("ATTACK", r.id, null)) return true;
    print("Violence won't help here.", "error");
    return false;
  }

  function handlePet(obj) {
    if (!obj) { print("Pet what?", "error"); return false; }
    const r = resolveNoun(obj);
    if (r.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (r.notHere) { print(pool("notAccessible", { noun: obj }), "error"); return false; }
    if (r.ambiguous) { printAmbiguous(r.ambiguous); return false; }
    const npc = W.npcs[r.id];
    if (npc && npc.interactions && npc.interactions.pet) {
      print(npc.interactions.pet.message, "npc");
      return false;
    }
    print("That's not something you can pet.", "error");
    return false;
  }

  function handleWait() {
    print(pool("wait"), "room-desc");
    return true;
  }

  function handleHint() {
    const chain = (W.hints && W.hints.chain) || [];
    for (const h of chain) {
      if (typeof h.when === "function" && h.when(STATE)) {
        const lvl = (STATE.hintLevel[h.id] || 0);
        const stages = [h.nudge, h.push, h.shove];
        const msg = stages[Math.min(lvl, stages.length - 1)];
        STATE.hintLevel[h.id] = Math.min(lvl + 1, stages.length - 1);
        print("(Hint) " + msg, "system");
        return false;
      }
    }
    const fallback = (W.hints && W.hints.fallback) || [];
    if (fallback.length) {
      const i = (STATE.hintLevel._fallback || 0) % fallback.length;
      STATE.hintLevel._fallback = i + 1;
      print("(Hint) " + fallback[i], "system");
    } else {
      print("(No hints available right now.)", "system");
    }
    return false;
  }

  function handleScore() {
    printInstant("Score: " + STATE.score + "/" + STATE.maxScore +
                 "   Moves: " + STATE.moves, "system");
    return false;
  }

  function handleSave(slot) {
    slot = (slot || DEFAULT_SLOT).toString().trim();
    if (!SAVE_SLOTS.includes(slot)) {
      print("Save slots are 1, 2, or 3. Use: SAVE 2", "error");
      return false;
    }
    try {
      const payload = { savedAt: Date.now(), state: STATE };
      localStorage.setItem("soma_save_" + slot, JSON.stringify(payload));
      printInstant("Game saved to slot " + slot + ".", "system");
    } catch (e) {
      print("Save failed: " + e.message, "error");
    }
    return false;
  }

  function handleLoad(slot) {
    slot = (slot || DEFAULT_SLOT).toString().trim();
    if (!SAVE_SLOTS.includes(slot)) {
      print("Save slots are 1, 2, or 3. Use: LOAD 2", "error");
      return false;
    }
    try {
      const raw = localStorage.getItem("soma_save_" + slot);
      if (!raw) { print("No save in slot " + slot + ".", "error"); return false; }
      const payload = JSON.parse(raw);
      STATE = payload.state || payload;  // back-compat
      printInstant("Game loaded from slot " + slot + ".", "system");
      renderRoom(true);
      updateHUD();
    } catch (e) {
      print("Load failed: " + e.message, "error");
    }
    return false;
  }

  function handleSaves() {
    printInstant("Save slots:", "system");
    for (const s of SAVE_SLOTS) {
      const raw = localStorage.getItem("soma_save_" + s);
      if (!raw) {
        enqueuePrintInstant("  " + s + ". (empty)", "system");
        continue;
      }
      try {
        const p = JSON.parse(raw);
        const ts = p.savedAt ? new Date(p.savedAt).toLocaleString() : "?";
        const room = (p.state && W.rooms[p.state.currentRoom] &&
                      W.rooms[p.state.currentRoom].name) || "?";
        const score = (p.state && p.state.score) || 0;
        enqueuePrintInstant("  " + s + ". " + ts + "  —  " + escHTML(room) +
                            "  (score " + score + ")", "system");
      } catch (e) {
        enqueuePrintInstant("  " + s + ". (corrupt)", "error");
      }
    }
    return false;
  }

  function handleUndo() {
    if (!PREV_STATE) { print("Nothing to undo.", "error"); return false; }
    STATE = JSON.parse(PREV_STATE);
    PREV_STATE = null;
    printInstant("(Undone.)", "system");
    renderRoom(true);
    updateHUD();
    return false;
  }

  function handleRestart() {
    STATE = freshState();
    PREV_STATE = null;
    FAILURE_CURSORS = {};
    printInstant("--- Restarting ---", "system");
    print(C.intro, "room-desc");
    renderRoom(true);
    updateHUD();
    return false;
  }

  function handleMap() {
    const visited = Object.keys(STATE.roomStates).filter(id => STATE.roomStates[id].visited);
    if (!visited.length) { printInstant("You haven't been anywhere yet.", "system"); return false; }
    printInstant("Rooms visited:", "system");
    for (const id of visited) {
      const r = W.rooms[id];
      const mark = id === STATE.currentRoom ? " *" : "";
      enqueuePrintInstant("  " + escHTML(r.name) + mark, "system");
    }
    return false;
  }

  function tryRoomOverride(verb, directId, indirectId) {
    const room = currentRoom();
    const vo = room.verbOverrides || {};
    const key = verb + (directId ? ":" + directId : "") + (indirectId ? ":" + indirectId : "");
    const rule = vo[key] || vo[verb];
    if (!rule) return false;
    if (typeof rule === "function") { rule(STATE); return true; }
    if (rule.message) print(rule.message, "room-desc");
    applyEventBlock(rule);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /*  Special one-word commands (easter eggs)                            */
  /* ------------------------------------------------------------------ */

  function handleSpecial(verb) {
    const key = verb.replace(/^_/, "").toLowerCase();
    // Room verb override takes priority
    if (tryRoomOverride(key.toUpperCase(), null, null)) return true;
    const specials = C.specials || {};
    const v = specials[key];
    if (!v) return false;
    if (Array.isArray(v)) {
      const idx = (FAILURE_CURSORS["_special_" + key] || 0) % v.length;
      FAILURE_CURSORS["_special_" + key] = idx + 1;
      print(v[idx], "system");
    } else {
      print(v, "system");
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /*  Misc helpers                                                       */
  /* ------------------------------------------------------------------ */

  function removeFromInventory(id) {
    const i = STATE.inventory.indexOf(id);
    if (i >= 0) STATE.inventory.splice(i, 1);
  }
  function shortName(id) {
    const e = entityById(id);
    if (!e) return id;
    return e.name;
  }
  function printAmbiguous(ids) {
    const names = ids.map(shortName);
    print(pool("ambiguous", { a: names[0], b: names[1] }), "error");
    // Save state so the player's next input can resolve the ambiguity
    PENDING_DISAMBIG = { candidates: ids, parsed: CURRENT_PARSED };
  }

  /* ------------------------------------------------------------------ */
  /*  New handlers                                                       */
  /* ------------------------------------------------------------------ */

  function handlePush(obj) {
    if (!obj) { print("Push what?", "error"); return false; }
    const res = resolveNoun(obj);
    if (res.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (res.ambiguous) { printAmbiguous(res.ambiguous); return false; }
    const e = entityById(res.id);
    if (e && e.pushable) {
      const pb = e.pushable;
      if (pb.requiresFlag && !STATE.flags[pb.requiresFlag]) {
        print(pb.failMessage || "That doesn't budge.", "error");
        return false;
      }
      if (pb.message) print(pb.message, "room-desc");
      if (pb.setsFlag) setFlag(pb.setsFlag);
      if (pb.scoreEvent) awardScore(pb.scoreEvent);
      return true;
    }
    if (tryRoomOverride("PUSH", res.id, null)) return true;
    print("Pushing that accomplishes nothing.", "error");
    return false;
  }

  function handleBuy(direct) {
    if (!direct) { print("Buy what?", "error"); return false; }
    const want = direct.toLowerCase();
    const rs = currentRoomState();
    for (const nid of rs.npcs) {
      const npc = W.npcs[nid];
      if (!npc || !npc.shop) continue;
      for (const key in npc.shop) {
        if (key === want || want.includes(key) || key.includes(want)) {
          const entry = npc.shop[key];
          const price = entry.price || 0;
          if (STATE.money < price) {
            print("You don't have enough money. (You have $" + STATE.money + ", this costs $" + price + ".)", "error");
            return false;
          }
          STATE.money -= price;
          print(entry.message, "npc");
          if (entry.setsFlag) setFlag(entry.setsFlag);
          if (Array.isArray(entry.setsFlags)) for (const f of entry.setsFlags) setFlag(f);
          if (entry.grantsItem) {
            STATE.inventory.push(entry.grantsItem);
            printInstant("(You now have " + aOrThe(W.items[entry.grantsItem].name) + ".)", "system");
          }
          if (entry.scoreEvent) awardScore(entry.scoreEvent);
          if (price > 0) printInstant("($" + STATE.money + " remaining.)", "system");
          return true;
        }
      }
    }
    print("There's nothing to buy here, or no one to buy it from.", "error");
    return false;
  }

  function handleSmell(obj) {
    if (obj) {
      const res = resolveNoun(obj);
      if (!res.notFound && !res.ambiguous) {
        const e = entityById(res.id);
        if (e && e.smell) { print(e.smell, "room-desc"); return false; }
      }
    }
    const room = currentRoom();
    if (room && room.smell) { print(room.smell, "room-desc"); return false; }
    print((C.specials && C.specials.smell) || "Nothing remarkable.", "room-desc");
    return false;
  }

  function handleListen(obj) {
    if (obj) {
      const res = resolveNoun(obj);
      if (!res.notFound && !res.ambiguous) {
        const e = entityById(res.id);
        if (e && e.sound) { print(e.sound, "room-desc"); return false; }
      }
    }
    const room = currentRoom();
    if (room && room.sound) { print(room.sound, "room-desc"); return false; }
    print((C.specials && C.specials.listen) || "Nothing remarkable.", "room-desc");
    return false;
  }

  function handleCall(obj) {
    if (STATE.currentRoom === "lone_star" && STATE.inventory.includes("matchbook")) {
      print("You use the payphone. You dial the number from the matchbook. It rings three times. Then: Marcus's voice, recorded: 'Leave a message after the—' Click. The mailbox is full.", "room-desc");
      return false;
    }
    print((C.specials && C.specials.call) || "Your phone is dead. But there might be a payphone somewhere.", "system");
    return false;
  }

  function handleKiss(obj) {
    if (!obj) { print((C.specials && C.specials.kiss) || "There's no one here to kiss.", "system"); return false; }
    const res = resolveNoun(obj);
    if (res.notFound) { print(pool("unknownNoun", { noun: obj }), "error"); return false; }
    if (res.notHere) { print(pool("notAccessible", { noun: obj }), "error"); return false; }
    const npc = W.npcs[res.id];
    if (npc && npc.interactions) {
      const rule = STATE.flags["leo_trust_full"] && npc.interactions.kiss
        ? npc.interactions.kiss
        : npc.interactions.kiss_default || npc.interactions.kiss;
      if (rule) { print(rule.message || rule, "npc"); return false; }
    }
    print("Maybe another time.", "system");
    return false;
  }

  /* ------------------------------------------------------------------ */
  /*  Death timer check (called each command turn)                       */
  /* ------------------------------------------------------------------ */

  function checkDeathTimers() {
    if (STATE.flags.game_over) return;
    const room = currentRoom();
    if (!room || !room.deathTimer) return;
    const roomId = STATE.currentRoom;
    const turns = (STATE.roomTurns[roomId] || 0) + 1;
    STATE.roomTurns[roomId] = turns;
    const dt = room.deathTimer;
    if (dt.death && turns >= dt.death.at) {
      print(dt.death.message, "room-desc");
      STATE.flags.game_over = true;
      return;
    }
    if (Array.isArray(dt.warnings)) {
      for (const w of dt.warnings) {
        if (turns === w.at) { print(w.message, "room-desc"); break; }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Dispatch                                                           */
  /* ------------------------------------------------------------------ */

  function dispatch(parsed) {
    CURRENT_PARSED = parsed;
    switch (parsed.verb) {
      case "_PROFANITY": print(pool("profanity"), "system"); return false;
      case "_UNKNOWN":
        print(pool("unknownVerb", { word: parsed.word }), "error"); return false;

      case "GO":         return handleGo(parsed.direction, parsed.stray);
      case "LOOK":       return handleLook(parsed.direct);
      case "TAKE":       return handleTake(parsed.direct);
      case "DROP":       return handleDrop(parsed.direct);
      case "INVENTORY":  return handleInventory();
      case "USE":        return handleUse(parsed.direct, parsed.indirect);
      case "GIVE":       return handleGive(parsed.direct, parsed.indirect);
      case "TALK": {
        let tTarget = parsed.direct, tTopic = parsed.indirect;
        // "talk to jude about leo" still has "to" eaten first → direct="jude about leo"
        // Split on " about " if direct contains it and no indirect yet.
        if (tTarget && !tTopic) {
          const ai = tTarget.indexOf(" about ");
          if (ai >= 0) { tTopic = tTarget.slice(ai + 7).trim(); tTarget = tTarget.slice(0, ai).trim(); }
        }
        // "say hi to jude" → prep="to", direct="hi", indirect="jude"
        // Detect: direct is not an NPC but indirect is → swap so NPC is target.
        if (tTarget && tTopic && parsed.prep === "to") {
          const tRes = resolveNoun(tTarget);
          const iRes = resolveNoun(tTopic);
          if ((!tRes.id || !W.npcs[tRes.id]) && iRes.id && W.npcs[iRes.id]) {
            [tTarget, tTopic] = [tTopic, tTarget];
          }
        }
        return handleTalk(tTarget || null, tTopic);
      }
      case "OPEN":       return handleOpen(parsed.direct, parsed.indirect);
      case "ATTACK":     return handleAttack(parsed.direct);
      case "PET":        return handlePet(parsed.direct);
      case "PUSH":       return handlePush(parsed.direct);
      case "BUY":        return handleBuy(parsed.rawRest || parsed.direct);
      case "SMELL":      return handleSmell(parsed.direct);
      case "LISTEN":     return handleListen(parsed.direct);
      case "CALL":       return handleCall(parsed.direct);
      case "KISS":       return handleKiss(parsed.direct);
      case "UNDRESS":    return handleSpecial("_UNDRESS") || false;
      case "WAIT":       return handleWait();
      case "HELP":       print(C.help, "system"); return false;
      case "HINT":       return handleHint();
      case "SCORE":      return handleScore();
      case "SAVE":       return handleSave(parsed.direct);
      case "LOAD":       return handleLoad(parsed.direct);
      case "SAVES":      return handleSaves();
      case "UNDO":       return handleUndo();
      case "RESTART":    return handleRestart();
      case "MAP":        return handleMap();
      case "QUIT":
        print("Use RESTART to start over, or SAVE to preserve your progress.", "system");
        return false;
      case "AGAIN":
        if (!LAST_COMMAND) { print("There's nothing to repeat.", "error"); return false; }
        return runCommand(LAST_COMMAND, { isRepeat: true });

      default:
        if (parsed.verb && parsed.verb.startsWith("_")) {
          handleSpecial(parsed.verb);
          return false;
        }
        print(pool("cantDoThat"), "error");
        return false;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Command loop                                                       */
  /* ------------------------------------------------------------------ */

  function runCommand(raw, opts) {
    opts = opts || {};
    if (!opts.isRepeat) printEcho(raw);

    if (STATE.flags.game_over) {
      print("The game is over. Type RESTART to play again, or LOAD 1/2/3.", "system");
      return;
    }

    // Resolve pending disambiguation — player answered "which do you mean?"
    if (PENDING_DISAMBIG) {
      const pd = PENDING_DISAMBIG;
      PENDING_DISAMBIG = null;
      const wantLower = raw.toLowerCase().replace(/\b(the|a|an)\b\s*/g, "").trim();
      const chosen = pd.candidates.find(function(id) {
        const e = entityById(id); if (!e) return false;
        const names = [e.name].concat(e.aliases || []).map(function(n) { return n.toLowerCase(); });
        return names.some(function(n) {
          return n === wantLower ||
            wantLower.split(/\s+/).every(function(tok) { return n.split(/\s+/).includes(tok); });
        });
      });
      if (chosen) {
        printInstant("(" + entityById(chosen).name + ".)", "system");
        const newParsed = Object.assign({}, pd.parsed, { direct: entityById(chosen).name });
        PREV_STATE = JSON.stringify(STATE);
        const moved = dispatch(newParsed);
        if (moved) { STATE.moves += 1; updateHUD(); }
        checkDeathTimers();
        LAST_COMMAND = raw;
        return;
      }
      // Input didn't match any candidate — fall through to normal parsing
    }

    const parsed = parse(raw);
    if (parsed.empty) { print(pool("emptyInput"), "system"); return; }

    PREV_STATE = JSON.stringify(STATE);

    const movedOrActed = dispatch(parsed);

    if (movedOrActed) {
      STATE.moves += 1;
      updateHUD();
    }

    checkDeathTimers();

    if (parsed.verb && parsed.verb !== "AGAIN" &&
        !["UNDO", "SAVE", "LOAD", "SAVES", "HELP", "HINT", "SCORE", "MAP", "INVENTORY"]
          .includes(parsed.verb)) {
      LAST_COMMAND = raw;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Boot                                                               */
  /* ------------------------------------------------------------------ */

  function boot() {
    STATE = freshState();
    updateHUD();
    print(C.intro, "room-desc");
    renderRoom(true);

    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const v = inputEl.value;
      inputEl.value = "";
      if (v.trim() !== "") runCommand(v);
    });

    document.getElementById("crt").addEventListener("click", function () {
      if (TYPING) SKIP_ALL = true;
      inputEl.focus();
    });

    document.addEventListener("keydown", function () {
      if (TYPING) SKIP_ALL = true;
    });

    window._SOMA = { STATE: () => STATE, parse, dispatch, runCommand };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
