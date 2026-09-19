"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  Clipboard,
  FileText,
  ImageIcon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Mode = "copy" | "image" | "portrait";
type FormData = Record<string, string>;

const copyUses = [
  ["listing", "專業物件銷售文案"],
  ["591", "591物件文案"],
  ["honest", "誠實揭露型文案"],
  ["luxury-copy", "高總價住宅文案"],
  ["land-copy", "土地／農地文案"],
  ["facebook", "Facebook物件貼文"],
  ["line", "LINE群組分享"],
  ["calendar", "七天社群內容"],
  ["district", "在地商圈介紹"],
  ["video", "短影音腳本"],
] as const;

const imageUses = [
  ["standard", "專業標準物件海報"],
  ["fb-poster", "Facebook吸睛海報"],
  ["line-poster", "LINE快速分享海報"],
  ["591-cover", "591物件首圖"],
  ["luxury", "高總價豪宅海報"],
  ["first-home", "首購族住宅海報"],
  ["family", "換屋家庭海報"],
  ["transit", "捷運宅／交通型海報"],
  ["school", "學區宅海報"],
  ["apartment", "公寓／無電梯海報"],
  ["townhouse", "透天住宅海報"],
  ["shop-sale", "店面銷售海報"],
  ["shop-rent", "店面出租海報"],
  ["farm", "農地銷售海報"],
  ["building-land", "建地銷售海報"],
  ["factory", "工業廠房海報"],
  ["price-cut", "降價／價格調整海報"],
  ["exclusive", "專任委託海報"],
  ["open-house", "開放賞屋海報"],
  ["personal-brand", "個人品牌＋物件海報"],
] as const;

const portraitUses = [
  ["business-suit", "專業西裝形象照"],
  ["smart-casual", "商務休閒形象"],
  ["younger-pro", "專業自然年輕化"],
  ["natural-retouch", "自然美肌精神照"],
  ["resume-headshot", "履歷／證件形象照"],
  ["realtor-brand", "房仲個人品牌照"],
  ["executive", "高階主管形象照"],
  ["luxury-editorial", "精品雜誌人像"],
  ["cinematic", "電影質感人像"],
  ["korean-clean", "韓系清透形象"],
  ["japanese-natural", "日系自然人像"],
  ["outdoor-lifestyle", "戶外陽光生活照"],
  ["sporty", "運動活力形象照"],
  ["formal-event", "正式禮服／宴會造型"],
] as const;

const visualStyleOptions = [
  "專業",
  "溫馨",
  "現代",
  "清楚",
  "可信任",
  "科技",
] as const;

const colorOptions = [
  "紅",
  "綠＋黃",
  "深藍色＋金／古銅",
  "黑灰＋明亮霓虹",
  "自訂",
] as const;

const callToActionOptions = [
  "自動設計（依物件特色變化）",
  "喜歡就出價，成家的事交給我",
  "看中就出手，我陪你談成家",
  "心動別錯過，出價我來協助",
  "勇敢出價，理想家更近一步",
  "你的理想價，我來努力談",
  "喜歡這個家，我陪你爭取",
  "自訂",
] as const;

const copyDirections: Record<string, string> = {
  listing:
    "撰寫5個20字內標題、100字精簡版、300字完整版、6個條列特色，以及自然的預約賞屋結尾。",
  "591":
    "依手機閱讀習慣，先列三項核心優勢，再依物件特色、格局空間、生活機能、交通條件與適合對象分段，另產出5個標題。",
  honest:
    "客觀列出優點、應揭露事項、適合與不適合客群，再完成250字誠實但有吸引力的文案。不得淡化重大缺點。",
  "luxury-copy":
    "採沉穩、簡潔、精品雜誌式語氣，以空間、建築、隱私與生活方式呈現價值；避免堆砌奢華、帝王、稀有等俗套詞。",
  "land-copy":
    "分別產出專業完整版、LINE短版、5個廣告標題與購買前確認事項；不可自行宣稱可興建、變更、分割或申請農舍。",
  facebook:
    "產出能讓人停留的前兩行、生活情境、5項重點、基本資料、自然行動呼籲與5至8個相關標籤。",
  line: "控制在120至180字，使用少量Emoji，清楚排列地點、總價、坪數、格局、車位、主要特色與聯絡方式。",
  calendar:
    "把同一物件拆成連續7天內容：亮點、格局、生活機能、交通、生活情境、常見問題、預約賞屋；每天附貼文、素材與行動呼籲。",
  district:
    "依商圈特色、採買、交通、居住環境、適合生活型態與注意事項撰寫，另列出必須上網查證的項目。",
  video:
    "產出30秒9:16直式短影音表格，包含秒數、畫面、運鏡、口白、每句不超過15字的字幕與轉場。",
};

const imageDirections: Record<string, string> = {
  standard:
    "物件照片占60%，以主標題及使用者已提供的總價、坪數格局、特色與聯絡資訊建立清楚閱讀層級；未提供的項目直接省略。",
  "fb-poster":
    "前兩秒能看見物件名稱、總價及最大特色；畫面明亮、專業、有朝氣，適合手機社群瀏覽。",
  "line-poster":
    "版面極簡直接，僅呈現使用者已提供的總價、電話、地點、坪數、格局、車位和特色；未提供的項目直接省略。",
  "591-cover":
    "房屋照片為主，文字不超過畫面20%；只放短標題、總價、格局與一項核心賣點。",
  luxury:
    "使用深灰、象牙白與少量霧金，大面積主照片及大量留白，呈現低調精品雜誌質感。",
  "first-home":
    "採米白、淺木與柔和綠色，溫暖明亮、親切可信；避免暗示貸款一定核准。",
  family:
    "以生活空間升級為主題，突出房間數、收納、停車及便利性，風格成熟溫暖、不卡通化。",
  transit:
    "採簡潔都市感；只有使用者提供可核實的交通資料或圖像時，才可呈現交通資訊或圖示，並清楚區分已通車、施工中與規劃中建設。",
  school:
    "風格清新安心，以家庭客群為主；不得使用保證入學或永久學區等文字，加入學區查證提醒。",
  apartment:
    "突出室內實用空間與低公設優勢，不隱藏無電梯、樓層、屋齡或需整理等事實。",
  townhouse:
    "完整呈現建築立面，強調土地、空間與停車；不得拓寬道路、移除鄰房或增加庭院。",
  "shop-sale":
    "採紅黑白或深藍的商業視覺，突出面寬、臨路與使用空間；不得虛構人潮、錢潮或投報率。",
  "shop-rent":
    "以『出租』、月租與地點為最大資訊，入口和招牌位置不可被遮住，不保證生意或獲利。",
  farm: "使用綠色與大地色，清楚呈現分區、臨路、面寬與現況；不得增加道路、水電、建物或農舍。",
  "building-land":
    "採土地開發專業感，呈現基地資訊與分區；不得改變界址或把模擬興建視為確定結果。",
  factory:
    "使用深藍、灰與橘色的企業級視覺，突出坪數、樓高、電力、裝卸與使用分區。",
  "price-cut":
    "以醒目但不廉價的紅色標籤呈現價格調整，清楚列出原價、新價及調整日期。",
  exclusive:
    "突出專任委託、完整服務與專人負責，品牌標示醒目但不得遮住房屋主體。",
  "open-house":
    "僅將使用者已提供的日期、時間、地點與預約電話做醒目編排；未提供的資料或圖示不得補入，整體呈現明亮活動感。",
  "personal-brand":
    "物件仍是主角；只有使用者實際上傳人物照片時才可放入人物，人物占比不超過25%，並保持五官與年齡原貌。",
};

const portraitDirections: Record<string, string> = {
  "business-suit":
    "換成合身專業商務套裝。男性使用深藍或炭灰西裝、素色襯衫與低調領帶；女性使用俐落西裝外套搭配襯衫、長褲或及膝裙。西裝外套左胸別上小巧精緻的金色金屬『太平洋房屋』徽章，字樣使用正確繁體中文，不得變形或改字。採柔和影棚光與乾淨中性背景。",
  "smart-casual":
    "改為有親和力的商務休閒造型。男性使用襯衫或針織上衣搭配西裝外套；女性使用簡潔襯衫、針織上衣或柔和色西裝外套。保持自然、可靠、不過度正式。",
  "younger-pro":
    "製作精神、俐落的專業形象照，採合身商務服裝、柔和正面光與乾淨背景；穿著西裝外套時，在左胸別上小巧精緻的金色金屬『太平洋房屋』徽章，字樣使用正確繁體中文，不得變形或改字。年輕化程度只依本次選定的形象氣質處理。",
  "natural-retouch":
    "製作乾淨、自然、有精神的人像，保留原本服裝與場景；修飾強度只依本次選定的美肌效果處理。",
  "resume-headshot":
    "製作履歷與專業平台適用的大頭照，正面或微側角度、肩膀以上構圖、表情自然自信、服裝端正、背景乾淨，光線均勻且不產生過度戲劇化陰影。",
  "realtor-brand":
    "製作親切可信的房仲個人品牌照，穿著合身商務服裝，並在西裝外套左胸別上小巧精緻的金色金屬『太平洋房屋』徽章；徽章字樣使用正確繁體中文，清楚但不搶過人物主體，不得變形、改字或擴大成廣告Logo。姿態自然有自信，採明亮乾淨的專業環境或中性影棚背景；除指定徽章外，不得自行加入其他Logo、名牌、電話、建築或文字。",
  executive:
    "製作沉穩可靠的高階主管形象照，使用深色高質感商務套裝、簡潔姿態、精準輪廓光與低彩度辦公室或影棚背景，呈現領導力但不過度嚴肅。",
  "luxury-editorial":
    "製作低調精品雜誌風人像，服裝剪裁俐落、色彩克制，使用柔和側光、細緻陰影、大量留白與高級灰或暖米色背景，保留真實皮膚與本人辨識度。",
  cinematic:
    "製作電影感寫實人像，使用具有層次的主光與輪廓光、適度景深及電影色調；畫面可有氣氛但不得讓臉部過暗、變形或失去真實辨識度。",
  "korean-clean":
    "製作韓系清透形象照，使用柔和明亮光線、乾淨淺色背景、簡約服裝與自然妝髮；膚質清透但保留真實紋理，不使用過度磨皮、尖下巴或放大眼睛。",
  "japanese-natural":
    "製作日系自然人像，使用柔和日光、低飽和暖色、生活感構圖與簡潔服裝，表情自然親切，畫面安靜清爽並保留本人真實特徵。",
  "outdoor-lifestyle":
    "製作戶外陽光生活形象照，使用自然日光、柔和背景散景與輕鬆姿態；服裝乾淨有精神，背景不得自行加入未指定地標、建築或他人。",
  sporty:
    "製作健康有活力的運動形象照，換成合身但不暴露的運動服裝，姿態自然有自信，使用明亮動感光線；不得誇大肌肉、改變身形比例或生成未指定器材。",
  "formal-event":
    "換成正式宴會造型。男性使用合身深色西裝或晚宴服；女性使用剪裁典雅、端莊不暴露的洋裝或套裝。搭配柔和正式燈光與簡潔高雅背景。",
};

const portraitSkinDirections: Record<string, string> = {
  不修飾: "保留原始膚況，只校正曝光、白平衡與整體色調。",
  自然美肌:
    "自然改善氣色與膚質：均勻膚色、降低油光，淡化暫時性瑕疵、輕微黑眼圈與細紋，提亮眼神。保留真實皮膚紋理與原有臉型，不收整雙頰或下半臉。",
  專業精緻美肌:
    "完成看得出差異的商業形象照精修：明顯改善暗沉、膚色不均、黑眼圈、眼袋與細紋，整理眉型和儀容；針對臉頰浮腫、肉感與輕微不對稱適度修整，呈現較立體俐落的臉部線條。保留原有下顎骨架、五官比例與自然皮膚紋理。",
  高質感美肌:
    "務必完成一眼可見的高質感美型精修，而非只調亮或磨皮：顯著改善暗沉、眼袋、黑眼圈、細紋與輕微鬆弛，讓膚質細緻透亮但保有真實紋理。依原始臉況處理臉頰與下半臉軟組織：偏圓或浮腫時明顯收整雙頰肉感，視覺上約縮窄15%～20%，並平衡不對稱；偏瘦凹陷時增加少量自然飽滿感。保留原有下顎骨架、寬度與自然弧度，讓成品更精緻漂亮或帥氣，且仍能認出是本人。",
};

const portraitSkinSummaries: Record<string, string> = {
  不修飾: "只校正光線與色調",
  自然美肌: "輕度：改善氣色與小瑕疵，不改臉型",
  專業精緻美肌: "中度：商業精修，適度修整雙頰與輪廓",
  高質感美肌: "明顯：依臉況美型，雙頰可收整約15%～20%",
};

const portraitLookDirections: Record<string, string> = {
  保留原本氣質: "維持原照片中的年齡感、氣質與個人特色，只提升精神與整潔度。",
  "自然年輕3至5歲":
    "自然淡化黑眼圈、眼袋、魚尾紋、抬頭紋、法令紋、嘴角紋與輕微鬆弛，改善暗沉並提亮眼神，使面貌自然年輕約3至5歲；保留骨相、臉型、五官比例與本人特色，不得童顏化或換臉。",
  "明顯年輕5至8歲":
    "較明顯改善黑眼圈、眼袋、魚尾紋、抬頭紋、法令紋、嘴角紋、膚色暗沉與輕微鬆弛，適度提升肌膚緊緻度與精神，使面貌年輕約5至8歲；仍須維持同一人的骨相、臉型、眼鼻嘴比例與成熟辨識度。",
  帥氣俐落:
    "呈現成熟帥氣、乾淨俐落、有精神的形象，以服裝剪裁、髮型整理、姿態及光線加強魅力，不得靠改變五官或瘦臉達成。",
  優雅氣質:
    "呈現自然優雅、端莊、有氣質的形象，以柔和光線、儀容、姿態與服裝質感提升整體氛圍，不得改變真實面貌。",
  親切溫暖:
    "呈現親切、溫暖、容易接近的氣質，使用柔和眼神、自然表情與明亮光線。",
  自信幹練:
    "呈現自信、專業、幹練且可信任的形象，以眼神、挺拔姿態、服裝與光線塑造，不得改變臉部結構。",
};

const portraitHairDirections: Record<string, string> = {
  年輕化時自然加深髮色:
    "若選擇年輕化，將白髮自然減少約50%至70%，髮色調整為帶有層次的自然黑或深棕色；若未選擇年輕化則保留原髮色。不得使用死黑色塊或改變髮際線；髮型依本次髮型選項處理。",
  保留原髮色:
    "完整保留原照片髮色與白髮比例，只整理零亂髮絲並改善光澤。",
  自然減少白髮:
    "適度減少約40%至60%的白髮，保留少量自然銀白層次，使髮色較年輕但不突兀。",
  自然黑髮:
    "將髮色調整為具有真實明暗層次的自然黑色，避免過度濃黑或像假髮。",
  深棕髮色:
    "將髮色調整為低調自然的深棕色，與膚色、眉毛及整體光線協調。",
};

const originalHairstyle = "保留原髮型，只整理髮絲";
const maleHairstyles = [
  "俐落側分短髮",
  "韓系自然短髮",
  "清爽平頭",
  "自然後梳髮型",
  "微捲紋理短髮",
] as const;
const femaleHairstyles = [
  "側分長捲髮",
  "中分長捲髮",
  "自然長直髮",
  "長髮髮尾微捲",
  "半紮長髮",
  "鎖骨層次髮",
  "鎖骨內彎髮",
  "中長微捲髮",
  "俐落短鮑伯",
  "蓬鬆層次短髮",
  "低馬尾",
  "優雅低盤髮",
] as const;
const portraitHairstyleDirections: Record<string, string> = {
  [originalHairstyle]: "保留原照片的髮型、長度與分線，只整理零亂髮絲和自然光澤。",
  俐落側分短髮: "整理為兩側清爽、頂部自然側分的短髮，線條俐落。",
  韓系自然短髮: "整理為兩側清爽、頂部輕微層次的韓系短髮，不刻意蓬高。",
  清爽平頭: "整理為長度均勻、乾淨整齊的短平頭。",
  自然後梳髮型: "將頭髮自然向後梳整，保留原有髮量與成熟質感。",
  微捲紋理短髮: "整理為帶輕微自然捲度與紋理的短髮，清爽有精神。",
  側分長捲髮: "頭髮自然放下，採側分與柔和大捲，呈現優雅氣質。",
  中分長捲髮: "頭髮自然放下，採中分與柔和大捲，呈現成熟大方的線條。",
  自然長直髮: "頭髮自然放下，整理為柔順有光澤的長直髮。",
  長髮髮尾微捲: "頭髮自然放下，上半部柔順，髮尾帶輕微自然弧度。",
  半紮長髮: "上半部頭髮自然收起，下半部放下，整齊且柔和。",
  鎖骨層次髮: "整理為及鎖骨長度、髮尾輕盈有層次的髮型。",
  鎖骨內彎髮: "整理為及鎖骨長度，髮尾自然向內彎的髮型。",
  中長微捲髮: "整理為肩下中長髮，加入輕柔自然的捲度。",
  俐落短鮑伯: "整理為髮尾整齊、輪廓清爽的短鮑伯髮型。",
  蓬鬆層次短髮: "整理為輕盈有層次的短髮，蓬鬆但不誇張。",
  低馬尾: "將頭髮整齊束成低馬尾，保留少量自然線條。",
  優雅低盤髮: "將頭髮整齊收成低盤髮，呈現端莊的正式造型。",
};

const portraitSmileDirections: Record<string, string> = {
  保留原表情: "維持原照片的表情與嘴型。",
  嘴角微笑: "嘴角輕微上揚，表情沉穩自然，眼神放鬆。",
  自然微笑: "呈現自然親切的微笑，眼神同步帶有笑意，不僵硬。",
  自信笑容: "呈現自信、有精神且專業的笑容，嘴型自然，姿態大方。",
  露牙笑: "呈現自然露牙笑，牙齒排列與嘴部比例合理，不使用過度潔白或假牙般效果。",
  開朗笑容: "呈現較明顯、開朗有感染力的笑容，保留本人嘴型與臉部特徵。",
  沉穩不笑: "嘴唇自然閉合，表情沉穩有精神，不嚴肅僵硬。",
};

const initial: FormData = {
  propertyData: "",
  contactName: "",
  phone: "",
  brand: "太平洋房屋",
  branch: "友成大湳加盟店",
  company: "日榮不動產股份有限公司",
  address: "桃園市八德區大智路73號",
  broker: "黃立鈞",
  license: "(99)桃市經字第001151號",
  size: "直式4:5（1080×1350，社群貼文）",
  customSize: "",
  style: "專業、溫馨、現代、清楚、可信任",
  colors: "紅",
  customColors: "",
  callToAction: "自動設計（依物件特色變化）",
  customCallToAction: "",
  photoAdjust: "自然明亮",
  portraitRetouch: "自然美肌",
  portraitGender: "依原照片與使用者描述",
  portraitFraming: "半身形象照",
  portraitBackground: "依所選情境自動設計",
  portraitSkin: "自然美肌",
  portraitLook: "保留原本氣質",
  portraitHairstyle: originalHairstyle,
  portraitHair: "年輕化時自然加深髮色",
  portraitSmile: "自然微笑",
  fontStyle: "現代粗黑體",
};

const savedProfileKeys = [
  "contactName",
  "phone",
  "brand",
  "branch",
  "company",
  "address",
  "broker",
  "license",
] as const;
const profileStorageKey = "realty-ai-prompt-builder-profile-v1";

function joinPromptSections(...sections: Array<string | false | undefined>) {
  const seen = new Set<string>();
  return sections
    .filter((section): section is string => Boolean(section))
    .map((section) => section.trim())
    .filter((section) => {
      const key = section.replace(/\s+/g, " ");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join("\n\n");
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("copy");
  const [useCase, setUseCase] = useState("listing");
  const [data, setData] = useState<FormData>(initial);
  const [copied, setCopied] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const uses =
    mode === "copy" ? copyUses : mode === "image" ? imageUses : portraitUses;
  const setField = (key: string, value: string) =>
    setData((old) => ({ ...old, [key]: value }));
  const toggleStyle = (style: string) => {
    const selected = data.style
      .split("、")
      .map((item) => item.trim())
      .filter(Boolean);
    const next = selected.includes(style)
      ? selected.filter((item) => item !== style)
      : [...selected, style];
    setField("style", next.join("、"));
  };
  const changeMode = (value: string) => {
    const next = value as Mode;
    setMode(next);
    setUseCase(
      next === "copy"
        ? "listing"
        : next === "image"
          ? "standard"
          : "business-suit",
    );
  };
  const changePortraitGender = (value: string) => {
    setData((current) => ({
      ...current,
      portraitGender: value,
      portraitHairstyle:
        (value === "男性造型" && femaleHairstyles.includes(current.portraitHairstyle as typeof femaleHairstyles[number])) ||
        (value === "女性造型" && maleHairstyles.includes(current.portraitHairstyle as typeof maleHairstyles[number]))
          ? originalHairstyle
          : current.portraitHairstyle,
    }));
  };
  const changePortraitHairstyle = (value: string) => {
    setData((current) => ({
      ...current,
      portraitHairstyle: value,
      portraitGender: maleHairstyles.includes(value as typeof maleHairstyles[number])
        ? "男性造型"
        : femaleHairstyles.includes(value as typeof femaleHairstyles[number])
          ? "女性造型"
          : current.portraitGender,
    }));
  };
  const hairstyleGroups =
    data.portraitGender === "男性造型"
      ? [
          { label: "男生髮型", options: maleHairstyles },
          { label: "女生髮型", options: femaleHairstyles },
        ]
      : [
          { label: "女生髮型", options: femaleHairstyles },
          { label: "男生髮型", options: maleHairstyles },
        ];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(profileStorageKey);
      if (saved) setData((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {
      // Browser storage may be unavailable in private or restricted browsing modes.
    } finally {
      setProfileReady(true);
    }
  }, []);

  useEffect(() => {
    if (!profileReady) return;
    const profile = Object.fromEntries(
      savedProfileKeys.map((key) => [key, data[key]]),
    );
    try {
      window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    } catch {
      // Keep the form usable even when browser storage is unavailable.
    }
  }, [data, profileReady]);

  const prompt = useMemo(() => {
    const title = uses.find(([id]) => id === useCase)?.[1] ?? "";
    const direction =
      mode === "copy"
        ? copyDirections[useCase]
        : mode === "image"
          ? imageDirections[useCase]
          : portraitDirections[useCase];
    const property =
      data.propertyData.trim() ||
      "（尚未提供物件資料；請先要求使用者補充，不得自行填寫。）";
    if (mode === "portrait") {
      const portraitNotes =
        data.propertyData.trim() || "無其他需求，依所選情境自然處理。";
      const skinDirection =
        portraitSkinDirections[data.portraitSkin] ||
        portraitSkinDirections["自然美肌"];
      const lookDirection =
        portraitLookDirections[data.portraitLook] ||
        portraitLookDirections["保留原本氣質"];
      const hairDirection =
        portraitHairDirections[data.portraitHair] ||
        portraitHairDirections["年輕化時自然加深髮色"];
      const hairstyleDirection =
        portraitHairstyleDirections[data.portraitHairstyle] ||
        portraitHairstyleDirections[originalHairstyle];
      const hairstyleRule =
        data.portraitHairstyle === originalHairstyle
          ? `【髮型】\n${hairstyleDirection}`
          : `【髮型修改｜務必看得出變化】\n將原照片的髮型改成「${data.portraitHairstyle}」：${hairstyleDirection}這是明確的換髮型要求，不只是梳整、提亮或換髮色。請依目標造型調整頭髮長度、分線、捲度、層次或紮髮方式；需要長髮時可合理延長頭髮。髮型以本段為準，優先於情境中籠統的妝髮描述；保留本人臉孔與自然髮際線，完成後應能直接看出選定髮型。`;
      const smileDirection =
        portraitSmileDirections[data.portraitSmile] ||
        portraitSmileDirections["自然微笑"];
      return joinPromptSections(
        "你是一位專業人像攝影師、造型師與人像修圖師。",
        `請使用本次上傳的本人照片製作「${title}」。未上傳清晰本人照片時先要求補充，不得生成替代人物。`,
        hairstyleRule,
        `【美肌效果｜只執行選定等級】\n${skinDirection}`,
        `【其他設定】\n情境：${direction}\n性別造型：${data.portraitGender}\n構圖：${data.portraitFraming}\n背景：${data.portraitBackground}\n氣質：${lookDirection}\n髮色：${hairDirection}\n表情：${smileDirection}`,
        `【人物與資料邊界】\n- 以原照片為人物依據，保留本人核心五官與辨識度；已選的美肌與髮型修改仍須清楚完成，不因保真要求而省略。\n- 年齡變化只依本次選定的形象氣質；未選年輕化就不額外年輕化。\n- 髮型決定頭髮造型，髮色選項只決定顏色。\n- 除所選情境明確要求外，不加入未提供的人物、文字、Logo、名牌、電話、QR Code、地標或物件。\n- 不套用未選取的美肌、氣質、髮型、髮色或笑容提示。`,
        `【其他需求】\n${portraitNotes}`,
        "【輸出檢查】只確認本次選定效果已呈現，且沒有互相抵觸、換臉、塑膠肌或未提供元素。",
      );
    }
    const resolvedSize =
      data.size === "自訂尺寸"
        ? data.customSize.trim() || "自訂尺寸（待輸入）"
        : data.size || "直式4:5（1080×1350）";
    const resolvedColors =
      data.colors === "自訂"
        ? data.customColors.trim() || "自訂配色（待輸入）"
        : data.colors || "依物件照片與品牌識別協調配色";
    const resolvedCallToAction =
      data.callToAction === "自訂"
        ? data.customCallToAction.trim() || "不放行動標語"
        : data.callToAction === "自動設計（依物件特色變化）"
          ? "依本次物件資料與版面語氣重新構思自然、精簡且不誇大的標語，僅選用1句呈現在成品中；每次必須變換文案，不得沿用先前生成過的標語"
          : `只能使用「${data.callToAction}」這1句行動標語；若與物件資料或法規限制衝突則省略`;
    const sourceRules = `【資料邊界】\n只使用本次明確提供的文字、數據、照片與附件。未提供的人物、電話、地址、QR Code、Logo、地圖、捷運圖、交通、學區、建設、景觀或其他元素一律省略；不得搜尋、推測、補造、使用示意內容或預留位置。`;
    const complianceRules = `【必要法規檢查】\n- 價格、坪數、用途、交通、學區、建設狀態、距離、投報率與稀有性等敘述，必須有使用者提供且可核實的依據；不足就省略，不得保證結果。\n- 物件照片不得改變格局、比例、固定設施、屋況、景觀或周邊環境；聯絡與經紀業資料只能照原文使用。\n- 輸出前刪除任何無來源或無法核實的內容，並提醒刊登前依權狀、謄本、使用執照、主管機關公告與個案事實人工查核。`;

    if (mode === "copy") {
      return joinPromptSections(
        "你是一位熟悉台灣不動產市場、廣告實務與繁體中文的資深房仲行銷企劃。",
        `請依照以下資料製作「${title}」。`,
        `【本次任務】\n${direction}`,
        `【物件資料】\n${property}`,
        sourceRules,
        complianceRules,
      );
    }

    const imageSpec = `【本次設計設定】\n尺寸比例：${resolvedSize}\n視覺風格：${data.style || "專業、現代、清楚、可信任"}\n品牌色：${resolvedColors}\n行動標語：${resolvedCallToAction}\n物件照片微調：${data.photoAdjust}\n人物照片修飾：${data.portraitRetouch}\n字體：${data.fontStyle}`;
    const imageRules = `【圖像處理規則】\n- 只使用實際上傳的照片；未上傳人物照就不得生成真人、剪影或人物預留區。\n- 物件照片只依所選程度調整曝光與色彩，不改變建築、格局、比例、固定設施、屋況或窗外景觀。\n- 成品最多使用上述1句行動標語，不得改寫、重複或混入其他標語；電話、價格、坪數與證號只有提供時才呈現。`;
    const qrCodeRules = `【QR Code 原圖保護｜最高優先】\n若使用者有提供 QR Code 圖片，禁止交給生成模型重畫或融合。先在底圖保留乾淨安全區，完成其他圖像後，再把使用者提供的 QR Code 原圖以獨立圖層原樣貼回。只允許等比例縮放與定位；禁止裁切、旋轉、透視、扭曲、重製、補畫、換色、濾鏡、銳化、壓縮、加 Logo／邊框／陰影、覆蓋圖樣或改變留白區。輸出前必須實際掃描驗證結果與原 QR Code 完全相同；無法驗證就不得交付。未提供 QR Code 時不得生成或預留。`;

    return joinPromptSections(
      "你是一位具有15年以上經驗、熟悉台灣房地產廣告的專業平面設計總監。",
      `請依照以下資料製作「${title}」。`,
      `【本次任務】\n${direction}`,
      imageSpec,
      `【物件資料】\n${property}`,
      sourceRules,
      imageRules,
      qrCodeRules,
      complianceRules,
    );
  }, [mode, useCase, data, uses]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function resetCurrentWork() {
    setData((current) => ({
      ...initial,
      ...Object.fromEntries(
        savedProfileKeys.map((key) => [key, current[key]]),
      ),
    }));
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,#ef0000_0%,#cf0000_52%,#a90000_100%)] text-white">
      <header className="site-header border-b-4 border-[#ffd633] bg-[#111111] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e00000] text-[#ffd633] sm:size-11">
              <Building2 />
            </span>
            <div className="min-w-0">
              <h1 className="brand-title truncate text-base font-black tracking-tight sm:text-lg md:text-xl">
                房仲 AI 提示詞產生器
              </h1>
              <p className="brand-subtitle truncate text-[11px] text-[#ffd633] sm:text-xs">
                太平洋房屋 友成幸福團隊
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <div className="hidden items-center gap-2 rounded-full border border-[#ffd633]/40 bg-[#ffd633]/10 px-3 py-1.5 text-[11px] font-semibold text-white md:flex">
              <ShieldCheck className="size-3.5 text-[#ffd633]" />
              資料只在你的瀏覽器中組合
            </div>
            <p className="max-w-[120px] text-right text-[8px] font-semibold leading-tight tracking-tight text-[#fff4c2] sm:max-w-none sm:text-[9px]">
              <span className="block sm:inline">2026@All Rights</span>{" "}
              <span className="block sm:inline">
                Reserved by <span className="whitespace-nowrap">黃立鈞</span>
              </span>
            </p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1480px] px-4 py-6 md:px-8 md:py-9">
        <section className="hero-intro mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="hero-kicker mb-2 flex items-center gap-2 text-sm font-bold text-[#ffd633]">
              <Sparkles className="size-4" />
              四個步驟完成可直接使用的提示詞
            </p>
            <h2 className="hero-title max-w-4xl text-3xl font-black leading-tight tracking-[-0.035em] text-white md:text-5xl">
              選用途、填資料，
              <br className="hidden sm:block" />
              讓好物件說對的話。
            </h2>
          </div>
          <p className="hero-desc max-w-md text-sm leading-7 text-white/85">
            內建文案與圖像海報情境，自動加入台灣繁體中文、經紀業資料及不實廣告防呆規則。
          </p>
        </section>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(420px,.96fr)]">
          <section className="builder-panel rounded-[28px] border-4 border-[#ffd633] bg-white p-5 text-[#171717] shadow-[0_22px_70px_rgba(50,0,0,.35)] md:p-7">
            <div className="step-one-heading mb-7 flex items-center gap-3">
              <span className="step">1</span>
              <div>
                <h3 className="font-black text-[#171717]">
                  選擇生成類型與用途
                </h3>
                <p className="text-xs text-[#5f5f5f]">
                  用途會決定提示詞的角色、格式與設計重點
                </p>
              </div>
            </div>
            <Tabs value={mode} onValueChange={changeMode} className="mode-tabs mb-8">
              <TabsList className="mode-tabs-list grid h-auto w-full grid-cols-1 gap-3 rounded-2xl bg-transparent p-0 sm:grid-cols-3">
                <TabsTrigger
                  value="copy"
                  className="mode-trigger group h-16 min-h-16 items-center justify-start rounded-2xl border-2 border-black/15 bg-[#f7f7f7] px-4 py-2 text-left shadow-none transition-all hover:border-[#e00000] hover:bg-[#fff7d6] data-[state=active]:border-[#111111] data-[state=active]:bg-[#e00000] data-[state=active]:shadow-[0_0_0_3px_#ffd633,0_10px_24px_rgba(0,0,0,.18)]"
                >
                  <span className="mode-icon grid size-9 shrink-0 place-items-center rounded-xl bg-[#111111] text-[#ffd633] group-data-[state=active]:bg-[#ffd633] group-data-[state=active]:text-[#111111]">
                    <FileText className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="mode-label text-lg text-[#171717] group-data-[state=active]:text-white">
                        生成文案
                      </strong>
                      {mode === "copy" && (
                        <span className="grid size-5 place-items-center rounded-full bg-[#ffd633] text-[#111111]">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="mode-trigger group h-16 min-h-16 items-center justify-start rounded-2xl border-2 border-black/15 bg-[#f7f7f7] px-4 py-2 text-left shadow-none transition-all hover:border-[#e00000] hover:bg-[#fff7d6] data-[state=active]:border-[#111111] data-[state=active]:bg-[#e00000] data-[state=active]:shadow-[0_0_0_3px_#ffd633,0_10px_24px_rgba(0,0,0,.18)]"
                >
                  <span className="mode-icon grid size-9 shrink-0 place-items-center rounded-xl bg-[#111111] text-[#ffd633] group-data-[state=active]:bg-[#ffd633] group-data-[state=active]:text-[#111111]">
                    <ImageIcon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="mode-label text-lg text-[#171717] group-data-[state=active]:text-white">
                        生成圖像
                      </strong>
                      {mode === "image" && (
                        <span className="grid size-5 place-items-center rounded-full bg-[#ffd633] text-[#111111]">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="portrait"
                  className="mode-trigger group h-16 min-h-16 items-center justify-start rounded-2xl border-2 border-black/15 bg-[#f7f7f7] px-4 py-2 text-left shadow-none transition-all hover:border-[#e00000] hover:bg-[#fff7d6] data-[state=active]:border-[#111111] data-[state=active]:bg-[#e00000] data-[state=active]:shadow-[0_0_0_3px_#ffd633,0_10px_24px_rgba(0,0,0,.18)]"
                >
                  <span className="mode-icon grid size-9 shrink-0 place-items-center rounded-xl bg-[#111111] text-[#ffd633] group-data-[state=active]:bg-[#ffd633] group-data-[state=active]:text-[#111111]">
                    <UserRound className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="mode-label text-lg text-[#171717] group-data-[state=active]:text-white">
                        修改人像
                      </strong>
                      {mode === "portrait" && (
                        <span className="grid size-5 place-items-center rounded-full bg-[#ffd633] text-[#111111]">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="usecase-heading mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#171717]">
                  {mode === "copy"
                    ? "選擇文案情境／使用用途"
                    : mode === "image"
                      ? "選擇圖像情境／使用用途"
                      : "選擇人像修改情境／使用用途"}
                </p>
                <p className="usecase-count mt-1 text-xs text-[#666666]">
                  目前共有 {uses.length} 種，點選一項即可套用
                </p>
              </div>
              <span className="usecase-selected shrink-0 rounded-full bg-[#ffd633] px-2.5 py-1 text-[10px] font-bold text-[#171717]">
                已選：{uses.find(([id]) => id === useCase)?.[1]}
              </span>
            </div>
            <div className="grid max-h-52 grid-cols-2 gap-1.5 overflow-y-auto rounded-2xl border-2 border-black/10 bg-[#f2f2f2] p-2 sm:grid-cols-3">
              {uses.map(([id, name], index) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setUseCase(id)}
                  aria-pressed={useCase === id}
                  className={`flex min-h-9 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[11px] font-bold leading-4 transition sm:text-xs ${useCase === id ? "border-[#111111] bg-[#e00000] text-white shadow-[0_0_0_2px_#ffd633,0_6px_16px_rgba(0,0,0,.16)]" : "border-black/10 bg-white text-[#292929] hover:border-[#e00000] hover:bg-[#fff7d6]"}`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md text-[9px] ${useCase === id ? "bg-[#ffd633] text-[#111111]" : "bg-[#eeeeee] text-[#666666]"}`}
                  >
                    {useCase === id ? <Check className="size-3" /> : index + 1}
                  </span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
            <div className="my-8 h-px bg-black/10" />
            <div className="mb-6 flex items-center gap-3">
              <span className="step">2</span>
              <div>
                <h3 className="font-black text-[#171717]">
                  {mode === "portrait" ? "輸入人像修改需求" : "貼上物件資料"}
                </h3>
                <p className="text-xs text-[#666666]">
                  {mode === "portrait"
                    ? "使用提示詞時，請一併上傳清晰的本人照片"
                    : "直接貼上公司系統產生的完整物件資料即可"}
                </p>
              </div>
            </div>
            <label className="block">
              <span className="field-label">
                {mode === "portrait" ? "其他修改需求" : "物件資料"}
              </span>
              <div className="mb-3 rounded-xl border-2 border-[#111111] bg-[#ffd633] px-4 py-3 text-center text-base font-black leading-6 text-[#d90000] shadow-[0_4px_0_#111111] sm:text-lg">
                {mode === "portrait"
                  ? "請務必在使用提示詞時上傳清晰本人照片"
                  : "請一定要在此輸入經紀業及經紀人"}
              </div>
              <Textarea
                value={data.propertyData}
                onChange={(e) => setField("propertyData", e.target.value)}
                placeholder={
                  mode === "portrait"
                    ? "可補充服裝顏色、希望保留的配件、背景、姿勢或用途。\n例如：保留銀色細框眼鏡、深藍色西裝、白襯衫、銀色領帶，作為房仲名片形象照。"
                    : "請在這裡貼上完整物件資料，並包含經紀業及經紀人資料。\n例如：物件名稱、地點、總價、坪數、格局、樓層、屋齡、車位、特色、生活機能、交通條件及應揭露事項等。"
                }
                className="min-h-72 rounded-2xl border-2 border-black/15 bg-white p-4 leading-7 text-[#171717] placeholder:text-[#777777] md:min-h-80"
              />
            </label>
            <div className="flex flex-col">
              {mode === "image" && (
                <section
                  className="order-1 mt-4 rounded-2xl border-2 border-black/10 bg-[#fffdf5] p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="step">3</span>
                    <div>
                      <h3 className="font-black text-[#171717]">圖像輸出規格</h3>
                      <p className="text-xs text-[#666666]">設定尺寸、風格、配色與照片調整方式</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label>
                      <span className="field-label">尺寸比例</span>
                      <Select
                        value={data.size}
                        onValueChange={(value) => setField("size", value)}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "正方形1:1（1080×1080，社群貼文）",
                            "直式4:5（1080×1350，社群貼文）",
                            "直式3:4（900×1200，一般海報）",
                            "直式2:3（1000×1500，DM海報）",
                            "直式9:16（1080×1920，限動／短影音封面）",
                            "橫式16:9（1920×1080，簡報／影片封面）",
                            "橫式5:4（1250×1000，一般橫式廣告）",
                            "橫式3:2（1500×1000，網站圖片）",
                            "橫式4:3（1600×1200，一般橫式海報）",
                            "橫式2:1（1600×800，網站橫幅／社群廣告）",
                            "橫式3:1（1800×600，大型橫幅／看板）",
                            "A4直式（210×297mm，印刷DM）",
                            "A4橫式（297×210mm，印刷DM）",
                            "直式1:5（長條帆布）",
                            "橫式5:1（長條帆布）",
                            "自訂尺寸",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {data.size === "自訂尺寸" && (
                        <Input
                          value={data.customSize}
                          onChange={(e) =>
                            setField("customSize", e.target.value)
                          }
                          placeholder="例：寬600×高120cm，直式"
                          className="mt-2 border-black/15 bg-white text-[#171717]"
                        />
                      )}
                    </label>
                    <div>
                      <span className="field-label">視覺風格</span>
                      <details className="multi-select relative">
                        <summary className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-black/15 bg-white px-3 text-sm text-[#171717]">
                          <span className="truncate">
                            {data.style || "請選擇視覺風格"}
                          </span>
                        </summary>
                        <div className="absolute left-0 right-0 z-30 mt-1 grid gap-1 rounded-xl border border-black/15 bg-white p-2 shadow-xl">
                          {visualStyleOptions.map((item) => {
                            const selected = data.style
                              .split("、")
                              .includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleStyle(item)}
                                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ${selected ? "bg-[#fff3a6] font-bold text-[#171717]" : "text-[#454545] hover:bg-[#f3f3f3]"}`}
                              >
                                <span className={`grid size-5 place-items-center rounded border ${selected ? "border-[#e00000] bg-[#e00000] text-white" : "border-black/20 bg-white"}`}>
                                  {selected && <Check className="size-3.5" />}
                                </span>
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </details>
                      <p className="mt-1.5 text-[11px] text-[#666666]">
                        可複選，再次點選即可取消
                      </p>
                    </div>
                    <div>
                      <span className="field-label">品牌配色</span>
                      <Select
                        value={data.colors}
                        onValueChange={(value) => setField("colors", value)}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {data.colors === "自訂" && (
                        <Input
                          value={data.customColors}
                          onChange={(e) =>
                            setField("customColors", e.target.value)
                          }
                          placeholder="請輸入自訂配色"
                          className="mt-2 border-black/15 bg-white text-[#171717]"
                        />
                      )}
                    </div>
                    <div>
                      <span className="field-label">行動標語</span>
                      <Select
                        value={data.callToAction}
                        onValueChange={(value) =>
                          setField("callToAction", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {callToActionOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {data.callToAction === "自訂" && (
                        <Input
                          value={data.customCallToAction}
                          onChange={(e) =>
                            setField("customCallToAction", e.target.value)
                          }
                          placeholder="請輸入自訂行動標語；留白即不放"
                          className="mt-2 border-black/15 bg-white text-[#171717]"
                        />
                      )}
                    </div>
                    <label>
                      <span className="field-label">物件照片微調</span>
                      <Select
                        value={data.photoAdjust}
                        onValueChange={(value) =>
                          setField("photoAdjust", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "不調整",
                            "自然明亮",
                            "明亮清透",
                            "溫暖柔和",
                            "冷調現代",
                            "鮮明飽和",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">人物照片修飾</span>
                      <Select
                        value={data.portraitRetouch}
                        onValueChange={(value) =>
                          setField("portraitRetouch", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "無人物照片",
                            "不修飾",
                            "自然美肌",
                            "專業形象修飾",
                            "精緻美肌",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">海報字體風格</span>
                      <Select
                        value={data.fontStyle}
                        onValueChange={(value) => setField("fontStyle", value)}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "現代粗黑體",
                            "清新圓體",
                            "典雅明體",
                            "溫度手寫風",
                            "精品襯線風",
                            "幾何科技字體",
                            "強烈廣告標題字",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
                </section>
              )}
              {mode === "portrait" && (
                <section className="order-1 mt-4 rounded-2xl border-2 border-black/10 bg-[#fffdf5] p-5">
                  <div className="flex items-center gap-3">
                    <span className="step">3</span>
                    <div>
                      <h3 className="font-black text-[#171717]">人像修改規格</h3>
                      <p className="text-xs text-[#666666]">
                        設定美肌、氣質、髮型、髮色、笑容、造型、構圖與背景
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label>
                      <span className="field-label">性別造型</span>
                      <Select
                        value={data.portraitGender}
                        onValueChange={changePortraitGender}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "依原照片與使用者描述",
                            "男性造型",
                            "女性造型",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">構圖範圍</span>
                      <Select
                        value={data.portraitFraming}
                        onValueChange={(value) =>
                          setField("portraitFraming", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["大頭照", "半身形象照", "四分之三身", "全身形象照"].map(
                            (item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">背景方式</span>
                      <Select
                        value={data.portraitBackground}
                        onValueChange={(value) =>
                          setField("portraitBackground", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "依所選情境自動設計",
                            "保留原照片背景",
                            "純色攝影棚背景",
                            "簡潔辦公空間",
                            "自然戶外散景",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">美肌效果</span>
                      <Select
                        value={data.portraitSkin}
                        onValueChange={(value) =>
                          setField("portraitSkin", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "不修飾",
                            "自然美肌",
                            "專業精緻美肌",
                            "高質感美肌",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-1.5 text-[11px] text-[#666666]">
                        {portraitSkinSummaries[data.portraitSkin]}
                      </p>
                    </label>
                    <label>
                      <span className="field-label">形象氣質</span>
                      <Select
                        value={data.portraitLook}
                        onValueChange={(value) =>
                          setField("portraitLook", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "保留原本氣質",
                            "自然年輕3至5歲",
                            "明顯年輕5至8歲",
                            "帥氣俐落",
                            "優雅氣質",
                            "親切溫暖",
                            "自信幹練",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">髮型</span>
                      <Select
                        value={data.portraitHairstyle}
                        onValueChange={changePortraitHairstyle}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={originalHairstyle}>{originalHairstyle}</SelectItem>
                          {hairstyleGroups.map(({ label, options }) => (
                            <SelectGroup key={label}>
                              <SelectLabel>{label}</SelectLabel>
                              {options.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-1.5 text-[11px] text-[#666666]">
                        男生 5 種、女生 12 種；選單可上下滑動
                      </p>
                    </label>
                    <label>
                      <span className="field-label">髮色處理</span>
                      <Select
                        value={data.portraitHair}
                        onValueChange={(value) =>
                          setField("portraitHair", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "年輕化時自然加深髮色",
                            "保留原髮色",
                            "自然減少白髮",
                            "自然黑髮",
                            "深棕髮色",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <label>
                      <span className="field-label">笑容表情</span>
                      <Select
                        value={data.portraitSmile}
                        onValueChange={(value) =>
                          setField("portraitSmile", value)
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border-black/15 bg-white text-[#171717]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "保留原表情",
                            "嘴角微笑",
                            "自然微笑",
                            "自信笑容",
                            "露牙笑",
                            "開朗笑容",
                            "沉穩不笑",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
                </section>
              )}
            </div>
          </section>
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="overflow-hidden rounded-[28px] border-4 border-[#111111] bg-[#ffd6df] text-[#27171a] shadow-[0_22px_70px_rgba(50,0,0,.34)]">
              <div className="flex items-center justify-between border-b-2 border-[#e00000]/25 bg-[#ffc1ce] px-5 py-5 md:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-[#e00000] font-black text-white shadow-[0_0_0_3px_#ffd633]">
                    4
                  </span>
                  <div>
                    <h3 className="font-black">完整提示詞</h3>
                    <p className="text-xs text-[#6f3944]">
                      內容會隨前面輸入的資料即時更新
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCurrentWork}
                  className="text-[#6f3944] hover:bg-white/50 hover:text-[#171717]"
                >
                  <RotateCcw />
                  清除
                </Button>
              </div>
              <pre className="max-h-[67vh] min-h-[420px] overflow-auto whitespace-pre-wrap break-words bg-[#ffe5eb] px-5 py-6 font-sans text-[13px] leading-7 text-[#27171a] md:min-h-[480px] md:px-7">
                {prompt}
              </pre>
              <div className="border-t-2 border-[#e00000]/20 bg-[#ffc1ce] p-4 md:p-5">
                <Button
                  onClick={copyPrompt}
                  className="h-12 w-full rounded-xl border-2 border-[#111111] bg-[#e00000] text-base font-black text-white shadow-[0_4px_0_#ffd633] hover:bg-[#c90000]"
                >
                  {copied ? (
                    <>
                      <Check />
                      已複製，可以貼到AI使用
                    </>
                  ) : (
                    <>
                      <Clipboard />
                      複製完整提示詞
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex gap-3 rounded-2xl border-2 border-[#ffd633] bg-[#111111] p-4 text-xs leading-6 text-white/80">
              <ShieldCheck className="mt-1 size-5 shrink-0 text-[#ffd633]" />
              <p>
                <strong className="text-[#ffd633]">刊登前請再核對：</strong>
                價格、坪數、電話、用途、學區、交通距離與經紀業資料。AI很會排版，但它不會替你接公平會的電話。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
