import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
declare var Razorpay: any;
@Component({
  selector: 'app-razorpay-editor',
  templateUrl: './test-razorpay.component.html',
  styleUrls: ['./test-razorpay.component.scss'],
})
export class TestRazorpayComponent {
  editorData = 'Demo Razorpay';
  isSubmitted = false;
  modalReference: NgbModalRef;
  amount= 10;
  paymentId;
  refundAmount=1;
  @ViewChild('Payment', { static: false })
  Payment: TemplateRef<any>;
  @ViewChild('Refund', { static: false })
  Refund: TemplateRef<any>;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) { }
  onModalClose() {
    this.isSubmitted = false;
    this.modalReference.close();
  }
  onPayModalOpen() {
    // this.formInit();
    this.modalReference = this.modalService.open(this.Payment, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  onRefundModalOpen() {
    // this.formInit();
    this.modalReference = this.modalService.open(this.Refund, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  payNow() {
    const RazorpayOption = {
      key: 'rzp_test_XabYHaPVvTzzaX', // Replace with your Razorpay key
      amount: this.amount * 100, // amount in paise (1000 paise = ₹10)
      currency: 'INR',
      name: 'SOA',
      description: 'SOA',
      image: 'http://school-media-dev.solutionanalysts.us/dev-organization/4a67935a-e5f6-4c4b-b55f-d1755549cf99-2023-06-02', // Add the path to your logo
      order_id: '', // Leave it empty if not using orders
      handler: (response: any) => {
        console.log(response);
        // Handle the success or failure response here
      },
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
        uniqueId: 'uniqueID', // write unique id for payment
      },
      theme: {
        color: '#f78d1e',
      },
    }
    const successCallback = (paymentid:any)=>{
      console.log('success payment', paymentid)
    }
    const failureCallback = (e:any)=>{
      console.log('fail payment', e)
    }
   Razorpay.open(RazorpayOption,successCallback,failureCallback );
  }
  async refundNow() {
    if(!this.paymentId && !this.refundAmount){
      this.utils.showErrorToast('Enter valid value');
    }else {
      this.utils.showLoading();
      const data = {
        payment_id: this.paymentId,
        amount: this.refundAmount
      }
      const response: any = await this.apiService.razorpayRefundPayment(data);
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.utils.hideLoading();
      }
    }
  }
}
