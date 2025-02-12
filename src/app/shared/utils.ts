export class Utils {
  static isMobile() {
    return window && window.matchMedia('(max-width: 767px)').matches;
  }
  static isXLMonitor() {
    return window && window.matchMedia('(max-width: 1439px)').matches;
  }
  static isLMonitor() {
    return window && window.matchMedia('(max-width: 1023px)').matches;
  }
  static ngbDateToDate(ngbDate: { month; day; year }) {
    if (!ngbDate) {
      return null;
    }
    return new Date(`${ngbDate.month}/${ngbDate.day}/${ngbDate.year}`);
  }
  static dateToNgbDate(date: Date) {
    if (!date) {
      return null;
    }
    date = new Date(date);
    return {
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: date.getFullYear(),
    };
  }
  static scrollToTop(selector: string) {
    if (document) {
      const element = <HTMLElement>document.querySelector(selector);
      element.scrollTop = 0;
    }
  }
  static scrollTopWindow() {
    if (window) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }
  static genId() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  static scrollTracker() {
    return window && window.scrollY;
  }
}
