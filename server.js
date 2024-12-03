const express = require("express");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Configurar o Express para servir arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Middleware para processar JSON no body das requisições
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem não pode estar vazia." });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Você é um assistente de idiomas que está me ajudando com o Inglês. Então você responderá sempre em inglês.",
    });

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 100 },
    });

    const result = await chat.sendMessage(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar mensagem." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
