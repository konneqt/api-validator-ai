require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/process', async (req, res) => {
  try {
    const openapiSpec = req.body.openapi;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `
Avalie o seguinte open api spec, aponte falhas de formatação, e também violações de Owasp API top 10, aponte a nota e as linhas de código de cada ocorrência, e o que fazer para consertar:

\`\`\`yaml
${openapiSpec}
\`\`\`
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    //console.log("✅ Resposta do Gemini:", response);

    res.json({ output: response });
  } catch (err) {
    console.error('Erro ao chamar Gemini:', err);
    res.status(500).json({ error: 'Erro ao processar OpenAPI Spec' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
