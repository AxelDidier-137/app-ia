import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  console.log("📩 MENSAJE:", message);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Eres un asistente útil, amable y preciso."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log("🔥 STATUS GROQ:", response.status);

    if (!response.ok) {
      console.log("🔥 RESPUESTA GROQ:", JSON.stringify(data));
      return res.status(500).json({
        reply: "Error del servidor de IA"
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({
      reply: "Error de conexión"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT} 🚀`);
});