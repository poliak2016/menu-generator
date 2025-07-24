require('dotenv').config();
const express = require('express');
const cors = require('cors')
const   OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post ('/api/menu', async (req, res) => {
  const {guests, days, cuisine, preference} = req.body;

  if(!guests || !days || !cuisine){
    return res.status(400).send("Brakuje wymaganych danych.")
  }

  const prompt = `
 Jesteś profesjonalnym kucharzem. Stwórz tygodniowe menu dla ${guests} gości.
Typ kuchni: ${cuisine}
Szczególne wymagania: ${preference || "brak"}
Wymagania:
- codziennie śniadanie, obiad i kolacja,
- równowaga dań mięsnych, rybnych i warzywnych,
- żadna potrawa nie może się powtarzać więcej niż dwa razy.
Zwróć wynik w formacie tekstowym, czytelnym dla człowieka.
`; 
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{role: 'user', content: prompt}],
      temperature: 0.7
    });
    res.send(completion.choices[0].message.content);
  } catch (err) {
    console.error('Błąd:', err);
    res.status(500).send("Błąd podczas generowania menu.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`)
});