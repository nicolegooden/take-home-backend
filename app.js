const express = require("express");
const cors = require("cors");
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = "Test Express";
app.use(cors());
app.use(express.json());

app.get("/api/v1/conversations", async (req, res) => {
  try {
    const conversations = await database("conversations").select();
    res.status(200).json(conversations);
  } catch (e) {
    res.status(500).json({e})
  }
})

app.get("/api/v1/messages/:conversation", async (req, res) => {
  try {
    const messages = await database("messages")
    .where("conversation_id", `${req.params.conversation}`)
    .select();
    if (messages.length) {
      res.status(200).json(messages);
    } else {
      express.status(404).json({
        error: `No messages found for the conversation id ${req.params.conversation}.`   
      })
    }
  } catch (e) {
    res.status(500).json({e})   
  }
})

app.get("/api/v1/thoughts/:message", async (req, res) => {
  try {
    const thoughts = await database("thoughts")
    .where("message_id", `${req.params.message}`)
    .select();
    if (thoughts.length) {
      res.status(200).json(thoughts);
    } else {
      express.status(404).json({
        error: `No thoughts found for the message id ${req.params.message}.`   
      })
    }
  } catch (e) {
    res.status(500).json({e})   
  }
})




module.exports = app;