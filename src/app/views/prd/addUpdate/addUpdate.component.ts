import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';

@Component({
  selector: 'app-addUpdate',
  templateUrl: './addUpdate.component.html',
  styleUrls: ['./addUpdate.component.scss']
})
export class AddUpdateComponent implements OnInit {
productId:number=0;
  constructor(private _route:ActivatedRoute) {
    this.productId = parseInt(
      this._route.snapshot.paramMap.get('productId') ?? '0'
    );
   }

  ngOnInit(): void {

  }




}
