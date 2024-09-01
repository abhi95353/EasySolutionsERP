import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2';
import { ComponentsServicesService } from '../../components-services.service';
import { WindowRefService } from 'src/app/window-ref.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-monthly-fee',
  templateUrl: './monthly-fee.component.html',
  styleUrls: ['./monthly-fee.component.css'],
  providers: [WindowRefService],
})
export class MonthlyFeeComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService,
    private fb: FormBuilder
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
  is_concession_ew: boolean = true;
  is_concession_3c: boolean = true;
  less: number = 0;
  monthList: any = [];
  feeData: any = [];
  paymentType: any = 2;
  paymentMode: any;
  paybox: any;
  uuid: any;
  hintBox: boolean = false;
  studentDataList: any = [];
  searchBy: any = 'account';
  submitLoader: boolean = false;
  payableFee: number = 0;
  comment: any = null;
  tagName: any = 'Account No';
  receiptDate: any = null;
  receiptNo: any = null;
  cheque_date: any;
  cheque_bank: any;
  cheque_ifs_code: any;
  cheque_no: any;
  cheque_account_no: any;
  cheque_payer: any;
  autoPrint: boolean = false;
  mobileNo: number;
  emailId: any = null;
  payType: any = [];

  total: number = 0;
  lessData = this.fb.group({
    previousDue: 100,
    transportFee: 0,
  });
  report: any = {};
  fees: any = [];
  monthlyFees: any;
  AdmissionFees: any;
  TransportFees: any;
  totalConseesion: number;
  totalFine: number;
  ngOnInit(): void {
    this.cs.feesCollection$.subscribe((response: any) => {
      if (response.type == 'MF') {
        this.localStorageUpdate();
        this.admissionNo = response.account_no;
        this.checkAdmission(this.admissionNo);
        this.searchByAdmission(0);
        this.showPayType();
      } else {
        this.feesBox = false;
      }
    });
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
    this.paymentType = value;
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showAllStudent();
      this.school_code = localStorage.getItem('school_code');
      this.uuid = localStorage.getItem('uuid');
    }
  }

  showAllStudent() {
    this.apis.allStudentList().subscribe((response: any) => {
      this.studentDataList = response.response.data;
    });
  }

  searchByAdmissionButton(value: any) {
    this.searchByAdmission(value);
  }

  searchByAdmission(is_paid: any) {
    this.resetAll();
    this.submitLoader = true;
    this.apis
      .showFeesDetails(this.admissionNo, is_paid)
      .subscribe((response: any) => {
        this.monthList = [];
        this.studentData = response.response;
        console.log(this.studentData);
        this.mobileNo = this.studentData.parent.cred 
        for (let i = 0; i < this.studentData.due.length; i++) {
          const element = this.studentData.due[i];
          if (i == 0) {
            this.monthId = element.id;
            this.payableFee = element.due;
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
        setTimeout(() => {
          this.monthlyFee(false); //Monthly Fee Function
        }, 100);
        this.feesBox = true;
        this.submitLoader = false;
      });
  }

  showPaidFee(is_paid: any) {
    this.apis
      .showFeesDetails(this.admissionNo, is_paid)
      .subscribe((response: any) => {
        this.feeData = response.response.due;
      });
  }

  onSelectMonth(id: any) {
    this.monthId = id;
    this.less = 0;
    setTimeout(() => {
      this.payableFee = (
        document.getElementById('payableAmount') as HTMLElement
      ).innerHTML as unknown as number;
    }, 200);
    setTimeout(() => {
      this.monthlyFee(false); //Monthly Fee Function
    }, 200);
  }

  payButtonClick(id: any, month: any, uuid: any) {
    this.submitStatus = true;
    if (this.payableFee == 0) {
      alert('Please! Update pay amount');
      this.submitStatus = false;
      return;
    }


    if (this.paymentType == 1) {
      this.payWithRazor(this.payableFee, id, month, uuid);
      return;
    }
    if (this.paymentType == 2 || this.paymentType >= 4) {
      this.onClickPay(id, month, uuid);
      return;
    }

    if (this.paymentType == 3) {
      this.payChequePayment(id, month, uuid);
      return;
    }
  }

  confirmationBox(id: any, month: any, uuid: any) {
    this.contribution();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Pay Fees!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.payButtonClick(id, month, uuid);
        }
      });
  }

  payWithRazor(amount: any, id: any, month: any, uuid: any) {
    var data: any = {};
    var collect_details: any = {};
    var customer = {};
    if (this.emailId == null) {
      this.apis.showNotifications('error', 'Email field is mandatory');
      return;
    }
    collect_details = {
      collect_type: 'FeeCollect', //"FeeCollect / CustomFeeCollect / PreviousBalance / StudentAdmissionFee",
      id: id,
      uuid: uuid,
      paid: this.payableFee,
      less: this.less,
      is_waived: this.is_waiver,
      comment: this.comment,
      report: this.report,
      pay_type_id: this.paymentType,
      fees: this.fees,
    };
    customer = {
      contact: this.mobileNo,
      email: this.emailId,
    };

    data = {
      collect_details: collect_details,
      customer: customer,
      payer: this.studentData.student.name,
    };

    if (this.receiptDate != null || this.receiptNo != null) {
      (collect_details.receipt_no = this.receiptNo),
        (collect_details.date = this.receiptDate);
    }

    for (let index = 0; index < this.studentData.due.length; index++) {
      var el = this.studentData.due[index];
      if (el.month == month) {
        for (let i = 0; i < el.student_concessions.length; i++) {
          const element = el.student_concessions[i];
          collect_details[element.name] = (
            document.getElementById(element.name) as HTMLInputElement
          ).checked;
        }
      }
    }

    for (let index = 0; index < this.studentData.due.length; index++) {
      var el = this.studentData.due[index];
      if (el.month == month) {
        for (let i = 0; i < el.student_fines.length; i++) {
          const element = el.student_fines[i];
          collect_details[element.name] = (
            document.getElementById(element.name) as HTMLInputElement
          ).checked;
        }
      }
    }

    this.apis.createOnlinePayment(data).subscribe((response: any) => {
      if (response.success) {
        this.searchByAdmission(0);
        this.apis.showNotifications('success', response.message);
        this.paymentType = 2;
        this.emailId = null;
        data = {};
        this.cs.focusInputFiledCollect(true);
      } else {
        this.apis.showNotifications('error', response.message);
      }
      this.submitStatus = false;
    });
  }

  payChequePayment(id: any, month: any, uuid: any) {
    var data: any = {};
    var collect_details: any = {};
    var cheque_details = {};
    var payer = '';

    collect_details = {
      collect_type: 'FeeCollect', //"FeeCollect / CustomFeeCollect / PreviousBalance",
      id: id,
      uuid: uuid,
      paid: this.payableFee,
      less: this.less,
      is_waived: this.is_waiver,
      comment: this.comment,
      report: this.report,
      fees: this.fees,
    };
    cheque_details = {
      date: this.cheque_date,
      bank: this.cheque_bank,
      ifsc_code: this.cheque_ifs_code,
      account_no: this.cheque_account_no,
      cheque_no: this.cheque_no,
      amount: this.payableFee,
    };
    if (this.receiptDate != null || this.receiptNo != null) {
      (collect_details.receipt_no = this.receiptNo),
        (collect_details.date = this.receiptDate);
    }

    for (let index = 0; index < this.studentData.due.length; index++) {
      var el = this.studentData.due[index];
      if (el.month == month) {
        for (let i = 0; i < el.student_concessions.length; i++) {
          const element = el.student_concessions[i];
          collect_details[element.name] = (
            document.getElementById(element.name) as HTMLInputElement
          ).checked;
        }
      }
    }

    for (let index = 0; index < this.studentData.due.length; index++) {
      var el = this.studentData.due[index];
      if (el.month == month) {
        for (let i = 0; i < el.student_fines.length; i++) {
          const element = el.student_fines[i];
          collect_details[element.name] = (
            document.getElementById(element.name) as HTMLInputElement
          ).checked;
        }
      }
    }
    payer = this.cheque_payer;
    data = {
      collect_details: collect_details,
      cheque_details: cheque_details,
      payer: payer,
    };

    this.apis.createChequePayment(data).subscribe((response: any) => {
      if (response.success) {
        this.searchByAdmission(0);
        this.cs.focusInputFiledCollect(true);
        this.apis.showNotifications('success', response.message);
        this.less = 0;
        this.payableFee = 0;
        this.comment = null;
        this.paymentType = 2;
        // this.printPage(response.response.data , true)
      } else {
        this.apis.showNotifications('error', response.message);
      }
      this.submitStatus = false;
    });
  }

  onClickPay(id: any, month: any, uuid: any) {
    var icon: any;
    var title: any;
    var data: any = {};
    data = {
      id: id,
      month: month,
      uuid: uuid,
      is_waiver: this.is_waiver,
      less: this.less,
      paid: this.payableFee,
      comment: this.comment,
      report: this.report,
      pay_type_id: this.paymentType,
      fees: this.fees,
    }; 
    if (this.receiptDate != null || this.receiptNo != null) {
      (data.comment = this.comment),
        (data.receipt_no = this.receiptNo),
        (data.date = this.receiptDate);
    }
    for (let index = 0; index < this.studentData.due.length; index++) {
      var el = this.studentData.due[index];
      if (el.month == month) {
        for (let i = 0; i < el.student_concessions.length; i++) {
          const element = el.student_concessions[i];
          data[element.name] = (
            document.getElementById(element.name) as HTMLInputElement
          ).checked;
        }
      }
    }

    for (let index = 0; index < this.studentData.due.length; index++) {
      var el = this.studentData.due[index];
      if (el.month == month) {
        for (let i = 0; i < el.student_fines.length; i++) {
          const element = el.student_fines[i];
          data[element.name] = (
            document.getElementById(element.name) as HTMLInputElement
          ).checked;
        }
      }
    }

    this.apis.storePayFees(data).subscribe((response: any) => {
      if (response.success) {
        this.searchByAdmission(0);
        icon = 'success';
        title = response.message;
        var data: any = {
          account_no: this.admissionNo,
          auto_print: this.autoPrint,
        };
        this.cs.passAccountNo(data);
        this.cs.focusInputFiledCollect(true);
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

  onClickReceiptType(value: any) {
    this.receiptDate = null;
    this.receiptNo = null;
    this.isReceiptTypeManual = value;
  }

  setReceiptDate(value: any) {
    this.receiptDate = value;
  }
  setReceiptNo(value: any) {
    this.receiptNo = value;
  }

  openList() {
    this.cs.paymentNoticsBox(true);
  }

  concessionBox(dt: any, value: any, type: any) {
    var data: any = {};
    data.status = value;
    data.data = dt;
    data.type = type;
    data.account = this.studentData.student.account;
    this.cs.concessionBox(data);
  }

  payableFunction(data: any, type: boolean) {
    if (type) {
      this.total = Number(data.due);
    } else {
      this.total = 0;
    }
    for (let i = 0; i < data.student_concessions.length; i++) {
      let value = (
        document.getElementById(
          data.student_concessions[i].name
        ) as HTMLInputElement
      ).checked;
      if (!value) {
        this.total = this.total + Number(data.student_concessions[i].deduction);
      }
    }

    for (let i = 0; i < data.student_fines.length; i++) {
      let value = (
        document.getElementById(data.student_fines[i].name) as HTMLInputElement
      ).checked;
      if (!value) {
        this.total = this.total - Number(data.student_fines[i].charge);
      }
      if (!type) {
        this.total = this.total + Number(data.student_fines[i].charge);
      }
    }

    if (!type) {
      for (let i = 0; i < data.fees.length; i++) {
        let value = (
          document.getElementById(
            data.fees[i].facility_standard.facility.name
          ) as HTMLInputElement
        ).value;
        this.total = this.total + Number(value);
      }

      if ((document.getElementById('Transport') as HTMLInputElement) != null) {
        let value = (document.getElementById('Transport') as HTMLInputElement)
          .value;
        this.total = this.total + Number(value);
      }
    }

    if (type) {
      if (this.less > 0) {
        this.total = this.total - this.less;
      }
      (document.getElementById('payableAmount') as HTMLElement).innerHTML = this
        .total as unknown as string;
    }
    this.payableFee = this.total;
  }

  setTransport(dt: any) {
    var data: any = {};
    data.status = true;
    data.student = this.studentData.student;
    data.dt = dt;
    this.cs.transportBox(data);
  }

  resetAll() {
    this.less = 0;
    this.payableFee = 0;
    this.comment = null;
    this.paymentType = 2;
  }

  updateAdmission(account: any, event: any) {
    var data: any = {};
    var checkBoxValue = !event.target.checked;
    data.account = account;
    if (event.target.checked) {
      data.state = true;
    } else {
      data.state = false;
    }
    this.apis.updatemanageAdmissionFee(data).subscribe((response: any) => {
      if (response.success) {
        this.apis.showNotifications('success', response.message);
        var data: any = { account_no: account, auto_print: false, type: 'MF' };
        this.cs.passAccountNo(data);
      } else {
        this.apis.showNotifications('error', response.message);
        (
          document.getElementById('manage-addmission') as HTMLInputElement
        ).checked = checkBoxValue;
      }
    });
  }

  checkAdmission(account: any) {
    var data: any = {};
    data.account = account;
    this.apis.checkManageAdmissionFee(data).subscribe((response: any) => {
      if (response.success) {
        setTimeout(() => {
          (
            document.getElementById('manage-addmission') as HTMLInputElement
          ).checked = response.response.data.state;
          (document.getElementById('loading') as HTMLElement).innerHTML = '';
        }, 1000);
      }
    });
  }

  contribution() {
    var report: any = {};
    if ((document.getElementById('Transport') as HTMLInputElement) != null) {
      report['Transport'] = (
        document.getElementById('Transport') as HTMLInputElement
      ).value;
    }

    for (let index = 0; index < this.studentData.due.length; index++) {
      const element = this.studentData.due[index];
      if (this.monthId == element.id) {
        for (let j = 0; j < element.fees.length; j++) {
          const el = element.fees[j];
          var name: any = '';
          name = el.facility_standard.facility.name;
          report[name] = (
            document.getElementById(
              el.facility_standard.facility.name
            ) as HTMLInputElement
          ).value;
        }
      }
    }
    this.report = report;
  }

  monthlyFee(type: boolean) {
    const current_cons:any = this.consessionCalculation()
    var monthly: number = 0;
    var monthCount: number = 0;
    var transport: number = 0;
    var admission: number = 0;
    for (let index = 0; index < this.studentData.due.length; index++) {
      const element = this.studentData.due[index];
      if (this.monthId >= element.id) {
        for (let j = 0; j < element.fees.length; j++) {
          const el = element.fees[j];

          if (el.facility_standard.facility.name == 'Monthly Fee') {
            monthly = monthly + el.fee;
            transport = transport + element.student_transport_route.fee;
            let overAllCns: number = 0;
            for (let k = 0; k < element.student_concessions.length; k++) {
              const cns = element.student_concessions[k];
              overAllCns += Number(cns.deduction);
              monthly = monthly - Number(cns.deduction);
              if (this.monthId == element.id) {
                if (type) {
                  let value = (
                    document.getElementById(cns.name) as HTMLInputElement
                  ).checked;
                  if (!value) {
                    monthly = monthly + Number(cns.deduction);
                  }
                }
              }
            }
            this.monthlyFees = monthly;
          }

          if (el.facility_standard.facility.name == 'New Admission Fee') {
            admission = el.fee;
            this.AdmissionFees = admission;
          }

          setTimeout(() => {
            console.log(el, 'el');
            if (
              (document.getElementById(
                el.facility_standard.facility.name
              ) as HTMLInputElement) != null
            ) {
              (
                document.getElementById(
                  el.facility_standard.facility.name
                ) as HTMLInputElement
              ).value = monthly as unknown as string;
            }
            if (
              (document.getElementById('Transport') as HTMLInputElement) != null
            ) {
              this.TransportFees = transport;
              (document.getElementById('Transport') as HTMLInputElement).value =
                transport as unknown as string;
            }
            if (
              (document.getElementById(
                'New Admission Fee'
              ) as HTMLInputElement) != null
            ) {
              (
                document.getElementById('New Admission Fee') as HTMLInputElement
              ).value = admission as unknown as string;
            }
          }, 1);
        }
      }
    }
  }

  showPayType() {
    this.apis.showPayType().subscribe((response: any) => {
      this.payType = response.response.data;
    });
  }

  dueCreate() {
    this.fees = [];
    let dt = {};
    if ((document.getElementById('Transport') as HTMLInputElement) != null) {
      dt = {};
      dt = {
        name: 'Transport',
        total_paid: this.TransportFees,
        due: Math.abs(Number((document.getElementById('Transport') as HTMLInputElement).value)- Number((document.getElementById('Transport_d') as HTMLInputElement).value)) ,
        paid:
          this.TransportFees -
          Number(
            (document.getElementById('Transport') as HTMLInputElement).value
          ),
      };
      this.fees.push(dt);
    }
    if (
      (document.getElementById('New Admission Fee') as HTMLInputElement) != null
    ) {
      dt = {};
      dt = {
        name: 'New Admission Fee',
        total_paid: this.AdmissionFees,
        due:
          this.AdmissionFees -
          Number(
            (document.getElementById('New Admission Fee') as HTMLInputElement)
              .value
          ) -
          Number(
            (document.getElementById('New Admission Fee_d') as HTMLInputElement)
              .value
          ),
        paid:
          this.AdmissionFees -
          Number(
            (document.getElementById('New Admission Fee') as HTMLInputElement)
              .value
          ),
      };
      this.fees.push(dt);
    }
    if ((document.getElementById('Monthly Fee') as HTMLInputElement) != null) {
      dt = {};
      dt = {
        name: 'Monthly Fee',
        total_paid: this.monthlyFees,
        due:
          this.monthlyFees -
          Number(
            (document.getElementById('Monthly Fee') as HTMLInputElement).value
          ),
        paid:
          this.monthlyFees -
          Number(
            (document.getElementById('Monthly Fee') as HTMLInputElement).value
          ),
      };
      this.fees.push(dt);
    }
  }

  consessionCalculation() {
    for (let index = 0; index < this.studentData.due.length; index++) {
      const element = this.studentData.due[index];
      if (this.monthId >= element.id) {
        this.totalConseesion = 0;
        for (let k = 0; k < element.student_concessions.length; k++) {
          const cns = element.student_concessions[k];
          this.totalConseesion += Number(cns.deduction);
        }
      }
    }
    return this.totalConseesion
  }

  fineCalculation() {
    for (let index = 0; index < this.studentData.due.length; index++) {
      const element = this.studentData.due[index];
      if (this.monthId >= element.id) {
        this.totalFine = 0;
        for (let k = 0; k < element.student_fines.length; k++) {
          const fine = element.student_fines[k];
          this.totalFine += Number(fine.charge);
        }
      }
    }
    return this.totalFine
  }
}
