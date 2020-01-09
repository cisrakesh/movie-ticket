const mongoose = require('mongoose');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    emailId: {
        type: 'String',
        required: true,
        trim: true
    },
    tickets: {
        type:Array,
        required: true,
        trim: true
    }
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = {
    Ticket: TicketModel
}