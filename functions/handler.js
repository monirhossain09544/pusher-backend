// functions/handler.js
const Pusher = require('pusher');
const { saveMessage, getMessages, deleteMessage } = require('./messages');

// Initialize Pusher
const pusher = new Pusher({
  appId: "1783030",
  key: "49730284d9a95184d68b",
  secret: "50ff5dd3169bf8806bf7",
  cluster: "ap2",
  useTLS: true
});

exports.handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case "GET":
        const since = event.queryStringParameters.since; // Expect a 'since' parameter for synchronization
        const messages = await getMessages(since);
        return { statusCode: 200, body: JSON.stringify(messages) };

      case "POST":
        const { message, user } = JSON.parse(event.body);
        const messageData = { user, text: message, timestamp: new Date().toISOString() };
        const savedMessage = await saveMessage(messageData);
        try {
          // Await Pusher trigger to catch any errors that occur here
          await pusher.trigger('chat-channel', 'new-message', savedMessage);
        } catch (pusherError) {
          console.error('Error triggering Pusher:', pusherError);
          // Handle the Pusher error, possibly by logging it or sending a response that indicates failure
        }
        return { statusCode: 200, body: JSON.stringify({ message: 'Message sent and stored' }) };

      case "DELETE":
        const { id } = JSON.parse(event.body);
        await deleteMessage(id);
        return { statusCode: 200, body: JSON.stringify({ message: 'Message deleted' }) };

      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Unsupported HTTP method' }) };
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    // This is a catch-all for other errors that may occur in the handler
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error', details: error.toString() }) };
  }
};

// Global handler for uncaught exceptions and unhandled rejections
process.on('unhandledRejection', error => {
  console.error('Unhandled rejection:', error);
});
process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});
