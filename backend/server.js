
const express = require('express');
const bodyParser = require('body-parser');
const {OpenAI } = require('openai');
require('dotenv').config();
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');


const mongoUri = 'mongodb://localhost:27017/?appName=MongoDB+Compass&directConnection=true&serverSelectionTimeoutMS=2000';
const dbName = 'PMAITryouts';

const app = express();
const port = 5000;


// Middleware to parse JSON
app.use(bodyParser.json());

// Configure OpenAI API
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

// Endpoint to get OpenAI response
app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Replace with 'gpt-4' if required
        messages: [{ role: 'user', content: prompt }],
      });

      const aiResponse = response.choices[0].message.content; 
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 16 * 1024 * 1024 } }); // 16 MB limit

// MongoDB Client
let db;

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error(error));

// API to upload file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileData = {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    file: req.file.buffer, // Store the file as binary data
    uploadDate: new Date(),
  };

  db.collection('files')
    .insertOne(fileData)
    .then(result => {
      res.status(200).json({ message: 'File uploaded successfully', fileId: result.insertedId });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Failed to upload file');
    });
});

// API to download file by ID
app.get('/download/:id', (req, res) => {
  const fileId = req.params.id;

  db.collection('files')
    .findOne({ _id: new ObjectId(fileId) })
    .then(file => {
      if (!file) {
        return res.status(404).send('File not found');
      }

      res.setHeader('Content-Type', file.contentType);
      res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
      res.send(file.file);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving file');
    });
});

//Api to fetch all files  stored

app.get('/files', (req, res) => {
  db.collection('files')
    .find({}, { projection: { filename: 1, _id: 1 } }) // Project only filename and _id
    .toArray()
    .then(files => {
      if (files.length === 0) {
        return res.status(404).send('No files found');
      }

      res.status(200).json(files); // Return the list of files
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving files');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


