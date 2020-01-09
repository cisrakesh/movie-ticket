// Login controller , all function related to login should reside here

const mongoose = require('mongoose');
const { Ticket} = require('../models/ticket');
const { check, validationResult, oneOf, sanitize } = require('express-validator');
var async = require("async");
var dateFormat = require('dateformat');
const connUri = process.env.MONGO_LOCAL_CONN_URL;

var self=module.exports = {
    //validate method , which returns a middleware to check the validation of the fields
    validate:(method)=>{
        switch (method) {
            //for adding ration
            case 'bookTicket': {
                return [
                    check('emailId', "Packet Id should have atleast one character").isLength({ min: 1 }),
                    //check('tickets', "packet Id is required").exists()
                ];
                break;
            
            }
            case 'cancelTicket': {
                return [
                    check('emailId', "Packet Id should have atleast one character").isLength({ min: 1 }),
                    //check('tickets', "packet Id is required").exists()
                ];
                break;
            }
            
        }
        
    },
    bookTicket: (req, res) => {
        
        let result = {};
        let status = 201;
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(422).send({ errors: errors.array(), message: 'Something Went wrong , please try again later' })
        // }
        
        var ticketsArray=req.body.tickets;
        const ticketModel = new Ticket(); // document = instance of a model
        ticketModel.emailId = req.body.emailId;
        ticketModel.tickets=[];
        var bookTickets=[];

        Ticket.find({"tickets.seatNumber":{$in:ticketsArray}}, (err, tickets) => {
            if (err) {
                console.log(err);
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }else{
                if(tickets.length<=0){
                    async.forEachOf(ticketsArray, function (eachTicket, key, forEachCallback) {
                        ticketModel.tickets.push({seatNumber:eachTicket});
                        forEachCallback();
                    }, function (err) {
                        if (err) {
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        }else{
                            ticketModel.save((err, ticketObj) => {
                                if (err) {
                                    console.log(err);
                                    status = 500;
                                    result.status = status;
                                    result.error = err;
                                    res.status(status).send(result);
                                }else{
                                    res.status(status).send(ticketObj);        
                                    
                                }
                                
                            });
                            
                        }
                        
                    });
                }else{
                    status = 500;
                    result.status = status;
                    result.error = "Asked tickets are not available! Please select other.";
                    res.status(status).send(result);
                }
            }
        });
        
        
    },

    
    getAll: (req, res) => {
        let result = {};
        let status = 201;
        //get all type of ration
        Ticket.find({}, (err, tickets) => {
            if (!err) {
                var bookedSeats=[];
                async.forEachOf(tickets, function (eachTicket, key, forEachCallback) {
                    async.forEachOf(eachTicket.tickets, function (eachSeat, key, internalForEachCallback) {

                        bookedSeats.push(eachSeat.seatNumber);
                        internalForEachCallback();
                    }, function (err) { 

                        if(err){
                            forEachCallback(err);     
                        }else{
                            forEachCallback();     
                        }
                        
                    });  
                    
                }, function (err) {
                    if (err) {
                        status = 500;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }else{
                        res.status(status).send(bookedSeats);        
                    }
                    
                });
                
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
        
    },
    getMyTickets: (req, res) => {
        let result = {};
        let status = 201;
        
        var emailId = req.body.emailId;
        var seatNumber = req.body.seatNumber;

        Ticket.findOne({"emailId":emailId,"tickets.seatNumber":seatNumber}, (err, ticket) => {
            if (!err) {
                if (err) {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                }else{
                    res.status(status).send(ticket);        
                }
                
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
        
    },
    cancelTicket:(req,res)=>{
        let result = {};
        let status = 201;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array(), message: 'Something Went wrong , please try again later' })
        }
        Ticket.remove({ _id: req.query.id }, function (err) {
            if (!err) {
                result.status = status;
                result.message = "Ticket deleted succesfully!";
                
            }
            else {
                status = 500;
                result.status = status;
                result.error = err;
            }
            res.status(status).send(result);
        });
    }
}