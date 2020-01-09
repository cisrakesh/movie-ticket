import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { AlertService, TicketService } from './services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
    // @ViewChild(ModalDirective, { static: false }) confimTcktModal: ModalDirective;
    // @ViewChild(ModalDirective, { static: false }) cancelTcktModal: ModalDirective;
    @ViewChild("confimTcktModalTmp", { static: false }) confimTcktModalTmp;
    @ViewChild("cancelTcktModalTmp", { static: false }) cancelTcktModalTmp;
    title = 'movie-ticket';
    modalRef: BsModalRef;
    numberOfCols=12;
    numberOfRows = 10;
    selectedSeat=[];
    reservedSeat = [];
    seatToCancel="";
    ticktObjectToCancel=false;
    bookingForm: FormGroup;
    cancelBookingForm: FormGroup;
    loading = false;
    submitted = false;
    
    config = {
        class: 'modal-dialog-centered modal-lg',
    };
    constructor(
        private modalService: BsModalService,
        private fb: FormBuilder,
        private ticketService: TicketService,
        private alertService: AlertService
    ) { }
    ngOnInit() {
        this.bookedTickets();
        this.createBookingForm();
        this.createCancelBooking();
    }
    createBookingForm(): void {
        this.bookingForm = this.fb.group({
            emailId: ['', Validators.compose([Validators.required, Validators.email])],
        });
    }
    
    createCancelBooking(): void {
        this.cancelBookingForm = this.fb.group({
            emailId: ['', Validators.compose([Validators.required, Validators.email])],
        });
    }
    get f() { return this.bookingForm.controls; }
    get cancelFormCtrls() { return this.cancelBookingForm.controls; }
    resetForm() {

        this.submitted = false;
        this.bookingForm.reset();
        this.cancelBookingForm.reset();


    }
    onSubmit() {
        this.submitted = true;


        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.bookingForm.invalid) {
            return;
        }

        this.loading = true;
        const ticketData = {
            emailId: this.f.emailId.value,
            tickets: this.selectedSeat,
        };
        this.ticketService.bookTicket(ticketData).subscribe(
            data => {
                if (data) {
                    //this.userProfile = data;
                    this.alertService.success("you have booked "+this.selectedSeat+" seats");
                    //this.loadFormData();
                    console.log(data);
                    //this.confimTcktModal.hide();
                    
                    this.modalRef.hide();
                    this.reservedSeat.concat(this.selectedSeat);
                    this.selectedSeat=[];
                }
                this.resetForm();
                this.loading = false;
                this.bookedTickets();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
                this.modalRef.hide();
            }
        );
        //this.bookedTickets();
    }
    
    enquireBooking(){
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.cancelBookingForm.invalid) {
            return;
        }

        this.loading = true;
        const ticketData = {
            emailId: this.cancelFormCtrls.emailId.value,
            seatNumber: this.seatToCancel
        };
        this.ticketService.enquireTicket(ticketData).subscribe(
            data => {
                if (data) {
                    if (Object.keys(data).length>0){
                        this.ticktObjectToCancel = data;    
                    }
                    
                    console.log(data);
                    //this.confimTcktModal.hide();

                    
                } else {
                    this.ticktObjectToCancel = false;
                    this.alertService.error("No matching Ticket found with email " + this.cancelFormCtrls.emailId.value);
                    this.loading = false;
                    this.modalRef.hide();
                    this.resetForm();
                }
                
                this.loading = false;
                
            },
            error => {
                this.alertService.error("No matching Ticket found with email " + this.cancelFormCtrls.emailId.value);
                this.loading = false;
                this.modalRef.hide();
            }
        );
    }
    bookedTickets(){
        this.ticketService.getBookedTickets().subscribe(
            data => {
                if (data) {
                    this.reservedSeat = data;
                    console.log(data);
                }
                
            },
            error => {
                this.alertService.error(error);
                
            }
        );
    }
    
    confirmBooking(){
        
        this.modalRef = this.modalService.show(this.confimTcktModalTmp, this.config);
    }
    
    
    printColsNumber(){
        let cols=[];
        for (let i = 1; i <= this.numberOfCols; i++) {
            
            cols.push(i);
            if (i % 5 == 0) {
                cols.push("");
            }
        } 
        return cols;
    }
    
    printRowsNumber() {
        let rows = [];
        
        for (let i = 1; i <= this.numberOfRows; i++) {

            rows.push(String.fromCharCode(64+i));
            if (i % 5 == 0) {
                rows.push("");
            }
        }
        return rows;
    }
    
    seatStatus(seatNumber){
        var classString = "emptyBox";
        if(this.selectedSeat.includes(seatNumber)){
            classString="greenBox";
        } else if (this.reservedSeat.includes(seatNumber)){
            classString = "redBox";
        }
        return classString;
    }
    
    seatClicked(rowNumber, colNumber){
        var seatNumber = rowNumber+""+colNumber;
        if (this.reservedSeat.includes(seatNumber)) {
            console.log("136")
            if (this.selectedSeat.length<=0){
                //this.cancelTcktModal.show();
                this.seatToCancel = seatNumber; 
                this.modalRef = this.modalService.show(this.cancelTcktModalTmp, this.config);           
                console.log("139")
            }else{
                return false;    
            }
            
        } else if (this.selectedSeat.includes(seatNumber)){
            var indexOfSeat=this.selectedSeat.indexOf(seatNumber)
            if (indexOfSeat!==-1){
                this.selectedSeat.splice(indexOfSeat, 1);
            }
        }else{
            this.selectedSeat.push(seatNumber);
        }
        
        
    }
}
