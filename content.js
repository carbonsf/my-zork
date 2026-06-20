/* ==========================================================================
   content.js — Long-form text strings for the engine.
   Room/item/NPC prose is inlined in world.js; this file carries cross-
   cutting text: the intro, help, response pools, specials, and finale.
   ========================================================================== */

window.CONTENT = {

  /* ------------------------------------------------------------------ */
  /*  Intro                                                              */
  /* ------------------------------------------------------------------ */
  intro: [
    "═══════════════════════════════════════════",
    "   THE SECRET OF THE EMBARCADERO",
    "   ~ An Adventure Along the San Francisco Waterfront ~",
    "═══════════════════════════════════════════",
    "",
    "San Francisco. Early morning.",
    "Fog still drapes the bay.",
    "",
    "You stand at the north end of the Embarcadero,",
    "though you can't quite remember why.",
    "Your pockets are empty.",
    "But intuition whispers that something important",
    "waits for you along this stretch of waterfront —",
    "",
    "the memories of sailors who worked this harbor,",
    "the ghosts of the rails that once ran beneath the piers,",
    "and a trail of clues someone has left behind for you.",
    "",
    "Everything begins at Pier 39.",
    "",
    "(Type HELP for a command summary, or HINT if you get stuck.)",
    ""
  ].join("\n"),

  /* ------------------------------------------------------------------ */
  /*  Help                                                               */
  /* ------------------------------------------------------------------ */
  help: [
    "COMMANDS",
    "  Movement : N, S, E, W, NE, NW, SE, SW, UP, DOWN",
    "             or GO <direction> — also ENTER, LEAVE, INSIDE",
    "  Looking  : LOOK (L), EXAMINE <thing> (X <thing>)",
    "  Items    : TAKE <thing>, DROP <thing>, INVENTORY (I)",
    "  Using    : USE <thing> ON <thing>",
    "             GIVE <thing> TO <npc>",
    "  People   : TALK TO <npc>, ASK <npc> ABOUT <topic>",
    "  Meta     : SAVE [1-3], LOAD [1-3], SAVES, SCORE, MAP, WAIT (Z)",
    "             G (repeat last), UNDO, RESTART",
    "  Stuck?   : HINT — escalating nudge / push / shove"
  ].join("\n"),

  /* ------------------------------------------------------------------ */
  /*  Failure & atmospheric response pools                               */
  /* ------------------------------------------------------------------ */
  pools: {
    cantDoThat: [
      "That doesn't seem to work.",
      "Nothing happens.",
      "You try, but accomplish nothing.",
      "That's not going to work here.",
      "Nope."
    ],
    unknownVerb: [
      "I don't understand the word \"{word}\".",
      "\"{word}\"? That's not a word I know.",
      "You can't {word} things in this game."
    ],
    unknownNoun: [
      "You don't see any {noun} here.",
      "There's no {noun} anywhere nearby.",
      "A {noun}? You don't see one."
    ],
    notAccessible: [
      "You can't see any {noun} here.",
      "The {noun} isn't within reach.",
      "You'd have to find a {noun} first."
    ],
    missingObject: [
      "What do you want to {verb}?",
      "{verb} what?",
      "You'll have to be more specific — {verb} what?"
    ],
    ambiguous: [
      "Do you mean the {a} or the {b}?",
      "Which do you mean — the {a} or the {b}?"
    ],
    emptyInput: [
      "(You say nothing.)",
      "(Silence.)"
    ],
    profanity: [
      "Such language! And in a nice place like this.",
      "A nearby seagull looks pointedly unimpressed.",
      "A passing tourist pretends not to hear."
    ],
    alreadyHave: [
      "You already have the {noun}.",
      "It's already in your pocket."
    ],
    cantTake: [
      "You can't take the {noun}.",
      "The {noun} won't budge.",
      "That's not something you can carry."
    ],
    tooHeavy: [
      "The {noun} is far too heavy to lift."
    ],
    dontHave: [
      "You don't have a {noun}.",
      "You're not carrying any {noun}."
    ],
    dropped: [
      "Dropped.",
      "You set down the {noun}.",
      "The {noun} clatters to the ground."
    ],
    taken: [
      "Taken.",
      "You pocket the {noun}.",
      "The {noun} is now yours."
    ],
    dark: [
      "It is pitch black. You can't see a thing.",
      "The darkness is absolute. Better not stumble."
    ],
    wait: [
      "Time passes. The waves fold in and out.",
      "Sea wind brushes your face.",
      "A gull cuts overhead.",
      "A foghorn moans somewhere distant.",
      "Sunlight breaks through a seam in the clouds."
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  Easter eggs & one-word specials                                    */
  /* ------------------------------------------------------------------ */
  specials: {
    xyzzy: "Nothing happens. This isn't Colossal Cave.",
    plugh: "A hollow voice says, \"Fool.\"   ...no — that was just a gull.",
    plover: "No exotic birds here. Just gulls.",
    diagnose: "You are in good health. A bit windburned, perhaps.",
    pray: "You offer a quiet prayer. The sound of the waves seems a little calmer.",
    sing: "You start humming \"I Left My Heart in San Francisco.\" A passing tourist applauds.",
    swim: "At this water temperature, hypothermia would set in within five minutes. Better not.",
    jump: "Reckless things like that are best avoided.",
    fly: "Regrettably, you lack the capacity.",
    scream: "\"AAAAAAAH!\" The cry echoes off the Bay Bridge. A flock of pigeons lifts off all at once.",
    dance: "You break into a dance on the Embarcadero. A street performer watches, visibly impressed.",
    sleep: "A nap on a bench is tempting, but you have an adventure to finish.",
    eat: "You have nothing to eat right now. (Unless you're holding sourdough, of course.)",
    hello: "No one answers. A gull tilts its head at you.",
    hi:    "No one answers. A gull tilts its head at you."
  },

  /* ------------------------------------------------------------------ */
  /*  Finale sequences (keyed by id; used by endings.finale / exit       */
  /*  interactions)                                                      */
  /* ------------------------------------------------------------------ */
  finale: {
    lighthouse: [
      "",
      "Inside the lighthouse, the air is still. A small round chamber",
      "holds an ancient control panel with three shallow indentations.",
      "Carved into the stone above: \"The record of the sea, the memory",
      "of the land, and the one that points the way. When three are",
      "gathered, the light returns.\"",
      "",
      "You place the captain's log in the first indentation.  ...click.",
      "You place the vintage train model in the second.   ...click, click.",
      "You place the brass compass in the third.",
      "",
      "......",
      "",
      "A low rumble. The lighthouse trembles. Above you, a great lens",
      "begins to turn — and a dazzling pillar of light lances out across",
      "the bay.",
      "",
      "The beam parts the fog, glances off the crimson towers of the",
      "Golden Gate Bridge, flashes along the silver cables of the Bay",
      "Bridge, and touches even the cold walls of Alcatraz with a",
      "sudden, unexpected warmth.",
      "",
      "The entire bay glows gold.",
      "",
      "You have unlocked the secret of the Embarcadero. The captains who",
      "once walked this coast, the railworkers who laid the rails beneath",
      "these piers, the long procession of lives that passed through here —",
      "their memory lives on, inside this light.",
      "",
      "*** The adventure is over. ***",
      "",
      "But the Embarcadero's story goes on — the next time you walk it, too."
    ]
  }
};
