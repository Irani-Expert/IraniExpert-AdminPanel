import { Component, OnInit } from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';

@Component({
  selector: 'app-addUpdate',
  templateUrl: './addUpdate.component.html',
  styleUrls: ['./addUpdate.component.scss']
})
export class AddUpdateComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  page = 1;
  pageSize = 8;
  products: any[] = [];
  constructor(   private dl: DataLayerService) { }

  ngOnInit(): void {
    this.dl.getProducts()
    .subscribe((products: any[]) => {
      this.products = products;
    });
  }



  selectAll(_e: any) {
    this.products = this.products.map(p => {
      p.isSelected = this.allSelected;
      return p;
    });

    if (this.allSelected) {

    }
    console.log(this.allSelected);
  }
}
