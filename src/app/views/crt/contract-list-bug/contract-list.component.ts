import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractModel } from './contract.model';


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],

})
export class ContractListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  contractList:FormGroup;
contractModel:ContractModel;
  constructor(  private modalService: NgbModal  ,
    private _formBuilder: FormBuilder  ) {}

  ngOnInit(): void {

    this.contractList = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      sellingType: [null, Validators.compose([Validators.required])],
      prcentReward: [null, Validators.compose([Validators.required])],
      fromDate: [null, Validators.compose([Validators.required])],
      toDate: [null, Validators.compose([Validators.required])],
      roleID: [null, Validators.compose([Validators.required])],
      userID: [null, Validators.compose([Validators.required])],

    });
  }
  openModal(content: any,row:ContractModel) {
    if (row === undefined) {
      row = new ContractModel();
      row.id = 0;
      row.prcentReward = 0;
    }
    this.contractModel = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' ,  size: 'lg', })
      .result.then(
        (result ) => {
         
        },
        (reason) => {
          
          console.log('Err!', reason);
       
        }
      );
  }
 async check(){
    
    console.log(this.contractModel.prcentReward)
    
  }
}