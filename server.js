import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI reflection endpoint
app.post('/reflect', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a gentle, poetic, and compassionate guide in a reflective library.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reflection = completion.choices[0].message.content.trim();
    res.json({ reflection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get reflection.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mirror Library backend running on port ${port}`);
});
