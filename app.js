const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

let data = require('./data.json');

app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('/api/allData', (req, res) => {
  const allData = {
    data: data
  };
  res.json(allData);
});

app.get('/api/userData', (req, res) => {
  const userData = fs.readFileSync('./data.json', 'utf-8');
  res.send(userData);
});
//try
app.get('/api/cookieData', (req, res) => {
  const cookieData = fs.readFileSync('./cookie.json', 'utf-8');
  res.send(cookieData);
}); 

app.post('/api/add', (req, res) => {
  const { uid } = req.body;

  if (uid) {
    data.ChatWithAiOfficialUserIDs.push(uid);
    updateJsonFile(data, './data.json');
    res.json({ success: true, message: 'User ID added successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid request. Provide a valid user ID.' });
  }
});

app.post('/api/delete', (req, res) => {
  const { uid } = req.body;

  if (uid) {
    data.ChatWithAiOfficialUserIDs = data.ChatWithAiOfficialUserIDs.filter(id => id !== uid);
    updateJsonFile(data, './data.json');
    res.json({ success: true, message: 'User ID deleted successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid request. Provide a valid user ID.' });
  }
});

// New endpoint to handle file upload and replace cookie.json
app.post('/api/upload', upload.single('cookieFile'), (req, res) => {
  const { path: tempFilePath, originalname } = req.file;

  if (originalname && originalname.toLowerCase() === 'cookie.json') {
    const newCookieData = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));
    updateJsonFile(newCookieData, './cookie.json');
    res.json({ success: true, message: 'Cookie data uploaded and replaced successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid file. Please upload a valid cookie.json file.' });
  }
});

function updateJsonFile(jsonData, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`\nDEVELOP BY: REJARDGWAPO`);
});