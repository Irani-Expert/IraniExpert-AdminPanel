import { Router } from '@angular/router';
import { BreadcrumbListModel, BreadcrumbModel } from './../../models/breadcrumb.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrump',
  templateUrl: './breadcrump.component.html',
  styleUrls: ['./breadcrump.component.scss']
})
export class BreadcrumpComponent implements OnInit {
  @Input('breadcrumb') public breadcrumbList:BreadcrumbListModel;
  breadcrumbModel:BreadcrumbListModel |undefined;
  constructor(protected _router:Router) { }

  ngOnInit(): void {
    this.breadcrumbModel=this.breadcrumbList;
  }

}
