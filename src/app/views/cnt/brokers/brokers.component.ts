import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
interface Navigation {
  id: number;
  title: string;
  urlPath: string;
  isActive: boolean;
  icon: string;
}
@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  styleUrls: ['./brokers.component.scss'],
})
export class BrokersComponent implements OnInit {
  urlActiveId: number = 100;
  routeSubscriber: Subscription;
  navigations: Array<Navigation> = [
    {
      id: 1,
      title: 'لیست بروکر ها',
      urlPath: 'broker-list',
      isActive: true,
      icon: 'pi-list',
    },
    // ,
    // {
    //   id: 2,
    //   title: 'بروکر آیتم ها',
    //   urlPath: 'broker-items',
    //   isActive: false,
    //   icon: 'pi-info',
    // },
  ];
  private routeSubject = new Subject();
  constructor(private router: Router) {
    this.routeSubscriber = this.router.events
      .pipe(takeUntil(this.routeSubject))
      .subscribe({
        next: async (res) => {
          if (res instanceof Scroll) {
            if (res.routerEvent instanceof NavigationEnd) {
              for (let i = 0; i < this.navigations.length; i++) {
                if (this.urlActiveId == 100) {
                  if (this.navigations[i].urlPath) {
                    if (
                      res.routerEvent.urlAfterRedirects.split('/')[3] ==
                      this.navigations[i].urlPath
                    ) {
                      this.urlActiveId = i;
                    }
                  }
                } else {
                  if (this.navigations[i].urlPath) {
                    if (
                      res.routerEvent.urlAfterRedirects.split('/')[3] ==
                      this.navigations[i].urlPath
                    ) {
                      document
                        .getElementById(`ngb-nav-${this.urlActiveId}`)
                        .classList?.remove('active');
                      this.urlActiveId = i;
                      document
                        .getElementById(`ngb-nav-${i}`)
                        .classList?.add('active');
                    }
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
