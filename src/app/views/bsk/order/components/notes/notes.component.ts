import { Component, Input, OnInit } from '@angular/core';
import { CommentModel } from 'src/app/shared/models/comment.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  @Input('data') note = new CommentModel();
  constructor() {}

  ngOnInit(): void {}
}
