export type ThemeId = "classic-wood" | "dark-academia";

export interface Theme {
  id: ThemeId;
  name: string;
  bn: string;
  blurb: string;
  cardBg: string;
  texture?: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
  panelBg: string;
  caseFrame: string;
  plank: string;
  avatarBg: string;
  avatarInk: string;
  spines: string[];
  band: string;
}

export const themes: Theme[] = [
  {
    id: "classic-wood",
    name: "Classic Wood",
    bn: "ক্লাসিক কাঠ",
    blurb: "উষ্ণ আলো, পুরনো লাইব্রেরি",
    cardBg:
      "radial-gradient(120% 90% at 50% 0%, #5c3a21 0%, #3b2415 55%, #24150b 100%)",
    texture:
      "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 9px)",
    ink: "#f7ecd6",
    muted: "rgba(247,236,214,0.62)",
    accent: "#e0b062",
    line: "rgba(224,176,98,0.38)",
    panelBg: "linear-gradient(180deg, rgba(18,9,3,0.62), rgba(18,9,3,0.36))",
    caseFrame: "#7b4e2a",
    plank: "#8f5d32",
    avatarBg: "#2a190e",
    avatarInk: "#e0b062",
    spines: [
      "#7b2d26",
      "#2f4a3a",
      "#c58a3d",
      "#2c3e57",
      "#9a6a3a",
      "#5b2a4a",
      "#d8c39a",
      "#3d3a36",
    ],
    band: "rgba(247,236,214,0.55)",
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    bn: "ডার্ক অ্যাকাডেমিয়া",
    blurb: "কালো, গাঢ় বাদামি, ম্লান সোনালি",
    cardBg: "linear-gradient(165deg, #1d1713 0%, #110e0c 100%)",
    ink: "#ebe0c8",
    muted: "rgba(235,224,200,0.56)",
    accent: "#b9975b",
    line: "rgba(185,151,91,0.32)",
    panelBg: "rgba(255,255,255,0.035)",
    caseFrame: "#3b3027",
    plank: "#4d3d2f",
    avatarBg: "#17120f",
    avatarInk: "#b9975b",
    spines: [
      "#3e2a22",
      "#243b32",
      "#5a1f27",
      "#2b2f3a",
      "#6b5436",
      "#202020",
      "#4b3a2a",
      "#34402f",
    ],
    band: "rgba(185,151,91,0.75)",
  },
];

export const defaultThemeId: ThemeId = "classic-wood";

export function getTheme(id: ThemeId): Theme {
  return themes.find((t) => t.id === id) ?? themes[0];
}
