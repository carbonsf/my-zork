/* ==========================================================================
   world.js — All rooms, items, NPCs, puzzles, and scoring data for
   SOUTH OF MARKET. The engine (engine.js) reads this at runtime.
   ========================================================================== */

window.WORLD = {

  /* ------------------------------------------------------------------ */
  /*  Meta                                                               */
  /* ------------------------------------------------------------------ */
  meta: {
    title: "SOUTH OF MARKET",
    startRoom: "eagle_plaza",
    startInventory: ["brass_key", "drummer_page"],
    maxScore: 130
  },

  /* ------------------------------------------------------------------ */
  /*  Score events                                                       */
  /* ------------------------------------------------------------------ */
  scoreEvents: {
    eagle_photo_examined:  5,
    matchbook_found:       5,
    marcus_name_learned:   5,
    leo_trust_1:           5,
    trick_passed:          5,
    uv_flashlight_bought:  5,
    workshop_key_found:   10,
    pattern_found:        10,
    stone_moved:          10,
    underground_entered:   5,
    vault_found:          10,
    flagpole_read:         5,
    leo_full_trust:        5,
    vault_exit_opened:     5,
    journal_read:          5,
    polaroid_found:        5,
    examine_bootprints:    5,
    key_cuff_made:         5,
    marcus_reached:        5,
    satchel_retrieved:    10
  },

  /* ------------------------------------------------------------------ */
  /*  Rooms                                                              */
  /* ------------------------------------------------------------------ */
  rooms: {

    eagle_plaza: {
      name: "Eagle Plaza",
      smell: "Cigarette smoke, stale beer, and the cold bite of fog off Folsom.",
      sound: "Low conversation from the patio. The distant thump of bass from somewhere east.",
      descriptions: {
        default: "The open-air plaza outside the SF Eagle. Concrete benches under strings of bare bulbs. A few guys lean against the railing in boots and harnesses, not talking to you yet. The Leather Pride flag hangs from a pole near the entrance, its black and blue stripes barely moving in the fog. To the east, the Eagle's patio. South, down Folsom toward the rest of the block.",
        short: "Eagle Plaza. The flag hangs still in the fog. East to the patio, south down Folsom."
      },
      scenery: ["crumpled_flyer", "leather_pride_flagpole"],
      items: [],
      npcs: ["smoker"],
      exits: {
        east:  { to: "eagle_patio" },
        south: { to: "folsom_11th" }
      }
    },

    eagle_patio: {
      name: "SF Eagle — Patio",
      smell: "Beer and cigarettes and the warmth of bodies gathered outside in the cold.",
      sound: "The bass is louder here, thumping through the wall from inside. Snatches of laughter. Ice in glasses.",
      descriptions: {
        default: "Open-air back patio. Picnic tables, string lights, a crowd of men in various configurations of leather and denim. The bass from inside thumps through the wall like a second heartbeat. There's a guy at a table near the far edge, alone, nursing a beer and watching you with no particular hurry.",
        short: "Eagle Patio. Leo is at the far table. West to the plaza, south inside."
      },
      items: ["matchbook"],
      scenery: ["leather_jacket"],
      npcs: ["leo"],
      exits: {
        west:  { to: "eagle_plaza" },
        south: { to: "eagle_interior" }
      }
    },

    eagle_interior: {
      name: "SF Eagle — Interior",
      smell: "Whiskey, sweat, wood polish, and decades of smoke absorbed into the walls.",
      sound: "The music is loud enough to feel. Glasses on the bar. Someone talking in your ear at a volume that means shouting.",
      descriptions: {
        default: "Dark. Loud. A long bar runs the length of the room. The lighting is red and amber. On the walls: framed photos of leather contests, fundraiser check presentations, faces of men who are gone. The bartender moves with economy, like someone who's been doing this for twenty years because they have.",
        short: "SF Eagle interior. Jude is behind the bar. North to the patio, west out front."
      },
      scenery: ["framed_photos", "coaster"],
      npcs: ["jude"],
      exits: {
        north: { to: "eagle_patio" },
        west:  { to: "folsom_11th" }
      }
    },

    folsom_11th: {
      name: "Folsom Street (11th)",
      smell: "Diesel exhaust and fog. Cold asphalt. Someone's cologne drifting from a doorway.",
      sound: "A motorcycle engine ticking as it cools. Traffic thin at this hour. Music from two directions, muffled.",
      descriptions: {
        default: "The fog has thickened. Folsom stretches east and west under amber streetlights, mostly empty at this hour. A motorcycle is parked at the curb, engine still ticking — someone just arrived. The Eagle is north. South, you can hear music from two directions — the thump of bass to the southeast and something harder, rawer, to the southwest.",
        short: "Folsom at 11th. Eagle north. Powerhouse southeast, Hole in the Wall southwest.",
        sable_opened: "The fog is thicker now. Or maybe it's you. The street feels like it's watching. Eagle north. Powerhouse southeast, Hole in the Wall southwest."
      },
      items: ["rubber_wristband"],
      scenery: ["motorcycle"],
      exits: {
        north: { to: "eagle_plaza" },
        southeast: { to: "powerhouse_interior" },
        southwest: { to: "hole_in_wall" },
        west:  { blocked: true, failMessage: "The city. You didn't come here to go back." }
      }
    },

    powerhouse_interior: {
      name: "Powerhouse — Interior",
      smell: "Sweat and whiskey and the ozone smell of the lighting rig.",
      sound: "The music is physical — you feel it in your sternum, in your back teeth. It doesn't let up.",
      descriptions: {
        default: "Low ceilings. Red light. The music is physical — you feel it in your sternum. Bodies move in the dim. The bar is a slab of black wood. Behind the DJ booth, someone moves with the music without looking like they're dancing. A curtain at the back of the room shifts in the bass-generated air. Stairs behind it.",
        short: "Powerhouse interior. Sable is at the booth. Northwest to Folsom, east to Hole in the Wall."
      },
      items: ["wrist_cuff"],
      scenery: ["drink_menu"],
      npcs: ["sable"],
      exits: {
        northwest: { to: "folsom_11th" },
        east: { to: "hole_in_wall" },
        west: { to: "lone_star" },
        down: {
          to: "powerhouse_basement",
          requires: { flag: "sable_opened" },
          failMessage: "The curtain is there. But Sable is watching you from the booth, and something in their expression says not yet."
        }
      },
      verbOverrides: {
        "DANCE": { message: "You let the bass take over for a minute. It helps." },
        "UNDRESS": { message: "Wrong room." }
      }
    },

    powerhouse_basement: {
      name: "Powerhouse — Basement",
      smell: "Old concrete and pipe rust and something damp that's been here longer than the bar above.",
      sound: "The music is muffled — a dull heartbeat through the floor. Your own breathing.",
      descriptions: {
        default: "The stairs are steep and the handrail is a pipe worn smooth by a thousand hands. Below: a low-ceilinged space with exposed brick. A few people are down here but they're not interested in conversation. In the far wall: a heavy metal door with no handle, just a combination dial. Someone has scratched arrows into the floor pointing toward it.",
        short: "Powerhouse Basement. Metal door in the far wall. Up to the interior.",
        leo_full_trust: "Powerhouse Basement. Leo is here near the metal door, waiting for you. Up to the interior."
      },
      items: ["note"],
      scenery: ["rusted_pipe", "metal_door"],
      npcs: [],
      exits: {
        up: { to: "powerhouse_interior" }
      }
    },

    hole_in_wall: {
      name: "Hole in the Wall Saloon",
      smell: "Beer and sawdust and old wood. The smell of a bar that doesn't try too hard.",
      sound: "The jukebox is playing something with teeth. A crack of pool balls. Someone's loud and having a good time.",
      descriptions: {
        default: "Bright compared to Powerhouse. This is a dive and it's proud of it. Stickers on every surface — band stickers, political stickers, benefit flyers from decades past. A pool table in the back. The jukebox is playing something with teeth. A large man in a leather vest is holding court at the end of the bar, directly in front of the back door.",
        short: "Hole in the Wall. Trick is at the back. East to Powerhouse, west to Lone Star.",
        trick_passed: "Hole in the Wall. The back door to Ringold is clear. East to Powerhouse, west to Lone Star, south through the back."
      },
      scenery: ["pool_cue", "stickers"],
      npcs: ["trick"],
      exits: {
        east:  { to: "powerhouse_interior" },
        west:  { to: "lone_star" },
        south: {
          to: "ringold_alley",
          requires: { flag: "trick_passed" },
          failMessage: "Trick is sitting directly in front of that door. He's not moving."
        }
      }
    },

    lone_star: {
      name: "Lone Star Saloon",
      smell: "Beer and bar nuts. The sweetness of something spilled a long time ago.",
      sound: "Country on the jukebox, low. A few quiet conversations. Much calmer than the Powerhouse.",
      descriptions: {
        default: "Smaller than the Hole in the Wall, quieter. Dart board, neon beer signs, the kind of bar that's been in the same spot for decades and never needed to update its image. A payphone hangs by the door — a real one, coin slot and everything. The bartender is wiping down the bar with the focused air of someone who finds cleaning meditative.",
        short: "Lone Star Saloon. Payphone by the door. East back to Hole in the Wall, north to Powerhouse."
      },
      scenery: ["payphone"],
      npcs: ["lone_star_bartender"],
      exits: {
        east:  { to: "hole_in_wall" },
        north: { to: "powerhouse_interior" }
      }
    },

    ringold_alley: {
      name: "Ringold Alley",
      smell: "Cold concrete and fog. Something floral — fresh flowers. The city held at a distance.",
      sound: "Quiet. The bars feel far away. Your footsteps on the colored concrete.",
      descriptions: {
        default: "The alley opens up into something else entirely. The Leather Pride flag is embedded in the pavement under your feet — black, blue, white, the red heart. Brass bootprints line the curbs, each one inscribed with a name. Standing stones rise from the colored concrete, engraved with the names of places that don't exist anymore. It's quiet here. The fog makes the streetlights into halos. North is the Hole in the Wall. East, the alley deepens. West, a gate in the fence with a lock.",
        short: "Ringold Alley. The brass bootprints, the standing stones, the quiet. North, east, west (with key)."
      },
      scenery: ["brass_bootprints", "granite_marker"],
      npcs: [],
      exits: {
        north: { to: "hole_in_wall" },
        east:  { to: "memorial_stones" },
        west:  {
          to: "mr_s_showroom",
          requires: { item: "brass_key" },
          failMessage: "The gate is locked with a heavy padlock. You'd need the right key.",
          message: "The brass key slides into the lock and turns with a precision that surprises you."
        }
      }
    },

    memorial_stones: {
      name: "Memorial Stones",
      smell: "Cold air and damp concrete and, faintly, the fresh carnation at the base of one stone.",
      sound: "Almost nothing. The city is muffled here. Your own heartbeat.",
      descriptions: {
        default: "The eastern end of Ringold Alley. The standing stones are taller here, more closely spaced, like a corridor. The engraved names of vanished bars and bathhouses surround you — The Catacombs, The Slot, The Barracks, Febe's, The Ambush. It feels like a graveyard for places. But the people are in here too. One stone in particular catches your eye: 'The Catacombs,' engraved in deep cuts, the stone slightly larger than the others.",
        short: "Memorial Stones. The Catacombs stone is here. West back to Ringold."
      },
      items: ["carnation"],
      scenery: ["catacombs_stone"],
      exits: {
        west: { to: "ringold_alley" },
        down: {
          to: "storm_drain",
          requires: { flag: "stone_moved" },
          message: "You lower yourself through the gap. It's a longer drop than you expected — your arms stretch full before your feet find the bottom. The stone grinds back into place above you. You're not going back up this way.",
          failMessage: "The stones are set solid into the ground. But the Catacombs stone felt different when you touched it."
        }
      }
    },

    mr_s_showroom: {
      name: "Mr. S Leather — Showroom",
      smell: "Tanned hide, metal hardware, something faintly chemical from the neoprene. Intoxicating.",
      sound: "Soft ambient music. The quiet of a place that takes itself seriously.",
      descriptions: {
        default: "The legendary gear shop. Racks of leather and neoprene under warm lighting. Glass cases display harnesses and restraints with the care of a jewelry store. A staff member looks up from behind the counter, professional, unhurried. East leads back to the alley gate. A door to the south is closed.",
        short: "Mr. S Showroom. The clerk is here. East to the alley, south to workshop (if unlocked)."
      },
      scenery: ["leather_harness", "dye_shelf"],
      items: ["catalog"],
      npcs: ["clerk"],
      exits: {
        east:  { to: "ringold_alley" },
        south: {
          to: "mr_s_workshop",
          requires: { item: "workshop_key" },
          failMessage: "The workshop door is locked. You'd need a key.",
          message: "The small iron key turns the workshop lock. The door swings open into the smell of leather dye and work."
        }
      },
      verbOverrides: {
        "UNDRESS": { message: "Absolutely not." }
      }
    },

    mr_s_workshop: {
      name: "Mr. S Leather — Back Workshop",
      smell: "Leather dye, adhesive, cut hide. The smell of things being made.",
      sound: "Silence except for the tick of cooling machinery.",
      descriptions: {
        default: "Behind the showroom. A workbench with cutting tools and leather scraps, ordered with professional care. Industrial sewing machines at rest. The air is heavy with the smell of leather dye and adhesive. A pegboard on the wall holds patterns — templates for harnesses, cuffs, hoods. One section of the pegboard has been cleared recently. Dust outlines show where patterns used to hang. One template remains in the cleared section: larger than the others, not a garment.",
        short: "Mr. S Workshop. The remaining pattern is on the pegboard. North back to the showroom."
      },
      scenery: ["leather_scraps", "dye_jar"],
      items: ["pattern"],
      exits: {
        north: { to: "mr_s_showroom" }
      }
    },

    storm_drain: {
      name: "Storm Drain Access",
      smell: "Cold water, old concrete, rust, and something organic that's been wet for a long time.",
      sound: "Water moving somewhere below. Dripping seepage. Above, the muffled city.",
      descriptions: {
        default: "You're standing in ankle-deep water in a concrete tunnel. The only light leaks through a grate above you — streetlight, fractured and dim. The tunnel runs roughly south. The walls are old — pre-earthquake old. Carved into the concrete at eye level, someone has scratched arrows pointing south.",
        short: "Storm Drain. Water ankle-deep. Scratched arrows point south."
      },
      items: ["polaroid"],
      scenery: ["grate", "scratched_arrows"],
      deathTimer: {
        warnings: [
          { at: 2, message: "The water has risen to your knees. You need to move south." },
          { at: 3, message: "The water is at your waist now. The tunnel is flooding." },
          { at: 4, message: "The water is at your chest. The current is pulling. You need to go south NOW." }
        ],
        death: { at: 5, message: "The water closes over your head. The current takes you. You are gone.\n\n*** You have drowned. ***\n\nType RESTART or LOAD to try again." }
      },
      exits: {
        south: {
          to: "the_vault",
          requires: { item: "pattern" },
          message: "You hold the pattern rubbing against the south wall and compare. A seam in the concrete, barely visible. A door. You find the edge with your fingers and push. It swings inward on old hinges.",
          failMessage: "The tunnel continues south but ends in what looks like a blank wall. You run your hands over the concrete. There must be something you're missing — some way to know where to look.",
          scoreEvent: "underground_entered"
        },
        east: { blocked: true, failMessage: "The water gets deeper to the east. You turn back." },
        up:   { blocked: true, failMessage: "The grate is too high to reach. You're not going back up this way." }
      }
    },

    the_vault: {
      name: "The Vault",
      smell: "Dry, cool air. Old brick and paper and candle wax from another century.",
      sound: "Silence. Deep, complete silence. After the city, it's almost physical.",
      descriptions: {
        default: "A dry, vaulted room older than anything above it. Brick walls from another century, the ceiling arching high above you. Someone has set up a work area: a folding table, a camp lantern with dead batteries, and boxes of papers and photographs. Marcus's workspace. In the far north wall: a heavy metal door with a combination dial. Three numbers. South, through a crumbling opening, the tunnel continues.",
        short: "The Vault. Marcus's workspace. Combination door north, crumbling opening south."
      },
      scenery: ["boxes_of_papers", "camp_lantern", "combination_lock", "vault_walls"],
      items: ["journal"],
      exits: {
        north: {
          to: "powerhouse_basement",
          requires: { flag: "knows_combination" },
          message: "6... 14... 2. The dial clicks through each number. The heavy door swings outward. Cool air from the tunnel beyond. You step through.",
          failMessage: "A heavy metal door with a combination dial. Three numbers. You try a few guesses. Nothing. You'll need the actual combination.",
          scoreEvent: "vault_exit_opened"
        },
        south: { to: "foundation_site" }
      },
      onEnterFirst: {
        scoreEvent: "vault_found"
      }
    },

    foundation_site: {
      name: "Foundation Site",
      smell: "Fresh concrete, motor oil, disturbed earth. The cold smell of excavation.",
      sound: "Distant machinery. Your footsteps echo off rebar and concrete pilings. And then: a voice.",
      descriptions: {
        default: "Through the crumbling opening: a vast excavation. Rebar. Concrete pilings. Construction equipment silhouetted against the glow of streetlights filtering down from above. The foundation of the new development. Directly above you, the future building.\n\nAt the far end of the excavation, sitting on an overturned bucket, is Marcus.",
        short: "Foundation Site. Marcus is here. North to the vault, up to the street (with satchel)."
      },
      npcs: ["marcus"],
      scenery: ["construction_plans"],
      deathTimer: {
        warnings: [
          { at: 6, message: "A low rumble from above. Dust sifts down from the rebar. Marcus looks up. 'We should hurry,' he says." },
          { at: 8, message: "The rumbling is louder. A section of the eastern wall shifts. 'I mean it,' Marcus says. 'We need to go.'" }
        ],
        death: { at: 10, message: "The ceiling gives way. There is a sound like the whole city falling.\n\n*** You did not make it out. ***\n\nType RESTART or LOAD to try again." }
      },
      exits: {
        north: { to: "the_vault" },
        up: {
          to: "harrison_dawn",
          requires: { item: "satchel" },
          failMessage: "Marcus shakes his head. 'Not without the archive. That's the whole point.'"
        }
      },
      onEnterFirst: {
        scoreEvent: "marcus_reached"
      }
    },

    harrison_dawn: {
      name: "Harrison Street — Dawn",
      descriptions: {
        default: "Harrison Street at dawn."
      },
      exits: {},
      onEnterFirst: {
        finale: "soma_ending",
        setFlag: "game_won",
        scoreEvent: "satchel_retrieved"
      }
    }

  },

  /* ------------------------------------------------------------------ */
  /*  Items                                                              */
  /* ------------------------------------------------------------------ */
  items: {

    /* --- Portable --- */

    brass_key: {
      name: "brass key",
      aliases: ["key", "brass"],
      description: "A heavy brass key, old-style, hand-finished. Tool marks visible on the bow if you look closely. Someone made this by hand.",
      examine: "A heavy brass key, hand-finished. Hefty. On the bow, a tiny stamped symbol — the same one you'll notice on the granite marker in Ringold Alley, if you're paying attention.",
      useWith: {
        trick: {
          message: "You hold out the brass key. Trick turns it over in his enormous hand. 'Where'd you get that?' he says, finally. 'That's Marcus's style of work.' He looks at you for a long moment, then steps aside. 'Go on through.'",
          setsFlag: "trick_passed",
          scoreEvent: "trick_passed"
        },
        wrist_cuff: {
          message: "You thread the brass key through the brass ring on the leather cuff. It settles there naturally, like it was made for it — a wearable key, practical and resonant. You clip it to your wrist.",
          grantsItem: "key_cuff",
          consumesTarget: true,
          scoreEvent: "key_cuff_made"
        }
      }
    },

    drummer_page: {
      name: "Drummer page",
      aliases: ["page", "magazine", "drummer", "paper", "torn page"],
      description: "A torn page from issue 114 of Drummer magazine. A photo essay of leather bars on Folsom Street in the early 1980s. On the back, in Marcus's handwriting: 'Ringold. Before they pour the foundation.'",
      examine: "Issue 114 of Drummer, partial. A photo essay: men in leather in the bars you're walking through tonight, except decades younger. On the back, in Marcus's handwriting: 'Ringold. Before they pour the foundation.'",
      useWith: {
        leo: {
          message: "Leo's eyes go to the page immediately. His hand moves like he's going to reach for it, then stops. 'Where did you get that?' His voice is quieter than before. 'That's issue 114.' He looks at you differently now.",
          setsFlag: "leo_trust_1",
          scoreEvent: "leo_trust_1"
        },
        jude: {
          message: "'Oh, shit,' Jude says, leaning over to look. 'Issue 114. That was a good one. Alan used to have a stack of these at the shop — said it was proof that Mr. S had history worth protecting.'"
        },
        sable: {
          message: "Sable glances at the page from behind the booth. 'Drummer 114.' They study your face for a moment. 'Someone sent you that. That's not just a souvenir.'",
          setsFlag: "sable_seen_flyer"
        }
      }
    },

    matchbook: {
      name: "Lone Star matchbook",
      aliases: ["matchbook", "matches", "match", "book"],
      description: "A matchbook from the Lone Star Saloon. The inside cover has a phone number written in ballpoint — a 415 number, not a cell phone.",
      examine: "Lone Star Saloon matchbook. Three matches left. Inside the cover, written in handwriting you're starting to recognize: 415-555-0114. Marcus's number.",
      scoreOnTake: "matchbook_found"
    },

    wrist_cuff: {
      name: "leather wrist cuff",
      aliases: ["cuff", "wristband", "leather cuff", "wrist"],
      description: "A leather wrist cuff left on the bar at Powerhouse. Dark brown, well-made. A small brass ring attached at the center — the kind meant for clipping a key.",
      examine: "Well-worn leather cuff. A small brass ring at the center. You realize it would hold a key perfectly."
    },

    uv_flashlight: {
      name: "UV flashlight",
      aliases: ["flashlight", "light", "uv light", "blacklight", "uv"],
      description: "A compact UV flashlight from Mr. S. Heavy for its size. Batteries included.",
      examine: "A solid UV flashlight, the professional kind. Under its light, things invisible to the naked eye become legible.",
      useWith: {
        leather_pride_flagpole: {
          message: "You crouch at the base of the flagpole and sweep the UV light across the metal. Numbers appear, scratched in and filled with UV-reactive ink: 6 — 14 — 2. The combination.",
          setsFlag: "knows_combination",
          scoreEvent: "flagpole_read"
        },
        rubber_wristband: {
          message: "Under the UV light, the black rubber wristband reveals text in invisible ink: VAULT ACCESS. Not a key. But confirmation you're looking for the right thing."
        },
        vault_walls: {
          message: "Names appear on the brick walls. Dozens of them. Written in ink invisible to the naked eye. Men who were here. Men who are gone. This vault has been known to people in the leather community for decades — passed down quietly, a secret shared among those trusted enough to keep it. Marcus didn't discover the vault. He discovered it was about to be destroyed."
        }
      }
    },

    rubber_wristband: {
      name: "black rubber wristband",
      aliases: ["wristband", "band", "rubber band", "rubber", "bracelet"],
      description: "A plain black rubber wristband, the kind handed out at club events. No visible markings. Found on the ground on Folsom.",
      examine: "Plain black rubber. No markings visible to the naked eye. The material has a particular quality — like it was printed with something that needs a different light to read."
    },

    catalog: {
      name: "Mr. S catalog",
      aliases: ["catalog", "catalogue", "booklet", "brochure"],
      description: "The current Mr. S Leather catalog. Glossy. Someone has been reading this copy — there's a handwritten annotation on the inside back cover.",
      examine: "Current Mr. S catalog. On the inside back cover, in handwriting you're starting to recognize as Marcus's: 'Workshop key is with the old stock. Bottom shelf, behind the dye.' Underlined twice."
    },

    workshop_key: {
      name: "small iron key",
      aliases: ["iron key", "small key", "workshop key", "iron"],
      description: "A small iron key, heavier than it looks, with an old-fashioned profile. A workshop or storage room key.",
      examine: "Small and heavy. Iron, not brass. This unlocks something practical. It doesn't have the same careful finish as the brass key."
    },

    pattern: {
      name: "leather pattern rubbing",
      aliases: ["pattern", "rubbing", "template", "map", "tunnel map"],
      description: "A large leather template from the Mr. S workshop. But it's not a garment pattern — it's a rubbing of a surface covered in symbols and numbers. A map of something underground.",
      examine: "This isn't a garment template. It's a rubbing — charcoal on leather, transferred from a cast-metal surface. A map of a tunnel system, with notation in Marcus's hand. A door is marked with an arrow. This is how you find the vault from below.",
      scoreOnTake: "pattern_found"
    },

    carnation: {
      name: "red carnation",
      aliases: ["carnation", "flower", "red flower", "flowers"],
      description: "A single red carnation, still fresh. Someone left it at the base of a standing stone in the last hour — the petals haven't curled yet.",
      examine: "Still fresh, still red. Someone left this recently. In this context — this alley, these stones — it means something specific."
    },

    note: {
      name: "folded note",
      aliases: ["note", "paper", "message", "slip"],
      description: "A folded piece of paper from the Powerhouse basement floor. In Marcus's handwriting: 'The combination is on the flag. —M'",
      examine: "A note, folded once. In Marcus's handwriting. 'The combination is on the flag. —M'. Brief. Confident. Like he expected someone to find it."
    },

    polaroid: {
      name: "Polaroid photo",
      aliases: ["photo", "picture", "polaroid", "photograph", "pouch"],
      description: "A Polaroid in a waterproof pouch. Marcus, in a concrete tunnel, giving a thumbs-up. On the back: 'Found it. Holy shit. —M, March'",
      examine: "Marcus in a concrete tunnel, grinning. Thumbs up. On the back: 'Found it. Holy shit. —M, March'. Three months ago.",
      scoreOnTake: "polaroid_found",
      useWith: {
        leo: {
          message: "Leo sees the photo and goes very still. 'He was down there alone?' His voice is flat, controlled. He looks at it for a long time. When he hands it back his hand is steady but his face isn't. 'He didn't tell me he was going down without someone with him.'",
          setsFlag: "leo_trust_2"
        }
      }
    },

    journal: {
      name: "leather-bound journal",
      aliases: ["journal", "diary", "book", "notebook"],
      description: "Marcus's field journal. Heavy, well-used. The binding is hand-stitched.",
      examine: "Marcus's field journal. You read the last few entries. He discovered this vault while researching the neighborhood for a documentary project. He's been cataloguing artifacts for months. The last entry, three weeks ago: 'Meeting with a developer rep tomorrow. They want to pour the foundation for the new building on this block. If they do, the vault gets buried permanently. I won't let that happen. I need help. I need someone who gives a damn. I know who to call.'",
      onExamine: {
        scoreEvent: "journal_read",
        doneFlag: "journal_read"
      }
    },

    satchel: {
      name: "Marcus's satchel",
      aliases: ["satchel", "bag", "archive", "documents", "case"],
      description: "Marcus's satchel, heavy with paper and photographs. The complete archive, organized and documented. This is what you came for.",
      examine: "Heavy. Full. Organized with care. Documents, photographs, personal effects — irreplaceable records of the people commemorated in Ringold Alley. Marcus has been building something real."
    },

    key_cuff: {
      name: "key on cuff",
      aliases: ["key cuff", "cuff key", "wearable key"],
      description: "The brass key threaded through the ring of the leather cuff, worn at the wrist. Practical and resonant.",
      examine: "The brass key sits perfectly in the ring of the leather cuff. You can wear it, carry it, use it. It looks like it belongs there."
    },

    /* --- Scenery --- */

    crumpled_flyer: {
      name: "crumpled flyer",
      aliases: ["flyer", "leaflet"],
      scenery: true,
      examine: "A flyer for Gear Night at Powerhouse, tonight. 'DJ Sable spinning 10PM–close.' A red SOLD OUT stamp across the top, but the door is open."
    },

    leather_pride_flagpole: {
      name: "Leather Pride flagpole",
      aliases: ["flagpole", "flag pole", "flag", "leather pride flag", "pole"],
      scenery: true,
      examine: "The Leather Pride flag above — black and blue stripes, the white stripe, the red heart. The pole is set in a concrete base. In the dimness you can see something scratched into the metal at the base, but you can't read it without more light."
    },

    leather_jacket: {
      name: "leather jacket",
      aliases: ["jacket", "coat", "leather coat"],
      scenery: true,
      takeable: false,
      examine: "A beautiful jacket draped over a bench — old leather, shaped by years of wear, fit to one specific body. Not yours. In this neighborhood, people notice."
    },

    framed_photos: {
      name: "framed photos",
      aliases: ["photos", "photographs", "pictures", "frames", "photo", "picture", "frame", "wall"],
      scenery: true,
      examine: "Dozens of photos, spanning decades. Leather contest winners. Fundraiser check presentations. Men in their prime. One photo stops you: two men at a workshop bench, arm in arm, laughing at something off-camera. The younger one is Marcus — you'd know that face anywhere. The inscription reads: 'M & Alan, Mr. S, '04'.",
      onExamine: {
        scoreEvent: "eagle_photo_examined",
        doneFlag: "eagle_photo_seen"
      }
    },

    coaster: {
      name: "coaster",
      aliases: ["coaster", "qr", "qr code"],
      scenery: true,
      examine: "A bar coaster with a QR code. Your phone died an hour ago. Typical."
    },

    motorcycle: {
      name: "motorcycle",
      aliases: ["motorcycle", "bike", "harley", "motorbike"],
      scenery: true,
      examine: "A Harley Sportster, parked at the curb. Engine still ticking as it cools. Beautiful machine. Not yours."
    },

    drink_menu: {
      name: "drink menu",
      aliases: ["menu", "drinks"],
      scenery: true,
      examine: "Whiskey. Beer. More whiskey. This isn't a cocktail bar and it isn't trying to be."
    },

    rusted_pipe: {
      name: "rusted pipe",
      aliases: ["pipe", "plumbing", "railing"],
      scenery: true,
      examine: "Part of the original plumbing. This building is older than it looks — much older, underneath the renovations."
    },

    metal_door: {
      name: "metal door",
      aliases: ["door", "combination door", "dial"],
      scenery: true,
      examine: "A heavy metal door set in the far wall. No handle, just a combination dial. Three numbers. Arrows scratched into the floor point toward it."
    },

    pool_cue: {
      name: "pool cue",
      aliases: ["pool cue", "cue", "cue stick"],
      scenery: true,
      examine: "You pick it up, sight along it, set it back. It's straight. Focus."
    },

    stickers: {
      name: "stickers",
      aliases: ["sticker", "wall", "flyers", "missing flyer", "walls", "missing"],
      scenery: true,
      examine: "Layers of history. Band stickers, political stickers, benefit flyers from campaigns long past. A small MISSING flyer, half covered by newer stickers — you can make out the face. Marcus. Posted maybe a month ago. No tip number written on it yet."
    },

    brass_bootprints: {
      name: "brass bootprints",
      aliases: ["bootprints", "boots", "boot prints", "prints", "names"],
      scenery: true,
      examine: "The bootprints are cast in brass and set into the curb, each one inscribed with a name. You crouch down to read them. Dozens of names. Leather community figures, bar owners, artists, activists. One stops you: 'Alan Selby — Founder, Mr. S Leather — Mayor of Folsom Street.'",
      onExamine: {
        scoreEvent: "examine_bootprints",
        doneFlag: "bootprints_examined"
      }
    },

    granite_marker: {
      name: "granite marker",
      aliases: ["granite", "marker", "mural", "stone marker", "leather david"],
      scenery: true,
      examine: "A detailed bas-relief — the Leather David, flanked by names of community organizations. In the shadowed lower corner, half worn away, a small symbol has been scratched in. The same symbol is on the bow of the brass key in your pocket."
    },

    leather_harness: {
      name: "leather harness",
      aliases: ["harness", "display harness"],
      scenery: true,
      examine: "Beautifully made. The stitching is even, the hardware polished, the leather supple without being soft. You know quality when you see it. This is quality."
    },

    dye_shelf: {
      name: "dye shelf",
      aliases: ["dye", "shelf", "bottom shelf", "old stock", "stock", "cans"],
      scenery: true,
      examine: "Old stock. Cans of leather dye in umber and oxblood on the bottom shelf. As you look more closely, something catches your eye behind a can of umber dye — a small iron key, tucked against the wall.",
      onExamine: {
        message: "You reach behind the umber dye and close your fingers around a small iron key.",
        grantsItem: "workshop_key",
        scoreEvent: "workshop_key_found",
        doneFlag: "workshop_key_taken"
      }
    },

    leather_scraps: {
      name: "leather scraps",
      aliases: ["scraps", "offcuts", "leather offcuts"],
      scenery: true,
      examine: "Offcuts in every color — black, chestnut, oxblood, a deep teal that's unusual. Someone who works here has range."
    },

    dye_jar: {
      name: "jar of leather dye",
      aliases: ["dye jar", "jar", "umber dye"],
      scenery: true,
      examine: "Umber leather dye. Still wet — the brush is resting across the top. Someone was working here recently. Very recently."
    },

    grate: {
      name: "grate",
      aliases: ["grate", "drain grate", "street grate"],
      scenery: true,
      examine: "Steel grate flush in the ceiling above you. Streetlight comes through in fractured slices. Too high to reach. You're not going back up this way."
    },

    scratched_arrows: {
      name: "scratched arrows",
      aliases: ["arrows", "scratching", "markings"],
      scenery: true,
      examine: "Recent. Done with a key or a knife. Deliberate — someone who knew where they were going, leaving a trail for whoever came next. They all point south."
    },

    boxes_of_papers: {
      name: "boxes of papers",
      aliases: ["boxes", "papers", "documents", "photographs", "box", "archive"],
      scenery: true,
      examine: "Historical documents: property deeds from the 1960s, photographs of bars and bathhouses, original Drummer magazine pages, handwritten accounts of the early leather scene. Marcus has been building an archive — a real one, organized by date and subject. Of everything that happened here before it was paved over."
    },

    camp_lantern: {
      name: "camp lantern",
      aliases: ["lantern", "lamp"],
      scenery: true,
      examine: "A good camp lantern, battery-powered. The batteries are dead. Marcus has been working by flashlight — or in the dark."
    },

    combination_lock: {
      name: "combination lock",
      aliases: ["lock", "combination", "dial", "combination lock", "vault door"],
      scenery: true,
      examine: "A heavy dial combination lock built into the north wall door. Three numbers. You'll need the combination to open it."
    },

    vault_walls: {
      name: "vault walls",
      aliases: ["walls", "wall", "brick", "bricks"],
      scenery: true,
      examine: "Old brick, the kind that absorbs whatever happens in a room. There's something on the surface — variations in texture, marks in the mortar — but you can't make out any detail in this light. The UV flashlight might reveal something."
    },

    construction_plans: {
      name: "construction plans",
      aliases: ["plans", "blueprints", "building plans"],
      scenery: true,
      examine: "Building plans tacked to a concrete piling. On the page covering the area directly below you: 'Zone 4 — cleared for fill.' The vault is in Zone 4."
    },

    catacombs_stone: {
      name: "Catacombs stone",
      aliases: ["stone", "standing stone", "catacombs", "memorial stone"],
      scenery: true,
      examine: "Engraved: 'The Catacombs.' Below the name, an address and a date range. You run your hand along the edge and feel something give. The stone shifts slightly in its base. It's not as fixed as the others.",
      pushable: {
        message: "You lean into the Catacombs stone. It resists, then gives — a grinding sound of old concrete, and the stone swings back on a hidden pivot to reveal a gap at ground level. The smell of cold water rises from below.",
        setsFlag: "stone_moved",
        scoreEvent: "stone_moved"
      }
    },

    payphone: {
      name: "payphone",
      aliases: ["phone", "payphone", "telephone", "landline"],
      scenery: true,
      examine: "A genuine payphone, coin slot and all. The receiver is cold. It has a dial tone."
    }

  },

  /* ------------------------------------------------------------------ */
  /*  NPCs                                                               */
  /* ------------------------------------------------------------------ */
  npcs: {

    smoker: {
      id: "smoker",
      name: "smoker",
      aliases: ["man", "guy", "smoker"],
      description: "A lean man in his fifties, smoking with practiced economy, watching the street.",
      dialogue: {
        default: "He looks at you sideways. 'Some guy was asking about the old tunnels last week. Wearing a nice jacket. Wouldn't say who he was.' He takes a drag. 'Probably nothing.'",
        after: "He's said what he had to say. He smokes and watches the street."
      },
      dialogueFlagKey: "smoker_talked",
      dialogueFlagMap: { "true": "after", "false": "default" },
      onDialogue: {
        default: { setFlag: "smoker_talked" }
      }
    },

    leo: {
      id: "leo",
      name: "Leo",
      aliases: ["leo", "man", "guy at table"],
      description: "Late forties. Quiet. A well-worn leather jacket that fits him like a second skin. He's been nursing that beer for a while.",
      dialogueFlagPriority: ["leo_trust_full", "leo_trust_2", "leo_trust_1"],
      dialogueFlagPriorityMap: {
        "leo_trust_full": "trust_full",
        "leo_trust_2":    "trust_2",
        "leo_trust_1":    "trust_1"
      },
      dialogue: {
        default:     "'You look lost.' His voice is level. He's not being unfriendly. He's being careful.",
        trust_1:     "'I've been coming here every Friday for three months,' he says. 'Same spot. Same beer. You know who I'm waiting for.' He doesn't explain further. Not yet.",
        trust_2:     "'He went down without telling me.' He's quiet for a moment. 'That's not like him. Marcus plans. He documents. He tells people where he's going.' He looks at his hands. 'Something changed.'",
        trust_full:  "Leo is quiet for a long time. Then: 'The combination is 6-14-2. He told me two months ago, in case anything went wrong.' He meets your eyes. 'Find him. Bring him up.'"
      },
      onDialogue: {
        trust_full: {
          setFlag: "knows_combination",
          scoreEvent: "leo_full_trust"
        }
      },
      interactions: {
        "ask about marcus": {
          requiresFlag: "marcus_name_learned",
          message: "'You know Marcus Cahill?' Something in his posture changes. 'Who's asking.' It's not quite a question. He's deciding something."
        },
        "give carnation": {
          message: "Leo looks at the carnation for a long moment. Then he closes his eyes. 'He used to leave these for me. At the bar, on Friday nights. Never said it was him. I always knew.' He takes it carefully. 'He's been down there for weeks, hasn't he.'",
          consumesItem: true,
          setsFlag: "leo_trust_full",
          scoreEvent: "leo_full_trust"
        },
        "kiss": {
          requiresFlag: "leo_trust_full",
          message: "He leans in. Brief. Warm. He pulls back and looks at you like he's making a decision."
        },
        "kiss_default": {
          message: "He tilts his head. 'I don't know you well enough for that. Yet.'"
        }
      }
    },

    jude: {
      id: "jude",
      name: "Jude",
      aliases: ["jude", "bartender", "barkeep"],
      description: "Late thirties. Fast hands, slow eyes. He's been behind this bar long enough to know everyone and care about most of them.",
      dialogue: {
        default: "'What'll it be?' He's already reaching for a glass."
      },
      shop: {
        "drink": { price: 5, message: "Jude slides a drink across the bar without comment. You take it in two swallows. It helps." }
      },
      interactions: {
        "ask about marcus": {
          message: "'Marcus Cahill? Haven't seen him in weeks. He used to come in Sunday afternoons — sit in the corner, drink one beer, write in that journal of his for hours. Quiet guy. Serious.' Jude pauses. 'You looking for him?'",
          setsFlag: "marcus_name_learned",
          scoreEvent: "marcus_name_learned"
        },
        "ask about money": {
          requiresFlag: "marcus_name_learned",
          message: "Jude studies you. 'You're trying to find Marcus.' It's not a question. He reaches under the bar. 'You find him, drinks are on the house forever. Here's twenty to get you started.'",
          setsMoney: 20
        },
        "ask about alan": {
          message: "'Alan Selby ran Mr. S for decades. Passed a few years back. He and Marcus went way back — Marcus did some of his historical research using the Mr. S archive. Good man.'"
        }
      }
    },

    sable: {
      id: "sable",
      name: "Sable",
      aliases: ["sable", "dj", "dj sable"],
      description: "Nonbinary. Late twenties. Shaved head, septum ring, tattoo sleeves. They're running the room and they know it.",
      dialogue: {
        default: "'The party's up here, handsome.' They don't look up from the decks.",
        opened:  "'You're good.' They tilt their head toward the curtain. 'Don't break anything down there.'"
      },
      dialogueFlagKey: "sable_opened",
      dialogueFlagMap: { "true": "opened", "false": "default" },
      interactions: {
        "ask about basement": {
          message: "'Basement's for friends.' A pause. 'Tell me why you want to go down there.'"
        },
        "ask about marcus": {
          message: "'The leather guy? Yeah, he went down a few times this spring. Always asked politely first. Always had a reason.' They study you. 'Do you have one?' Before you can answer: 'Actually — you have that look. Like someone looking for something specific. Go ahead.'",
          setsFlag: "sable_opened"
        },
        "ask about archive": {
          message: "'You know about the archive.' Not a question. 'Alright. Go down.'",
          setsFlag: "sable_opened"
        },
        "ask about disappearance": {
          message: "'He disappeared? Shit.' A beat. 'Go down. Find out what's going on.'",
          setsFlag: "sable_opened"
        }
      }
    },

    trick: {
      id: "trick",
      name: "Trick",
      aliases: ["trick", "big man", "bouncer", "man in vest"],
      description: "A large man with a large laugh and a larger presence. Leather vest, engineer boots, arms like bridge cables. He's not hostile. He's protective.",
      dialogue: {
        default: "'Hey there.' His voice is friendly, unhurried. 'Door's not for tourists.'",
        passed:  "'You're good people.' He's already turned back to his drink. The door is unguarded."
      },
      dialogueFlagKey: "trick_passed",
      dialogueFlagMap: { "true": "passed", "false": "default" },
      interactions: {
        "ask about ringold": {
          message: "'It's a memorial. Not a shortcut.' He says it without heat."
        },
        "ask about marcus": {
          requiresFlag: "marcus_name_learned",
          message: "'You know Marcus Cahill?' Something shifts in his expression. 'Shit. Why didn't you say so.' He moves aside. 'Go on through.'",
          setsFlag: "trick_passed",
          scoreEvent: "trick_passed"
        },
        "kiss": {
          message: "'Not that kind of bar.' He winks."
        }
      }
    },

    lone_star_bartender: {
      id: "lone_star_bartender",
      name: "Lone Star bartender",
      aliases: ["bartender", "barkeep", "bar", "lone star bartender"],
      description: "A compact man in his sixties, wiping down the bar with methodical care.",
      dialogue: {
        default: "'What can I get you?' He sets down the cloth."
      },
      shop: {
        "drink": {
          price: 5,
          message: "You order a drink and ask him to send one over to Trick at the Hole in the Wall. 'Trick. Sure.' He nods and reaches for a glass. 'I'll let him know it's from you.'",
          setsFlag: "trick_passed",
          scoreEvent: "trick_passed"
        }
      },
      interactions: {
        "ask about trick": {
          message: "'Trick? Good man. He's at the Hole tonight, probably. Want to buy him a drink? I can send it over — five dollars.'"
        },
        "ask about marcus": {
          message: "'Marcus Cahill. Used to come in here. Quiet. Working on something — papers spread out on the table. Haven't seen him in a while.' He pauses. 'You're the second person to ask about him this week.'"
        }
      }
    },

    clerk: {
      id: "clerk",
      name: "clerk",
      aliases: ["clerk", "staff", "salesclerk", "woman", "employee"],
      description: "Mid-fifties. Professional, knowledgeable. She's worked here long enough to have known Alan Selby.",
      dialogue: {
        default: "'Welcome to Mr. S. Looking for anything specific?'"
      },
      shop: {
        "flashlight":    { price: 15, grantsItem: "uv_flashlight", message: "'Fifteen dollars.' She sets it on the counter. 'Good choice. Batteries are included.'", scoreEvent: "uv_flashlight_bought" },
        "uv flashlight": { price: 15, grantsItem: "uv_flashlight", message: "'Fifteen dollars.' She sets it on the counter.", scoreEvent: "uv_flashlight_bought" },
        "light":         { price: 15, grantsItem: "uv_flashlight", message: "'The UV flashlight? Fifteen dollars.' She sets it on the counter.", scoreEvent: "uv_flashlight_bought" }
      },
      interactions: {
        "ask about marcus": {
          message: "'Marcus Cahill. He had workshop access — Alan gave it to him years ago, before Alan passed. He was doing historical research. Haven't seen him in a while.' She pauses. 'He left something in the workshop. I kept meaning to call him about it.'"
        },
        "ask about workshop": {
          message: "'Workshop access is for employees and authorized artisans. We do have a key somewhere — Marcus may have left his copy inside. Check the old stock on the bottom shelf if you're curious.' She says it carefully, like she's deciding as she speaks."
        },
        "ask about alan": {
          message: "'Alan Selby built this place into what it is. Passed a few years ago.' Her voice is matter-of-fact but her eyes aren't. 'He's on the wall in Ringold. You should go look.'"
        }
      }
    },

    marcus: {
      id: "marcus",
      name: "Marcus",
      aliases: ["marcus", "marcus cahill", "cahill"],
      description: "Sixty years old. Lean. Gray-bearded. Still handsome. He's been living down here for weeks and it shows — but his eyes are sharp.",
      dialogue: {
        default: "Marcus looks up when he hears you. A long pause. Then the most exhausted smile you've ever seen on a person. 'You got my note.' He stands up from the overturned bucket. 'I didn't know if you would.'\n\nHe tells you everything. The vault — a prohibition-era storage space that the leather community repurposed starting in the 1960s, an informal archive and meeting place passed down quietly for sixty years. What he found: original documents, photographs, personal effects. Irreplaceable records of the men on the bootprints in Ringold Alley.\n\nWhy he disappeared: the developer's timeline accelerated. He went underground to finish the cataloguing before it was too late.\n\n'I sent you the key because I couldn't carry all of this out alone. And because you're the only person I trust to understand why it matters.' He lifts the satchel from the table and holds it out. 'Get it to the Cultural District office. Tell them what you found. Make them care.'"
      },
      onDialogue: {
        default: {
          grantsItem: "satchel",
          setFlag: "marcus_talked",
          scoreEvent: "marcus_reached"
        }
      }
    },

    rubin: {
      id: "rubin",
      name: "Rubin",
      aliases: ["rubin", "woman", "scholar"],
      description: "A woman in her forties with the focused look of someone who's spent years in archives. Small notebook in her hand.",
      dialogue: {
        default: "'The vault.' She says it like a word she's been waiting to say out loud. 'I've been trying to document its existence for three years. The community has known it was there for decades. But nobody would talk to me on the record.' She looks at you carefully. 'You've been down there.'",
        talked:  "'What you found is real. The vault predates SOMA as we know it. And it will survive — in the archive, if not in the ground.'"
      },
      dialogueFlagKey: "marcus_talked",
      dialogueFlagMap: { "true": "talked", "false": "default" }
    }

  },

  /* ------------------------------------------------------------------ */
  /*  Spawns (flag → add NPC or item to room)                           */
  /* ------------------------------------------------------------------ */
  spawns: {
    leo_trust_full: [
      { room: "powerhouse_basement", npc: "leo", announce: "Leo is in the basement, near the metal door, waiting. He nods when he sees you." }
    ],
    marcus_talked: [
      { room: "ringold_alley", npc: "rubin", announce: "A woman emerges from the shadows of the alley — she's been waiting." }
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  Endings                                                            */
  /* ------------------------------------------------------------------ */
  endings: {
    win: {
      flag: "game_won",
      win: true
    }
  },

  /* ------------------------------------------------------------------ */
  /*  Hints                                                              */
  /* ------------------------------------------------------------------ */
  hints: {
    chain: [
      {
        id: "start",
        when: function(s) { return !s.flags.marcus_name_learned; },
        nudge: "The SF Eagle's interior bar has a bartender named Jude who knows most of the regulars.",
        push: "Ask Jude about Marcus: ASK JUDE ABOUT MARCUS",
        shove: "Go east from Eagle Plaza to the Patio, then south into the Eagle Interior. Talk to the bartender."
      },
      {
        id: "trick",
        when: function(s) { return s.flags.marcus_name_learned && !s.flags.trick_passed; },
        nudge: "The back door to Ringold Alley is through the Hole in the Wall, and a man named Trick is blocking it.",
        push: "Three ways past Trick: show him the brass key (GIVE KEY TO TRICK), mention Marcus by name (ASK TRICK ABOUT MARCUS), or buy him a drink at Lone Star.",
        shove: "Lone Star is west of Powerhouse. The bartender there can send a drink to Trick for $5."
      },
      {
        id: "underground",
        when: function(s) { return s.flags.trick_passed && !s.flags.stone_moved; },
        nudge: "Ringold Alley leads east to the Memorial Stones. Something there is the key to going underground.",
        push: "In the Memorial Stones, examine the Catacombs stone. It feels different from the others. Try pushing it.",
        shove: "Type: PUSH STONE or EXAMINE CATACOMBS STONE"
      },
      {
        id: "pattern",
        when: function(s) { return s.flags.stone_moved && !s.inventory.includes("pattern"); },
        nudge: "The underground tunnel has an unmarked south wall. You'll need something to show you where the door is.",
        push: "The Mr. S Leather workshop has a pattern rubbing that maps the tunnel. Get there via the west gate in Ringold Alley (requires the brass key).",
        shove: "At Mr. S: read the catalog, examine the dye shelf for the workshop key, then go south into the workshop."
      },
      {
        id: "combination",
        when: function(s) { return s.inventory.includes("pattern") && !s.flags.knows_combination; },
        nudge: "The Vault has a combination lock on the north exit. You need three numbers.",
        push: "The combination is on the Leather Pride flagpole at Eagle Plaza — use the UV flashlight on the base. Or earn Leo's full trust by giving him the red carnation from Memorial Stones.",
        shove: "The UV flashlight is $15 at Mr. S Leather (BUY FLASHLIGHT). The carnation is in Memorial Stones."
      },
      {
        id: "endgame",
        when: function(s) { return s.flags.vault_found && !s.flags.marcus_talked; },
        nudge: "The south passage from the Vault leads to the Foundation Site. Marcus is there.",
        push: "Go south from the Vault. Talk to Marcus — he'll give you the archive.",
        shove: "Type SOUTH then TALK TO MARCUS. He'll give you the satchel. Then go UP."
      }
    ],
    fallback: [
      "Try examining things more carefully — many objects have hidden details.",
      "Talking to NPCs about specific topics opens new paths: ASK [NPC] ABOUT [TOPIC].",
      "The UV flashlight reveals things invisible to the naked eye. Use it on anything you're unsure about.",
      "Type I to see your inventory. Type SCORE to check your progress."
    ]
  }

};
