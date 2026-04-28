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
    client: "לקוח בתחום AgriTech (חסוי תחת NDA)",
    year: "2024",
    duration: "4 חודשים",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
    heroTag: "IoT · אלקטרוניקה · אוטומציה",
    overview: {
      challenge: {
        title: "האתגר",
        text: "ניטור ידני של מערך חממות גדול, ללא התראות בזמן אמת על תקלות מערכת השקיה ואקלים — אובדן יבול בודד עלול לעלות עשרות אלפי שקלים",
      },
      solution: {
        title: "הפתרון",
        text: "רשת חיישנים אלחוטיים מבוססת LoRa עם PCB מותאמת, תיקי IP65 ודשבורד ענן לניטור ובקרה מלאה",
      },
      result: {
        title: "התוצאה",
        text: "מערכת שעובדת בשטח כבר יותר משנה ברציפות. מתריעה ב-WhatsApp תוך דקות, סוללות מחזיקות לפי התכנון",
      },
    },
    problem: {
      title: "כשמשק של מאות דונם מנוהל עם פתקים",
      paragraphs: [
        "מנהל המשק שיתף שנים את אותה תחושה — כל בוקר שני פועלים יוצאים לסבב ידני בין החממות לבדוק טמפרטורה, לחות ומצב מערכות השקיה. ״ידני זה גם טעות אנוש וגם זמן אבוד״, הוא תיאר.",
        "אירוע יבול שאבד בלילה במהלך הקיץ — מזגן שקרס בשעה שלוש לפנות בוקר ואיש לא ידע — היה הרגע שבו ההחלטה התקבלה: צריך מערכת שמתריעה לפני שהנזק נוצר.",
        'הדרישה הייתה ברורה: התראה ב-WhatsApp תוך דקות מכל אירוע חריג, סוללה לפחות שנתיים, ועבודה ללא תלות ב-WiFi בכל חממה — כי בשדה פשוט אין.',
      ],
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
      imageCaption: "אחת החממות באתר הלקוח לפני ההתקנה",
    },
    steps: [
      {
        number: 1,
        title: "ניתוח שטח ומיפוי דרישות",
        description:
          "ביקור באתר, מדידת מרחקים, זיהוי נקודות עיוורות בקליטה ומיפוי פרמטרי הניטור הקריטיים לכל חממה — טמפרטורה, לחות, CO₂ ומצב השקיה.",
      },
      {
        number: 2,
        title: "עיצוב PCB מותאמת",
        description:
          "תכנון לוח בקרה מרכזי ולוחות חיישן עצמאיים ב-KiCad. מיקרו-בקר ESP32-S3 עם מודול LoRa SX1276 לטווח של עד 15 ק״מ ברדיוס בקו ישיר.",
      },
      {
        number: 3,
        title: "פיתוח Firmware ותקשורת",
        description:
          "כתיבת Firmware ב-C++ עם מנגנון sleep חכם — צריכה של עשרות מיקרו-אמפרים במנוחה. פרוטוקול MQTT מעל LoRaWAN עם הצפנת AES-128 מקצה לקצה.",
      },
      {
        number: 4,
        title: "תכנון תיק IP65 ואינטגרציה",
        description:
          "מודלינג ב-SolidWorks של תיק אטום לאבק ולחות. הדפסת אב-טיפוס, בדיקות עמידות עד 60°C, ייצור סדרת ייצור ב-PETG-CF.",
      },
      {
        number: 5,
        title: "התקנה, כיול ומסירה",
        description:
          "התקנה מלאה של החיישנים ביום אחד, כיול מול מד ייחוס מוסמך, הדרכת צוות ותמיכה כלולה לחודש הראשון.",
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
          "ארכיטקטורת mesh עם נקודות ממסר (repeater) שמאפשרת כיסוי גם מאחורי מבנים ועד 15 ק״מ ברדיוס",
      },
      {
        problem: "עמידות לחום — חממות מגיעות ל-55°C בקיץ",
        solution:
          "בחירת רכיבים מסדרה industrial (−40°C עד +85°C), כולל קבלים tantalum ומחברים עם נעילה תרמית",
      },
      {
        problem: "חיי סוללה — דרישת הלקוח: שנתיים ללא טעינה",
        solution:
          "Sleep Mode אגרסיבי: ערות 4 שניות כל 15 דקות. צריכה ממוצעת בעשרות מיקרו-אמפרים — תחזית של 2.4 שנות פעולה",
      },
    ],
    stats: [],
    quote: {
      text: "",
      author: "",
      role: "",
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
      "איך פיתחנו רשת IoT לחממות חקלאיות — PCB מותאמת, LoRa, תיק IP65 ושנה בשטח ללא תקלות.",
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
