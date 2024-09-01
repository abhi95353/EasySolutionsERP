import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataTableComponent } from './tables/data-table/data-table.component';
import { AdmissionComponent } from './master/admission/admission.component';
import { RegistrationComponent } from './master/registration/registration.component';
import { SchoolComponent } from './master/school/school.component';
import { ClassesComponent } from './master/classes/classes.component';
import { DownloadAdmissionComponent } from './master/admission/download-admission/download-admission.component';
import { FeesStructureComponent } from './master/fees-structure/fees-structure.component';
import { FeesTypeComponent } from './master/fees-structure/fees-type/fees-type.component';
import { SchoolListComponent } from './master/school/school-list/school-list.component';
import { RegistrationListComponent } from './master/registration/registration-list/registration-list.component';
import { LoginComponent } from './login/login.component';
import { AdmissionListComponent } from './master/admission/admission-list/admission-list.component';
import { CustomFeesComponent } from './master/fees-structure/custom-fees/custom-fees.component';
import { FineComponent } from './master/fees-structure/fine/fine.component';
import { LoginGuardGuard } from './login-guard.guard';
import { DownloadRegistrationComponent } from './master/registration/download-registration/download-registration.component';
import { CustomFeesListComponent } from './master/fees-structure/custom-fees-list/custom-fees-list.component';
import { CollectFeesComponent } from './master/fees-structure/collect-fees/collect-fees.component';
import { ManageStudentFacilityComponent } from './student/manage-student-facility/manage-student-facility.component';
import { ViewStudentFacilityComponent } from './student/view-student-facility/view-student-facility.component';
import { FeeDefaultersComponent } from './report/fee-defaulters/fee-defaulters.component';
import { FeeConcessionComponent } from './report/fee-concession/fee-concession.component';
import { FineReportComponent } from './report/fine-report/fine-report.component';
import { ManageSectionComponent } from './student/manage-section/manage-section.component';
import { SectionListComponent } from './student/section-list/section-list.component';
import { AssignRollNoComponent } from './student/assign-roll-no/assign-roll-no.component';
import { CustomFeeCollectionComponent } from './master/fees-structure/custom-fee-collection/custom-fee-collection.component';
import { ExportStudentComponent } from './master/export-student/export-student.component';
import { StudentIdCardComponent } from './student/student-id-card/student-id-card.component';
import { ManageSectionNameComponent } from './master/section/manage-section-name/manage-section-name.component';
import { CertificateComponentComponent } from './student/certificate-component/certificate-component.component';
import { StudentDataListComponent } from './student/student-data-list/student-data-list.component';
import { FeesReportComponent } from './report/fees-report/fees-report.component';
import { PreviousDueCollectComponent } from './master/fees-structure/previous-due-collect/previous-due-collect.component';
import { PreDueListComponent } from './master/fees-structure/pre-due-list/pre-due-list.component';
import { CreateSubjectComponent } from './subject/create-subject/create-subject.component';
import { ManageSubjectComponent } from './subject/manage-subject/manage-subject.component';
import { CreateStaffComponent } from './staff/create-staff/create-staff.component';
import { ManageStaffComponent } from './staff/manage-staff/manage-staff.component';
import { AssignRoleComponent } from './staff/assign-role/assign-role.component';
import { ManageNoticComponent } from './notifications/manage-notic/manage-notic.component';
import { TransportRouteComponent } from './transport/transport-route/transport-route.component';
import { ManageTransportRouteComponent } from './transport/manage-transport-route/manage-transport-route.component';
import { ManualSmsComponent } from './manual-sms/manual-sms.component';
import { ChequeOptionComponent } from './master/fees-structure/cheque-option/cheque-option.component';
import { StaffCertificateComponent } from './staff/staff-certificate/staff-certificate.component';
import { ChangePasswordComponent } from './setting/change-password/change-password.component';
import { CreateBusComponent } from './transport/create-bus/create-bus.component';
import { BusMeterReadingComponent } from './transport/bus-meter-reading/bus-meter-reading.component';
import { AcademicSessionComponent } from './master/academic-session/academic-session.component';
import { StudentLeaveComponent } from './student/student-leave/student-leave.component';
import { TransportListComponent } from './student/transport-list/transport-list.component';
import { PromoteStudentComponent } from './student/promote-student/promote-student.component';
import { FeeCarryForwordComponent } from './student/fee-carry-forword/fee-carry-forword.component';
import { FeeCarryForwardListComponent } from './student/fee-carry-forward-list/fee-carry-forward-list.component';
import { AssignFeeToStudentComponent } from './master/fees-structure/assign-fee-to-student/assign-fee-to-student.component';
import { DemoteComponent } from './student/demote/demote.component';
import { TransferCertificateComponent } from './student/certificate-component/transfer-certificate/transfer-certificate.component';
import { FeesExcelReportComponent } from './report/fees-excel-report/fees-excel-report.component';
import { PermitsAdmissionGuard } from './permits-admission.guard';
import { PermitsAccountsGuard } from './permits-accounts.guard';
import { NotificationCategoryComponent } from './notifications/notification-category/notification-category.component';
import { MassageTemplateComponent } from './Message/massage-template/massage-template.component';
import { DownloadCenterComponent } from './download-center/download-center.component';
import { UpdateAttandanceComponent } from './attandance/update-attandance/update-attandance.component';
import { FeeTransportReportComponent } from './report/fee-transport-report/fee-transport-report.component';
import { PermitsGuardGuard } from './permits-guard.guard';
import { ParentAssoChildComponent } from './student/parent-asso-child/parent-asso-child.component';
import { MisReportComponent } from './report/mis-report/mis-report.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent, 
    canActivate: [LoginGuardGuard],
  },
  {
    path: 'tables',
    component: DataTableComponent,
    canActivate: [LoginGuardGuard],
  },
  {
    path: 'student-admission',
    component: AdmissionComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard], 
  },
  {
    path: 'manage-student-section',
    component: ManageSectionComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-student-roll-no',
    component: AssignRollNoComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-section-list',
    component: SectionListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-admission-list',
    component: AdmissionListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard],
  },
  {
    path: 'student-registration',
    component: RegistrationComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard],
  },
  {
    path: 'student-registration-list',
    component: RegistrationListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard],
  },
  {
    path: 'school-registration',
    component: SchoolComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'school-list',
    component: SchoolListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-classes',
    component: ClassesComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'download-form-admission',
    component: DownloadAdmissionComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard],
  },
  {
    path: 'fee-structure',
    component: FeesStructureComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'facilities',
    component: FeesTypeComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'custom-fees',
    component: CustomFeesComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'custom-fees-list',
    component: CustomFeesListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'fees-collect',
    component: CollectFeesComponent,
    canActivate: [LoginGuardGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-fine',
    component: FineComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-student-fee',
    component: ManageStudentFacilityComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-fee-list',
    component: ViewStudentFacilityComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'fee-defaulter-list',
    component: FeeDefaultersComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'fee-concession-list',
    component: FeeConcessionComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'fee-fine-list',
    component: FineReportComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'fee-report',
    component: FeesReportComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'export-student',
    component: ExportStudentComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-id-card',
    component: StudentIdCardComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manageSection-list',
    component: ManageSectionNameComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-certificate',
    component: CertificateComponentComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-data-list',
    component: StudentDataListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'create-subject',
    component: CreateSubjectComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-subject',
    component: ManageSubjectComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'create-staff',
    component: CreateStaffComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-staff',
    component: ManageStaffComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'pre-due-list',
    component: PreDueListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-notice',
    component: ManageNoticComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'create-bus-route',
    component: TransportRouteComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-bus-route',
    component: ManageTransportRouteComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-cheque',
    component: ChequeOptionComponent,
    canActivate: [LoginGuardGuard, PermitsAccountsGuard],
  },
  {
    path: 'staff-certificate',
    component: StaffCertificateComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'send-sms',
    component: ManualSmsComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-bus-driver',
    component: CreateBusComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'bus-meter-reading',
    component: BusMeterReadingComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'create-session',
    component: AcademicSessionComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-leave',
    component: StudentLeaveComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-transport-list',
    component: TransportListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'promote-student',
    component: PromoteStudentComponent,
    canActivate: [LoginGuardGuard, PermitsAccountsGuard],
  },
  {
    path: 'demote-student',
    component: DemoteComponent,
    canActivate: [LoginGuardGuard, PermitsAccountsGuard],
  },
  {
    path: 'fees-carry-forward',
    component: FeeCarryForwordComponent,
    canActivate: [LoginGuardGuard, PermitsAccountsGuard],
  },
  {
    path: 'fees-carry-forward-list',
    component: FeeCarryForwardListComponent,
    canActivate: [LoginGuardGuard, PermitsAccountsGuard],
  },
  {
    path: 'apply-fees-to-student',
    component: AssignFeeToStudentComponent,
    canActivate: [LoginGuardGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'student-tc',
    component: TransferCertificateComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'fee-excel-report',
    component: FeesExcelReportComponent,
    canActivate: [LoginGuardGuard],
  },
  {
    path: 'notification-category',
    component: NotificationCategoryComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'manage-download-center',
    component: DownloadCenterComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'msg-template',
    component: MassageTemplateComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'attandance',
    component: UpdateAttandanceComponent,
    canActivate: [PermitsGuardGuard],
  },
  {
    path: 'student-transport-report',
    component: FeeTransportReportComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'student-transport-list',
    component: TransportListComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'mis-report',
    component: MisReportComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  {
    path: 'parent-asso-child',
    component: ParentAssoChildComponent,
    canActivate: [LoginGuardGuard, PermitsAdmissionGuard, PermitsAccountsGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
