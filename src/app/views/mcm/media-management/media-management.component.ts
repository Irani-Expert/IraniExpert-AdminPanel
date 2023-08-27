import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivationEnd, Event, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
class Navigation {
  id: number = 0;
  title: string = '';
  urlPath: string = '';
  isActive: boolean = false;
  icon: string = '';
}
@Component({
  selector: 'app-media-management',
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.scss'],
})
export class MediaManagementComponent implements OnDestroy, AfterViewInit {
  urlActiveId: number = 100;
  routeSubscriber: Subscription;
  navigations: Array<Navigation> = [
    {
      id: 1,
      title: 'لیست فایل ها',
      urlPath: 'media-list',
      isActive: true,
      icon: 'pi-list',
    },
    {
      id: 2,
      title: 'آپلود فایل',
      urlPath: 'upload-center',
      isActive: true,
      icon: 'pi-upload',
    },
    {
      id: 3,
      title: 'جایگاه ها',
      urlPath: 'media-stations',
      isActive: true,
      icon: 'pi-map-marker',
    },
  ];
  constructor(private router: Router) {
    this.routeSubscriber = this.router.events.subscribe({
      next: (res) => {
        if (res instanceof NavigationEnd) {
          for (let i = 0; i <= this.navigations.length; i++) {
            if (this.urlActiveId == 100) {
              if (this.navigations[i].urlPath) {
                if (res.url.split('/')[2] == this.navigations[i].urlPath) {
                  this.urlActiveId = i;
                }
              }
            } else {
              if (this.navigations[i]?.urlPath) {
                if (res.url.split('/')[2] == this.navigations[i].urlPath) {
                  document
                    .getElementById(`ngb-nav-${this.urlActiveId}`)
                    .classList?.remove('active');
                  document
                    .getElementById(`ngb-nav-${i}`)
                    .classList?.add('active');
                }
              }
            }
          }
        }
      },
    });
  }
  ngAfterViewInit(): void {
    document.getElementById(`ngb-nav-${0}`).classList?.remove('active');
    document
      .getElementById(`ngb-nav-${this.urlActiveId}`)
      .classList?.add('active');
  }

  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
  }

  ngOnInit(): void {}
}
