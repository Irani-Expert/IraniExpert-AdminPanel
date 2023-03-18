import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Result } from 'src/app/shared/models/Base/result.model';
import{allcommissionService}from 'src/app/views/crt/allcommission.service'
import { allComissionModel } from './allComission.model';
@Component({
  selector: 'app-all-commission',
  templateUrl: './all-commission.component.html',
  styleUrls: ['./all-commission.component.scss']
})
export class AllCommissionComponent implements OnInit {
addReceiptModal: any;
modalKeeper:any
mainModalKeeper:any
expireDate: any;
rows:allComissionModel[]=new Array<allComissionModel>
  constructor(    private modalService: NgbModal,
    private _allcommissionService:allcommissionService) { }

  ngOnInit(): void {
  this.getAllCommission()
  }
  getAllCommission(){
    this._allcommissionService.getCommissionAllUser(2).subscribe((commission) => {
    this.rows=commission.data
    console.log(this.rows);
    
    });

  }
  openModal(content: any,modelsize:string){
    if(modelsize!="lg"){
      this.modalKeeper.close()
          }
          else{            
        this.mainModalKeeper=content
          }
      
 this.modalKeeper=this.modalService
    .open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: modelsize,
   
    })
    
  this.modalKeeper.result.then((result) => {
 }, (result) => {
  if(modelsize!="lg"){
    this.addReceipt();
     } });
 
    
    //  .result.then(function() {
    
    //  });
  }
  addReceipt(){
    this.modalKeeper.close()
   this.openModal(this.mainModalKeeper,"lg")
   
  }
}
