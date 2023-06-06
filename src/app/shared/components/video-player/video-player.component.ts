import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() filePreview: any;
  @Input() fileName: string;
  @Input() file: any;
  constructor() {}

  ngOnInit(): void {}
}
