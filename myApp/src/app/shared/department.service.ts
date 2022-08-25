import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  departmentList: AngularFireList<any>;
  array=[] as any;

  constructor(private firebase: AngularFireDatabase) { 
    this.departmentList=this.firebase.list('departments');
    this.departmentList.snapshotChanges().subscribe(
      list => {
        this.array=list.map(item => { 
          return {
            $key:item.key,
            ...item.payload.val()
          };
        });
    });     
  };
 

  getDepartmentName($key) {
    if ($key == "0")
      return "";
    else{
      return _.find(this.array, (obj) => { return obj.$key == $key; })['name'];
    }
  }
}

