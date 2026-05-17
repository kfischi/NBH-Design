/**
 * Real Proto-Model projects — single source of truth for both the listing
 * (CaseStudies bento) and the detail pages (`/projects/[slug]`).
 *
 * Photos: when a `coverPhoto` filename is set, expect the file at
 * `public/projects/photos/{filename}`. Missing files render a brand-gradient
 * fallback — no broken images.
 */

export type ProjectCategory =
  | "defense"
  | "medical"
  | "agritech"
  | "innovation"
  | "design"
  | "electronics";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  problem: string;
  thinking: string;
  solution: string;
  result: string;
  tags: string[];
  coverPhoto: string | null;
  featured: boolean;
  timeToPrototype?: string;
  hasVideo: boolean;
  altText?: string;
}

export const projects: Project[] = [
  {
    slug: "parkinson-straw",
    title: "קשית לחולי פרקינסון",
    category: "medical",
    categoryLabel: "רפואי",
    problem:
      "רעד בלתי נשלט הופך שתייה לאתגר יומיומי עבור חולי פרקינסון. אין מוצר מסחרי שנותן מענה אמיתי — רוב הפתרונות הקיימים כבדים, מסורבלים, ולא עובדים עם כוסות רגילות.",
    thinking:
      "האתגר ההנדסי המרכזי: המנגנון חייב להיות קל ועמיד בו-זמנית, לשמור על זווית יציבה גם כשהיד רועדת, ולעבוד עם כל סוג כוס. הפתרון חייב לגרום לאדם להרגיש כבוד — לא נכה עם ציוד עזר.",
    solution:
      "קשית עם מנגנון ייצוב מכני מודפס בתלת-מימד — מיישר אוטומטית לזווית שתייה אופטימלית ללא קשר לזווית הכוס. מתאים לכל כוס סטנדרטית. קל, ניתן לניקוי, ייצור בעלות נגישה.",
    result:
      "מוצר פונקציונלי שמחזיר עצמאות בפעולה יומיומית בסיסית. אב-טיפוס עבד מהסבב הראשון. מתאים לייצור המוני.",
    tags: ["הדפסת 3D", "רפואי", "עיצוב מוצר", "הומניטרי", "PLA+"],
    coverPhoto: null,
    featured: true,
    timeToPrototype: "48 שעות",
    hasVideo: true,
    altText: "קשית מייצבת לחולי פרקינסון — עיצוב מוצר מודפס תלת-מימד",
  },
  {
    slug: "crowd-control-device",
    title: "מתקן עצירת מתפרעים",
    category: "defense",
    categoryLabel: "ביטחוני",
    problem:
      "כוחות ביטחון צריכים פתרון מכני מהיר ואמין להכלת מצבי קיצון — מוצר שעובד בלחץ, עמיד בתנאי שדה קשים, ולא מסכן את המשתמש.",
    thinking:
      "עיצוב ביטחוני חייב לעבור ניתוח כישלונות (FMEA) לפני כל דבר אחר. מה קורה אם המנגנון נתקע? מה קורה בחום / קור קיצוני? האם יש סיכון לנפילה בעת שימוש? כל תרחיש חייב פתרון.",
    solution:
      "מתקן מכני מהנדס לביצועים בשדה — חומרים תעשייתיים, מנגנון פשוט לתפעול תחת לחץ, בדיקות עומסים מלאות. פותח בשיתוף גורמי ביטחון ועומד בדרישותיהם.",
    result: "מוצר שנבדק ואושר לשימוש מבצעי. מוכח בשטח.",
    tags: ["ביטחוני", "מכניקה", "שדה", "בדיקות עומסים", "FMEA"],
    coverPhoto: null,
    featured: true,
    timeToPrototype: "72 שעות",
    hasVideo: true,
    altText: "מתקן עצירה מכני לשימוש ביטחוני — הנדסה מדויקת לתנאי שדה",
  },
  {
    slug: "irrigation-gear",
    title: "גלגל שיניים לציוד השקיה",
    category: "agritech",
    categoryLabel: "חקלאות",
    problem:
      'גלגל שיניים במנוע pivot השקיה נשבר. חלק OEM לא זמין — זמן אספקה 6 שבועות מחו"ל. השדה עצר. כל יום השבתה = הפסד כספי ישיר.',
    thinking:
      "מדידה של החלק השבור, הנדסה הפוכה מלאה, בחירת חומר שיחזיק בחשיפה לשמש + שמן + עומס ציר חוזר. Nylon PA12 על פני PETG — עמיד יותר בתנאים חיצוניים לטווח ארוך.",
    solution:
      "מדידה → CAD → הדפסה ב-Nylon PA12 — חלק זהה ל-OEM מבחינת מידות, עם שיפור בחוזק. סופק תוך 48 שעות מהפנייה הראשונה.",
    result:
      "Pivot חזר לפעול תוך יומיים. הגלגל המודפס עמד 18+ חודשים בשדה ועוד עובד.",
    tags: ["הנדסה הפוכה", "CAD", "Nylon PA12", "חקלאות", "חלקי חילוף"],
    coverPhoto: "1000426189.jpg",
    featured: false,
    timeToPrototype: "48 שעות",
    hasVideo: false,
    altText: "גלגל שיניים מותאם אישית למתקן השקיה pivot — הדפסת Nylon PA12",
  },
  {
    slug: "toroidal-propeller",
    title: "פרופלור טורואידאלי חדשני",
    category: "innovation",
    categoryLabel: "חדשנות",
    problem:
      "מדחפים סטנדרטיים יוצרים מערבולות קצה כנף שגורמות לרעש, לאיבוד יעילות, ולסכנה בפגיעה בבני אדם. הפתרון הקיים — לא מספיק.",
    thinking:
      'צורה טורואידאלית (טבעת) מבטלת מערבולות קצה על ידי "סגירת" הכנפות. האתגר: לתכנן גיאומטריה שעובדת אווירודינמית ועדיין ניתנת להדפסה בתלת-מימד. כל גרסה דרשה סימולציה + בדיקה פיזית.',
    solution:
      "פרופלור בעיצוב טורואידאלי — שקט יותר (המסגרת המעוגלת מבטלת מערבולות), עמיד יותר (המסגרת מחזקת את המבנה), ולא חותך בשר בפגיעה. פותח ונבדק במספר גרסאות.",
    result:
      "אב-טיפוס עובד — מוכח בשני סרטוני בדיקה. שקט משמעותית ממדחף סטנדרטי. המשך פיתוח בתהליך.",
    tags: ["R&D", "אווירודינמיקה", "חדשנות", "בטיחות", "CAD", "הדפסת 3D"],
    coverPhoto: null,
    featured: true,
    hasVideo: true,
    altText: "פרופלור טורואידאלי — עיצוב חדשני שמבטל מערבולות ומגדיל בטיחות",
  },
  {
    slug: "drone-buggy-connector",
    title: "מתקן חיבור רחפן לבאגי",
    category: "defense",
    categoryLabel: "ביטחוני",
    problem:
      "דרישה צבאית לחיבור מהיר ואמין בין רחפן לרכב קרקעי (באגי). החיבור חייב לסבול עומסים דינמיים, להתנתק בבטחה לפי פקודה, ולעמוד בתנאי שטח.",
    thinking:
      "עיצוב מחבר דינמי: כיצד מטפלים בוויברציות מהמנוע + הבסיס בו-זמנית? בחירת גיאומטריה שמאפשרת תנועה במספר צירים מבלי לאבד קשיחות מבנית.",
    solution:
      "מחבר מכני עם מנגנון quick-release, בידוד ויברציות מובנה, ומסגרת עם חוזק מבנה מכוון. בדיקות עומסים ב-3 צירים. סרט עובד מהמערכת.",
    result: "מערכת פועלת ומוכחת בוידאו. עמדה בכל בדיקות העומסים הנדרשות.",
    tags: ["ביטחוני", "מכניקה", "quick-release", "ויברציות", "בדיקות עומסים"],
    coverPhoto: null,
    featured: false,
    hasVideo: true,
    altText: "מתקן חיבור מכני בין רחפן לרכב קרקעי — הנדסה לתנאי שטח",
  },
  {
    slug: "music-stand-holder",
    title: "מחזיק ציוד לעמוד תווים",
    category: "design",
    categoryLabel: "עיצוב מוצר",
    problem:
      "מוזיקאים צריכים להחזיק ציוד נוסף (מטרונום, טלפון, מיקרופון) על עמוד התווים בזמן הגנה — אין מוצר שמתאים לכל גדלי העמודים ולכל הציוד.",
    thinking:
      "עמודי תווים מגיעים בקוטר שונה — המחזיק חייב להיות אוניברסלי. מנגנון ההידוק חייב להחזיק יציב אבל להתפרק בקלות. 4 גרסאות של חזרות עד לפתרון הנכון.",
    solution:
      "מחזיק מפרקי מודפס תלת-מימד עם מנגנון הידוק אוניברסלי — מתאים לעמודים בקוטר 18-32mm, מחזיק עד 500 גרם. 4 גרסאות שיפור לאורך הפיתוח.",
    result:
      "מוצר פונקציונלי שנבדק על ידי מוזיקאים. ארבעה סרטוני גרסאות מראים את הפיתוח האיטרטיבי.",
    tags: ["עיצוב מוצר", "הדפסת 3D", "מוזיקה", "פיתוח איטרטיבי", "הנדסת צרכן"],
    coverPhoto: null,
    featured: false,
    hasVideo: true,
    altText: "מחזיק ציוד מתכוונן לעמוד תווים — 4 גרסאות פיתוח",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
export const projectsByCategory = (cat: string): Project[] =>
  cat === "all" ? projects : projects.filter((p) => p.category === cat);
