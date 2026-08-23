const fs = require("fs");
const vm = require("vm");

const chunkPath = "_next/static/chunks/0enh8n3fh6ku6-20260821.js";
let source = fs.readFileSync(chunkPath, "utf8");

function findArray(sourceText, marker) {
  const markerIndex = sourceText.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Marker not found: ${marker}`);
  const start = markerIndex + marker.length - 1;
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = start; index < sourceText.length; index += 1) {
    const character = sourceText[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === "[") depth += 1;
    else if (character === "]") {
      depth -= 1;
      if (depth === 0) return { start, end: index + 1 };
    }
  }
  throw new Error(`Unclosed array after: ${marker}`);
}

function audience(value) {
  const match = String(value ?? "")
    .replaceAll(",", "")
    .replace(/\s/g, "")
    .match(/^(\d+(?:\.\d+)?)(만|천)?$/);
  if (!match) return 0;
  return Math.round(
    Number(match[1]) * (match[2] === "만" ? 10000 : match[2] === "천" ? 1000 : 1),
  );
}

function total(creator) {
  return audience(creator.instagram) + audience(creator.youtube);
}

function creator({
  id,
  name,
  handle,
  initials,
  tone,
  instagram,
  youtube = "—",
  categories,
  intro,
  youtubeUrl,
}) {
  return {
    id,
    name,
    handle: `@${handle}`,
    initials,
    tone,
    rank: 99,
    change: 0,
    score: 0,
    instagramScore: 0,
    youtubeScore: 0,
    instagram,
    youtube,
    growth: "—",
    engagement: "—",
    categories,
    verified: true,
    featured: false,
    intro,
    chart: [],
    photo: `/profiles/${handle}.jpg`,
    profileUrl: `https://www.instagram.com/${handle}/`,
    profilePlatform: "Instagram",
    ...(youtubeUrl ? { youtubeUrl } : {}),
    provisional: false,
    newEntry: true,
  };
}

const bounds = findArray(source, "P=[");
const current = vm.runInNewContext(`(${source.slice(bounds.start, bounds.end)})`);

const corrections = new Map([
  [
    "@chocohomee",
    {
      handle: "@_chocohomee_",
      instagram: "15.7만",
      photo: "/profiles/_chocohomee_.jpg",
      profileUrl: "https://www.instagram.com/_chocohomee_/",
    },
  ],
  ["@hejdoodoo", { instagram: "25.4만", photo: "/profiles/hejdoodoo.jpg" }],
  ["@haedal_home", { photo: "/profiles/haedal_home.jpg" }],
  ["@mm2_home", { photo: "/profiles/mm2_home.jpg" }],
  ["@meyer_home", { photo: "/profiles/meyer_home.jpg" }],
]);

const corrected = current.map((item) => ({
  ...item,
  ...(corrections.get(item.handle) ?? {}),
}));

const additions = [
  creator({
    id: 201,
    name: "구아카",
    handle: "cooaka__",
    initials: "구아",
    tone: "honey",
    instagram: "21.1만",
    youtube: "4.43만",
    categories: ["주방·요리", "식품", "살림템"],
    intro: "부부의 집밥과 실용적인 주방 살림을 함께 소개하는 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/channel/UC_KUcoS03mj2Y1fStCPZzgA",
  }),
  creator({
    id: 202,
    name: "연테이블 안도연",
    handle: "__y.e.o.n",
    initials: "연테",
    tone: "rose",
    instagram: "21.7만",
    categories: ["주방·요리", "식품", "살림템"],
    intro: "집밥과 주방용품을 중심으로 일상의 식탁을 소개하는 크리에이터입니다.",
  }),
  creator({
    id: 203,
    name: "길쭉이네",
    handle: "eunjin_1225",
    initials: "길쭉",
    tone: "sage",
    instagram: "19.5만",
    youtube: "7.9만",
    categories: ["집밥", "주방·요리", "살림템"],
    intro: "집밥과 실용적인 주방 살림템을 영상으로 소개하는 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/@eunjin_1225",
  }),
  creator({
    id: 204,
    name: "콩라이프",
    handle: "cong_lyfe",
    initials: "콩라",
    tone: "mint",
    instagram: "27.4만",
    youtube: "3.65만",
    categories: ["세탁·청소", "생활용품", "가전"],
    intro: "세탁과 청소, 생활용품과 가전을 실용적으로 소개하는 살림 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/@cong_lyfe",
  }),
  creator({
    id: 205,
    name: "백반집첫째딸",
    handle: "100ban_88",
    initials: "백반",
    tone: "peach",
    instagram: "18.4만",
    youtube: "11.7만",
    categories: ["집밥", "식품", "주방·요리"],
    intro: "집밥과 식품, 주방 살림을 친근하게 소개하는 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/@100Ban_88",
  }),
  creator({
    id: 206,
    name: "유부림",
    handle: "married_rim",
    initials: "유부",
    tone: "lilac",
    instagram: "28.1만",
    youtube: "1.6만",
    categories: ["가전", "주방·요리", "세탁·청소"],
    intro: "가전과 가구, 주방·청소용품을 폭넓게 소개하는 리빙 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/@married_rim",
  }),
  creator({
    id: 207,
    name: "모난살림",
    handle: "monan_sallim",
    initials: "모난",
    tone: "blue",
    instagram: "21만",
    youtube: "52",
    categories: ["생활용품", "주방·요리", "세탁·청소"],
    intro: "생활용품과 주방·청소·가전을 다루는 실용 살림 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/channel/UCeKUVpoScMeK5aUVpDtuNtg",
  }),
  creator({
    id: 208,
    name: "이유살림",
    handle: "2you_salim",
    initials: "이유",
    tone: "coral",
    instagram: "15.4만",
    youtube: "3.9만",
    categories: ["집밥", "식품", "생활용품"],
    intro: "건강한 집밥과 식품, 주방·생활용품을 소개하는 살림 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/@2you_salim",
  }),
  creator({
    id: 209,
    name: "마마홈",
    handle: "mama__home_",
    initials: "마마",
    tone: "honey",
    instagram: "60만",
    categories: ["주방·요리", "세탁·청소", "가전"],
    intro: "주방과 청소, 가전과 생활용품을 폭넓게 소개하는 살림 크리에이터입니다.",
  }),
  creator({
    id: 210,
    name: "지니하우스",
    handle: "genie__house__",
    initials: "지니",
    tone: "blue",
    instagram: "28.8만",
    categories: ["주방·요리", "정리·수납", "가전"],
    intro: "주방용품과 생활가전, 냉장고 정리 노하우를 소개하는 살림 크리에이터입니다.",
  }),
  creator({
    id: 211,
    name: "쑤기테이블",
    handle: "ssugi_table",
    initials: "쑤기",
    tone: "rose",
    instagram: "19.8만",
    categories: ["집밥", "주방·요리", "식품"],
    intro: "집밥과 요리, 주방용품과 생활가전을 소개하는 살림 크리에이터입니다.",
  }),
  creator({
    id: 212,
    name: "요오리",
    handle: "__cookduck",
    initials: "요오",
    tone: "peach",
    instagram: "36만",
    youtube: "42.9만",
    categories: ["집밥", "주방·요리", "식품"],
    intro: "시간과 에너지를 아끼는 집밥과 실용적인 주방 살림을 소개하는 크리에이터입니다.",
    youtubeUrl: "https://www.youtube.com/@cookduck",
  }),
  creator({
    id: 213,
    name: "퇴근후살림",
    handle: "sallim_after_work",
    initials: "퇴근",
    tone: "sage",
    instagram: "23.3만",
    categories: ["1인가구", "정리·수납", "생활용품"],
    intro: "작은 집과 1인 가구를 위한 실용적인 살림 레시피를 소개하는 크리에이터입니다.",
  }),
  creator({
    id: 214,
    name: "메종드율",
    handle: "maison_de_yul",
    initials: "메종",
    tone: "lilac",
    instagram: "20만",
    categories: ["집밥", "식품", "주방·요리"],
    intro: "집밥과 식품, 주방용품을 중심으로 맛있는 살림을 소개하는 크리에이터입니다.",
  }),
];

const byHandle = new Map();
for (const item of [...corrected, ...additions]) byHandle.set(item.handle, item);

const top50 = [...byHandle.values()]
  .sort(
    (left, right) =>
      total(right) - total(left) ||
      audience(right.instagram) - audience(left.instagram) ||
      left.name.localeCompare(right.name, "ko"),
  )
  .slice(0, 50)
  .map((item, index) => ({ ...item, rank: index + 1, change: 0 }));

source = `${source.slice(0, bounds.start)}${JSON.stringify(top50)}${source.slice(bounds.end)}`;
source = source.replaceAll("2026.08.18", "2026.08.21");
source = source.replaceAll("2026.08.12", "2026.08.21");
source = source.replaceAll("2026.08.21", "2026.08.23");
fs.writeFileSync(chunkPath, source);

console.log(`Updated ${chunkPath}`);
for (const item of top50) {
  console.log(
    `${String(item.rank).padStart(2, "0")} ${item.handle.padEnd(20)} ${String(total(item)).padStart(8)} ${item.photo ?? "(fallback)"}`,
  );
}
console.log(`Cutoff: ${top50.at(-1).handle} / ${total(top50.at(-1))}`);
