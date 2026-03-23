export interface ProjectStep {
  number: number;
  title: string;
  description: string;
}

export interface ProjectStat {
  value: string;
  suffix: string;
  label: string;
}

export interface ProjectChallenge {
  problem: string;
  solution: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  wide: boolean;
}

export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: string;
  duration: string;
  heroImage: string;
  heroTag: string;
  overview: {
    challenge: { title: string; text: string };
    solution: { title: string; text: string };
    result: { title: string; text: string };
  };
  problem: {
    title: string;
    paragraphs: string[];
    image: string;
    imageCaption: string;
  };
  steps: ProjectStep[];
  gallery: GalleryImage[];
  challenges: ProjectChallenge[];
  stats: ProjectStat[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
  tech: string[];
  ogDescription: string;
}

export const projects: ProjectData[] = [
  {
    slug: "greenhouse-iot",
    title: "מערכת ניטור חכמה לחממות חקלאיות",
    subtitle: "IoT · PCB מותאמת · תיק IP65",
    category: "אלקטרוניקה ואוטומציה",
    client: "אגרו-מאיר בע״מ",
    year: "2024",
    duration: "4 חודשים",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
    heroTag: "IoT · אלקטרוניקה · אוטומציה",
    overview: {
      challenge: {
        title: "האתגר",
        text: "ניטור ידני של 8 חממות, אובדן יבולים בשל היעדר התראות בזמן אמת, ובזבוז של אלפי מ״ק מים בשנה",
      },
      solution: {
        title: "הפתרון",
        text: "רשת חיישנים אלחוטיים מבוססת LoRa עם PCB מותאמת, תיקי IP65 ודשבורד ענן לניטור ובקרה מלאה",
      },
      result: {
        title: "התוצאה",
        text: "38% חיסכון במים, אפס אירועי נזק ב-12 חודשים, החזר השקעה מלא תוך 8 חודשים",
      },
    },
    problem: {
      title: "כשמשק של 200 דונם מנוהל עם פתקים",
      paragraphs: [
        "יוסי מאיר מנהל 8 חממות מסחריות בשרון. שנים הוא ידע שמשהו לא עובד — כל בוקר הוא שלח שניים מהפועלים לסבב ולבדוק ידנית טמפרטורות, לחות ומערכות השקיה. ״ידני זה גם טעות אנוש וגם זמן אבוד״, הסביר.",
        "בקיץ 2023 אבד יבול של עגבניות שלם בחממה מס׳ 3 — מזגן קרס בלילה, אף אחד לא ידע. הנזק: כ-180 אלף שקל. זה היה הרגע שיוסי החליט שמשהו חייב להשתנות.",
        'הדרישה שלו הייתה ברורה: מערכת שתתריע ב-WhatsApp תוך דקות מכל אירוע חריג, שתעבוד על סוללה לפחות שנתיים, ושלא תדרוש חיבור WiFi בכל חממה — כי בשדה פשוט אין.',
      ],
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
      imageCaption: "אחת מ-8 החממות של אגרו-מאיר לפני ההתקנה",
    },
    steps: [
      {
        number: 1,
        title: "ניתוח שטח ומיפוי דרישות",
        description:
          "ביקור בחוות, מדידת מרחקים, זיהוי נקודות עיוורות בקליטה ומיפוי פרמטרי הניטור הקריטיים לכל חממה — טמפרטורה, לחות, CO₂ ומצב השקיה.",
      },
      {
        number: 2,
        title: "עיצוב PCB מותאמת",
        description:
          "תכנון לוח בקרה מרכזי ו-24 לוחות חיישן עצמאיים ב-KiCad. מיקרו-בקר ESP32-S3 עם מודול LoRa SX1276 לטווח של עד 15 ק״מ ברדיוס.",
      },
      {
        number: 3,
        title: "פיתוח Firmware ותקשורת",
        description:
          "כתיבת Firmware ב-C++ עם מנגנון sleep חכם — צריכה של 12μA במנוחה. פרוטוקול MQTT מעל LoRaWAN עם הצפנת AES-128 מקצה לקצה.",
      },
      {
        number: 4,
        title: "תכנון תיק IP65 ואינטגרציה",
        description:
          "מודלינג ב-SolidWorks של תיק אטום לאבק ולחות. הדפסת אב-טיפוס, בדיקות עמידות עד 60°C, ייצור סדרה של 24 יחידות ב-PETG-CF.",
      },
      {
        number: 5,
        title: "התקנה, כיול ומסירה",
        description:
          "התקנה מלאה של 24 חיישנים ב-8 חממות תוך יום אחד. כיול מול מד ייחוס מוסמך, הדרכת צוות ותמיכה כלולה לחודש הראשון.",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
        caption: "תהליך עיצוב PCB ב-KiCad",
        wide: true,
      },
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        caption: "לוח PCB מוגמר לפני הלחמה",
        wide: false,
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
        caption: "רכיבים SMD לאחר הלחמה",
        wide: false,
      },
      {
        src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
        caption: "בדיקות bench לפני האינטגרציה",
        wide: true,
      },
    ],
    challenges: [
      {
        problem: "טווח קליטה — מבנים חוסמים אות בין החממות",
        solution:
          "ארכיטקטורת mesh עם 3 נקודות ממסר (repeater) שמאפשרת כיסוי גם מאחורי מבנים ועד 15 ק״מ ברדיוס",
      },
      {
        problem: "עמידות לחום — חממות מגיעות ל-55°C בקיץ",
        solution:
          "בחירת רכיבים מסדרה industrial (−40°C עד +85°C), כולל קבלים tantalum ומחברים עם נעילה תרמית",
      },
      {
        problem: "חיי סוללה — הלקוח דרש שנתיים ללא טעינה",
        solution:
          "Sleep Mode אגרסיבי: ערות 4 שניות כל 15 דקות. צריכה ממוצעת 18μA — תחזית של 2.4 שנות פעולה",
      },
    ],
    stats: [
      { value: "38", suffix: "%", label: "חיסכון במים בשנה הראשונה" },
      { value: "0", suffix: "", label: "אירועי נזק ב-12 חודשים מאז ההתקנה" },
      { value: "8", suffix: " חודשים", label: "זמן להחזר השקעה מלא" },
      { value: "24", suffix: "", label: "חיישנים ב-8 חממות פועלים ברציפות" },
    ],
    quote: {
      text: "תוך שבוע מההתקנה, הבנו שחסכנו כבר את עלות הפרויקט. היום אני שומע על בעיה בחממה לפני שהפועלים מגיעים לעבודה.",
      author: "יוסי מאיר",
      role: 'מנכ״ל אגרו-מאיר בע״מ',
    },
    tech: [
      "KiCad",
      "ESP32-S3",
      "LoRa SX1276",
      "SolidWorks",
      "C++ / FreeRTOS",
      "Python",
      "React Dashboard",
      "MQTT",
      "IP65 Enclosure",
      "PETG-CF",
    ],
    ogDescription:
      "איך פיתחנו רשת IoT ל-8 חממות שחוסכת 38% מים ומונעת נזקי יבול — PCB מותאמת, LoRa, ותיק IP65.",
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
