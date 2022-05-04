import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataLayerService } from '../../services/data-layer.service';
import { Observable, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  startWith,
  debounceTime,
  switchMap,
  map,
  filter,
} from 'rxjs/operators';
import { SharedAnimations } from '../../animations/shared-animations';
import { SearchService } from '../../services/search.service';
import { Result } from '../../models/Base/result.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [SharedAnimations],
})
export class SearchComponent implements OnInit {
  results$: any ;
  searchCtrl: FormControl = new FormControl('');

  constructor(

    public searchService: SearchService,
    private _router: Router
  ) {}

  ngOnInit() {}

  getByTrackCode() {
    let value = parseInt(this.searchCtrl.value);
    //Todo Change To Get By Filter With Track Code or Agent Tell
    // this._complaintService
    //   .getByTarckCode(value)
    //   .toPromise()
    //   .then((res) => {
    //     this.results$ = res.data;
    //   });
  }

  openComplaint() {
    if (this.results$.trackCode !== undefined) {
      this.searchService.searchOpen = false;
      this._router.navigate([
        'crm/complaint/complaint-detail/' + this.results$.trackCode,
      ]);
    }
  }
}
