const TicketController = require('../Controllers/ticketController');

module.exports = (router) => {
  	router.route('/ticket')
            //.post([TicketController.validate('bookTicket')],TicketController.bookTicket)
            .post(TicketController.bookTicket)
            .get(TicketController.getAll) 
            .delete([TicketController.validate('cancelTicket')],TicketController.cancelTicket);
    
    router.route('/myticket')
    		.post(TicketController.getMyTickets);
    
        
  	
};