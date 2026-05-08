export const T = {
  bg: "#fdf8f9",
  card: "#ffffff",
  card2: "#faf5f6",
  input: "#f7f0f1",
  bdr: "#f0e4e6",
  bdr2: "#e5d8db",
  tx: "#2e1a1e",
  tx2: "#7a5c62",
  tx3: "#b09a9e",
  ac: "#d4677e",
  acG: "rgba(212,103,126,0.08)",
  acL: "#fdf0f3",
  gn: "#059669",
  gnB: "#ecfdf5",
  rd: "#e11d48",
  rdB: "#fff1f2",
  am: "#ca8a04",
  amB: "#fefce8",
  bl: "#2563eb",
  cy: "#0891b2",
  pk: "#db2777",
  gr: "linear-gradient(135deg,#d4677e,#e8a0b0)",
  grWarm: "linear-gradient(135deg, #fdf0f3 0%, #fdf8f9 100%)",
  shadow: "0 1px 3px rgba(46,26,30,0.04), 0 4px 12px rgba(46,26,30,0.03)",
  shadowHover: "0 2px 8px rgba(46,26,30,0.06), 0 8px 24px rgba(46,26,30,0.05)",
  shadowLg: "0 -4px 24px rgba(46,26,30,0.08)",
};

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;-webkit-tap-highlight-color:transparent}
::-webkit-scrollbar{display:none}
html{height:-webkit-fill-available}
body{min-height:100vh;min-height:-webkit-fill-available;font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif;-webkit-font-smoothing:antialiased;background:${T.bg};color:${T.tx};overscroll-behavior-y:none}
#root{min-height:100vh;min-height:-webkit-fill-available}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes pop{0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes toastIn{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}
.fade{animation:fadeIn .3s ease-out}
.pop{animation:pop .2s ease-out}
.slideUp{animation:slideUp .35s cubic-bezier(.16,1,.3,1)}
.toast{animation:toastIn .25s ease-out}
input,textarea,select,button{font-family:inherit}
input:focus,textarea:focus,select:focus{border-color:${T.ac}!important;outline:none;box-shadow:0 0 0 3px ${T.acG}}
details summary{list-style:none}details summary::-webkit-details-marker{display:none}
.cardHover:hover{transform:translateY(-1px);box-shadow:${T.shadowHover}}
.btnTap:active{transform:scale(.97)}
.tdone{text-decoration:line-through;opacity:.4;transition:all .25s}
`;

export const todayStr = () => new Date().toISOString().slice(0, 10);
export const timeStr = () => new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
export const calcAge = (b) => { const d = new Date(), bd = new Date(b); let y = d.getFullYear() - bd.getFullYear(); if (d.getMonth() < bd.getMonth() || (d.getMonth() === bd.getMonth() && d.getDate() < bd.getDate())) y--; return y; };
export const daysTo = (d) => Math.ceil((new Date(d) - new Date(todayStr())) / 86400000);

export const googleCalUrl = ({ title, date, description }) => {
  const d = date.replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${d}/${d}`,
    details: description || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const PET_COLORS = ["#d4677e", "#ca8a04", "#059669", "#b85c8a", "#2563eb", "#0891b2"];
export const petColor = (pets, petId) => {
  const i = pets.findIndex((p) => p.id === petId);
  return PET_COLORS[(i < 0 ? 0 : i) % PET_COLORS.length];
};

export const SPECIES = [
  { id: "dog", label: "犬", icon: "Dog", emoji: "🐕" },
  { id: "cat", label: "猫", icon: "Cat", emoji: "🐈" },
  { id: "rabbit", label: "うさぎ", icon: "Rabbit", emoji: "🐇" },
  { id: "hamster", label: "ハムスター", icon: "PawPrint", emoji: "🐹" },
  { id: "bird", label: "鳥", icon: "Bird", emoji: "🐦" },
  { id: "reptile", label: "爬虫類", icon: "PawPrint", emoji: "🦎" },
  { id: "other", label: "その他", icon: "PawPrint", emoji: "🐾" },
];

export const getSpecies = (id) => SPECIES.find((s) => s.id === id) || SPECIES[0];
export const speciesLabel = (id) => getSpecies(id).label;
export const speciesEmoji = (id) => getSpecies(id).emoji;
