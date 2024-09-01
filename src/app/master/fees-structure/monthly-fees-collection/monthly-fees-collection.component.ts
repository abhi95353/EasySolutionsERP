import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ToWords } from 'to-words';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-monthly-fees-collection',
  templateUrl: './monthly-fees-collection.component.html',
  styleUrls: ['./monthly-fees-collection.component.css']
})
export class MonthlyFeesCollectionComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
schoolName:any = ''
admissionNo: any = '';
monthList:any = []
monthId:any = null
toWords:any = new ToWords(); 
inFigure:any
date = new Date();
todayDate:any
studentData:any = [] 
viewStatus:boolean = false
is_old:boolean = false
is_mannul:boolean = false
day:any = this.date.getDate()
mnth:any = this.date.getMonth() + 1
year:any = this.date.getFullYear()
payType: any = [];
paymentType: any = 2;
submitStatus:boolean = false
mobileNo: number;
emailId: any = null;
cheque_date: any;
cheque_bank: any;
cheque_ifs_code: any;
cheque_no: any;
cheque_account_no: any;
cheque_payer: any;
cheque_amount:any
is_staff:boolean = false
sessionList:any=[]
sid:any
suuid:any
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
currentDate:any
today:any
sessionId:any
feesCollectionForm:any = this.fb.group({
    fees:this.fb.array([])
  })

  get fees() {
    return this.feesCollectionForm.get('fees') as FormArray;
  }

  ngOnInit(): void {
    this.cs.feesCollection$.subscribe((response: any) => {
      if (response.type == 'MF') {
        this.is_staff = this.apis.isStaff
        console.log('is Staff' , this.is_staff)
        this.today = this.year+'-'+this.mnth+'-'+this.day
        this.admissionNo = response.account_no;
        this.searchByAdmission(0);
        this.showPayType();
        this.showAllSession()
      } else {
        this.viewStatus = false;
      }
    });
    this.schoolName = localStorage.getItem('school_name')
    console.log(this.date.getMonth() , 'ms')
  }


  searchByAdmission(is_paid:any){
    this.monthId == null
    this.apis
    .showNewFeesDetails(this.admissionNo, is_paid).subscribe((response:any)=>{
      // response.response.due.flatMap((item:any) => this.addFees(item));
      console.log(response , 'rs')
      this.fees.clear()
      this.studentData = response.response
      this.monthList = []
      this.mobileNo =  this.studentData.parent.cred
      this.checkNewOrOld()
      this.sid = response.response.student.id
      this.suuid = response.response.student.uuid
      for (let index = 0; index < response.response.due.length; index++) {
        const element = response.response.due[index];
        this.monthList.push(element.month)
        if(index == 0){
          this.monthId = element.month
        }
        this.addFees(element)
        this.totalPayable(index)
      }
      this.viewStatus = true

    })
  }

  checkNewOrOld(){
    if(this.studentData.student.academic_session.id == this.studentData.student.batch.id){
      this.is_old = false
      return
    }
    this.is_old = true
  }

  submit(){
    var data:any = {}
    var status:any = this.payValidation()
    if(!status){return}
    this.submitStatus = true
  
    for (let index = 0; index < this.fees.length; index++) {
      const element:any = this.fees.controls[index].value;
      console.log(element.month , this.monthId , !this.is_mannul)
      if(element.month == this.monthId){
        if(this.is_mannul){
          console.log(this.day - this.mnth)
          var dt = this.year+'-'+this.mnth+'-'+this.day 
          this.fees.controls[index].patchValue({date: dt})
        }
        else{
          this.fees.controls[index].patchValue({slip_no: '' , date: this.today})
        }
        data = this.fees.controls[index].value
      }
    }
    this.apis.storePayFees(data).subscribe((response: any) => {
      if (response.success) {
        this.searchByAdmission(0);
        this.apis.showNotifications('success' , response.message)
        var data: any = {
          account_no: this.admissionNo,
          auto_print: false,
        };
        this.cs.passAccountNo(data);
        this.cs.focusInputFiledCollect(true);
      } else {
        this.apis.showNotifications('error' , response.message)
      }
      this.submitStatus = false;
     
    });
    // setTimeout(()=>{this.submitStatus = false},2000)
  }

  changeDate(){
    this.currentDate = new Date(this.year+'-'+this.mnth+'-'+this.day ).toDateString()
  }


  addFees(fee:any){
    let newForm:any = this.fb.group({
    adm_due:fee.adm_due,
    adm_fee:fee.adm_fee, 
    adm_less:[0 , Validators.min(0)],
    adm_note:fee.adm_note,
    adm_paid:[0 , Validators.min(0)],
    adm_pay:fee.adm_pay,
    adm_payable:fee.adm_pay,
    adm_outstanding:0,
    adm_pre:fee.adm_pre,

    bal_due:fee.bal_due,
    bal_fee:fee.bal_fee, 
    bal_less:[0 , Validators.min(0)],
    bal_note:fee.bal_note,
    bal_paid:[0 , Validators.min(0)],
    bal_pay:fee.bal_pay,
    bal_pre:fee.bal_pre,
    bal_payable:fee.bal_pay,
    bal_outstanding:0,
    balance:fee.balance,

    conv_due:fee.conv_due,
    conv_fee:fee.conv_fee,
    conv_less:[0 , Validators.min(0)],
    conv_note:fee.conv_note,
    conv_paid:[0 , Validators.min(0)],
    conv_pay:fee.conv_pay,
    conv_payable:fee.conv_pay,
    conv_outstanding:[0 , Validators.min(0)],
    conv_pre:fee.conv_pre,


    exam_due:fee.exam_due,
    exam_fee:fee.exam_fee,
    exam_less:[0 , Validators.min(0)],
    exam_note:fee.exam_note,
    exam_paid:[0 , Validators.min(0)],
    exam_pay:fee.exam_pay,
    exam_payable:fee.exam_pay,
    exam_outstanding:0,
    exam_pre:fee.exam_pre,


    installment:fee.installment,
    lmf_due:fee.lmf_due,
    lmf_fee:fee.lmf_fee,
    lmf_less:[0 , Validators.min(0)],
    lmf_note:fee.lmf_note,
    lmf_paid:[0 , Validators.min(0)],
    lmf_pay:fee.lmf_pay,
    lmf_payable:fee.lmf_pay,
    lmf_outstanding:0,
    lmf_pre:fee.lmf_pre,

    month:fee.month,
    reg_due:fee.reg_due,
    reg_fee:fee.reg_fee,
    reg_less:[0 , Validators.min(0)],
    reg_note:fee.reg_note,
    reg_paid:[0 , Validators.min(0)],
    reg_pay:fee.reg_pay,
    reg_payable:fee.reg_pay,
    reg_outstanding:0,
    reg_pre:fee.reg_pre,

    tot_due:fee.tot_due,
    tot_fee:fee.tot_fee,
    tot_less:[0 , Validators.min(0)],
    tot_note:fee.tot_note,
    tot_paid:[0 , Validators.min(0)],
    tot_pay:fee.tot_pay,
    tot_payable:0,
    tot_outstanding:0,
    tot_pre:fee.tot_pre,

    tut_due:fee.tut_due,
    tut_fee:fee.tut_fee,
    tut_less:[0 , Validators.min(0)],
    tut_note:fee.tut_note,
    tut_paid:[0 , Validators.min(0)],
    tut_pay:fee.tut_pay,
    tut_payable:fee.tut_pay,
    tut_outstanding:0,
    tut_pre:fee.tut_pre,

    id:fee.id,
    uuid:fee.uuid,
    date: new Date(this.today).toDateString(),
    slip_no:'',
    conc_3c: fee.conc_3c,
    conc_ew:fee.conc_ew,
    conc_fl: fee.conc_fl,
    inFigure: '',
    collect_type : 'StudentFee',
    pay_type_id:2,
    narration:''
  })
  this.fees.push(newForm)
  }



  getSumFees(value1:any , value2:any , op:any){
    if(op == 'positive'){
      return Number(value1) + Number(value2)
    }
    return Number(value1) - Number(value2)
  }

  getLessFees(value1:any , value2:any , index:any , name:any){
    if(name == 'exam'){
      this.fees.controls[index].patchValue({
        exam_payable: value1 - value2
      })
    }
    if(name == 'registration'){
      this.fees.controls[index].patchValue({
        reg_payable: value1 - value2
      })
    }
    if(name == 'admission'){
      this.fees.controls[index].patchValue({
        adm_payable: value1 - value2
      })
    }

    if(name == 'monthly'){
      this.fees.controls[index].patchValue({
        tut_payable: value1 - value2
      })
    }

    if(name == 'transport'){
      this.fees.controls[index].patchValue({
        conv_payable: value1 - value2
      })
    }

    if(name == 'lmf'){
      this.fees.controls[index].patchValue({
        lmf_payable: value1 - value2
      })
    }

    if(name == 'due'){
      this.fees.controls[index].patchValue({
        bal_payable: value1 - value2
      })
    }
    this.totalPayable(index)

  }


  getPaidFees(value1:any , value2:any ,index:any, name:any){
    console.log(value1 , value2)
    if(name == 'exam'){
      this.fees.controls[index].patchValue({
        exam_outstanding: value1 - value2
      })
      return
    }
    if(name == 'registration'){
      this.fees.controls[index].patchValue({
        reg_outstanding: value1 - value2
      })
    }
    if(name == 'admission'){
      this.fees.controls[index].patchValue({
        adm_outstanding: value1 - value2
      })
    }

    if(name == 'monthly'){
      this.fees.controls[index].patchValue({
        tut_outstanding: value1 - value2
      })
    }

    if(name == 'transport'){
      this.fees.controls[index].patchValue({
        conv_outstanding: value1 - value2
      })
    }

    if(name == 'lmf'){
      this.fees.controls[index].patchValue({
        lmf_outstanding: value1 - value2
      })
    }

    if(name == 'due'){
      this.fees.controls[index].patchValue({
        bal_outstanding: value1 - value2
      })
    }
    this.totalPayable(index)
  }

  totalPayable(index:any){
    var element:any = this.fees.controls[index].value
    var less:number = element.adm_less + element.reg_less + element.tut_less + element.lmf_less + element.conv_less + element.exam_less + element.bal_less
    var payable:number = element.adm_payable + element.reg_payable + element.tut_payable + element.lmf_payable + element.conv_payable + element.exam_payable + element.bal_payable
    var paid:number = element.adm_paid + element.reg_paid + element.tut_paid + element.lmf_paid + element.conv_paid + element.exam_paid + element.bal_paid
    var outstanding:number = element.adm_outstanding + element.reg_outstanding + element.tut_outstanding + element.lmf_outstanding + element.conv_outstanding + element.exam_outstanding + element.bal_outstanding
    this.fees.controls[index].patchValue({
      tot_less:    less,
      tot_payable: payable,
      tot_paid: paid,
      tot_outstanding: outstanding,
      inFigure : this.toWords.convert(paid)
    })
  }

  entryType(event:any , value:any){
    if(value == 1){
      this.is_mannul = true;
      (document.getElementById('auto') as HTMLInputElement).checked = false;
      (document.getElementById('mauual') as HTMLInputElement).checked = true
    }else{
      this.is_mannul = false;
      for (let index = 0; index < this.fees.length; index++) {
        const element:any = this.fees.controls[index].value;
        console.log(element.month , this.monthId , !this.is_mannul)
        if(element.month == this.monthId){
          this.fees.controls[index].patchValue({slip_no: '' , date: new Date().toDateString()})
        }
      }
      (document.getElementById('auto') as HTMLInputElement).checked = true;
      (document.getElementById('mauual') as HTMLInputElement).checked = false
    }
  }


  addType(event:any , value:any){
    if(value == 1){
      this.is_old = true;
      (document.getElementById('new_admission') as HTMLInputElement).checked = false;
      (document.getElementById('old_admission') as HTMLInputElement).checked = true
    }else{
      this.is_old = false;
      (document.getElementById('new_admission') as HTMLInputElement).checked = true;
      (document.getElementById('old_admission') as HTMLInputElement).checked = false
    }
  }

  concessionBox(dt: any, value: any, type: any) {
    var data: any = {};
    data.status = value;
    data.data = dt;
    data.type = type;
    data.account = this.studentData.student.account;
    this.cs.concessionBox(data);
  }



  updateAdmission(account: any) {
    var data: any = {};
    data.account = account;
    this.apis.checkManageAdmissionFee(data).subscribe((response: any) => {
      console.log(response)
      if (response.success) {
        this.is_old = response.response.data.state
      }
    });
  }

  showPayType() {
    this.apis.showPayType().subscribe((response: any) => {
      this.payType = response.response.data;
    });
  }

  clickCash(value: any) {

    for (let index = 0; index < this.fees.length; index++) {
      const element:any = this.fees.controls[index].value;
      if(element.month == this.monthId){
      console.log(element.tot_paid , 0)

        if(element.tot_paid <= 0){
          this.apis.showNotifications('error' , 'Invailid Amount');
          (document.getElementById('pay_type') as HTMLInputElement).value = this.paymentType;
          return
        }
        this.paymentType = value;
        this.fees.controls[index].patchValue({'pay_type_id' : value})
      }
    }
  }

  confirmationBox() {
    console.log(this.fees)
    for (let index = 0; index < this.fees.length; index++) {
      const element:any = this.fees.controls[index].value;
      console.log(element.month , this.monthId , !this.is_mannul)
      if(element.month == this.monthId){
        if(this.fees.controls[index].status == "INVALID"){ this.apis.showNotifications('error' , "Please check discount & deposit amount");this.submitStatus=false; return}
      }
    }
    

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
          this.submit();
        }
      });
  }

  setTransport(dt: any) {
    var data: any = {};
    data.status = true;
    data.student = this.studentData.student;
    data.dt = dt;
    this.cs.transportBox(data);
  }

  payValidation(){
    for (let index = 0; index < this.fees.length; index++) {
      const element:any = this.fees.controls[index].value;
      if(element.month == this.monthId){
       if(element.tut_pay - element.tut_less < 0 ){
        this.apis.showNotifications('error' , 'Please Check Discount')
        return false
       }
       if(element.reg_pay - element.reg_less < 0 ){
        this.apis.showNotifications('error' , 'Please Check Discount')
        return false
       }
       if(element.adm_pay - element.adm_less < 0 ){
        this.apis.showNotifications('error' , 'Please Check Discount')
        return false
       }

       if(element.exam_pay - element.exam_less < 0 ){
        this.apis.showNotifications('error' , 'Please Check Discount')
        return false
       }

       if(element.conv_pay - element.conv_less < 0 ){
        this.apis.showNotifications('error' , 'Please Check Discount')
        return false
       }
       if(element.lmf_pay - element.lmf_less < 0 ){
        this.apis.showNotifications('error' , 'Please Check Discount')
        return false
       }


       if(element.tut_payable - element.tut_paid < 0 ){
        this.apis.showNotifications('error' , 'Please Check Deposit')
        return false
       }
       if(element.reg_payable - element.reg_paid < 0 ){
        this.apis.showNotifications('error' , 'Please Check Deposit')
        return false
       }
       if(element.adm_payable - element.adm_paid < 0 ){
        this.apis.showNotifications('error' , 'Please Check Deposit')
        return false
       }

       if(element.exam_payable - element.exam_paid < 0 ){
        this.apis.showNotifications('error' , 'Please Check Deposit')
        return false
       }

       if(element.conv_payable - element.conv_paid < 0 ){
        this.apis.showNotifications('error' , 'Please Check Deposit')
        return false
       }
       if(element.lmf_payable - element.lmf_paid < 0 ){
        this.apis.showNotifications('error' , 'Please Check Deposit')
        return false
       }
 
      }
    }
    return true
  }



  payWithRazor() {
    var data: any = {};
    var customer = {};
    var collect_details = {};
    if (this.emailId == null) {
      this.apis.showNotifications('error', 'Email field is mandatory');
      return;
    }
 
    for (let index = 0; index < this.fees.length; index++) {
      const element:any = this.fees.controls[index].value;
      console.log(element.month , this.monthId , !this.is_mannul)
      if(element.month == this.monthId){
        if(this.is_mannul){
          console.log(this.day - this.mnth)
          var dt = this.year+'-'+this.mnth+'-'+this.day 
          this.fees.controls[index].patchValue({date: dt})
        }
        else{
          this.fees.controls[index].patchValue({slip_no: '' , date: this.today})
        }
        collect_details = this.fees.controls[index].value
        if(this.fees.controls[index].status == "INVALID"){ this.apis.showNotifications('error' , "Please check discount & deposit amount");this.submitStatus=false; return}
      }
    }
    customer = {
      contact: this.mobileNo,
      email: this.emailId,
    };

    data = {
      collect_details: collect_details,
      customer: customer,
      payer: this.studentData.student.name,
    };

   

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


  payChequePayment() {
    var data: any = {};
    var collect_details: any = {};
    var cheque_details = {};
    var payer = '';

    for (let index = 0; index < this.fees.length; index++) {
      const element:any = this.fees.controls[index].value;
      console.log(element.month , this.monthId , !this.is_mannul)
      if(element.month == this.monthId){
        if(this.is_mannul){
          console.log(this.day - this.mnth)
          var dt = this.year+'-'+this.mnth+'-'+this.day 
          this.fees.controls[index].patchValue({date: dt})
        }
        else{
          this.fees.controls[index].patchValue({slip_no: '' , date: this.today})
        }
        collect_details = this.fees.controls[index].value
        if(this.fees.controls[index].status == "INVALID"){ this.apis.showNotifications('error' , "Please check discount & deposit amount");this.submitStatus=false; return}

      }
    }
    cheque_details = {
      date: this.date,
      bank: this.cheque_bank,
      ifsc_code: this.cheque_ifs_code,
      account_no: this.cheque_account_no,
      cheque_no: this.cheque_no,
      amount: this.cheque_amount,
    };
    
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
        this.paymentType = 2;
        this.cheque_date =''
        this.cheque_bank = ''
        this.cheque_ifs_code = ''
        this.cheque_account_no = ''
        this.cheque_no = ''
        this.cheque_amount =''
        // this.printPage(response.response.data , true)
      } else {
        this.apis.showNotifications('error', response.message);
      }
      this.submitStatus = false;
    });
  }

  inputDate(date:any){

  }


  showAllSession(){
    this.apis.showAllAcademicSession().subscribe((response:any)=>{
      if(response.response != null){
        this.sessionList = response.response
        }          
    })
  }

  updateOld(){
    var data:any = {
    "id": this.sid,
    "uuid": this.suuid,
    "batch_id": this.sessionId,
    }
    if(this.is_old){
    data['batch_type'] =  "Old"
    }
    else{
    data['batch_type'] = "New"
    }
    this.apis.checkManageAdmissionFee(data).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        var data:any = {'account_no' : this.admissionNo , 'auto_print' : false , 'type' : 'MF'}
        this.cs.passAccountNo(data)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }
  
}
