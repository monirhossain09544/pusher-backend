// functions/handler.js
const Pusher = require('pusher');
const { saveMessage, getMessages, deleteMessage } = require('./messages');

// Initialize Pusher
const pusher = new Pusher({
  appId: "1783030", // Replace with your Pusher `appId`
  key: "49730284d9a95184d68b", // Replace with your Pusher `key`
  secret: "50ff5dd3169bf8806bf7", // Replace with your Pusher `secret`
  cluster: "ap2", // Replace with your Pusher `cluster`
  useTLS: true
});

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case "GET":
      // Fetch message history
      const messages = await getMessages();
      return {
        statusCode: 200,
        body: JSON.stringify(messages)
      };

    case "POST":
      // Send message
      const { message, user } = JSON.parse(event.body);
      const messageData = { user, text: message, timestamp: new Date().toISOString() };
      
      // Save the message to FaunaDB
      const savedMessage = await saveMessage(messageData);
      
      // Broadcast the message using Pusher
      pusher.trigger('chat-channel', 'new-message', savedMessage);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message sent and stored' })
      };

    case "DELETE":
      // Delete a message
      const { id } = JSON.parse(event.body);
      await deleteMessage(id);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message deleted' })
      };

    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unsupported HTTP method' })
      };
  }
};
