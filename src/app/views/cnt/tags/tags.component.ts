import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  randomColor: string = '';
  colorHolder: string = '';
  listItem = new Array<{
    backgroundColor: string;
    id: number;
  }>();
  colors: string[] = ['#d2e2e1', '#74b3be', '#a6887d', '#e8d3cc', '#0cead0'];
  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i <= 9; ) {
      this.colorHolder = this.randomColor;
      this.randomColor =
        this.colors[Math.floor(Math.random() * this.colors.length)];

      if (this.randomColor !== this.colorHolder) {
        this.listItem.push({ backgroundColor: this.randomColor, id: i });
        i++;
      } else {
        i;
      }
    }
  }
}
