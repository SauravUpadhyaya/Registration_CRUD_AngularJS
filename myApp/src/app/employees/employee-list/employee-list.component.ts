import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DepartmentService } from 'src/app/shared/department.service';
import { EmployeeComponent } from '../employee/employee.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../../shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
 

  constructor(public service:EmployeeService, public departmentService: DepartmentService,
    public dialog: MatDialog,public notificationService: NotificationService,
    public dialogService:DialogService) { }
  listData: MatTableDataSource<any>;
  displayedColumns:string[]=['fullName', 'email', 'mobile', 'city', 'departmentName', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchkey:string;
  
  
  ngOnInit():void{
    this.service.getEmployees().subscribe(

      list => {
        let array=list.map(item => { 
         let departmentName = this.departmentService.getDepartmentName(item.payload.val()['department']);
          return {
            $key:item.key,
           departmentName: departmentName,
            ...item.payload.val()
          };

          
        });

        this.listData = new MatTableDataSource(array);
        this.listData.sort= this.sort;
        this.listData.paginator= this.paginator;
        // this.listData.filterPredicate = (data, filter) => {
        //   return this.displayedColumns.some(ele => {
        //     return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
        //   });
        // };
      
    });
  }
  onSearchClear(){
    this.searchkey="";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter=this.searchkey.trim().toLowerCase();
  }


  onCreate(){
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }
  onEdit(row){
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onDelete($key){
    // if(confirm('Are you sure to delete this record ?')){
    // this.service.deleteEmployee($key);
    // this.notificationService.warn('Deleted successfully');
    // }

    this.dialogService.openConfirmDialog('Are you sure to delete this record?').afterClosed()
    .subscribe(res=>{
     //console.log(res)
     if(res){
      this.service.deleteEmployee($key);
      this.notificationService.warn('Deleted successfully');
     }});
    }
  }
