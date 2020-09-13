import express from "express"
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import pusher from './pusher.js'
import cors from 'cors';


const db = mongoose.connection

db.once('open', () => {
    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
        console.log(change);
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted' , {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }else {
            console.log('Error triggering Pusher')
        }
    })
})

import Messages from './Models/dbMessages.js';

const app = express();
const port = process.env.PORT || 9000

const connection_url = 'mongodb+srv://Eben:Nigeria4real@cluster0.ayerq.mongodb.net/WHATSAPP-CLONE-BACKEND?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.post('/api/v1/messages/create', (req,res) => {
    console.log(res.body);
    Messages.create(req.body, (err, message) => {
        if(err) {
            res.status(500).send({
                status: "Failed",
                data: err
            })
        }else {
            res.status(201).send({
                status: "Success",
                data: message
            })
        }
    })
})
app.get('/api/v1/messages/sync', (req,res) => {
    Messages.find((err, message) => {
        if(err) {
            res.status(500).send({
                status: "Failed",
                data: err
            })
        }else {
            res.status(200).send({
                status: "Success",
                data: message
            })
        }
    })
})

app.listen(port, () => console.log(`Listening on localhost:${port}`))




