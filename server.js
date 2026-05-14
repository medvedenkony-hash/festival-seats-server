const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();
const PORT = 3000;
const FILE = "seats.json";

app.use(cors());
app.use(express.json());

// получить все места
app.get("/seats", async (req, res) => {
  const data = await fs.readJson(FILE);
  res.json(data);
});

// купить места
app.post("/buy", async (req, res) => {
  const { name, phone, seats } = req.body;

  let data = await fs.readJson(FILE);

  // проверка занятости
  for (let seat of seats) {
    if (data[seat]) {
      return res.status(400).json({ message: "Место уже занято: " + seat });
    }
  }

  // сохраняем
  for (let seat of seats) {
    data[seat] = { name, phone };
  }

  await fs.writeJson(FILE, data, { spaces: 2 });

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Сервер запущен на http://localhost:" + PORT);
});