const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API Key y modelo de Hugging Face
const API_KEY = "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";
const MODEL_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    const prompt = message;

    try {
        const response = await axios.post(
            MODEL_URL,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Respuesta completa del modelo:", response.data);

        // Manejar la respuesta del modelo
        if (Array.isArray(response.data) && response.data[0]?.generated_text) {
            const reply = response.data[0].generated_text;
            res.json({ reply });
        } else if (response.data?.generated_text) {
            res.json({ reply: response.data.generated_text });
        } else {
            res.json({ reply: "No se recibió respuesta válida del modelo." });
        }
    } catch (error) {
        console.error("Error al interactuar con Hugging Face:", error.response?.data || error.message);
        res.status(500).json({ error: "Error al procesar la solicitud en el backend." });
    }
});


// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
