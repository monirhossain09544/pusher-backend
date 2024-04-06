const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: "fnAFeV1rgtAAQH4naL-Qkc7DUCj-fiSKpC-tO9B1" });

async function saveMessage(messageData) {
  return client.query(
    q.Create(q.Collection('chat_messages'), { data: messageData })
  ).then((response) => response.data);
}

async function getMessages() {
  return client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('chat_messages'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  ).then((response) => response.data.map((d) => d.data));
}

async function deleteMessage(id) {
  return client.query(
    q.Delete(q.Ref(q.Collection('chat_messages'), id))
  );
}

module.exports = { saveMessage, getMessages, deleteMessage };
