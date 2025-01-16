const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Route to handle the AI request
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Prepare the input data for the Python script
  const inputData = userMessage

  // Spawn a new Python process and pass the input data
  const pythonProcess = spawn('python', ['main.py']);

  // Send the input data to the Python script via stdin
  pythonProcess.stdin.write(inputData);
  pythonProcess.stdin.end();

  // Capture the output from the Python script
  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  // Handle Python process errors
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // On Python process close, send the response back to the client
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Failed to execute Python script" });
    }

    // Parse the JSON response from the Python script and send it to the client
    try {
      const response = JSON.parse(output);
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: "Failed to parse Python response" });
    }
  });
});




// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/* The main issue with the express server is that we are getting an eof issue where the main.py which consist the agent
funtionality but takes input from the command line (example: response=input() ), when we try to create a subprocess
and run python in the subprocess we are getting a end of line issue
*/


//Author Darshan K