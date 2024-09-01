import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComponentsServicesService } from '../../components-services.service';
import { ScriptLoad } from '../../../../assets/js/payment';
import { WindowRefService } from 'src/app/window-ref.service';
@Component({
  selector: 'app-collect-fees',
  templateUrl: './collect-fees.component.html',
  styleUrls: ['./collect-fees.component.css'],
  providers: [WindowRefService],
  
})
export class CollectFeesComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService,
    private winRef: WindowRefService
  ) {}
  @ViewChild('htmlData') htmlData!: ElementRef;
  @ViewChild('htmlData1') htmlData1!: ElementRef;

  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  submitStatus: boolean = false;
  schoolData: any = [];
  studentData: any = [];
  school_code: any = 'Select School';
  school_id: any;
  admissionNo: any = '';
  isReceiptTypeManual: boolean = false;
  lateMonthFine: any = 0;
  limitCrossFine: any = 0;
  today: any = Date.now();
  feesBox: boolean = false;
  monthId: any;
  is_waiver: boolean = false;
  less: any = 0;
  monthList: any = [];
  feeData: any = [];
  print_data: any = [];
  printStatus: any = false;
  print_month: any;
  paymentType: any = 'cash';
  paymentMode: any;
  paybox: any;
  uuid: any;
  hintBox: boolean = false;
  studentDataList: any = [];
  searchBy: any = 'account';
  submitLoader: boolean = false;
  studentPrintData: any = [];
  printData: any = [];
  receiptId: any = [];
  totalAount: number;
  payableFee: number = 0;
  comment: any = null;
  tagName: any = 'Account No';
  receiptDate: any = null;
  receiptNo: any = null;
  cheque_date:any
  cheque_bank:any
  cheque_ifs_code:any
  cheque_no:any
  cheque_account_no:any
  cheque_payer:any
  printValue:any
  printStatusOnly:boolean = false
  autoPrint:boolean = false

  ngOnInit(): void {
    this.localStorageUpdate();
    if (localStorage.getItem('sub_host') != 'null') {
      // this.showClass()
      this.school_id = localStorage.getItem('school_id');
      this.showSchool();
    }
  }

  updateTagName() {
    if (this.searchBy == 'account') {
      this.tagName = 'Account No';
      return;
    }
    if (this.searchBy == 'f_name') {
      this.tagName = 'Father Name';
      return;
    }
    if (this.searchBy == 'name') {
      this.tagName = 'Student Name';
      return;
    }
  }
  clickCash(value: any) {
    console.log(value)
    this.paymentType = value;
  }
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showAllStudent();
      this.school_code = localStorage.getItem('school_code');
      this.uuid = localStorage.getItem('uuid');
    }
  }

  showSchool() {
    this.apis
      .showSelectiveMigrationSchool(this.school_id, this.uuid)
      .subscribe((response: any) => {
        this.schoolData = response.response;
      });
  }

  showAllStudent() {
    this.apis.allStudentList().subscribe((response: any) => {
      this.studentDataList = response.response.data;
    });
  }

  searchByAdmissionButton(value:any){
    this.searchByAdmission(value)
    this.autoPrint = false
  } 

  searchByAdmission(is_paid: any) {
    this.submitLoader = true;
    this.apis
      .showFeesDetails(this.admissionNo, is_paid)
      .subscribe((response: any) => {
        this.monthList = [];
        this.studentData = response.response;
        for (let i = 0; i < this.studentData.due.length; i++) {
          const element = this.studentData.due[i];
          if (i == 0) {
            this.monthId = element.id;
          }
          var data: any = {};
          data = {
            id: element.id,
            month: element.month,
            is_paid: 0,
            payable: element.payable,
          };
          this.monthList.push(data);
        }

        this.feesBox = true;
        this.submitLoader = false;
        this.showReceipt();
      });
  }

  showPaidFee(is_paid: any) {
    this.apis
      .showFeesDetails(this.admissionNo, is_paid)
      .subscribe((response: any) => {
        this.feeData = response.response.due;
        console.log(this.feeData , 'fess list')
      });
  }

  onSelectMonth(id: any) {
    this.monthId = id;
    this.payableFee = 0;
    this.less = 0;
  }

  download_pdf(data: any) {
    this.printStatus = true;
    this.print_data = [];
    this.print_data.push(data);
    this.print_month = data.month;
    this.receiptId = data.receipt_no;
    for (let i = 0; i < data.details.length; i++) {
      const element = data.details[i];
      this.totalAount = parseInt(element.pre_due) + parseInt(element.paid);
    }
  }

  openPDF(): void {
    var DATA: any;
    var DATA1: any;
    DATA = document.getElementById('htmlData');
    DATA1 = document.getElementById('htmlData1');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 96;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 6, 6, fileWidth, fileHeight, '', 'SLOW');

      html2canvas(DATA1).then((canvas) => {
        let fileWidth = 96;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        PDF.addImage(FILEURI, 'PNG', 106, 6, fileWidth, fileHeight, '', 'SLOW');
        PDF.save(this.receiptId + '-monthly_fee.pdf');
        this.printStatus = false;
      });
    });
  }

  close() {
    this.printStatus = false;
  }

  

  payButtonClick(id: any, month: any , uuid:any) {
    this.submitStatus = true
    if (this.payableFee == 0) {
      alert('Please! Update pay amount');
      this.submitStatus = false
      return;
    }
    console.log(this.paymentType)

    if (this.paymentType == 'online') {
      this.payWithRazor(this.payableFee, id, month , uuid);
      return;
    }
    if (this.paymentType == 'cash') {
      this.onClickPay(id, month , uuid);
      return;
    }

    if (this.paymentType == 'cheque') {
      this.payChequePayment(id, month , uuid);
      return;
    }
  }

  payChequePayment(id: any, month: any , uuid:any) {
    var data: any = {};
    var collect_details = {}
    var cheque_details = {}
    var payer = " "
    
       collect_details = {
          "collect_type": 'FeeCollect',  //"FeeCollect / CustomFeeCollect / PreviousBalance",
          "id": id,
          "uuid": uuid,
          "paid": this.payableFee,
          "less": this.less,
          "is_waived": this.is_waiver,
          "comment": this.comment
      }
       cheque_details =  {
          "date": this.cheque_date,
          "bank": this.cheque_bank,
          "ifsc_code": this.cheque_ifs_code,
          "account_no": this.cheque_account_no,
          "cheque_no": this.cheque_no,
          "amount": this.payableFee
      }

      payer = this.cheque_payer

      data = {
       collect_details : collect_details,
       cheque_details : cheque_details,
       payer : payer
      };
    this.apis.createChequePayment(data).subscribe((response: any) => {
      if (response.success) {
        console.log(response, 'cheque')
        // this.showPaidFee(1);
        this.searchByAdmission(0);
        this.apis.showNotifications('success', response.message);
        this.less = 0;
        this.payableFee = 0;
        this.comment = null;
        this.paymentType = 'cash'
        this.printPage(response.response.data , true)
      } else {
        this.apis.showNotifications('error', response.message);
      }
      this.submitStatus = false;
    });
  }

  onClickPay(id: any, month: any , uuid:any) {
    var icon: any;
    var title: any;
    var data: any = {};
    if (this.receiptDate != null || this.receiptNo != null) {
      data = {
        id: id,
        month: month,
        uuid:uuid,
        is_waiver: this.is_waiver,
        less: this.less,
        paid: this.payableFee,
        comment: this.comment,
        receipt_no: this.receiptNo,
        date: this.receiptDate,
      };
    } else {
      data = {
        id: id,
        month: month,
        uuid:uuid,
        is_waiver: this.is_waiver,
        less: this.less,
        paid: this.payableFee,
        comment: this.comment,
      };
    }

    this.apis.storePayFees(data).subscribe((response: any) => {
      if (response.success) {
        // this.showPaidFee(1);
        this.searchByAdmission(0);
        icon = 'success';
        title = response.message;
        this.less = 0;
        this.payableFee = 0;
        this.comment = null;
      } else {
        icon = 'error';
        title = response.message;
      }
      this.submitStatus = false;
      this.Toast.fire({
        icon: icon,
        title: title,
      });
    });
  }

  search(value: any) {
    var newDataList = [];
    this.hintBox = true;
    newDataList = this.studentDataList;
    this.studentDataList = [];

    if (value.inputType.match('deleteContentBackward')) {
      this.showAllStudent();
    } else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi');
        if (this.searchBy == 'account') {
          if (newDataList[i].account.match(str)) {
            this.studentDataList.push(newDataList[i]);
          }
        }
        if (this.searchBy == 'f_name') {
          if (newDataList[i].parental.f_name.match(str)) {
            this.studentDataList.push(newDataList[i]);
          }
        }
        if (this.searchBy == 'name') {
          if (newDataList[i].name.match(str)) {
            this.studentDataList.push(newDataList[i]);
          }
        }
      }
    }
  }

  onChangeBox(account: any) {
    this.admissionNo = account;
    setTimeout(() => {
      this.hintBox = false;
    }, 500);
  }
  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 500);
  }

  showReceipt() {
    this.studentPrintData, (this.printData = []);
    this.apis.getReceipt(this.admissionNo, 'fee').subscribe((response: any) => {
      if (response.success) {
        if (response.response != null) {
          this.studentPrintData = response.response.data.student;
          this.printData = response.response.data.collect;
          if(this.autoPrint){
            for (let index = 0; index < this.printData.length; index++) {
              const element = this.printData[index];
              if(index == (this.printData.length - 1)){
                this.download_pdf(element)
                this.autoPrint = false
              }
              
            }
          }
        }
        console.log(response, 'rs');
      }
    });
  }

  onClickReceiptType(value: any) {
    console.log(this.receiptNo, this.receiptDate, 'before');
    this.receiptDate = null;
    this.receiptNo = null;
    this.isReceiptTypeManual = value;
    console.log(this.receiptNo, this.receiptDate, 'value');
  }

  setReceiptDate(value: any) {
    this.receiptDate = value;
  }
  setReceiptNo(value: any) {
    this.receiptNo = value;
  }

  payWithRazor(amount: any, id: any, month: any , uuid:any) {
    const options: any = {
      key: 'rzp_test_JOC0wRKpLH1cVW',
      amount: amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'My Easy ERP Solutions', // company name or product name
      description: 'Education', // product description
      image: 'assets/image/profile/R.jpg', // company logo or product image
      // order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: 'rgb(2,145,235',
      },
    };
    options.handler = (response: any, error: any) => {
      options.response = response;
      console.log(response);
      console.log(options);
      this.onClickPay(id, month , uuid)
      // call your backend api to verify payment signature & capture transaction
    };
    options.modal.ondismiss = () => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  printPage(value:any , status:any) {
    this.printStatusOnly = status
    console.log(value , status)
    this.printValue = value
    this.printValue.school_name = localStorage.getItem('school_name')
  }

} 
 