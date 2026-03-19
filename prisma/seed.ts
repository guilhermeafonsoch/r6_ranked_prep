import {
  Difficulty,
  Phase,
  PlanType,
  PrismaClient,
  RankBand,
  Side,
  SideType,
} from "@prisma/client";

type AttackBlueprint = {
  primaryLane: string;
  splitLane: string;
  utilityTarget: string;
  flankRisk: string;
  plantSpot: string;
  fallback: string;
  operators: Record<PlanType, string[]>;
  watchouts: string[];
};

type DefenseBlueprint = {
  primaryHold: string;
  extension: string;
  denialPoint: string;
  roamRoute: string;
  retakePlan: string;
  operators: Record<PlanType, string[]>;
  watchouts: string[];
};

type SiteBlueprint = {
  slug: string;
  name: string;
  difficulty: Difficulty;
  attack: AttackBlueprint;
  defense: DefenseBlueprint;
};

type BanBlueprint = {
  attackBan: string;
  defenseBan: string;
  rationale: string;
  fallbackAttack: string[];
  fallbackDefense: string[];
  weight: number;
};

type MapBlueprint = {
  slug: string;
  name: string;
  seasonTag: string;
  sites: SiteBlueprint[];
  bans: Record<RankBand, BanBlueprint>;
};

const prisma = new PrismaClient();
const latestSeasonTag = "Y11S1 Demo";

const operators = [
  ["ace", "Ace", Side.ATTACK, ["hard-breach", "execute", "plant"], Difficulty.MEDIUM],
  ["thatcher", "Thatcher", Side.ATTACK, ["breach-support", "anti-gadget", "execute"], Difficulty.LOW],
  ["thermite", "Thermite", Side.ATTACK, ["hard-breach", "execute", "support"], Difficulty.MEDIUM],
  ["buck", "Buck", Side.ATTACK, ["vertical", "soft-breach", "entry-support"], Difficulty.MEDIUM],
  ["jackal", "Jackal", Side.ATTACK, ["roam-clear", "intel", "entry"], Difficulty.MEDIUM],
  ["nomad", "Nomad", Side.ATTACK, ["flank-watch", "post-plant", "support"], Difficulty.MEDIUM],
  ["dokkaebi", "Dokkaebi", Side.ATTACK, ["intel", "execute", "roam-clear"], Difficulty.HIGH],
  ["ying", "Ying", Side.ATTACK, ["entry", "execute", "crowd-control"], Difficulty.HIGH],
  ["azami", "Azami", Side.DEFENSE, ["site-rework", "stall", "anchor"], Difficulty.HIGH],
  ["mira", "Mira", Side.DEFENSE, ["anchor", "site-control", "crossfire"], Difficulty.MEDIUM],
  ["kaid", "Kaid", Side.DEFENSE, ["breach-denial", "anchor", "utility"], Difficulty.MEDIUM],
  ["mute", "Mute", Side.DEFENSE, ["breach-denial", "anti-intel", "anchor"], Difficulty.LOW],
  ["fenrir", "Fenrir", Side.DEFENSE, ["trap", "area-control", "stall"], Difficulty.MEDIUM],
  ["valkyrie", "Valkyrie", Side.DEFENSE, ["intel", "roam-support", "flex"], Difficulty.MEDIUM],
  ["smoke", "Smoke", Side.DEFENSE, ["anchor", "execute-denial", "stall"], Difficulty.MEDIUM],
  ["lesion", "Lesion", Side.DEFENSE, ["trap", "flank-info", "anchor"], Difficulty.LOW],
] as const;

const attackSafeA = ["ace", "thatcher", "buck", "nomad", "dokkaebi"];
const attackSafeB = ["thermite", "thatcher", "buck", "nomad", "dokkaebi"];
const attackAggressiveA = ["thermite", "ying", "buck", "jackal", "nomad"];
const attackAggressiveB = ["ace", "ying", "jackal", "buck", "nomad"];
const attackFallbackA = ["ace", "buck", "dokkaebi", "nomad", "ying"];
const attackFallbackB = ["thermite", "buck", "dokkaebi", "ying", "nomad"];

const defenseSafeA = ["mira", "kaid", "mute", "smoke", "lesion"];
const defenseSafeB = ["mira", "smoke", "mute", "lesion", "kaid"];
const defenseSafeC = ["azami", "kaid", "smoke", "mute", "valkyrie"];
const defenseSafeD = ["mira", "kaid", "mute", "smoke", "valkyrie"];
const defenseSafeE = ["mira", "smoke", "mute", "valkyrie", "lesion"];
const defenseSafeF = ["azami", "smoke", "mute", "valkyrie", "fenrir"];
const defenseAggressive = ["azami", "fenrir", "valkyrie", "smoke", "lesion"];
const defenseAggressiveB = ["azami", "kaid", "valkyrie", "fenrir", "smoke"];
const defenseFallbackA = ["mute", "smoke", "lesion", "valkyrie", "azami"];
const defenseFallbackB = ["mute", "smoke", "lesion", "valkyrie", "kaid"];
const defenseFallbackC = ["smoke", "mute", "lesion", "valkyrie", "mira"];

function attack(
  primaryLane: string,
  splitLane: string,
  utilityTarget: string,
  flankRisk: string,
  plantSpot: string,
  fallback: string,
  safeOps: string[],
  aggressiveOps: string[],
  fallbackOps: string[],
  watchouts: string[],
): AttackBlueprint {
  return {
    primaryLane,
    splitLane,
    utilityTarget,
    flankRisk,
    plantSpot,
    fallback,
    operators: {
      SAFE: safeOps,
      AGGRESSIVE: aggressiveOps,
      FALLBACK: fallbackOps,
    },
    watchouts,
  };
}

function defense(
  primaryHold: string,
  extension: string,
  denialPoint: string,
  roamRoute: string,
  retakePlan: string,
  safeOps: string[],
  aggressiveOps: string[],
  fallbackOps: string[],
  watchouts: string[],
): DefenseBlueprint {
  return {
    primaryHold,
    extension,
    denialPoint,
    roamRoute,
    retakePlan,
    operators: {
      SAFE: safeOps,
      AGGRESSIVE: aggressiveOps,
      FALLBACK: fallbackOps,
    },
    watchouts,
  };
}

function site(
  slug: string,
  name: string,
  difficulty: Difficulty,
  attackBlueprint: AttackBlueprint,
  defenseBlueprint: DefenseBlueprint,
): SiteBlueprint {
  return {
    slug,
    name,
    difficulty,
    attack: attackBlueprint,
    defense: defenseBlueprint,
  };
}

function ban(
  attackBan: string,
  defenseBan: string,
  rationale: string,
  fallbackAttack: string[],
  fallbackDefense: string[],
  weight: number,
): BanBlueprint {
  return {
    attackBan,
    defenseBan,
    rationale,
    fallbackAttack,
    fallbackDefense,
    weight,
  };
}

const clubhouseBlueprint: MapBlueprint = {
  slug: "clubhouse",
  name: "Clubhouse",
  seasonTag: latestSeasonTag,
  sites: [
    site(
      "cctv-cash",
      "CCTV / Cash",
      Difficulty.MEDIUM,
      attack(
        "CCTV wall and rafters",
        "Construction pinch with a garage catwalk cut",
        "Kaid denial buried on the CCTV wall",
        "garage catwalk and red stairs",
        "default behind the server rack",
        "garage balcony pinch into late Cash control",
        attackSafeA,
        attackAggressiveA,
        attackFallbackA,
        [
          "Cash rotate swings can punish the first breach if rafters is not isolated.",
          "Garage catwalk becomes lethal when flank watch leaves too early.",
          "Do not commit the plant until both rafters and Cash have callout-level control.",
        ],
      ),
      defense(
        "CCTV with a Cash crossfire into breach",
        "Construction control backed by rafters delay",
        "CCTV wall and Jacuzzi pressure",
        "garage catwalk into red stairs",
        "fall back to Cash and deny the plant through the rotate",
        defenseSafeA,
        defenseAggressiveB,
        defenseFallbackA,
        [
          "Aggressive rafters fights collapse if Construction utility is spent too early.",
          "Do not let the breach pair hold the same angle uncontested for free.",
          "If garage catwalk falls, update the rotate plan immediately instead of chasing it back.",
        ],
      ),
    ),
    site(
      "church-arsenal",
      "Church / Arsenal",
      Difficulty.HIGH,
      attack(
        "Dirt tunnel and blue pressure",
        "Kitchen hatch timing into moto pressure",
        "Arsenal wall denial and blue bunker utility",
        "main stairs and oil pit swings",
        "default at church shelf",
        "blue split with a late kitchen hatch collapse",
        attackSafeB,
        attackAggressiveB,
        attackFallbackB,
        [
          "Blue clears stall when the top side does not trade into moto on time.",
          "Dirt pushes fail fast if the hard breach opens before bunker utility is thinned.",
          "Avoid a church plant when moto and blue are not talking to each other.",
        ],
      ),
      defense(
        "Church crossfire with Arsenal utility support",
        "blue bunker and dirt pressure",
        "dirt, blue and the church wall",
        "blue bunker into a kitchen re-drop",
        "fall to church and deny default from behind the bomb",
        defenseSafeA,
        defenseAggressiveB,
        defenseFallbackC,
        [
          "Blue utility evaporates if one defender tries to solo every choke.",
          "Late dirt calls matter more than early bunker damage.",
          "Keep at least one denial piece for the final church shelf plant.",
        ],
      ),
    ),
  ],
  bans: {
    ALL: ban(
      "jackal",
      "mira",
      "Clubhouse punishes loose flank timing, so the baseline removes relentless roam clear and the most oppressive crossfire anchor.",
      ["thatcher", "nomad", "dokkaebi"],
      ["kaid", "azami", "fenrir"],
      88,
    ),
    COPPER_BRONZE: ban(
      "jackal",
      "mira",
      "In lower-coordination lobbies, direct information denial and easy gunfight multipliers create the biggest headaches on Clubhouse.",
      ["dokkaebi", "thatcher", "nomad"],
      ["kaid", "azami", "valkyrie"],
      92,
    ),
    SILVER_GOLD: ban(
      "thatcher",
      "mira",
      "Mid-rank Clubhouse rounds still lean heavily on hard breach support, so removing Thatcher makes wall work less automatic.",
      ["jackal", "nomad", "dokkaebi"],
      ["kaid", "azami", "fenrir"],
      96,
    ),
    PLATINUM_EMERALD: ban(
      "thatcher",
      "kaid",
      "Platinum and Emerald teams usually convert breach utility well, so the highest value is often denying the denial layer itself.",
      ["jackal", "nomad", "ying"],
      ["mira", "azami", "fenrir"],
      100,
    ),
    DIAMOND_CHAMPION: ban(
      "nomad",
      "azami",
      "High-rank Clubhouse teams punish every unchecked flank and every improvised defensive reshape, so Nomad and Azami rise sharply.",
      ["thatcher", "jackal", "dokkaebi"],
      ["kaid", "mira", "fenrir"],
      106,
    ),
  },
};

const oregonBlueprint: MapBlueprint = {
  slug: "oregon",
  name: "Oregon",
  seasonTag: latestSeasonTag,
  sites: [
    site(
      "laundry-supply",
      "Laundry / Supply",
      Difficulty.MEDIUM,
      attack(
        "freezer and laundry stairs pressure",
        "pillar control with a meeting hatch threat",
        "elbow denial and supply closet utility",
        "back tower and freezer rotates",
        "default by the laundry bins",
        "pillar split into a supply-side plant",
        attackSafeA,
        attackAggressiveA,
        attackFallbackA,
        [
          "Freezer pressure means little if elbow is never isolated.",
          "Do not let the meeting hatch become an afterthought once pillar opens.",
          "Laundry default is only safe when both supply and elbow are cut at the same time.",
        ],
      ),
      defense(
        "Laundry elbow with Supply crossfire support",
        "pillar and freezer delay",
        "freezer breach and elbow line",
        "back tower into a meeting rotate",
        "collapse toward Supply and deny the default bins plant",
        defenseSafeB,
        defenseAggressive,
        defenseFallbackB,
        [
          "Pillar contests need a clean exit path or they disappear for nothing.",
          "Save at least one denial layer for the bins plant, even in winning rounds.",
          "If freezer control breaks early, call the compact hold immediately.",
        ],
      ),
    ),
    site(
      "kids-dorms",
      "Kids / Dorms",
      Difficulty.MEDIUM,
      attack(
        "master balcony and attic breach",
        "trophy pressure through dorms timing",
        "attic denial and kids shield utility",
        "white stairs and big tower late flanks",
        "default by the kids window side",
        "trophy plant off a dorms split",
        attackSafeB,
        attackAggressiveB,
        attackFallbackB,
        [
          "Attic swings punish any execute that forgets the trophy half of the map.",
          "Master balcony pressure stalls if white is unchecked too long.",
          "Do not plant kids default while the attic rotate is still live.",
        ],
      ),
      defense(
        "Kids bunks with a Dorms crossfire",
        "attic and trophy contest",
        "attic breach and the master wall",
        "big tower through white stairs",
        "fall into Dorms and deny the window-side plant",
        defenseSafeB,
        defenseAggressive,
        defenseFallbackA,
        [
          "Attic extensions need a real retreat route, not just confidence.",
          "Pixel-like anchor spots invite too much nade value if not traded.",
          "If trophy falls first, shrink the site and play for the final swing.",
        ],
      ),
    ),
  ],
  bans: {
    ALL: ban(
      "dokkaebi",
      "mira",
      "Oregon rewards audio discipline and layered site denial, so baseline bans trim noisy executes and the strongest bunker windows.",
      ["jackal", "ying", "nomad"],
      ["fenrir", "azami", "kaid"],
      86,
    ),
    COPPER_BRONZE: ban(
      "jackal",
      "mira",
      "Lower-rank Oregon rounds get snowballed by simple roam-clear and static power positions more than by micro-utility.",
      ["dokkaebi", "ying", "nomad"],
      ["fenrir", "kaid", "azami"],
      90,
    ),
    SILVER_GOLD: ban(
      "dokkaebi",
      "fenrir",
      "Mid-rank teams still overreact to call pressure and fear vision traps more than niche extension setups.",
      ["jackal", "ying", "nomad"],
      ["mira", "azami", "kaid"],
      94,
    ),
    PLATINUM_EMERALD: ban(
      "ying",
      "azami",
      "Stronger execute timing on Oregon raises the value of deleting oppressive entry tools and flexible site reshaping.",
      ["dokkaebi", "jackal", "nomad"],
      ["fenrir", "mira", "kaid"],
      99,
    ),
    DIAMOND_CHAMPION: ban(
      "nomad",
      "azami",
      "At the top end, Oregon rounds hinge on airtight flank protection and punishing reshaped cover, so Nomad and Azami spike.",
      ["ying", "dokkaebi", "jackal"],
      ["fenrir", "mira", "kaid"],
      104,
    ),
  },
};

const chaletBlueprint: MapBlueprint = {
  slug: "chalet",
  name: "Chalet",
  seasonTag: latestSeasonTag,
  sites: [
    site(
      "master-nexus",
      "Master / Nexus",
      Difficulty.MEDIUM,
      attack(
        "Jacuzzi wall and master breach",
        "office pressure into west main timing",
        "bathroom denial and the trophy rotate",
        "library stairs and solarium runouts",
        "default behind half wall",
        "office pinch into a Nexus-side plant",
        attackSafeA,
        attackAggressiveA,
        attackFallbackA,
        [
          "Jacuzzi breaches still fail if office pressure never forces the rotate.",
          "Solarium greed turns a clean setup into a tradeable mess.",
          "Half-wall plants need bathroom and connector called dead, not just softened.",
        ],
      ),
      defense(
        "Master crossfire into bathroom and connector",
        "office and west main delay",
        "Jacuzzi wall and the master breach",
        "library stairs through fireplace",
        "retreat into bathroom and deny the half-wall plant",
        defenseSafeC,
        defenseAggressive,
        defenseFallbackB,
        [
          "West main fights should cost time, not full bodies.",
          "Bathroom denial is the round insurance. Do not burn it on the first sound cue.",
          "If office collapses, stop peeking and play the plant lane instead.",
        ],
      ),
    ),
    site(
      "wine-snowmobile",
      "Wine / Snowmobile",
      Difficulty.HIGH,
      attack(
        "Snowmobile wall and blue pressure",
        "fireplace hatch timing into wine",
        "Snowmobile denial and wine shield utility",
        "blue rotates and main lobby stairs",
        "default behind the wine boxes",
        "blue take with a late fireplace hatch plant",
        attackSafeB,
        attackAggressiveB,
        attackFallbackB,
        [
          "Snowmobile walls tempt early plants before blue is actually walled off.",
          "Fireplace hatch pressure only matters if it syncs with the wall timing.",
          "Do not ignore lobby when blue turns into a grind.",
        ],
      ),
      defense(
        "Wine anchor spots with Snowmobile denial",
        "blue and fireplace pressure",
        "Snowmobile wall and the blue entry",
        "blue into a main lobby loop",
        "give blue on your terms and deny the wine default late",
        defenseSafeB,
        defenseAggressive,
        defenseFallbackB,
        [
          "Blue contests need layered utility or they vanish the first time nades arrive.",
          "A quiet lobby flank often matters more than an extra hallway duel.",
          "Keep one denial tool alive specifically for the wine box plant.",
        ],
      ),
    ),
  ],
  bans: {
    ALL: ban(
      "nomad",
      "kaid",
      "Chalet site splits get harder once flank locks and breach denial are trimmed, so those are the default levers here.",
      ["ying", "jackal", "dokkaebi"],
      ["azami", "mira", "fenrir"],
      84,
    ),
    COPPER_BRONZE: ban(
      "jackal",
      "kaid",
      "Simpler roam punishment and wall denial still create the most friction on Chalet for less structured teams.",
      ["nomad", "dokkaebi", "ying"],
      ["mira", "azami", "fenrir"],
      88,
    ),
    SILVER_GOLD: ban(
      "nomad",
      "kaid",
      "Mid-rank Chalet teams usually have the mechanics for the map but not always the re-clear patience, making Nomad especially annoying.",
      ["jackal", "ying", "dokkaebi"],
      ["azami", "mira", "fenrir"],
      92,
    ),
    PLATINUM_EMERALD: ban(
      "ying",
      "azami",
      "At stronger levels, Chalet often turns on one explosive entry timing or one reshaped angle, so Ying and Azami gain value.",
      ["nomad", "jackal", "dokkaebi"],
      ["kaid", "mira", "fenrir"],
      97,
    ),
    DIAMOND_CHAMPION: ban(
      "nomad",
      "azami",
      "High-rank Chalet rounds punish every missed flank and every improvised defensive headshot angle, which is why Nomad and Azami stay hot.",
      ["ying", "jackal", "dokkaebi"],
      ["kaid", "mira", "fenrir"],
      103,
    ),
  },
};

const borderBlueprint: MapBlueprint = {
  slug: "border",
  name: "Border",
  seasonTag: latestSeasonTag,
  sites: [
    site(
      "armory-archives",
      "Armory / Archives",
      Difficulty.MEDIUM,
      attack(
        "Armory wall and Archives door pressure",
        "Fountain into office pinch",
        "Armory wall denial and half-wall utility",
        "metal stairs and east stairs",
        "default behind the half wall",
        "Archives take into an office-side plant",
        attackSafeA,
        attackAggressiveA,
        attackFallbackA,
        [
          "Fountain pressure must either cut Archives or stop pretending it exists.",
          "Half-wall plants die quickly when East still has a swing.",
          "Do not over-fixate on the breach if the office side is already free.",
        ],
      ),
      defense(
        "Armory with Archives support",
        "Fountain and office contest",
        "Armory wall and the Archives breach lane",
        "metal stairs into customs",
        "fall to Archives and retake through Fountain timing",
        defenseSafeD,
        defenseAggressive,
        defenseFallbackB,
        [
          "Fountain fights are only worth it if the office player can trade them.",
          "Keep the Archives defender alive long enough to matter in the plant phase.",
          "If Armory utility is gone, stop shouldering the breach and play crossfires.",
        ],
      ),
    ),
    site(
      "ventilation-workshop",
      "Ventilation / Workshop",
      Difficulty.HIGH,
      attack(
        "Vent door and Workshop swing pressure",
        "east stairs collapse into bathroom timing",
        "Workshop denial and server-side utility",
        "customs flanks and metal stairs",
        "default behind the Workshop bench",
        "Tellers control into a late Vent plant",
        attackSafeB,
        attackAggressiveB,
        attackFallbackB,
        [
          "Border first-floor rounds fall apart when east pressure never connects to site.",
          "Metal stairs is the default punish for a lazy execute setup.",
          "Vent plants only stick when Workshop and bathroom are talking to each other.",
        ],
      ),
      defense(
        "Workshop with Vent crossfire support",
        "bathroom and east stairs delay",
        "Workshop breach and the server angle",
        "customs through metal stairs",
        "play back into Workshop and deny the final Vent plant",
        defenseSafeB,
        defenseAggressive,
        defenseFallbackB,
        [
          "Bathroom contests need an escape path or they are wasted seconds.",
          "Do not leave the Workshop anchor isolated after the first Vent contact.",
          "If east stairs is lost, shrink the map and make the plant cross a trap line.",
        ],
      ),
    ),
  ],
  bans: {
    ALL: ban(
      "ying",
      "mira",
      "Border rewards sharp direct entries and brutal anchor angles, so the default cuts one explosive execute tool and one static power piece.",
      ["jackal", "nomad", "dokkaebi"],
      ["valkyrie", "azami", "fenrir"],
      85,
    ),
    COPPER_BRONZE: ban(
      "jackal",
      "mira",
      "At lower ranks, Border punishes defenders who cannot hide and attackers who cannot read power positions, making these the clean bans.",
      ["ying", "nomad", "dokkaebi"],
      ["valkyrie", "kaid", "azami"],
      89,
    ),
    SILVER_GOLD: ban(
      "ying",
      "valkyrie",
      "Silver and Gold teams often lose Border to one blinding hit or one off-site camera chain, so those are the priority trims.",
      ["jackal", "nomad", "dokkaebi"],
      ["mira", "azami", "fenrir"],
      93,
    ),
    PLATINUM_EMERALD: ban(
      "nomad",
      "azami",
      "Better Border teams clear methodically, so taking away flank insurance and flexible cover forces more honest mid-round decisions.",
      ["ying", "jackal", "dokkaebi"],
      ["mira", "valkyrie", "fenrir"],
      98,
    ),
    DIAMOND_CHAMPION: ban(
      "nomad",
      "azami",
      "At the top of the ladder, Border is all about cross-map timing and cutoffs, which is why Nomad and Azami remain premium.",
      ["ying", "jackal", "dokkaebi"],
      ["valkyrie", "mira", "fenrir"],
      104,
    ),
  },
};

const kafeBlueprint: MapBlueprint = {
  slug: "kafe-dostoyevsky",
  name: "Kafe Dostoyevsky",
  seasonTag: latestSeasonTag,
  sites: [
    site(
      "reading-dining",
      "Reading / Dining",
      Difficulty.MEDIUM,
      attack(
        "Reading door and white hall pressure",
        "piano vertical with a red hall pinch",
        "pillar denial and red hall utility",
        "white stairs and red stairs",
        "default by the Reading doorway",
        "vertical collapse from piano into Dining",
        attackSafeA,
        attackAggressiveA,
        attackFallbackA,
        [
          "Reading hits stall when top-floor vertical never forces Dining to move.",
          "Red stairs becomes the round leak if nobody tracks the late swing.",
          "Do not plant doorway default until both Dining and white are pinned.",
        ],
      ),
      defense(
        "Reading crossfire into Dining",
        "fireplace and white hall control",
        "red hall, Reading door and cocktail hatch pressure",
        "white stairs into a top-floor re-drop",
        "tuck into Dining and deny the doorway plant with crossfire",
        defenseSafeE,
        defenseAggressive,
        defenseFallbackB,
        [
          "Kafe extensions must feed calls. Silent aggression is just overextension.",
          "White hall control matters more than random dining peeks.",
          "If top floor caves, stop contesting late and play the plant line.",
        ],
      ),
    ),
    site(
      "bar-cocktail",
      "Bar / Cocktail",
      Difficulty.HIGH,
      attack(
        "Cigar wall and cocktail split",
        "freezer and skylight pressure",
        "pixel utility and cocktail shield utility",
        "red stairs and freezer swings",
        "default behind the cocktail bar",
        "freezer plant after pixel is forced off",
        attackSafeB,
        attackAggressiveB,
        attackFallbackB,
        [
          "Pixel control is the entire round until it is not. Treat it that way.",
          "Skylight lurks need timing, not heroics.",
          "Do not plant cocktail default before freezer and red both stop talking.",
        ],
      ),
      defense(
        "Cocktail with Cigar support",
        "piano space and pixel swings",
        "cigar breach and the cocktail default lane",
        "red stairs into a white hall flank",
        "sink into cocktail and burn the bar plant late",
        defenseSafeF,
        defenseAggressive,
        defenseFallbackB,
        [
          "Cigar control does not mean the round is won. Watch freezer every time.",
          "Aggressive pixel peeks are great until the execute utility shows up.",
          "Always keep one denial cycle for the cocktail plant lane.",
        ],
      ),
    ),
  ],
  bans: {
    ALL: ban(
      "dokkaebi",
      "azami",
      "Kafe punishes audio overload and reshaped headshot angles, so the baseline leans into trimming both.",
      ["ying", "nomad", "jackal"],
      ["mira", "valkyrie", "fenrir"],
      87,
    ),
    COPPER_BRONZE: ban(
      "ying",
      "mira",
      "Lower-rank Kafe rounds are often decided by one simple flood or one unchecked anchor window, making Ying and Mira safe trims.",
      ["dokkaebi", "jackal", "nomad"],
      ["azami", "valkyrie", "fenrir"],
      91,
    ),
    SILVER_GOLD: ban(
      "dokkaebi",
      "azami",
      "Mid-rank Kafe play still over-indexes on call pressure and improvised cover, so those bans stay very reliable.",
      ["ying", "nomad", "jackal"],
      ["mira", "valkyrie", "fenrir"],
      95,
    ),
    PLATINUM_EMERALD: ban(
      "nomad",
      "azami",
      "More coordinated Kafe teams protect flank routes extremely well, so removing Nomad often creates the most breathing room.",
      ["dokkaebi", "ying", "jackal"],
      ["mira", "valkyrie", "fenrir"],
      99,
    ),
    DIAMOND_CHAMPION: ban(
      "nomad",
      "valkyrie",
      "Top-ladder Kafe rounds are information races. Cutting flank insurance and hidden cameras changes the whole pace of the map.",
      ["dokkaebi", "ying", "jackal"],
      ["azami", "mira", "fenrir"],
      105,
    ),
  },
};

const mapBlueprints: MapBlueprint[] = [
  clubhouseBlueprint,
  oregonBlueprint,
  chaletBlueprint,
  borderBlueprint,
  kafeBlueprint,
];

const users = [
  { email: "captain@rankedprep.local", displayName: "Maya Vector", rankBand: RankBand.PLATINUM_EMERALD },
  { email: "analyst@rankedprep.local", displayName: "Noah Ledger", rankBand: RankBand.SILVER_GOLD },
  { email: "support@rankedprep.local", displayName: "Lena Echo", rankBand: RankBand.DIAMOND_CHAMPION },
  { email: "anchor@rankedprep.local", displayName: "Diego Clamp", rankBand: RankBand.SILVER_GOLD },
] as const;

const patchNotes = [
  {
    seasonTag: "Y11S1 Demo",
    title: "Curated digest: Azami cover timing matters more on top sites",
    summary: "This seeded prep note highlights how delayed defensive reshapes force cleaner entry utility on Chalet and Kafe.",
    tacticalImplication: "Ranked prep should call Azami utility earlier in the ban discussion and avoid dry-swinging newly rebuilt power angles.",
    publishedAt: new Date("2026-03-10T12:00:00.000Z"),
  },
  {
    seasonTag: "Y11S1 Demo",
    title: "Curated digest: Clubhouse punish window favors tighter breach timing",
    summary: "The demo feed models a meta where late breach support is slightly weaker, making Clubhouse wall timing less forgiving.",
    tacticalImplication: "Queueing ranked should prioritize a cleaner breach pair and a stronger fallback plan if the first wall attempt stalls.",
    publishedAt: new Date("2026-03-06T12:00:00.000Z"),
  },
  {
    seasonTag: "Y11S1 Demo",
    title: "Curated digest: Fenrir pressure softens, site anchoring shifts",
    summary: "This card represents a lighter fear factor from vision traps, especially on Oregon and Border anchor setups.",
    tacticalImplication: "Teams can lean a little more on Smoke and Lesion in default holds, but should still prep a backup stall layer.",
    publishedAt: new Date("2026-03-01T12:00:00.000Z"),
  },
  {
    seasonTag: "Y10S4 Demo",
    title: "Curated digest: Kafe top-floor retakes demand red-stair discipline",
    summary: "The demo patch feed keeps Kafe in focus by emphasizing how red-stair timing swings decide late cocktail retakes.",
    tacticalImplication: "Prep notes should name the final red-stair check explicitly instead of leaving it as implied coverage.",
    publishedAt: new Date("2026-02-18T12:00:00.000Z"),
  },
  {
    seasonTag: "Y10S4 Demo",
    title: "Curated digest: Oregon basement plants reward earlier freezer pressure",
    summary: "This seeded card models a ranked environment where freezer control has slightly more value than a slow elbow grind.",
    tacticalImplication: "Safe Oregon defaults should drone freezer first and avoid wasting too much utility on a static elbow gunfight.",
    publishedAt: new Date("2026-02-09T12:00:00.000Z"),
  },
  {
    seasonTag: "Y10S4 Demo",
    title: "Curated digest: Border first-floor rounds punish loose flank talk",
    summary: "Border remains swingy in the demo feed, especially when teams stop updating metal and customs pressure late.",
    tacticalImplication: "Playbooks should give one player explicit ownership of the last flank check during Ventilation executions.",
    publishedAt: new Date("2026-01-28T12:00:00.000Z"),
  },
] as const;

const rotationEvents = [
  {
    seasonTag: "Y11S1 Demo",
    effectiveDate: new Date("2026-03-01T12:00:00.000Z"),
    addedMaps: ["Chalet"],
    removedMaps: ["Skyscraper"],
    notes: "Demo rotation event for the MVP. Use it to test how the app surfaces seasonal pool changes without scraping external sources.",
  },
  {
    seasonTag: "Y10S4 Demo",
    effectiveDate: new Date("2026-01-12T12:00:00.000Z"),
    addedMaps: ["Border"],
    removedMaps: ["Consulate"],
    notes: "Older demo event preserved to show historical rotation context in the patch feed timeline.",
  },
] as const;

const attackRoleTemplates: Record<
  PlanType,
  {
    title: string;
    description: (blueprint: AttackBlueprint) => string;
    roles: string[];
    responsibilities: (blueprint: AttackBlueprint) => string[];
    steps: (blueprint: AttackBlueprint) => { phase: Phase; text: string }[];
    note: string;
  }
> = {
  SAFE: {
    title: "Safe Hit",
    description: (blueprint) =>
      `Structured execute that secures ${blueprint.primaryLane} before the plant ever starts.`,
    roles: ["Breach lead", "Utility support", "Vertical pressure", "Flank lock", "Tempo caller"],
    responsibilities: (blueprint) => [
      `Open ${blueprint.primaryLane} without rushing the commit.`,
      `Clear ${blueprint.utilityTarget} and save at least one piece for the execute.`,
      `Pressure ${blueprint.splitLane} so the anchor line cannot focus the breach only.`,
      `Own ${blueprint.flankRisk} before the plant attempt begins.`,
      `Call the final commit onto ${blueprint.plantSpot} or pivot into ${blueprint.fallback}.`,
    ],
    steps: (blueprint) => [
      { phase: Phase.SETUP, text: `Drone ${blueprint.splitLane} first and confirm where the denial is stacked on ${blueprint.utilityTarget}.` },
      { phase: Phase.SETUP, text: `Stage the breach pair toward ${blueprint.primaryLane} while flank watch claims ${blueprint.flankRisk}.` },
      { phase: Phase.SETUP, text: "Keep the final smoke or plant utility uncommitted until both lanes can trade for each other." },
      { phase: Phase.EXECUTION, text: `Open ${blueprint.primaryLane} and immediately force the first swing angle off the map.` },
      { phase: Phase.EXECUTION, text: `Sync pressure from ${blueprint.splitLane} before planting at ${blueprint.plantSpot}.` },
      { phase: Phase.EXECUTION, text: "Plant only when the breach lane and the split lane can both hold the same trade path." },
      { phase: Phase.CONTINGENCY, text: `If the main breach stalls, reset around ${blueprint.fallback} instead of forcing a low-info plant.` },
      { phase: Phase.CONTINGENCY, text: "If the first entry dies, slow the round and trade utility for space before you re-hit." },
    ],
    note: "Safe plan only works if the final plant lane is treated as a synced crossfire, not a solo entry.",
  },
  AGGRESSIVE: {
    title: "Aggressive Split",
    description: (blueprint) =>
      `High-tempo round built to win first contact around ${blueprint.splitLane} and snowball into ${blueprint.plantSpot}.`,
    roles: ["First contact", "Main breach", "Split pressure", "Roam clear", "Plant cover"],
    responsibilities: (blueprint) => [
      `Take the first gunfight around ${blueprint.splitLane} with a clean trade path.`,
      `Explode ${blueprint.primaryLane} once pressure is called live.`,
      `Keep defenders split between ${blueprint.primaryLane} and ${blueprint.splitLane}.`,
      `Flush late swings out of ${blueprint.flankRisk}.`,
      `Protect the plant lane at ${blueprint.plantSpot} the second the site breaks.`,
    ],
    steps: (blueprint) => [
      { phase: Phase.SETUP, text: `Prep a fast path into ${blueprint.splitLane} and force defenders to respect the split immediately.` },
      { phase: Phase.SETUP, text: `Leave one drone parked on ${blueprint.flankRisk} so you do not lose the pace to a late roam.` },
      { phase: Phase.SETUP, text: `Set the breach pair for a committed open on ${blueprint.primaryLane} once the first pick or utility break lands.` },
      { phase: Phase.EXECUTION, text: `Win the first contact, then break ${blueprint.primaryLane} before the site can reset.` },
      { phase: Phase.EXECUTION, text: `Force the anchors to split attention between ${blueprint.splitLane} and the main plant lane.` },
      { phase: Phase.EXECUTION, text: `Plant at ${blueprint.plantSpot} only after your cutoff player confirms ${blueprint.flankRisk} is still locked.` },
      { phase: Phase.CONTINGENCY, text: `If the fast split dies, convert instantly into ${blueprint.fallback} rather than replaying the same angle.` },
      { phase: Phase.CONTINGENCY, text: "If the entry gets isolated, rebuild around the remaining utility and avoid ego peeks." },
    ],
    note: "Aggressive plans earn their value from instant trade potential. If you cannot trade it, you should not take it.",
  },
  FALLBACK: {
    title: "Fallback Route",
    description: (blueprint) =>
      `Low-ego default that keeps utility in pocket until a late pivot into ${blueprint.fallback} is available.`,
    roles: ["Core breach", "Trade partner", "Late lurk", "Safety flank", "Execute flex"],
    responsibilities: (blueprint) => [
      `Threaten ${blueprint.primaryLane} until defenders show the real utility stack.`,
      `Stay close enough to trade the core breach immediately.`,
      `Probe ${blueprint.splitLane} late and call the softest pivot window.`,
      `Never surrender ${blueprint.flankRisk} while the round is still live.`,
      `Carry the final commit tools into ${blueprint.fallback} or ${blueprint.plantSpot}.`,
    ],
    steps: (blueprint) => [
      { phase: Phase.SETUP, text: `Set early pressure on ${blueprint.primaryLane} without committing all of the execute utility.` },
      { phase: Phase.SETUP, text: `Use the first minute to learn how much attention the defenders are placing on ${blueprint.splitLane}.` },
      { phase: Phase.SETUP, text: `Keep one player solely responsible for ${blueprint.flankRisk} the entire round.` },
      { phase: Phase.EXECUTION, text: `If the site overreacts to the breach threat, pivot through ${blueprint.fallback}.` },
      { phase: Phase.EXECUTION, text: `If the anchors never move, recommit through ${blueprint.primaryLane} with full utility still available.` },
      { phase: Phase.EXECUTION, text: "Plant only after the pivot lane can cover the same defenders as the main lane." },
      { phase: Phase.CONTINGENCY, text: "If time gets tight, stop chasing the perfect setup and convert the clearest 2-lane trade." },
      { phase: Phase.CONTINGENCY, text: "If you lose the hard breach, shift instantly into a trade-heavy contact plan instead of pretending the original execute still exists." },
    ],
    note: "Fallback plans win by preserving options. If you burn everything early, it stops being a fallback.",
  },
};

const defenseRoleTemplates: Record<
  PlanType,
  {
    title: string;
    description: (blueprint: DefenseBlueprint) => string;
    roles: string[];
    responsibilities: (blueprint: DefenseBlueprint) => string[];
    steps: (blueprint: DefenseBlueprint) => { phase: Phase; text: string }[];
    note: string;
  }
> = {
  SAFE: {
    title: "Safe Hold",
    description: (blueprint) =>
      `Layered hold built around ${blueprint.primaryHold} with denial saved for the final plant window.`,
    roles: ["Anchor lead", "Denial anchor", "Info flex", "Swing trap", "Late-round closer"],
    responsibilities: (blueprint) => [
      `Own ${blueprint.primaryHold} and refuse free isolate angles.`,
      `Keep denial alive on ${blueprint.denialPoint} until the execute actually forms.`,
      `Feed calls from ${blueprint.extension} and update collapse timing.`,
      `Punish re-clears through ${blueprint.roamRoute}.`,
      `Save the final denial cycle for ${blueprint.retakePlan}.`,
    ],
    steps: (blueprint) => [
      { phase: Phase.SETUP, text: `Build the hold around ${blueprint.primaryHold} and set the first utility layer on ${blueprint.denialPoint}.` },
      { phase: Phase.SETUP, text: `Give the flex player a clear path through ${blueprint.extension} and a known return route.` },
      { phase: Phase.SETUP, text: "Agree ahead of time on the exact call that triggers the compact site collapse." },
      { phase: Phase.EXECUTION, text: `Let the first contact happen outside the site while ${blueprint.denialPoint} stays intact.` },
      { phase: Phase.EXECUTION, text: `Collapse out of ${blueprint.extension} before the attackers isolate it for free.` },
      { phase: Phase.EXECUTION, text: `Play the last utility cycle around ${blueprint.retakePlan}, not around a random mid-round duel.` },
      { phase: Phase.CONTINGENCY, text: "If the extension falls too early, stop taking hero peeks and rebuild the plant denial crossfire." },
      { phase: Phase.CONTINGENCY, text: `If attackers fake the execute, keep enough denial alive to still defend ${blueprint.denialPoint} a second time.` },
    ],
    note: "Safe holds should feel boring until the final 20 seconds. If the round feels chaotic early, you are probably overswinging it.",
  },
  AGGRESSIVE: {
    title: "Aggressive Contest",
    description: (blueprint) =>
      `Forward contest through ${blueprint.extension} that aims to drain time before the execute even forms.`,
    roles: ["Extension lead", "Denial backstop", "Intel layer", "Roam skirmish", "Retake pocket"],
    responsibilities: (blueprint) => [
      `Fight early through ${blueprint.extension} with a real trade route.`,
      `Hold the site-side utility on ${blueprint.denialPoint} until the swing player returns.`,
      `Stack calls around ${blueprint.roamRoute} so the roamer never disappears silently.`,
      `Take one high-value skirmish and get out.`,
      `Be the late-round body that still has utility for ${blueprint.retakePlan}.`,
    ],
    steps: (blueprint) => [
      { phase: Phase.SETUP, text: `Place the first contest line in ${blueprint.extension} and give it a disciplined fallback route.` },
      { phase: Phase.SETUP, text: `Hide one info layer to watch ${blueprint.roamRoute} after the first collapse.` },
      { phase: Phase.SETUP, text: "Tell the team which duel is worth taking and which one should be ignored." },
      { phase: Phase.EXECUTION, text: `Contest ${blueprint.extension} long enough to burn time, then fold back before the attackers isolate you.` },
      { phase: Phase.EXECUTION, text: `Once site pressure appears, rebuild around ${blueprint.primaryHold} and keep ${blueprint.denialPoint} intact.` },
      { phase: Phase.EXECUTION, text: `Use the last flexible utility piece to protect ${blueprint.retakePlan}.` },
      { phase: Phase.CONTINGENCY, text: "If the forward player dies without a trade, stop trying to recreate the same fight." },
      { phase: Phase.CONTINGENCY, text: "If attackers slow the round, keep the off-site player active enough to threaten a late crossfire but not stranded." },
    ],
    note: "Aggressive defense is not constant aggression. It is one or two planned drains followed by a disciplined reset.",
  },
  FALLBACK: {
    title: "Fallback Hold",
    description: (blueprint) =>
      `Compact setup that can concede ground early and still close the round from ${blueprint.retakePlan}.`,
    roles: ["Plant denial", "Crossfire anchor", "Flex stall", "Info retake", "Time burn"],
    responsibilities: (blueprint) => [
      `Hold the key denial cycle on ${blueprint.denialPoint}.`,
      `Lock ${blueprint.primaryHold} with the most consistent crossfire.`,
      `Bleed time in ${blueprint.extension} only while a safe exit still exists.`,
      `Keep intel alive for the late swing out of ${blueprint.retakePlan}.`,
      `Protect the final 20 seconds with utility instead of ego.`,
    ],
    steps: (blueprint) => [
      { phase: Phase.SETUP, text: `Build the compact crossfire on ${blueprint.primaryHold} first, then add stall utility into ${blueprint.extension}.` },
      { phase: Phase.SETUP, text: `Give the off-site player one clear time-burn job and one clear exit path through ${blueprint.roamRoute}.` },
      { phase: Phase.SETUP, text: "Hold one information tool back for the final plant read instead of spending everything in prep." },
      { phase: Phase.EXECUTION, text: `Trade away early space if needed, but keep the denial tools for ${blueprint.denialPoint}.` },
      { phase: Phase.EXECUTION, text: `Force the plant to cross the strongest angle from ${blueprint.primaryHold}.` },
      { phase: Phase.EXECUTION, text: "Trigger the retake swing only after the plant sound confirms the attackers have committed." },
      { phase: Phase.CONTINGENCY, text: `If the site floods too fast, reset immediately around ${blueprint.retakePlan}.` },
      { phase: Phase.CONTINGENCY, text: "If the attackers fake and leave, keep the compact hold intact instead of chasing them into bad terrain." },
    ],
    note: "Fallback defense is about surviving the first story of the round so you can win the second one.",
  },
};

function createAssignments(
  operatorsForPlan: string[],
  roles: string[],
  responsibilities: string[],
) {
  return operatorsForPlan.map((operator, index) => ({
    slot: `Slot ${index + 1}`,
    role: roles[index],
    operator,
    responsibility: responsibilities[index],
    minStackSize: index + 1,
    tags: index < 2 ? ["core"] : index === 4 ? ["late-round"] : ["support"],
  }));
}

function createAttackStrategy(site: SiteBlueprint, planType: PlanType) {
  const template = attackRoleTemplates[planType];
  const operatorsForPlan = site.attack.operators[planType];

  return {
    title: `${template.title}: ${site.name}`,
    description: `${template.description(site.attack)} ${template.note}`,
    recommendedOperators: operatorsForPlan,
    roleAssignments: createAssignments(
      operatorsForPlan,
      template.roles,
      template.responsibilities(site.attack),
    ),
    watchouts: [...site.attack.watchouts, template.note],
    steps: template.steps(site.attack).map((step, index) => ({
      phase: step.phase,
      stepOrder: index + 1,
      text: step.text,
    })),
  };
}

function createDefenseStrategy(site: SiteBlueprint, planType: PlanType) {
  const template = defenseRoleTemplates[planType];
  const operatorsForPlan = site.defense.operators[planType];

  return {
    title: `${template.title}: ${site.name}`,
    description: `${template.description(site.defense)} ${template.note}`,
    recommendedOperators: operatorsForPlan,
    roleAssignments: createAssignments(
      operatorsForPlan,
      template.roles,
      template.responsibilities(site.defense),
    ),
    watchouts: [...site.defense.watchouts, template.note],
    steps: template.steps(site.defense).map((step, index) => ({
      phase: step.phase,
      stepOrder: index + 1,
      text: step.text,
    })),
  };
}

async function main() {
  await prisma.strategyStep.deleteMany();
  await prisma.strategyCard.deleteMany();
  await prisma.banRule.deleteMany();
  await prisma.playbookCard.deleteMany();
  await prisma.savedNote.deleteMany();
  await prisma.squadMember.deleteMany();
  await prisma.squad.deleteMany();
  await prisma.site.deleteMany();
  await prisma.map.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.patchNote.deleteMany();
  await prisma.mapRotationEvent.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers = new Map<string, { id: string; displayName: string }>();

  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    createdUsers.set(user.email, { id: created.id, displayName: created.displayName });
  }

  const captainId = createdUsers.get("captain@rankedprep.local")!.id;
  const analystId = createdUsers.get("analyst@rankedprep.local")!.id;
  const supportId = createdUsers.get("support@rankedprep.local")!.id;
  const anchorId = createdUsers.get("anchor@rankedprep.local")!.id;

  for (const [slug, name, side, roleTags, difficulty] of operators) {
    await prisma.operator.create({
      data: {
        slug,
        name,
        side,
        roleTags,
        difficulty,
      },
    });
  }

  const createdMaps = new Map<string, { id: string; name: string }>();
  const createdSites = new Map<string, { id: string; name: string }>();

  for (const map of mapBlueprints) {
    const createdMap = await prisma.map.create({
      data: {
        slug: map.slug,
        name: map.name,
        inRotation: true,
        seasonTag: map.seasonTag,
      },
    });

    createdMaps.set(map.slug, { id: createdMap.id, name: createdMap.name });

    for (const site of map.sites) {
      const createdSite = await prisma.site.create({
        data: {
          mapId: createdMap.id,
          slug: site.slug,
          name: site.name,
          sideType: SideType.DEFENSE,
          difficulty: site.difficulty,
        },
      });

      createdSites.set(`${map.slug}:${site.slug}`, {
        id: createdSite.id,
        name: createdSite.name,
      });
    }
  }

  for (const map of mapBlueprints) {
    const createdMap = createdMaps.get(map.slug)!;

    for (const [rankBand, banData] of Object.entries(map.bans) as [
      RankBand,
      BanBlueprint,
    ][]) {
      await prisma.banRule.create({
        data: {
          mapId: createdMap.id,
          rankBand,
          attackBan: banData.attackBan,
          defenseBan: banData.defenseBan,
          rationale: banData.rationale,
          fallbackBans: {
            attack: banData.fallbackAttack,
            defense: banData.fallbackDefense,
          },
          weight: banData.weight,
        },
      });
    }

    for (const site of map.sites) {
      const createdSite = createdSites.get(`${map.slug}:${site.slug}`)!;

      for (const planType of [PlanType.SAFE, PlanType.AGGRESSIVE, PlanType.FALLBACK]) {
        const attackStrategy = createAttackStrategy(site, planType);
        const defenseStrategy = createDefenseStrategy(site, planType);

        await prisma.strategyCard.create({
          data: {
            mapId: createdMap.id,
            siteId: createdSite.id,
            side: Side.ATTACK,
            title: attackStrategy.title,
            description: attackStrategy.description,
            planType,
            teamSize: 5,
            recommendedOperators: attackStrategy.recommendedOperators,
            roleAssignments: attackStrategy.roleAssignments,
            watchouts: attackStrategy.watchouts,
            createdBy: captainId,
            steps: {
              create: attackStrategy.steps,
            },
          },
        });

        await prisma.strategyCard.create({
          data: {
            mapId: createdMap.id,
            siteId: createdSite.id,
            side: Side.DEFENSE,
            title: defenseStrategy.title,
            description: defenseStrategy.description,
            planType,
            teamSize: 5,
            recommendedOperators: defenseStrategy.recommendedOperators,
            roleAssignments: defenseStrategy.roleAssignments,
            watchouts: defenseStrategy.watchouts,
            createdBy: captainId,
            steps: {
              create: defenseStrategy.steps,
            },
          },
        });
      }
    }
  }

  for (const note of patchNotes) {
    await prisma.patchNote.create({ data: note });
  }

  for (const event of rotationEvents) {
    await prisma.mapRotationEvent.create({ data: event });
  }

  const nightShift = await prisma.squad.create({
    data: {
      ownerId: captainId,
      name: "Night Shift",
    },
  });

  const sundayStack = await prisma.squad.create({
    data: {
      ownerId: analystId,
      name: "Sunday Stack",
    },
  });

  await prisma.squadMember.createMany({
    data: [
      {
        squadId: nightShift.id,
        userId: captainId,
        nickname: "Vector",
        preferredRoles: ["IGL", "Support"],
        comfortOperators: ["ace", "mute", "smoke"],
      },
      {
        squadId: nightShift.id,
        userId: supportId,
        nickname: "Echo",
        preferredRoles: ["Entry", "Breach"],
        comfortOperators: ["thermite", "buck", "ying"],
      },
      {
        squadId: nightShift.id,
        userId: anchorId,
        nickname: "Clamp",
        preferredRoles: ["Anchor", "Denial"],
        comfortOperators: ["kaid", "mira", "lesion"],
      },
      {
        squadId: sundayStack.id,
        userId: analystId,
        nickname: "Ledger",
        preferredRoles: ["Flex", "Info"],
        comfortOperators: ["dokkaebi", "valkyrie", "nomad"],
      },
      {
        squadId: sundayStack.id,
        nickname: "Moss",
        preferredRoles: ["Roam", "Trap"],
        comfortOperators: ["fenrir", "lesion", "jackal"],
      },
    ],
  });

  await prisma.playbookCard.createMany({
    data: [
      {
        squadId: nightShift.id,
        mapId: createdMaps.get("clubhouse")!.id,
        siteId: createdSites.get("clubhouse:cctv-cash")!.id,
        title: "Server Rack Lock",
        summary: "Default defensive card for CCTV that keeps the round stable until the final breach call.",
        preferredComp: ["azami", "kaid", "valkyrie", "smoke", "fenrir"],
        assignedRoles: [
          { player: "Vector", role: "Denial backstop", operator: "Kaid", note: "Never reveal the claw until the second breach cue." },
          { player: "Echo", role: "Extension lead", operator: "Azami", note: "Burn one Kiba to buy the rafters rotate." },
          { player: "Clamp", role: "Late-round closer", operator: "Smoke", note: "Keep both canisters for the final execute." },
        ],
        checklist: [
          "Reinforce CCTV and Cash first, then Construction setup.",
          "Hide one info camera for the late garage flank call.",
          "If rafters falls, collapse instead of retaking it alone.",
        ],
      },
      {
        squadId: nightShift.id,
        mapId: createdMaps.get("oregon")!.id,
        siteId: createdSites.get("oregon:laundry-supply")!.id,
        title: "Freezer First Basement",
        summary: "Safer Oregon basement hit that prioritizes freezer timing over an endless elbow grind.",
        preferredComp: ["ace", "thatcher", "buck", "nomad", "dokkaebi"],
        assignedRoles: [
          { player: "Vector", role: "Tempo caller", operator: "Dokkaebi", note: "Keep the first logic bomb for the freeze-to-plant swing." },
          { player: "Echo", role: "Vertical pressure", operator: "Buck", note: "Own pillar before elbow becomes the only focus." },
          { player: "Clamp", role: "Flank lock", operator: "Nomad", note: "Back tower is your entire round until plant." },
        ],
        checklist: [
          "Park one drone behind freezer shield before round start.",
          "Do not drop meeting hatch until pillar can trade it.",
          "Plant only after elbow is isolated by two angles.",
        ],
      },
      {
        squadId: sundayStack.id,
        mapId: createdMaps.get("kafe-dostoyevsky")!.id,
        siteId: createdSites.get("kafe-dostoyevsky:bar-cocktail")!.id,
        title: "Pixel Tax",
        summary: "Compact note card for forcing pixel utility before the real cocktail hit starts.",
        preferredComp: ["thermite", "thatcher", "buck", "nomad", "dokkaebi"],
        assignedRoles: [
          { player: "Ledger", role: "Breach lead", operator: "Thermite", note: "Only open cigar once pixel utility is spoken for." },
          { player: "Moss", role: "Flank lock", operator: "Nomad", note: "Own freezer and the red rotate after skylight pressure." },
        ],
        checklist: [
          "Drone pixel every round. Do not assume the setup repeats.",
          "Freezer pressure exists to split the anchor line, not to chase kills.",
          "If cigar is still stacked, pause and play the fallback freezer plant.",
        ],
      },
    ],
  });

  await prisma.savedNote.createMany({
    data: [
      {
        userId: captainId,
        squadId: nightShift.id,
        mapId: createdMaps.get("clubhouse")!.id,
        siteId: createdSites.get("clubhouse:cctv-cash")!.id,
        title: "Cash wall go/no-go",
        body: "If the first breach charge gets muted or clawed, slow down and call the garage pinch instead of forcing the wall.",
      },
      {
        userId: captainId,
        squadId: nightShift.id,
        mapId: createdMaps.get("oregon")!.id,
        siteId: createdSites.get("oregon:laundry-supply")!.id,
        title: "Freezer drone habit",
        body: "Keep the freezer drone parked until the execute. We lose too many rounds when that drone gets spent on an early face-check.",
      },
      {
        userId: analystId,
        squadId: sundayStack.id,
        mapId: createdMaps.get("kafe-dostoyevsky")!.id,
        siteId: createdSites.get("kafe-dostoyevsky:bar-cocktail")!.id,
        title: "Pixel timing reminder",
        body: "Call pixel utility explicitly before asking for the breach. The order matters more than the raw speed.",
      },
      {
        userId: supportId,
        mapId: createdMaps.get("border")!.id,
        siteId: createdSites.get("border:armory-archives")!.id,
        title: "East stairs late call",
        body: "When we hit Archives, someone must own the last east-stairs check. If nobody says it, nobody is doing it.",
      },
    ],
  });

  console.log(`Seeded ${mapBlueprints.length} maps, ${operators.length} operators, ${patchNotes.length} patch notes, and demo playbook content.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
