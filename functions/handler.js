// functions/handler.js
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

// Route handler for notification endpoint
exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);
  pusher.trigger('notification-channel', 'new-notification', { message });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notification sent' })
  };
};
