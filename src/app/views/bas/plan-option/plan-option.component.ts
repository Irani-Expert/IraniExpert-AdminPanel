import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-plan-option',
  templateUrl: './plan-option.component.html',
  styleUrls: ['./plan-option.component.scss']
})
export class PlanOptionComponent implements OnInit {
  @Input() planId:number;
  constructor(public activeModal: NgbActiveModal) {
    
   }

  ngOnInit(): void {
  }

}
