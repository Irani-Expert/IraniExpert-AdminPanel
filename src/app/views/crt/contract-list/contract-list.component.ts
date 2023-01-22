import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],

})
export class ContractListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  contractList:FormGroup;

  constructor(  private modalService: NgbModal    ) {}

  ngOnInit(): void {


  }
  openModal(content: any) {
  
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' ,  size: 'lg', })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
       
          }
        },
        (reason) => {
          console.log('Err!', reason);
       
        }
      );
  }
}