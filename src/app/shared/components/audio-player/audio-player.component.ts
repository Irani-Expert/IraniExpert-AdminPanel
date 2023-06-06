import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  @Input() filePreview: any;
  @Input() fileName: string;
  @Input() file: any;

  constructor() {}

  ngOnInit(): void {}
}
