const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const app = express();
app.use(bodyParser.json());

// Initialize Pusher
const pusher = new Pusher({
  appId: "1783030",    // Replace with your Pusher `appId`
  key: "49730284d9a95184d68b",     // Replace with your Pusher `key`
  secret: "50ff5dd3169bf8806bf7", // Replace with your Pusher `secret`
  cluster: "ap2", // Replace with your Pusher `cluster`
  useTLS: true
});

// Endpoint to trigger notifications
app.post('/notify', (req, res) => {
  const { message } = req.body;
  pusher.trigger('notification-channel', 'new-notification', {
    message
  });
  res.json({ message: 'Notification sent' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
