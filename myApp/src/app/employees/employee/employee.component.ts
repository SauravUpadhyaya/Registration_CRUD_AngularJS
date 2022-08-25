import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { EmployeeService } from '../../shared/employee.service';
import { DepartmentService } from '../../shared/department.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(public service: EmployeeService,
    public departmentService: DepartmentService,
    public notificationService: NotificationService,
    public dialogRef:MatDialogRef<EmployeeComponent>) {}

  // departments = [
  //   { id: 3, value: 'Dep 1' },
  //   { id: 2, value: 'Dep 2' },
  //   { id: 3, value: 'Dep 3' }];

  

  ngOnInit() {
    this.service.getEmployees();
  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
  }

  onSubmit(){
    //check if the form is valid or not
    if(this.service.form.valid){
      if (!this.service.form.get('$key')?.value)
      this.service.insertEmployee(this.service.form.value);
      
      else 
      
    // function to reset the form
    this.service.updateEmployee(this.service.form.value);
    this.service.form.reset();
    // function to initialize to default value
    this.service.initializeFormGroup();
    this.notificationService.success('submitted successfully');
    this.onClose();
      
    }
  }


  onClose(){
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();

  }
}
