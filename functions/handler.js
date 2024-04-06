// functions/handler.js
const Pusher = require('pusher');

// Initialize Pusher
const pusher = new Pusher({
  appId: "1783030",    // Replace with your Pusher `appId`
  key: "49730284d9a95184d68b",     // Replace with your Pusher `key`
  secret: "50ff5dd3169bf8806bf7", // Replace with your Pusher `secret`
  cluster: "ap2", // Replace with your Pusher `cluster`
  useTLS: true
});

exports.handler = async (event) => {
  // Handle GET request
  if (event.httpMethod === "GET") {
    // Handle the GET request logic here
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'GET request received' })
    };
  }
  
  // Handle POST request
  if (event.httpMethod === "POST") {
    // Handle the POST request logic here
    const { message } = JSON.parse(event.body);
    pusher.trigger('notification-channel', 'new-notification', { message });
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent' })
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'Unsupported HTTP method' })
  };
};
