/* ==========================================================================
   world.js — Structural game data: rooms, items, NPCs, scores, hints,
   spawns, endings. The engine is data-driven; modifying this file alone
   should be enough to change game content.

   Map topology (north → south along the waterfront):

       pier39_deck (up)
            |
       pier39_plaza
            |
       pier7_promenade  ──→  hidden_dock  (one-way, west after telescope clue)
            |                      |
            |                      └──→ ferry_building_interior (up ladder east)
            |
       ferry_building_interior  ←→  ferry_building_balcony (up)
            |  └──→ ferry_dock (east; one-way, token consumed)
            |                └──→ rincon_park (south; over fence, one-way)
       rincon_park
            |  (south path blocked by sea lion)
       cupids_arrow  ──→  underground_passage (down, one-way back up)
            |                      └──→ south_promenade (south, needs flashlight)
       south_promenade
            |
       ballpark_entrance
            |
       lighthouse_point  (finale)
   ========================================================================== */

window.WORLD = {

  meta: {
    title: "Embarcadero",
    startRoom: "pier39_plaza",
    version: "1.0.0"
  },

  /* ======================================================================
     ROOMS
     ====================================================================== */
  rooms: {

    /* ---------------- Northern piers ---------------- */

    pier39_plaza: {
      id: "pier39_plaza",
      name: "Pier 39 Plaza",
      descriptions: {
        default:
          "You stand at the tourist-thronged entrance to Pier 39. Steam from " +
          "boiling crab mingles with the salt air, and the gaudy signs of " +
          "souvenir shops clutter your view. The barking of sea lions echoes " +
          "from the east. At your feet, a silver coin glints — someone's lost " +
          "pocket change. Stairs climb north to the observation deck, and a " +
          "promenade continues south.",
        short:
          "Pier 39 Plaza. Tourist bustle, salt air. Stairs up north; promenade south."
      },
      exits: {
        north: { to: "pier39_deck",
                 message: "You climb the wooden stairs up to the deck." },
        up:    { to: "pier39_deck",
                 message: "You climb the wooden stairs up to the deck." },
        south: { to: "pier7_promenade" },
        east:  { to: null, blocked: true,
                 failMessage: "The sea lions have entirely claimed the eastern dock. " +
                              "Get close and they rear up with a threatening bark." },
        west:  { to: null, blocked: true,
                 failMessage: "A wall of souvenir shops blocks your way — and " +
                              "you're in no mood to browse." }
      },
      items: ["silver_coin"],
      npcs: ["street_performer"],
      onEnterFirst: "Sea air slaps your face. The great sweep of San Francisco Bay " +
                    "opens up before you, and with it, the feeling that an adventure " +
                    "is about to begin."
    },

    pier39_deck: {
      id: "pier39_deck",
      name: "Pier 39 Observation Deck",
      descriptions: {
        default:
          "From the deck you can see the whole sweep of the bay. Alcatraz Island " +
          "floats dimly in the fog. An old brass telescope is bolted to the railing " +
          "— it has a coin slot. At the edge of the deck, something is carved " +
          "into a weather-beaten wooden plank. Stairs lead back down to the plaza.",
        short:
          "Observation deck. Alcatraz in the fog. Stairs down to the plaza.",
        telescope_clue:
          "From the deck you can see the sweep of the bay. The memory of what you " +
          "saw through the telescope is still fresh — something glinting near a " +
          "half-hidden dock below Pier 7. Stairs lead back down."
      },
      exits: {
        down:  { to: "pier39_plaza",
                 message: "You take the stairs back down to the plaza." },
        south: { to: "pier39_plaza",
                 message: "You take the stairs back down to the plaza." }
      },
      items: [],
      scenery: ["brass_telescope", "carved_plank"],
      onEnterFirst: "The wind is strong. You hold on to your hat and walk to the railing."
    },

    pier7_promenade: {
      id: "pier7_promenade",
      name: "Pier 7 Promenade",
      descriptions: {
        default:
          "A beautiful wooden pier stretches straight out into the bay. Fishermen " +
          "are evenly spaced along its length, lines dangling into the water. " +
          "Midway along the boards, a rusty key is wedged into the gap between " +
          "two planks. Pier 39 lies to the north, and the Ferry Building to the " +
          "south. Past the railing to the west you can half-glimpse a smaller, " +
          "hidden dock below.",
        short:
          "Pier 7 boardwalk. Fishermen. Pier 39 north, Ferry Building south."
      },
      exits: {
        north: { to: "pier39_plaza" },
        south: { to: "ferry_building_interior",
                 message: "The Ferry Building clock tower looms larger as you approach." },
        west: {
          to: "hidden_dock",
          requires: { flag: "telescope_clue" },
          failMessage: "Something may be over the railing, but you have no reason to " +
                       "climb down.",
          message: "You swing over the railing and pick your way carefully down to " +
                   "the hidden dock."
        }
      },
      items: ["rusty_key"],
      npcs: ["old_fisherman"],
      onEnterFirst: "The boards creak pleasantly beneath your feet. Seabirds wheel overhead."
    },

    hidden_dock: {
      id: "hidden_dock",
      name: "Hidden Dock",
      descriptions: {
        default:
          "A small floating dock concealed from the main promenade. It rocks " +
          "uneasily with the waves. Inside a weathered crate, wrapped in oilcloth, " +
          "lies an old nautical chart. The walls are too high to climb back to " +
          "the promenade — but a ladder east should lead up near the Ferry Building.",
        short:
          "Hidden floating dock. Ladder east to the Ferry Building."
      },
      exits: {
        east: { to: "ferry_building_interior",
                message: "You climb the ladder and emerge near the Ferry Building." },
        west: { to: null, blocked: true,
                failMessage: "Only the bay lies west. Swimming would be unwise." },
        up:   { to: null, blocked: true,
                failMessage: "The wall is high and slick. There is no going back up." }
      },
      items: ["old_nautical_chart"],
      onEnterFirst: {
        message: "Your shoes are wet from the waves. Almost no one comes here.",
        scoreEvent: "found_hidden_dock"
      }
    },

    /* ---------------- Ferry Building zone ---------------- */

    ferry_building_interior: {
      id: "ferry_building_interior",
      name: "Inside the Ferry Building",
      descriptions: {
        default:
          "You stand inside San Francisco's iconic Ferry Building. Under the " +
          "high arched ceiling, artisanal food shops and restaurants line the " +
          "nave. The smell of fresh bread and coffee hangs in the air. A loaf " +
          "of sourdough bread sits on a sampling counter. Exits lead north to " +
          "the promenade, south to Rincon Park, east to the ferry dock (through " +
          "a turnstile), and up to the second-floor balcony.",
        short:
          "Ferry Building nave. Market smells. Exits: north, south, east (turnstile), up.",
        second_bread_hint:
          "Ferry Building nave. Market smells. You notice now that a second loaf " +
          "of sourdough has been tucked almost out of sight beneath the bread " +
          "counter. Exits: north, south, east (turnstile), up."
      },
      exits: {
        north: { to: "pier7_promenade" },
        south: { to: "rincon_park",
                 message: "You leave the Ferry Building and walk south." },
        east:  { to: "ferry_dock",
                 requires: { item: "ferry_token" },
                 failMessage: "A turnstile blocks the way. It wants a token.",
                 consumesItem: true,
                 message: "You drop the token in the turnstile. A click, and the " +
                          "gate swings open." },
        up:    { to: "ferry_building_balcony",
                 message: "You climb the elegant staircase to the second floor." }
      },
      items: ["sourdough_bread"],
      npcs: ["cheese_vendor"],
      onEnterFirst: "You catch your breath in the Ferry Building's grand space. Since " +
                    "its first construction in 1898, this place has been rebuilt more " +
                    "than once."
    },

    ferry_building_balcony: {
      id: "ferry_building_balcony",
      name: "Ferry Building Balcony",
      descriptions: {
        default:
          "From the second-floor balcony you look down on the market below. " +
          "Stained-glass windows throw colored light across the floor. Inside an " +
          "old display case, among notes on the history of the ferries, a " +
          "forgotten ferry token lies in one corner. Stairs lead back down.",
        short:
          "Second-floor balcony. Stained-glass light. Stairs down."
      },
      exits: {
        down: { to: "ferry_building_interior",
                message: "You descend to the market floor." }
      },
      items: ["ferry_token"],
      scenery: ["display_case"],
      onEnterFirst: "It's quieter up here. Most tourists stay on the main floor."
    },

    ferry_dock: {
      id: "ferry_dock",
      name: "Ferry Dock",
      descriptions: {
        default:
          "The ferry dock is windswept. A single old ferry is moored at its end, " +
          "still. A captain's log lies forgotten on the deck. From the dock's far " +
          "edge you can see Oakland across the bay. This is a dead end — the gate " +
          "behind you doesn't open from this side, but the low fence to the south " +
          "might take you toward Rincon Park.",
        short:
          "Ferry Dock. An old ferry. South: fence over to Rincon Park."
      },
      exits: {
        west:  { to: null, blocked: true,
                 failMessage: "The gate only opens from the other side. One way." },
        south: { to: "rincon_park",
                 message: "You pick your way carefully over the low fence and drop " +
                          "down into Rincon Park." }
      },
      items: ["captains_log"],
      onEnterFirst: "The gate clicks shut behind you. It seems there's no going back."
    },

    /* ---------------- Southern waterfront ---------------- */

    rincon_park: {
      id: "rincon_park",
      name: "Rincon Park",
      descriptions: {
        default:
          "Enormous piers of the Bay Bridge soar overhead; their shadows sweep " +
          "the park. A few benches sit on trimmed lawns. At the park's center is " +
          "a tiled Cupid mosaic. North leads back to the Ferry Building, and " +
          "south toward Cupid's Span — except a huge sea lion sprawls across " +
          "the south path.",
        short:
          "Rincon Park. Bay Bridge shadow. A sea lion blocks the path south.",
        sea_lion_appeased:
          "Rincon Park. The Bay Bridge shadow is cool. Ferry Building north, the " +
          "path to Cupid's Span lies open south."
      },
      exits: {
        north: { to: "ferry_building_interior" },
        south: {
          to: "cupids_arrow",
          requires: { flag: "sea_lion_appeased" },
          failMessage: "The massive sea lion blocks the path! It must weigh three " +
                       "hundred kilos. Get close and it rears up with a warning bark. " +
                       "Some way to move it is going to be needed...",
          message: "You step quietly past the contented sea lion."
        }
      },
      scenery: ["cupid_mosaic", "bay_bridge"],
      npcs: ["giant_sea_lion"],
      onEnterFirst: "The sheer scale of the Bay Bridge is overwhelming. Traffic " +
                    "murmurs somewhere high overhead."
    },

    cupids_arrow: {
      id: "cupids_arrow",
      name: "Cupid's Span",
      descriptions: {
        default:
          "A colossal bow-and-arrow sculpture rises from the Embarcadero — " +
          "\"Cupid's Span\". Over twenty meters tall, it is about to loose its " +
          "arrow out over the bay. A small keyhole is set into the base. Behind " +
          "the pedestal, dark stairs descend. Rincon Park lies north; the " +
          "southern promenade, south.",
        short:
          "Cupid's Span. Keyhole in the base. Dark stairs down. North & south.",
        base_opened:
          "Cupid's Span. A side panel in the base stands open, a hollow where " +
          "something had been hidden. Dark stairs down, Rincon Park north, " +
          "promenade south."
      },
      exits: {
        north: { to: "rincon_park" },
        south: { to: "south_promenade" },
        down:  { to: "underground_passage",
                 message: "You descend into the dark. The air cools and thickens.",
                 alwaysVisible: true }
      },
      scenery: ["cupid_pedestal"],
      onEnterFirst: "The sculpture's shadow falls long over the stones. This place " +
                    "feels like it has secrets."
    },

    underground_passage: {
      id: "underground_passage",
      name: "Underground Passage",
      descriptions: {
        dark:
          "Black — complete, absolute darkness. Your outstretched hand meets cold " +
          "concrete. Somewhere, water drips. You can't see a thing.",
        default:
          "An old maintenance tunnel under the Embarcadero. Rusted rails — the " +
          "remnants of the Belt Line Railroad — run along the base of the wall. " +
          "Between graffiti and moss, the passage continues south. Stairs climb " +
          "back up. A dust-covered vintage train model sits in a hollow in the wall.",
        short:
          "Belt Line Railroad remnants. South passage, stairs up."
      },
      dark: true,
      exits: {
        up: { to: "cupids_arrow",
              message: "You climb back up to the light.",
              alwaysVisible: true },
        south: {
          to: "south_promenade",
          requires: { item: "flashlight" },
          failMessage: "Groping south through the pitch black seems unwise.",
          message: "You follow the tunnel south and emerge, blinking, into the sun."
        }
      },
      items: ["vintage_train_model"],
      onEnterFirst: {
        message: "You nearly miss the last stair in the dark. It's very dark. Some " +
                 "kind of light source is called for.",
        scoreEvent: "explored_underground"
      }
    },

    south_promenade: {
      id: "south_promenade",
      name: "South Promenade",
      descriptions: {
        default:
          "The south side of the Embarcadero. Fewer tourists — mostly joggers and " +
          "cyclists. Palm trees stand at even intervals; someone is reading on a " +
          "bench. By a flowerbed, a handmade cloth map is almost about to be " +
          "carried off by the wind. Cupid's Span lies north; the ballpark is south.",
        short:
          "South promenade. Quiet seaside. Cupid's Span north, ballpark south."
      },
      exits: {
        north: { to: "cupids_arrow" },
        south: { to: "ballpark_entrance",
                 message: "Stadium light towers appear in the distance." }
      },
      items: ["cloth_map"],
      npcs: ["jogger_npc"],
      onEnterFirst: "The noise of the north falls away. The air softens. You can " +
                    "hear the waves."
    },

    ballpark_entrance: {
      id: "ballpark_entrance",
      name: "Ballpark Entrance",
      descriptions: {
        default:
          "You stand in front of Oracle Park (formerly AT&T Park). A bronze " +
          "Willie Mays strikes his great catcher's stance. There's no game today, " +
          "and the stadium is quiet. An old-fashioned padlock hangs on the front " +
          "gate. North is the promenade, south the lighthouse point.",
        short:
          "Ballpark entrance. Willie Mays statue. Promenade north, lighthouse south."
      },
      exits: {
        north: { to: "south_promenade" },
        south: {
          to: "lighthouse_point",
          requires: { items: ["brass_compass", "old_nautical_chart"] },
          failMessage: "The path south along the rocky shore is lost in thick fog. " +
                       "Without a bearing and a chart of the route, you'd surely lose " +
                       "your way.",
          message: "With the compass and the chart to guide you, you make your way " +
                   "through the fog along the rocks."
        }
      },
      scenery: ["ballpark_gate", "willie_mays_statue"],
      onEnterFirst: "The Giants' home. Even on an off-day you can feel the afterglow " +
                    "of the crowd."
    },

    lighthouse_point: {
      id: "lighthouse_point",
      name: "Lighthouse Point",
      descriptions: {
        default:
          "The southernmost tip of the Embarcadero. A small lighthouse stands at " +
          "the point. Its door is ajar — you could step inside. At its foot, an " +
          "old stone marker bears carved words. Beyond is only sea. North leads " +
          "back to the ballpark.",
        short:
          "Lighthouse Point. Lighthouse door ajar. North to the ballpark.",
        game_won:
          "The lighthouse's beam sweeps across the whole bay. The fog is gone — " +
          "from the Golden Gate to the Bay Bridge, all of San Francisco Bay " +
          "stretches out, clear and golden."
      },
      exits: {
        north:   { to: "ballpark_entrance" },
        inside:  { interaction: "enter_lighthouse" }
      },
      interactions: {
        enter_lighthouse: {
          requires: { items: ["captains_log", "vintage_train_model", "brass_compass"] },
          failMessage: "Inside the lighthouse it's dim. A stone altar holds three " +
                       "indentations — but you don't have all three things it wants.",
          finale: "lighthouse",
          setsFlag: "game_won",
          scoreEvent: "completed_game"
        }
      },
      scenery: ["stone_marker", "lighthouse_door"],
      onEnterFirst: {
        message: "Waves break on the rocks and spray lightly touches your face. " +
                 "This is the end of the Embarcadero.",
        scoreEvent: "reached_lighthouse"
      }
    }
  },

  /* ======================================================================
     ITEMS
     ====================================================================== */
  items: {

    /* ---- Portable, puzzle-relevant ---- */

    silver_coin: {
      id: "silver_coin",
      name: "silver coin",
      aliases: ["coin", "silver", "old coin", "money", "quarter"],
      description:
        "An old silver coin. One face bears the Ferry Building's stamp; the " +
        "other reads \"1898\". It looks the right size for a telescope slot.",
      examine:
        "A silver coin, stamped 1898 — the year the Ferry Building was built. " +
        "Old, but still bright.",
      portable: true,
      weight: 1,
      useAlone: {
        message: "You flip the coin in your fingers. It rings nicely.",
        consumesItem: false
      },
      useWith: {
        brass_telescope: {
          message:
            "The coin drops into the slot with a click, and the telescope's lens " +
            "cover swings open. You put your eye to it — and far below Pier 7, " +
            "a small hidden dock, half-concealed. Something like a wooden crate " +
            "sits on it.",
          consumesItem: true,
          setsFlag: "telescope_clue",
          scoreEvent: "used_telescope"
        }
      }
    },

    rusty_key: {
      id: "rusty_key",
      name: "rusty key",
      aliases: ["key", "old key", "brass key", "rusted key"],
      description:
        "An old brass key, red with rust. An unusual, ornate shape.",
      examine:
        "A complex, decorative key. Meant for some kind of pedestal or monument, " +
        "it looks like.",
      portable: true,
      weight: 1,
      useWith: {
        cupid_pedestal: {
          message:
            "The key slides into the keyhole perfectly. With a slow grinding " +
            "sound, a panel in the side of the base swings open — and reveals " +
            "a brass compass hidden inside.",
          consumesItem: true,
          grantsItem: "brass_compass",
          setsFlag: "base_opened",
          scoreEvent: "opened_cupid_base"
        },
        ballpark_gate: {
          success: false,
          message: "The keyhole is the wrong shape. This isn't the right key.",
          consumesItem: false
        }
      }
    },

    old_nautical_chart: {
      id: "old_nautical_chart",
      name: "old nautical chart",
      aliases: ["chart", "nautical chart", "map", "sea chart"],
      description:
        "An old nautical chart, wrapped in oilcloth. It shows the currents and " +
        "reefs of San Francisco Bay in fine detail.",
      examine:
        "A careful hand-drawn chart. At the bay's southern tip it marks " +
        "\"lighthouse\" with a dotted safe passage to it — but without a " +
        "compass bearing, the route is hard to read.",
      portable: true,
      weight: 1,
      useWith: {
        brass_compass: {
          message:
            "You lay the compass on the chart. A safe route through the rocky " +
            "southern point emerges.",
          consumesItem: false,
          setsFlag: "chart_compass_combined",
          scoreEvent: "used_chart_compass"
        }
      }
    },

    sourdough_bread: {
      id: "sourdough_bread",
      name: "loaf of sourdough bread",
      aliases: ["bread", "sourdough", "loaf"],
      description:
        "San Francisco's famous sourdough. Still warm, fragrant.",
      examine:
        "A round loaf from Boudin Bakery. Crisp crust, soft crumb.",
      portable: true,
      weight: 1,
      useAlone: {
        message: "You tear off a piece and eat it. Incredible — this is why " +
                 "San Francisco is famous. But eating the whole loaf would be a waste.",
        consumesItem: false
      },
      useWith: {
        old_fisherman: {
          message:
            "The old fisherman takes the bread and grins. \"Thanks. Here — a " +
            "little something in return.\" He pulls a small flashlight from his " +
            "coat. \"Take it. Useful in dark places.\"",
          consumesItem: true,
          grantsItem: "flashlight",
          setsFlag: "fisherman_traded",
          scoreEvent: "traded_with_fisherman"
        },
        giant_sea_lion: {
          message:
            "You toss the bread in front of the sea lion. Its eyes light up — " +
            "and it swallows the loaf in a single gulp. It grunts contentedly " +
            "and lumbers to the side of the path. The way south is open.",
          consumesItem: true,
          setsFlag: "sea_lion_appeased",
          scoreEvent: "appeased_sea_lion"
        }
      }
    },

    /* Hidden second loaf — appears in Ferry Building after the cheese
       vendor's hint fires. Same effects as sourdough_bread. */
    sourdough_bread_2: {
      id: "sourdough_bread_2",
      name: "second loaf of sourdough",
      aliases: ["second bread", "second loaf", "bread", "sourdough", "loaf", "extra loaf"],
      description:
        "A second Boudin sourdough loaf, tucked under the counter. Also " +
        "still warm.",
      examine:
        "Somehow this second loaf had been out of sight under the counter. " +
        "The cheesemonger must have set it aside for you.",
      portable: true,
      weight: 1,
      useAlone: {
        message: "You tear off a piece and eat it. It's just as good as the first.",
        consumesItem: false
      },
      useWith: {
        old_fisherman: {
          message:
            "The old fisherman takes this loaf too, and chuckles. \"You're a " +
            "generous one. But I've no more gifts.\"",
          consumesItem: true
        },
        giant_sea_lion: {
          message:
            "You throw the bread to the sea lion. It swallows the loaf whole, " +
            "grunts happily, and lumbers aside. The way south is open!",
          consumesItem: true,
          setsFlag: "sea_lion_appeased",
          scoreEvent: "appeased_sea_lion"
        }
      }
    },

    ferry_token: {
      id: "ferry_token",
      name: "ferry token",
      aliases: ["token", "brass token", "ferry coin"],
      description:
        "An old ferry fare token, embossed with a ferry.",
      examine:
        "A ferry token that looks to date from the 1930s. \"San Francisco — " +
        "Oakland Ferry\" is still legible on its face. Meant for a turnstile.",
      portable: true,
      weight: 0
    },

    captains_log: {
      id: "captains_log",
      name: "captain's log",
      aliases: ["log", "journal", "ship's log", "notebook", "ship log"],
      description:
        "An old leather-bound captain's log. The last page bears a cryptic note.",
      examine:
        "The last page reads: \"The lighthouse asks for three treasures. The " +
        "record of the sea, the memory of the land, and the one that points " +
        "the way. When three are gathered, the light will return.\"",
      portable: true,
      weight: 1
    },

    flashlight: {
      id: "flashlight",
      name: "small flashlight",
      aliases: ["torch", "light", "lamp", "electric torch"],
      description:
        "A small but adequately bright flashlight. The batteries still hold.",
      examine:
        "A sturdy little metal flashlight. Flip the switch and it throws a " +
        "warm beam. Just the thing for dark places.",
      portable: true,
      weight: 1,
      isLightSource: true,
      useAlone: {
        message: "You click the flashlight on. A warm light fills the space around you.",
        consumesItem: false,
        setsFlag: "has_light"
      }
    },

    brass_compass: {
      id: "brass_compass",
      name: "brass compass",
      aliases: ["compass", "magnetic compass"],
      description:
        "A handsome brass compass. The needle rides true to north.",
      examine:
        "Finely-worked brass. Inside the cover, engraved: \"S.F. Harbor " +
        "Master, 1906\" — the year of the great earthquake. The needle " +
        "holds north without trembling.",
      portable: true,
      weight: 1
    },

    vintage_train_model: {
      id: "vintage_train_model",
      name: "vintage train model",
      aliases: ["train model", "model", "train", "locomotive", "model train"],
      description:
        "A precise model of the old Belt Line Railroad that once ran the " +
        "waterfront.",
      examine:
        "Remarkably detailed — 1920s Belt Line freight cars, the kind that " +
        "worked the piers. On the base, carved small: \"Do not forget this " +
        "place.\"",
      portable: true,
      weight: 1
    },

    cloth_map: {
      id: "cloth_map",
      name: "cloth map",
      aliases: ["embroidered map", "stitched map", "cloth", "handmade map"],
      description:
        "A handmade embroidered cloth map of the Embarcadero.",
      examine:
        "A careful embroidery of the whole Embarcadero — Pier 39 at the " +
        "north end, the lighthouse at the south, the major landmarks marked " +
        "with sweet little stitched icons. On the reverse, stitched: \"All " +
        "roads lead to the lighthouse.\"",
      portable: true,
      weight: 1,
      useAlone: {
        message:
          "You unfold the map and check your position. The shape of the " +
          "Embarcadero is easy to read at a glance.",
        consumesItem: false,
        showsMap: true
      }
    },

    /* ---- Scenery (non-portable) ---- */

    brass_telescope: {
      id: "brass_telescope",
      name: "brass telescope",
      aliases: ["telescope", "scope", "viewing telescope"],
      description: "An old brass tourist telescope, bolted to the railing. A coin slot.",
      examine:
        "Heavy brass, bolted to the railing. The slot is marked \"25¢\" but " +
        "it looks like most coins would fit. The lens cover is shut.",
      portable: false,
      scenery: true
    },

    carved_plank: {
      id: "carved_plank",
      name: "carved wooden plank",
      aliases: ["plank", "carving", "wooden plank", "carved plank"],
      description: "A weather-beaten plank with carved letters.",
      examine:
        "The carving reads, roughly: \"Look far before you look near. Silver " +
        "eyes don't lie.\"",
      portable: false,
      scenery: true
    },

    cupid_pedestal: {
      id: "cupid_pedestal",
      name: "sculpture pedestal",
      aliases: ["pedestal", "base", "keyhole", "cupid base", "cupid pedestal"],
      description:
        "The stone pedestal of the sculpture, with a small keyhole in its side.",
      examine:
        "A slab of polished stone. The keyhole is ornate and oddly shaped.",
      portable: false,
      scenery: true
    },

    ballpark_gate: {
      id: "ballpark_gate",
      name: "ballpark gate",
      aliases: ["gate", "padlock", "park gate", "front gate"],
      description:
        "An old-fashioned iron gate, chained with a heavy padlock.",
      examine:
        "Iron and chain. The padlock is big and forbidding — and its keyhole " +
        "clearly isn't meant for the rusty key you found.",
      portable: false,
      scenery: true
    },

    stone_marker: {
      id: "stone_marker",
      name: "stone marker",
      aliases: ["marker", "stone", "carved stone", "inscription"],
      description: "An old stone marker at the lighthouse's foot.",
      examine:
        "Carved into the stone: \"Three offerings open the light — the sea's " +
        "record, the land's memory, the one that points the way.\"",
      portable: false,
      scenery: true
    },

    lighthouse_door: {
      id: "lighthouse_door",
      name: "lighthouse door",
      aliases: ["door", "lighthouse"],
      description: "The door of the small lighthouse stands ajar.",
      examine:
        "The door is weathered, wooden, and not latched. You could step inside. " +
        "(Try: ENTER INSIDE)",
      portable: false,
      scenery: true
    },

    willie_mays_statue: {
      id: "willie_mays_statue",
      name: "Willie Mays statue",
      aliases: ["statue", "willie mays", "bronze statue", "mays"],
      description: "A bronze Willie Mays, caught in the middle of a legendary catch.",
      examine:
        "The Say Hey Kid, arms aloft, glove extended, forever running down " +
        "a ball somewhere in center field.",
      portable: false,
      scenery: true
    },

    display_case: {
      id: "display_case",
      name: "display case",
      aliases: ["case", "ferry history case", "exhibit"],
      description:
        "An old glass display case with notes on the Ferry Building's history.",
      examine:
        "Old photographs and captions from the Ferry's golden age. Tucked in " +
        "one corner, almost forgotten, a single ferry token.",
      portable: false,
      scenery: true
    },

    cupid_mosaic: {
      id: "cupid_mosaic",
      name: "Cupid mosaic",
      aliases: ["mosaic", "tile mosaic", "tiles", "cupid tiles"],
      description: "A tiled mosaic of Cupid set into the park's floor.",
      examine:
        "Blue and gold tiles form a Cupid with a bow. The colors are bright " +
        "beneath your feet.",
      portable: false,
      scenery: true
    },

    bay_bridge: {
      id: "bay_bridge",
      name: "Bay Bridge",
      aliases: ["bridge", "bay bridge", "the bridge"],
      description: "The Bay Bridge — its huge piers soar overhead.",
      examine:
        "Steel and shadow. The lower deck hums with traffic you cannot see.",
      portable: false,
      scenery: true
    }
  },

  /* ======================================================================
     NPCs
     ====================================================================== */
  npcs: {

    street_performer: {
      id: "street_performer",
      name: "silver-painted street performer",
      aliases: ["street performer", "performer", "silver man", "statue man",
                "silver performer", "living statue"],
      description:
        "A street performer painted head to toe in silver, holding a perfect " +
        "statuesque stillness.",
      dialogue: {
        default:
          "The silver performer doesn't move. But when you speak, one eye winks. " +
          "He whispers: \"Look out from the deck above. Silver eyes don't lie.\" " +
          "Then he is stone again.",
        after_telescope:
          "The silver performer smiles faintly. \"You saw, didn't you? What was " +
          "hidden.\""
      },
      dialogueFlagKey: "telescope_clue",
      dialogueFlagMap: { "true": "after_telescope", "false": "default" },
      interactions: {
        "give silver_coin": {
          message:
            "The performer glances at the coin but gently shakes his head. \"You " +
            "will need that elsewhere. Keep it safe.\" The coin is returned.",
          consumesItem: false
        },
        "attack": {
          message:
            "You swing — and he dodges with startling speed. Without so much as a " +
            "word he resumes his pose, one eye on you.",
          hostile: false
        }
      }
    },

    old_fisherman: {
      id: "old_fisherman",
      name: "old fisherman",
      aliases: ["fisherman", "old man", "fisher", "angler"],
      description:
        "A sunbrowned old man sits at the end of the pier, line in the water.",
      dialogue: {
        default:
          "The old fisherman speaks without looking up. \"Been fishing here fifty " +
          "years. There's nothing about this bay I don't know. ...I'm getting " +
          "hungry, though. I'd kill for some of that famous sourdough.\"",
        after_trade:
          "\"That was a fine loaf. Thanks kindly. Watch yourself in the dark " +
          "places — there's old tunnels under all this, you know.\"",
        "ask about lighthouse":
          "\"The lighthouse at the southern tip? There's an old tale — three " +
          "offerings laid at the light, and the bay glows again. Old wives' " +
          "story, mostly.\"",
        "ask about hidden dock":
          "\"Ah, that old dock below Pier 7. Smugglers used it once. Nobody goes " +
          "there any more.\"",
        "ask about train":
          "\"The Belt Line Railroad ran freight all down the piers once. They " +
          "tore up the tracks decades ago — but the tunnels are still there.\""
      },
      dialogueFlagKey: "fisherman_traded",
      dialogueFlagMap: { "true": "after_trade", "false": "default" },
      interactions: {
        "give sourdough_bread": {
          message:
            "The old fisherman's eyes light up. \"Oh, now! That's the stuff.\" He " +
            "takes the bread and fishes a small flashlight from a coat pocket. " +
            "\"Repayment. Use it in dark places.\"",
          consumesItem: true,
          grantsItem: "flashlight",
          setsFlag: "fisherman_traded",
          scoreEvent: "traded_with_fisherman"
        },
        "give sourdough_bread_2": {
          message:
            "The old fisherman takes this second loaf and laughs. \"You're a " +
            "generous one. But I've no more gifts for you.\"",
          consumesItem: true
        },
        "attack": {
          message: "The old fisherman raps your hand with his rod. \"Don't be a fool.\"",
          hostile: false
        }
      }
    },

    cheese_vendor: {
      id: "cheese_vendor",
      name: "cheesemonger",
      aliases: ["cheese vendor", "cheesemonger", "woman", "vendor", "cheese woman",
                "shopkeeper"],
      description:
        "A cheesemonger in a white apron, offering samples from her counter.",
      dialogue: {
        default:
          "\"Welcome! Care to try some Cowgirl Creamery? By the way — have you " +
          "been up to the balcony yet? Something interesting up there. Look " +
          "closely at the display case.\"",
        after_fisherman:
          "\"I saw you share a loaf with the old fisherman. That was kind. Here — " +
          "there's a second loaf I set aside under the bread counter. Take a " +
          "closer look; it should still be there if you need it.\""
      },
      dialogueFlagKey: "fisherman_traded",
      dialogueFlagMap: { "true": "after_fisherman", "false": "default" },
      onDialogue: {
        after_fisherman: { setFlag: "second_bread_hint" }
      },
      interactions: {
        "ask about balcony":
          "\"Yes, go up to the second floor. The display case has a nice little " +
          "exhibit. And — I think something's been forgotten in the corner of it.\"",
        "ask about bread":
          "\"Best sourdough on the coast. From the bakery downstairs.\"",
        "ask about lighthouse":
          "\"That little lighthouse south of the ballpark? There's a poem carved " +
          "on its base. Worth reading.\"",
        "attack": {
          message:
            "The cheesemonger hefts her enormous wire-cheese cutter and smiles. " +
            "\"I wouldn't.\" You reconsider.",
          hostile: false
        }
      }
    },

    giant_sea_lion: {
      id: "giant_sea_lion",
      name: "giant sea lion",
      aliases: ["sea lion", "sealion", "lion", "pinniped", "seal"],
      description:
        "A vast sea lion sprawled across the path, more than two meters of it.",
      dialogue: {
        default:
          "The sea lion looks up with wet black eyes and barks a dissatisfied " +
          "\"AROOH!\". It appears to be hungry.",
        after_fed:
          "The sea lion rolls contentedly onto its side. It looks positively sweet."
      },
      dialogueFlagKey: "sea_lion_appeased",
      dialogueFlagMap: { "true": "after_fed", "false": "default" },
      blocking: true,
      blocksExit: "south",
      interactions: {
        "give sourdough_bread": {
          message:
            "You hold out the bread. The sea lion's nose twitches — and it " +
            "swallows the whole loaf in one bite. It barks happily and " +
            "lumbers to the side of the path. The way south is open!",
          consumesItem: true,
          setsFlag: "sea_lion_appeased",
          scoreEvent: "appeased_sea_lion"
        },
        "give sourdough_bread_2": {
          message:
            "You hold out the second loaf. One bite, swallow, bark — and the " +
            "sea lion hauls itself aside. The way south is open!",
          consumesItem: true,
          setsFlag: "sea_lion_appeased",
          scoreEvent: "appeased_sea_lion"
        },
        "attack": {
          message:
            "Attack the sea lion? Seriously? Three hundred kilos of sea beast? " +
            "As expected, it roars and slams into you. You land on your back " +
            "three meters down the path.",
          hostile: false
        },
        "pet": {
          message:
            "Surprisingly, the sea lion tolerates a pat. But it still has no " +
            "intention of moving. It's probably hungry.",
          consumesItem: false
        }
      }
    },

    jogger_npc: {
      id: "jogger_npc",
      name: "jogger",
      aliases: ["jogger", "runner", "woman jogging", "jogging woman", "running woman"],
      description:
        "A jogger with earbuds in, pausing mid-stretch.",
      dialogue: {
        default:
          "She pops out an earbud. \"Favorite running route of mine. Did you know " +
          "there's a little lighthouse beyond the ballpark? Bring a compass, " +
          "though — the fog gets thick on the rocks and people lose their way.\"",
        "ask about lighthouse":
          "\"The lighthouse? Yeah, it's down past the ballpark. On foggy days the " +
          "path can be confusing — better to have a bearing and some kind of map.\"",
        "ask about fog":
          "\"The fog rolls in fast here. Always have a compass.\""
      },
      interactions: {
        "attack": {
          message:
            "She steps back lightly and gives you a cold look. \"I'll call the " +
            "cops.\" You pretend nothing happened.",
          hostile: false
        }
      }
    }
  },

  /* ======================================================================
     SCORE EVENTS — each at most once. Totals to 100.
     ====================================================================== */
  scoreEvents: {
    used_telescope:        10,
    found_hidden_dock:      5,
    traded_with_fisherman: 10,
    appeased_sea_lion:     10,
    opened_cupid_base:     15,
    explored_underground:   5,
    used_chart_compass:    10,
    reached_lighthouse:    10,
    completed_game:        25
  },

  /* ======================================================================
     HINT CHAIN — the player's HINT command escalates (nudge → push → shove)
     through the first entry whose `when(state)` evaluates true.
     ====================================================================== */
  hints: {
    chain: [
      {
        id: "get_coin",
        when: (S) =>
          !S.scoredEvents.used_telescope &&
          !S.inventory.includes("silver_coin") &&
          !S.flags.telescope_clue,
        nudge: "Something glints at your feet at Pier 39.",
        push:  "Pick up the coin. It may fit a coin-operated machine somewhere high up.",
        shove: "TAKE COIN, go UP to the deck, then USE COIN ON TELESCOPE."
      },
      {
        id: "use_telescope",
        when: (S) => S.inventory.includes("silver_coin") && !S.flags.telescope_clue,
        nudge: "The deck above Pier 39 has a view-finder that wants a coin.",
        push:  "USE COIN ON TELESCOPE — see what you notice.",
        shove: "Go up to the observation deck and USE SILVER COIN ON BRASS TELESCOPE."
      },
      {
        id: "reach_hidden_dock",
        when: (S) => S.flags.telescope_clue && !S.roomStates.hidden_dock.visited,
        nudge: "You saw something hidden from the deck — go look for it.",
        push:  "From Pier 7, the west side of the railing was suggestive.",
        shove: "From the Pier 7 promenade, go WEST over the railing."
      },
      {
        id: "open_cupid",
        when: (S) =>
          S.inventory.includes("rusty_key") &&
          !S.flags.base_opened,
        nudge: "There's a keyhole somewhere south of the Ferry Building.",
        push:  "The Cupid sculpture's base has a keyhole. Try the key.",
        shove: "At Cupid's Span: USE RUSTY KEY ON PEDESTAL."
      },
      {
        id: "appease_sea_lion",
        when: (S) => !S.flags.sea_lion_appeased &&
                     (S.inventory.includes("sourdough_bread") ||
                      S.inventory.includes("sourdough_bread_2")),
        nudge: "The sea lion is hungry.",
        push:  "Give it something from the Ferry Building bakery.",
        shove: "GIVE BREAD TO SEA LION."
      },
      {
        id: "two_breads",
        when: (S) => S.flags.fisherman_traded && !S.flags.sea_lion_appeased &&
                     !S.inventory.includes("sourdough_bread") &&
                     !S.inventory.includes("sourdough_bread_2"),
        nudge: "You only had one loaf — and you gave it away. Ask around inside.",
        push:  "The cheesemonger noticed what you did, and has a note for you now.",
        shove: "TALK TO CHEESEMONGER again. Then go back and look at the counter."
      },
      {
        id: "trade_fisherman",
        when: (S) => !S.flags.fisherman_traded &&
                     S.inventory.includes("sourdough_bread"),
        nudge: "Someone on Pier 7 mentioned being hungry.",
        push:  "The old fisherman wants some of that sourdough.",
        shove: "GIVE BREAD TO FISHERMAN — he'll thank you properly."
      },
      {
        id: "light_underground",
        when: (S) => S.roomStates.underground_passage.visited &&
                     !S.inventory.includes("flashlight"),
        nudge: "You'll need a light to travel the underground passage.",
        push:  "The old fisherman offered something useful in dark places — if he's fed.",
        shove: "GIVE BREAD TO FISHERMAN to get a flashlight."
      },
      {
        id: "chart_compass",
        when: (S) => S.inventory.includes("old_nautical_chart") &&
                     S.inventory.includes("brass_compass") &&
                     !S.flags.chart_compass_combined,
        nudge: "You have two pieces that work better together.",
        push:  "A chart without a bearing is hard to follow.",
        shove: "USE CHART ON COMPASS (or compass on chart)."
      },
      {
        id: "go_south_from_ballpark",
        when: (S) => S.roomStates.ballpark_entrance.visited &&
                     !S.roomStates.lighthouse_point.visited &&
                     S.inventory.includes("brass_compass") &&
                     S.inventory.includes("old_nautical_chart"),
        nudge: "With compass and chart, the foggy path south is possible now.",
        push:  "Go south from the ballpark entrance.",
        shove: "From the ballpark: S. Compass and chart will guide you."
      },
      {
        id: "finale",
        when: (S) => S.roomStates.lighthouse_point.visited && !S.flags.game_won,
        nudge: "The lighthouse wants three things from you.",
        push:  "Read the captain's log. It names three treasures.",
        shove: "Carry the captain's log, the train model, and the brass compass, " +
               "and then ENTER INSIDE the lighthouse."
      }
    ],
    fallback: [
      "Try LOOK and EXAMINE everything carefully.",
      "Talk to people. ASK them ABOUT things you've seen.",
      "Two items may be more useful combined than apart."
    ]
  },

  /* ======================================================================
     SPAWNS — when a flag flips true, drop the item into the named room,
     optionally with an announcement.
     ====================================================================== */
  spawns: {
    second_bread_hint: [
      {
        room: "ferry_building_interior",
        item: "sourdough_bread_2",
        announce: "(You notice a second loaf, tucked almost out of sight under the " +
                  "bread counter.)"
      }
    ]
  },

  /* ======================================================================
     ENDINGS — fire when flags (or allFlags) match. The interaction that
     sets `game_won` already plays the finale; this ending only marks
     the game as over so the loop freezes.
     ====================================================================== */
  endings: {
    win: { flag: "game_won", win: true }
  }
};
