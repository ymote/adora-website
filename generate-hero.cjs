const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.1-flash-image-preview";
const OUT_DIR = path.join(__dirname, "public", "images");

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `Create a 1920x1080 landscape hero background image for a robotics framework website.

Art direction: Renaissance Da Vinci composition principles (golden ratio, Vitruvian proportions, radial symmetry from a focal point) — BUT rendered in modern minimalist line art. Think Leonardo's notebook sketches reimagined as a modern tech wireframe.

Visual elements:
- Thin mono-weight line drawings of interconnected nodes (representing a dataflow graph — sensors, processors, actuators)
- Golden ratio spiral subtly guiding the composition
- Concentric circles suggesting Vitruvian proportion study
- Geometric construction lines (like Da Vinci's engineering sketches)
- Small constellation-like dots connected by delicate lines (data flowing between nodes)
- Abstract circuit-like paths that feel organic, not rigid

Color palette:
- Deep charcoal-black background (#0A0A0F to #12121A gradient)
- Lines in teal (#00D4AA) at very low opacity (10-20%)
- Accent touches of amber (#FFB84D) at 5-10% opacity
- Faint indigo (#4A4AFF) hints

Composition rules:
- 大量留白 (generous whitespace) — center-left area must be completely empty for text overlay
- Visual elements concentrated in the top-right and bottom-left corners (Renaissance diagonal)
- Very subtle and ethereal — this is a background, not a foreground illustration
- Abstract and aesthetic, NOT literal robotics imagery (no robot arms, no gears)
- The feel should be: intellectual, elegant, precise, like opening a Da Vinci codex in a dark room

ABSOLUTELY NO TEXT, no words, no letters, no numbers, no labels.`;

async function generateHero() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, "hero-bg.png");

  console.log("Generating hero image with Gemini...");

  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: "user", parts: [{ text: PROMPT }] }],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`Hero image saved: ${outFile} (${(buf.length / 1024).toFixed(0)}KB)`);
          return outFile;
        }
      }
      throw new Error("No image data in response");
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        const waitSec = 60 * (attempt + 1);
        console.log(`Rate limited, waiting ${waitSec}s (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await new Promise((r) => setTimeout(r, waitSec * 1000));
      } else {
        console.error(`Error: ${msg.slice(0, 300)}`);
        if (attempt < MAX_RETRIES - 1) {
          console.log(`Retrying (${attempt + 2}/${MAX_RETRIES})...`);
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }
  }
  console.error("Failed after retries");
  return null;
}

generateHero();
