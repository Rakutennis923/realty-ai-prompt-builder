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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Mode = "copy" | "image";
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
    "物件照片占60%，以主標題、總價、坪數格局、4項特色、聯絡資訊建立清楚閱讀層級。",
  "fb-poster":
    "前兩秒能看見物件名稱、總價及最大特色；畫面明亮、專業、有朝氣，適合手機社群瀏覽。",
  "line-poster":
    "版面極簡直接，總價與電話最大；只保留地點、坪數、格局、車位和4項特色。",
  "591-cover":
    "房屋照片為主，文字不超過畫面20%；只放短標題、總價、格局與一項核心賣點。",
  luxury:
    "使用深灰、象牙白與少量霧金，大面積主照片及大量留白，呈現低調精品雜誌質感。",
  "first-home":
    "採米白、淺木與柔和綠色，溫暖明亮、親切可信；避免暗示貸款一定核准。",
  family:
    "以生活空間升級為主題，突出房間數、收納、停車及便利性，風格成熟溫暖、不卡通化。",
  transit:
    "加入簡潔都市感與交通圖示，清楚區分已通車、施工中與規劃中建設，距離只採用已提供資料。",
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
    "日期、時間、地點與預約電話最醒目，搭配日曆、時鐘與定位圖示，呈現明亮活動感。",
  "personal-brand":
    "物件仍是主角，房仲人物占比不超過25%；人物五官與年齡保持原貌，呈現親切專業。",
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
  style: "專業、溫馨、現代、清楚、可信任、科技",
  colors: "紅、綠＋黃、深藍色＋金／古銅、黑灰＋明亮霓虹",
  photoAdjust: "自然明亮",
  portraitRetouch: "自然美肌",
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

function line(label: string, value: string) {
  return value.trim() ? `${label}：${value.trim()}` : "";
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("copy");
  const [useCase, setUseCase] = useState("listing");
  const [data, setData] = useState<FormData>(initial);
  const [copied, setCopied] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const uses = mode === "copy" ? copyUses : imageUses;
  const setField = (key: string, value: string) =>
    setData((old) => ({ ...old, [key]: value }));
  const changeMode = (value: string) => {
    const next = value as Mode;
    setMode(next);
    setUseCase(next === "copy" ? "listing" : "standard");
  };

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
      mode === "copy" ? copyDirections[useCase] : imageDirections[useCase];
    const role =
      mode === "copy"
        ? "你是一位熟悉台灣不動產市場、廣告實務與繁體中文溝通的資深房仲行銷企劃。"
        : "你是一位具有15年以上經驗、熟悉台灣房地產廣告的專業平面設計總監。";
    const property =
      data.propertyData.trim() ||
      "（尚未貼上物件資料，資訊不足處請標示待確認）";
    const contact = [
      line("聯絡人", data.contactName),
      line("電話", data.phone),
      line("品牌", data.brand),
      line("加盟店", data.branch),
      line("經紀業名稱", data.company),
      line("營業地址", data.address),
      line("經紀人", data.broker),
      line("經紀人證號", data.license),
    ]
      .filter(Boolean)
      .join("\n");
    const resolvedSize =
      data.size === "自訂尺寸"
        ? data.customSize.trim() || "自訂尺寸（待輸入）"
        : data.size || "直式4:5（1080×1350）";
    const imageSpec =
      mode === "image"
        ? `\n\n【輸出與設計規格】\n尺寸比例：${resolvedSize}\n視覺風格：${data.style || "專業、現代、清楚、可信任"}\n品牌色：${data.colors || "依物件照片與品牌識別協調配色"}\n物件照片微調：${data.photoAdjust}\n人物照片修飾：${data.portraitRetouch}\n海報字體風格：${data.fontStyle}\n請使用使用者上傳的真實物件照片與人物照片。物件照片僅能依所選風格調整明亮度、白平衡、色調、對比與飽和度，不得改變建築外觀、室內格局、空間比例、窗外景觀、固定設施或屋況。若有人物照片，僅依所選程度進行自然膚色、明亮度、輕微膚質與儀容修飾，必須保留本人五官、臉型、年齡特徵及真實辨識度。字體以所選風格呈現，優先確保繁體中文正確、清晰可讀，不要求模仿特定受著作權保護的字型。四周保留安全留白，電話、價格、坪數及證號不得變形。`
        : "";
    return `${role}\n\n請依照以下資料製作「${title}」。\n\n【任務要求】\n${direction}${imageSpec}\n\n【物件資料】\n${property}\n\n【聯絡及經紀業資料】\n${contact || "（尚未填寫）"}\n\n【台灣房仲廣告與法規防呆規則】\n1. 僅能使用使用者提供且可查證的資料；不得自行虛構或推測價格、面積、格局、用途、分區、建照或使照、學區、交通距離與時間、公共建設、屋況、景觀、投報率、成交紀錄、銷售紀錄或買方人數。資料不足時標示「待確認」。\n2. 捷運、輕軌或其他交通建設必須依官方最新公告標示狀態：已營運才可寫「已通車」；施工中的路線或車站必須明確寫「興建中」或「施工中」；尚未施工者必須明確寫「規劃中」。不得把未完成建設寫成已完工、已通車或可立即使用。\n3. 規劃中的路線、車站或站址若尚未經主管機關正式核定，必須註明「路線／站址尚未定案」；不得以確定語氣稱為「捷運站」或「預定站」，也不得宣稱步行分鐘數、距離、完工日期或通車日期。興建中的完工或通車時程僅能引用官方公告，並註明可能調整，不得保證。\n4. 物件面積須依權狀、謄本或可查證資料呈現，並清楚區分主建物、附屬建物、共有部分及車位；不得把公設、車位或無合法依據的增建面積包裝成室內實坪或可使用面積。\n5. 建物用途、土地使用分區、可否作住宅、營業、分割、改建或增建，須符合登記謄本、使用執照及主管機關規定；不得把工業、商業或其他非住宅用途誤導為合法住宅，也不得保證未來可變更用途。\n6. 學區、生活機能、道路距離、步行或車程時間須有可查證依據；若呈現距離或時間，須交代起訖點及衡量方式，不得以未確認資料宣稱「明星學區」「捷運幾分鐘」或「永久景觀」。\n7. 價格、原價、折扣、最低價、租金收益、投報率、增值性及稀有性須有客觀證據；不得使用「保證增值、穩賺、絕對最低價、唯一釋出、保證入學、零風險」等無法證明或保證結果的字句。\n8. 照片、格局圖、位置圖、示意圖及AI生成圖不得與實際物件或合法圖說不符。物件照片只能調整明亮度、白平衡、色調、對比與飽和度，不得移除瑕疵、改變建築外觀、室內格局、空間比例、固定設施、窗外景觀或周邊環境；示意內容須清楚標示「示意圖」。\n9. 不得隱匿足以影響交易判斷的重要資訊；聯絡人、經紀業名稱、經紀人及證號等資料，僅依使用者提供內容原樣呈現，不得自行補造。\n10. 輸出前逐項核對物件資料、圖片與官方資料；有疑義一律寫「待確認」，並提醒發布者於刊登前依權狀、謄本、使用執照、主管機關公告及個案事實完成人工查核。`;
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
            <p className="max-w-[130px] text-right text-[8px] leading-tight text-white/35 sm:max-w-none sm:text-[9px]">
              2026@All Rights Reserved by 黃立鈞
            </p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1480px] px-4 py-6 md:px-8 md:py-9">
        <section className="hero-intro mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="hero-kicker mb-2 flex items-center gap-2 text-sm font-bold text-[#ffd633]">
              <Sparkles className="size-4" />
              五個步驟，完成可直接使用的提示詞
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
            <Tabs value={mode} onValueChange={changeMode} className="mode-tabs mb-6">
              <TabsList className="mode-tabs-list grid h-auto w-full grid-cols-1 gap-3 rounded-2xl bg-transparent p-0 sm:grid-cols-2">
                <TabsTrigger
                  value="copy"
                  className="mode-trigger group h-auto min-h-28 items-start justify-start rounded-2xl border-2 border-black/15 bg-[#f7f7f7] p-4 text-left shadow-none transition-all hover:border-[#e00000] hover:bg-[#fff7d6] data-[state=active]:border-[#111111] data-[state=active]:bg-[#e00000] data-[state=active]:shadow-[0_0_0_3px_#ffd633,0_14px_32px_rgba(0,0,0,.2)]"
                >
                  <span className="mode-icon grid size-11 shrink-0 place-items-center rounded-xl bg-[#111111] text-[#ffd633] group-data-[state=active]:bg-[#ffd633] group-data-[state=active]:text-[#111111]">
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
                    <span className="mode-desc mt-1.5 block whitespace-normal text-sm font-normal leading-6 text-[#555555] group-data-[state=active]:text-white/90 sm:text-[15px]">
                      適合591物件介紹、Facebook、LINE、商圈貼文及短影音腳本
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="mode-trigger group h-auto min-h-28 items-start justify-start rounded-2xl border-2 border-black/15 bg-[#f7f7f7] p-4 text-left shadow-none transition-all hover:border-[#e00000] hover:bg-[#fff7d6] data-[state=active]:border-[#111111] data-[state=active]:bg-[#e00000] data-[state=active]:shadow-[0_0_0_3px_#ffd633,0_14px_32px_rgba(0,0,0,.2)]"
                >
                  <span className="mode-icon grid size-11 shrink-0 place-items-center rounded-xl bg-[#111111] text-[#ffd633] group-data-[state=active]:bg-[#ffd633] group-data-[state=active]:text-[#111111]">
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
                    <span className="mode-desc mt-1.5 block whitespace-normal text-sm font-normal leading-6 text-[#555555] group-data-[state=active]:text-white/90 sm:text-[15px]">
                      適合房仲海報、社群首圖、廣告DM、專任委託及開放賞屋
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
                    : "選擇圖像情境／使用用途"}
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
                <h3 className="font-black text-[#171717]">貼上物件資料</h3>
                <p className="text-xs text-[#666666]">
                  直接貼上公司系統產生的完整物件資料即可
                </p>
              </div>
            </div>
            <label className="block">
              <span className="field-label">物件資料</span>
              <Textarea
                value={data.propertyData}
                onChange={(e) => setField("propertyData", e.target.value)}
                placeholder={
                  "請在這裡貼上完整物件資料，例如：\n物件名稱、地點、總價、坪數、格局、樓層、屋齡、車位、特色、生活機能、交通條件及應揭露事項等。"
                }
                className="min-h-72 rounded-2xl border-2 border-black/15 bg-white p-4 leading-7 text-[#171717] placeholder:text-[#777777] md:min-h-80"
              />
            </label>
            <div className="flex flex-col">
              <section className="order-2 mt-4 rounded-2xl border-2 border-black/10 bg-[#fffdf5] p-5">
                <div className="flex items-center gap-3">
                  <span className="step">4</span>
                  <div>
                    <h3 className="font-black text-[#171717]">聯絡人與經紀業資料</h3>
                    <p className="text-xs text-[#666666]">資料會記住在這台裝置，下次自動帶入</p>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#e00000]/25 bg-[#fff3a6] px-3 py-2 text-[10px] leading-4 text-[#333333]">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#e00000]" />
                  <span>
                    修改後會自動記錄在這台裝置的瀏覽器，下次開啟時優先使用；不會影響其他使用者。
                  </span>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {[
                    ["contactName", "姓名"],
                    ["phone", "電話"],
                    ["brand", "品牌名稱"],
                    ["branch", "加盟店名稱"],
                    ["company", "經紀業名稱"],
                    ["address", "營業地址"],
                    ["broker", "經紀人"],
                    ["license", "經紀人證號"],
                  ].map(([key, label]) => (
                    <label key={key}>
                      <span className="field-label">{label}</span>
                      <Input
                        value={data[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        className="h-9 rounded-lg border-black/15 bg-white text-sm text-[#171717]"
                      />
                    </label>
                  ))}
                </div>
              </section>
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
                    <label>
                      <span className="field-label">視覺風格</span>
                      <Input
                        value={data.style}
                        onChange={(e) => setField("style", e.target.value)}
                        placeholder="例：專業、溫馨、現代、清楚、可信任、科技"
                        className="border-black/15 bg-white text-[#171717]"
                      />
                    </label>
                    <label>
                      <span className="field-label">品牌配色</span>
                      <Input
                        value={data.colors}
                        onChange={(e) => setField("colors", e.target.value)}
                        placeholder="例：紅、綠＋黃、深藍色＋金／古銅、黑灰＋明亮霓虹"
                        className="border-black/15 bg-white text-[#171717]"
                      />
                    </label>
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
            </div>
          </section>
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="overflow-hidden rounded-[28px] border-4 border-[#111111] bg-[#ffd6df] text-[#27171a] shadow-[0_22px_70px_rgba(50,0,0,.34)]">
              <div className="flex items-center justify-between border-b-2 border-[#e00000]/25 bg-[#ffc1ce] px-5 py-5 md:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-[#e00000] font-black text-white shadow-[0_0_0_3px_#ffd633]">
                    5
                  </span>
                  <div>
                    <h3 className="font-black">完整提示詞</h3>
                    <p className="text-xs text-[#6f3944]">
                      內容會隨左側資料即時更新
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
