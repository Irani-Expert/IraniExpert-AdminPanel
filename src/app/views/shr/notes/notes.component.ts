import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  tableTypes = [
    { title: 'سفارشات', id: 8 },
    { title: 'درخواست مشتریان', id: 10 },
  ];
  dropDownTitleHolder: string = null;
  constructor() {}

  ngOnInit(): void {}
}
