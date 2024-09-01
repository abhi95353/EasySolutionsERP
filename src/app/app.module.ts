import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angular2-qrcode';
import { GooglePayButtonModule } from "@google-pay/button-angular";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideHeaderComponent } from './Layout/side-header/side-header.component';
import { TopHeaderComponent } from './Layout/top-header/top-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { RadarChartComponent } from './charts/radar-chart/radar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DoughnutChartComponent } from './charts/doughnut-chart/doughnut-chart.component';
import { DataTableComponent } from './tables/data-table/data-table.component';
import { ClipboardModule } from 'ngx-clipboard';
import { AdmissionComponent } from './master/admission/admission.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RegistrationComponent } from './master/registration/registration.component';
import { SchoolComponent } from './master/school/school.component'; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ClassesComponent } from './master/classes/classes.component';
import { CreateClassesComponent } from './master/classes/create-classes/create-classes.component';
import { DownloadAdmissionComponent } from './master/admission/download-admission/download-admission.component';
import { FeesStructureComponent } from './master/fees-structure/fees-structure.component';
import { FeesTypeComponent } from './master/fees-structure/fees-type/fees-type.component';
import { CreateFeesStructureComponent } from './master/fees-structure/create-fees-structure/create-fees-structure.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SchoolListComponent } from './master/school/school-list/school-list.component';

import { FormsModule } from '@angular/forms';
import { RegistrationListComponent } from './master/registration/registration-list/registration-list.component';
import { RegistrationDetailViewComponent } from './master/registration/registration-detail-view/registration-detail-view.component';
import { LoginComponent } from './login/login.component';
import { AdmissionListComponent } from './master/admission/admission-list/admission-list.component';
import { CustomFeesComponent } from './master/fees-structure/custom-fees/custom-fees.component';
import { DownloadRegistrationComponent } from './master/registration/download-registration/download-registration.component';
import { FineComponent } from './master/fees-structure/fine/fine.component';
import { FooterComponent } from './Layout/footer/footer.component';
import { CustomFeesListComponent } from './master/fees-structure/custom-fees-list/custom-fees-list.component';
import { CollectFeesComponent } from './master/fees-structure/collect-fees/collect-fees.component';
import { AdmissionDetailsListComponent } from './master/admission/admission-details-list/admission-details-list.component';
import { FineListComponent } from './master/fees-structure/fine-list/fine-list.component';
import { ManageStudentFacilityComponent } from './student/manage-student-facility/manage-student-facility.component';
import { ViewStudentFacilityComponent } from './student/view-student-facility/view-student-facility.component';
import { FeeDefaultersComponent } from './report/fee-defaulters/fee-defaulters.component';
import { FeeConcessionComponent } from './report/fee-concession/fee-concession.component';
import { FineReportComponent } from './report/fine-report/fine-report.component';
import { ManageSectionComponent } from './student/manage-section/manage-section.component';
import { SectionListComponent } from './student/section-list/section-list.component';
import { SectionListDetailsComponent } from './student/section-list-details/section-list-details.component';
import { AssignRollNoComponent } from './student/assign-roll-no/assign-roll-no.component';
import { CustomFeeCollectionComponent } from './master/fees-structure/custom-fee-collection/custom-fee-collection.component';
import { ExportStudentComponent } from './master/export-student/export-student.component';
import { StudentIdCardComponent } from './student/student-id-card/student-id-card.component';
import { ManageSectionNameComponent } from './master/section/manage-section-name/manage-section-name.component';
import { CertificateComponentComponent } from './student/certificate-component/certificate-component.component';
import { NoDueCertificateComponent } from './student/certificate-component/no-due-certificate/no-due-certificate.component';
import { StudentDataListComponent } from './student/student-data-list/student-data-list.component';
import { FeesReportComponent } from './report/fees-report/fees-report.component';
import { PreviousDueCollectComponent } from './master/fees-structure/previous-due-collect/previous-due-collect.component';
import { PreDueListComponent } from './master/fees-structure/pre-due-list/pre-due-list.component';
import { CreateSubjectComponent } from './subject/create-subject/create-subject.component';
import { ManageSubjectComponent } from './subject/manage-subject/manage-subject.component';
import { CreateStaffComponent } from './staff/create-staff/create-staff.component';
import { ManageStaffComponent } from './staff/manage-staff/manage-staff.component';
import { ManageCoordinatorComponent } from './master/classes/manage-coordinator/manage-coordinator.component';
import { AssignRoleComponent } from './staff/assign-role/assign-role.component';
import { CreateNoticComponent } from './notifications/create-notic/create-notic.component';
import { ManageNoticComponent } from './notifications/manage-notic/manage-notic.component';
import { TransportRouteComponent } from './transport/transport-route/transport-route.component';
import { ManageTransportRouteComponent } from './transport/manage-transport-route/manage-transport-route.component';
import { ManualSmsComponent } from './manual-sms/manual-sms.component';
import { ChequeOptionComponent } from './master/fees-structure/cheque-option/cheque-option.component';
import { NgxPrintModule } from 'ngx-print';
import { StaffCertificateComponent } from './staff/staff-certificate/staff-certificate.component';
import { PaymentDetailsComponent } from './master/payment-details/payment-details.component';
import { ChangePasswordComponent } from './setting/change-password/change-password.component';
import { CreateBusComponent } from './transport/create-bus/create-bus.component';
import { BusMeterReadingComponent } from './transport/bus-meter-reading/bus-meter-reading.component';
import { MonthlyFeeComponent } from './master/fees-structure/monthly-fee/monthly-fee.component';
import { RecieptListComponent } from './master/fees-structure/reciept-list/reciept-list.component';
import { ReceiptPrintComponent } from './master/fees-structure/receipt-print/receipt-print.component';
import { AdmissionFeeCollectComponent } from './master/fees-structure/admission-fee-collect/admission-fee-collect.component';
import { AcademicSessionComponent } from './master/academic-session/academic-session.component';
import { StudentLeaveComponent } from './student/student-leave/student-leave.component';
import { ConcessionBoxComponent } from './master/fees-structure/concession-box/concession-box.component';
import { TransportBoxComponent } from './master/fees-structure/transport-box/transport-box.component';
import { TransportListComponent } from './student/transport-list/transport-list.component';
import { PromoteStudentComponent } from './student/promote-student/promote-student.component';
import { FeeCarryForwordComponent } from './student/fee-carry-forword/fee-carry-forword.component';
import { FeeCarryForwardListComponent } from './student/fee-carry-forward-list/fee-carry-forward-list.component';
import { AssignFeeToStudentComponent } from './master/fees-structure/assign-fee-to-student/assign-fee-to-student.component';
import { DemoteComponent } from './student/demote/demote.component';
import { TransferCertificateComponent } from './student/certificate-component/transfer-certificate/transfer-certificate.component';
import { FeesExcelReportComponent } from './report/fees-excel-report/fees-excel-report.component';
import { ManagePointsComponent } from './Transport/manage-points/manage-points.component';
import { NotificationCategoryComponent } from './notifications/notification-category/notification-category.component';
import { MassageTemplateComponent } from './Message/massage-template/massage-template.component';
import { DownloadCenterComponent } from './download-center/download-center.component';
import { CreateDownloadCenterComponent } from './download-center/create-download-center/create-download-center.component';
import { MonthlyFeesCollectionComponent } from './master/fees-structure/monthly-fees-collection/monthly-fees-collection.component';
import { UpdateAttandanceComponent } from './attandance/update-attandance/update-attandance.component';
import { FeeTransportReportComponent } from './report/fee-transport-report/fee-transport-report.component';
import { ParentAssoChildComponent } from './student/parent-asso-child/parent-asso-child.component';
import { MisReportComponent } from './report/mis-report/mis-report.component';


import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'

@NgModule({
  declarations: [
    AppComponent,
    SideHeaderComponent,
    TopHeaderComponent,
    DashboardComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    RadarChartComponent,
    DoughnutChartComponent,
    DataTableComponent,
    AdmissionComponent,
    RegistrationComponent,
    SchoolComponent,
    ClassesComponent,
    CreateClassesComponent,
    DownloadAdmissionComponent,
    FeesStructureComponent,
    FeesTypeComponent,
    CreateFeesStructureComponent,
    SchoolListComponent,
    RegistrationListComponent,
    RegistrationDetailViewComponent,
    LoginComponent,
    AdmissionListComponent,
    CustomFeesComponent,
    DownloadRegistrationComponent,
    FineComponent,
    FooterComponent,
    CustomFeesListComponent,
    CollectFeesComponent,
    AdmissionDetailsListComponent,
    FineListComponent,
    ManageStudentFacilityComponent,
    ViewStudentFacilityComponent,
    FeeDefaultersComponent,
    FeeConcessionComponent,
    FineReportComponent,
    ManageSectionComponent,
    SectionListComponent,
    SectionListDetailsComponent,
    AssignRollNoComponent,
    CustomFeeCollectionComponent,
    ExportStudentComponent,
    StudentIdCardComponent,
    ManageSectionNameComponent,
    CertificateComponentComponent,
    NoDueCertificateComponent,
    StudentDataListComponent,
    FeesReportComponent,
    PreviousDueCollectComponent,
    PreDueListComponent,
    CreateSubjectComponent,
    ManageSubjectComponent,
    CreateStaffComponent,
    ManageStaffComponent,
    ManageCoordinatorComponent,
    AssignRoleComponent,
    CreateNoticComponent,
    ManageNoticComponent,
    TransportRouteComponent,
    ManageTransportRouteComponent,
    ManualSmsComponent,
    ChequeOptionComponent,
    StaffCertificateComponent,
    PaymentDetailsComponent,
    ChangePasswordComponent,
    CreateBusComponent,
    BusMeterReadingComponent,
    MonthlyFeeComponent,
    RecieptListComponent,
    ReceiptPrintComponent,
    AdmissionFeeCollectComponent,
    AcademicSessionComponent,
    StudentLeaveComponent,
    ConcessionBoxComponent,
    TransportBoxComponent,
    TransportListComponent,
    PromoteStudentComponent,
    FeeCarryForwordComponent,
    FeeCarryForwardListComponent,
    AssignFeeToStudentComponent,
    DemoteComponent,
    TransferCertificateComponent,
    FeesExcelReportComponent,
    ManagePointsComponent,
    NotificationCategoryComponent,
    MassageTemplateComponent,
    DownloadCenterComponent,
    CreateDownloadCenterComponent,
    MonthlyFeesCollectionComponent,
    UpdateAttandanceComponent,
    FeeTransportReportComponent,
    ParentAssoChildComponent,
    MisReportComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    ClipboardModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTabsModule,
    MatButtonToggleModule,
    HttpClientModule,
    FormsModule,
    QRCodeModule,
    GooglePayButtonModule,
    AngularEditorModule,
    NgxPrintModule,
    Ng2SearchPipeModule,


    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,

    
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
