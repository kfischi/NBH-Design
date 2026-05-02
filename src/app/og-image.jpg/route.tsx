/**
 * GET /og-image.jpg
 *
 * Dynamic Open Graph image (1200×630) for the site. Replaces a missing
 * static `/og-image.jpg` so social shares stop 404-ing.
 *
 * Brand-gradient panel with the Proto-Model mark + Hebrew title. Heebo is loaded
 * at request time from Google's CSS endpoint; if the fetch fails we still
 * render — Hebrew text just falls back to the default sans-serif.
 *
 * Cached for 1 hour.
 */

import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = 3600;

const HEBREW_GLYPHS =
  "Proto-Modelהנדסה רב־תחומיתמכניקה אלקטרוניקה אוטומציהתחת קורת גג אחתזמין לפרויקטים חדשיםgivat-haim israelproto-model.commultidisciplinary product engineeringמחלום למציאותPM·";

async function loadHeebo(weight: 400 | 800): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Heebo:wght@${weight}&text=${encodeURIComponent(HEBREW_GLYPHS)}&display=swap`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        // Force the modern CSS that returns ttf/otf URLs satori can render.
        "User-Agent":
          "Mozilla/5.0 (compatible; NextJSImageResponse/1.0) AppleWebKit/537.36",
      },
    });
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const match = css.match(
      /url\((https:\/\/[^)]+)\)\s*format\(['"]?(?:truetype|opentype)['"]?\)/,
    );
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(): Promise<Response> {
  const [bold, regular] = await Promise.all([loadHeebo(800), loadHeebo(400)]);

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    style: "normal";
    weight: 400 | 800;
  }> = [];
  if (bold) fonts.push({ name: "Heebo", data: bold, style: "normal", weight: 800 });
  if (regular) fonts.push({ name: "Heebo", data: regular, style: "normal", weight: 400 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundImage:
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 130%)",
          color: "#ffffff",
          fontFamily: "Heebo",
          position: "relative",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0))",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -250,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(6,182,212,0.35), rgba(6,182,212,0))",
            display: "flex",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              PM
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  opacity: 0.92,
                }}
              >
                Proto-Model
              </span>
              <span style={{ fontSize: 18, opacity: 0.78, fontWeight: 400 }}>
                מחלום למציאות
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.3)",
              fontSize: 18,
              fontWeight: 700,
              display: "flex",
            }}
          >
            givat-haim · israel
          </div>
        </div>

        {/* Center headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            position: "relative",
            alignItems: "flex-end",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 96,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -2,
              maxWidth: 1000,
              textAlign: "right",
            }}
          >
            הנדסה רב־תחומית
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 400,
              opacity: 0.94,
              textAlign: "right",
              maxWidth: 980,
            }}
          >
            מכניקה · אלקטרוניקה · אוטומציה — תחת קורת גג אחת
          </p>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            fontSize: 22,
            fontWeight: 700,
            opacity: 0.92,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: "#34d399",
                display: "flex",
              }}
            />
            זמין לפרויקטים חדשים
          </span>
          <span>proto-model.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  );
}
