// functions/messages.js
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

async function saveMessage(messageData) {
  return client.query(
    q.Create(q.Collection('chat_messages'), { data: messageData })
  ).then((response) => response.data);
}

async function getMessages(since) {
  const indexRef = q.Match(q.Index('messages_by_timestamp'));
  let paginateExpr = q.Paginate(q.Documents(q.Collection('chat_messages')));

  if (since) {
    paginateExpr = q.Paginate(
      q.Range(indexRef, q.Time(since), null)
    );
  }

  return client.query(
    q.Map(
      paginateExpr,
      q.Lambda('X', q.Get(q.Var('X')))
    )
  ).then((response) => response.data.map((d) => {
    return {
      id: d.ref.id,
      user: d.data.user,
      text: d.data.text,
      timestamp: d.data.timestamp
    };
  }));
}

async function deleteMessage(id) {
  return client.query(
    q.Delete(q.Ref(q.Collection('chat_messages'), id))
  );
}

module.exports = { saveMessage, getMessages, deleteMessage };
