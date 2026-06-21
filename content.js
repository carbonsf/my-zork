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
    "   SOUTH OF MARKET",
    "   ~ A Text Adventure ~",
    "═══════════════════════════════════════════",
    "",
    "San Francisco. Friday night. Late.",
    "The fog is settling in over SOMA, thick and diesel-scented.",
    "",
    "You haven't been to this neighborhood in years.",
    "Not since Marcus — leather artisan, mentor, the man who taught",
    "you to see these streets as something more than concrete and",
    "freeway overpasses — stopped returning your calls.",
    "",
    "Three months of silence.",
    "Then, yesterday, a package arrived:",
    "a brass key with no note, wrapped in a torn page",
    "from an old issue of Drummer magazine.",
    "",
    "On the back, in Marcus's handwriting:",
    "  \"Ringold. Before they pour the foundation.\"",
    "",
    "Tonight you've come to find out what that means.",
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
    "             or GO <direction> — also ENTER, LEAVE",
    "  Looking  : LOOK (L), EXAMINE <thing> (X <thing>)",
    "             SMELL, LISTEN",
    "  Items    : TAKE <thing>, DROP <thing>, INVENTORY (I)",
    "  Using    : USE <thing> ON <thing>",
    "             GIVE <thing> TO <npc>, SHOW <thing> TO <npc>",
    "             PUSH <thing>",
    "  Buying   : BUY <thing>",
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
      "The bartender doesn't even look up. You're in SOMA.",
      "Someone nearby laughs, but not at you.",
      "The bass from the bar swallows the word whole."
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
      "The {noun} hits the ground."
    ],
    taken: [
      "Taken.",
      "You pocket the {noun}.",
      "The {noun} is now yours."
    ],
    dark: [
      "It is pitch black. You can't see a thing.",
      "The darkness is absolute."
    ],
    wait: [
      "The bass from somewhere thumps through the wall.",
      "A truck rattles past on Folsom. The fog holds everything in.",
      "Someone laughs from inside one of the bars. The sound cuts off.",
      "The streetlights have halos tonight. The fog will only get thicker.",
      "Diesel and leather conditioner and old concrete. You breathe it in."
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  Easter eggs & one-word specials                                    */
  /* ------------------------------------------------------------------ */
  specials: {
    xyzzy:    "A hollow voice says, 'This is SOMA, not a cave in Massachusetts.'",
    plugh:    "Nothing happens. But someone at the bar glances at you.",
    plover:   "There are no exotic birds here.",
    diagnose: "You are in good health, considering.",
    pray:     "For Marcus. For the neighborhood. For whatever's left.",
    sing:     "You start humming something under your breath. Nobody notices. That's okay.",
    swim:     "The bay is six blocks north. And cold enough to kill you.",
    jump:     "You resist the urge.",
    fly:      "Regrettably, you lack the capacity.",
    scream:   "You don't. Not yet.",
    dance:    "There's no music here. Just you.",
    sleep:    "You don't have time to sleep. Marcus has been underground for weeks.",
    eat:      "You haven't eaten since this afternoon. You'll live.",
    hello:    "No one answers.",
    hi:       "No one answers.",
    self:     "You look like someone who came here for a reason. Boots, jeans, t-shirt. You'll do.",
    undress:  "Not yet.",
    kiss:     "There's no one here to kiss.",
    smell:    "Diesel and leather conditioner. Fog coming in. The neighborhood smells like itself.",
    listen:   "Traffic on Folsom. The distant thump of music. The city at midnight."
  },

  /* ------------------------------------------------------------------ */
  /*  Finale sequences                                                   */
  /* ------------------------------------------------------------------ */
  finale: {
    soma_ending: [
      "",
      "The ladder rungs are cold under your hands.",
      "",
      "You climb. The construction site falls away below you, the camp lantern's",
      "dead light and Marcus's folding table growing small, the sound of his voice",
      "fading: 'Get it to the Cultural District office. Tell them what you found.'",
      "",
      "The satchel is heavy against your hip. Full of paper and photographs and",
      "sixty years of lives that almost got buried under twenty stories of glass.",
      "",
      "You push through a gap in the chain-link at the top of the site.",
      "",
      "Harrison Street at dawn.",
      "",
      "The fog is burning off — not gone, just thinning, pulling back from the",
      "streetlights in slow wisps. The city is waking up around you. A bus sighs",
      "to a stop somewhere east. A crow lands on a construction sign and watches",
      "you with professional interest.",
      "",
      "Folsom is quiet. The bars are closed. The boots that walked this block last",
      "night have all gone home. But the brass bootprints are still in the concrete",
      "on Ringold, and the standing stones are still standing, and now the archive",
      "in your arms will still exist when the foundation gets poured.",
      "",
      "Marcus knew what he was doing when he sent you that key.",
      "",
      "*** You have completed SOUTH OF MARKET. ***",
      "",
      "Type SCORE to see your final tally.",
      ""
    ]
  }
};
