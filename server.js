const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("Servidor IA activado 🚀");
});

// CHAT
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  console.log("MENSAJE RECIBIDO:", message);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente de apoyo emocional. Tu objetivo es escuchar, comprender y responder con empatía. Habla de forma calmada, cercana y sin juzgar. Ayuda a la persona a expresar lo que siente y ofrece apoyo emocional práctico cuando sea necesario. Responde de forma humana, breve y cálida. No des juicios ni regaños."
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No pude generar respuesta";

    res.json({ reply });

  } catch (error) {
    console.log("ERROR:", error);
    res.json({ reply: "Error en servidor" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});