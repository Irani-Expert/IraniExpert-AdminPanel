import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
class BenefitsModel {
  advantages: string;
  disadvantages: string;
}
class SimpleArr {
  value: string;
  id: number;
}
@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
})
export class BenefitsComponent implements OnInit {
  isChanging = false;
  @Output('result') result = new EventEmitter<any>();
  @Input('data') data: BenefitsModel = new BenefitsModel();
  disAdvantageArr: SimpleArr[] = new Array<SimpleArr>();
  advantagesArr = new Array<SimpleArr>();
  advantages: string[] = new Array<string>('');
  disadvantages: string[] = new Array<string>('');
  constructor(private renderer2: Renderer2) {}
  ngOnInit(): void {
    this.setArrys(this.advantages, this.disadvantages);
  }

  setArrys(advantage: string[], disadvantages: string[]) {
    advantage.forEach((it, counter) => {
      this.advantagesArr.push({ id: counter + 1, value: it });
    });
    disadvantages.forEach((it, counter) => {
      this.disAdvantageArr.push({ id: counter + 1, value: it });
    });
  }
  toAdd(type: number, item: SimpleArr, event: any) {
    event.preventDefault();
    if (type == 0) {
      this.pushToDisAdvs(item);
    } else {
      this.pushToAdvs(item);
    }
  }

  pushToDisAdvs(item: SimpleArr) {
    if (this.checkArr(item.id, this.disAdvantageArr)) {
      this.disAdvantageArr.push({ id: item.id + 1, value: '' });
      setTimeout(() => {
        let node = document.getElementById(`dis-${item.id + 1}`);
        node.focus();
      }, 200);
    } else {
      console.log('AlreadyExist');
    }
  }
  get _advStr() {
    let x = '';
    this.advantagesArr.forEach((it) => (x += `${it.value}@`));
    return x.trim().slice(0, x.length - 1);
  }
  get _disAdvStr() {
    let x = '';
    this.disAdvantageArr.forEach((it) => (x += `${it.value}@`));
    return x.trim().slice(0, x.length - 1);
  }
  pushToAdvs(item: SimpleArr) {
    if (this.checkArr(item.id, this.advantagesArr)) {
      this.advantagesArr.push({ id: item.id + 1, value: '' });
      setTimeout(() => {
        let node = document.getElementById(`adv-${item.id + 1}`);
        node.focus();
      }, 200);
    } else {
      console.log('AlreadyExist');
    }
  }
  checkArr(id: number, arr: SimpleArr[]) {
    if (id < arr.length) {
      // Dont Make New One
      return false;
    } else {
      // Make New One

      return true;
    }
  }
  sendBackToParent() {
    this.result.emit({
      advantages: this._advStr,
      disadvantages: this._disAdvStr,
    });
    this.isChanging = false;
  }
  // pushArr(value: string, type: number, id: number) {
  //   if (type == 0) {
  //     let x = this.disAdvantageArr.findIndex((it) => it.id == id);
  //     if (x == -1) {
  //       this.disAdvantageArr.push({ value: value, id: id });
  //     } else {
  //       this.disAdvantageArr[x].value = value;
  //     }
  //     console.log(this.disAdvantageArr);
  //   } else {
  //     let x = this.advantagesArr.findIndex((it) => it.id == id);
  //     if (x == -1) {
  //       this.advantagesArr.push({ value: value, id: id });
  //     } else {
  //       this.advantagesArr[x].value = value;
  //     }
  //     console.log(this.advantagesArr);
  //   }
  // }

  // checkIsNeedAClone(type: number, id: number) {
  //   // if (id == 1) {
  //   //   return true;
  //   // } else {
  //   //   let res = false;
  //   //   if (type == 0) {
  //   //     this.disAdvantageArr.length > id - 1 ? (res = false) : (res = true);
  //   //   } else {
  //   //     this.advantagesArr.length > id - 1 ? (res = false) : (res = true);
  //   //   }
  //   return true;
  //   // }
  // }

  // addInput(elementId: string, positionId: string) {
  //   let type = elementId == 'disadvantage' ? 0 : 1;
  //   let node: any = document.getElementById(elementId);

  //   let id = parseInt(node.id.split('-')[2]);

  //   node.addEventListener('keypress', (ev) => {
  //     if (ev.key === 'Enter') {
  //       this.pushArr(node.value, type, id);
  //     }
  //   });
  //   let clone: any = node.cloneNode(true);

  //   clone.id = `${elementId}-input-${id + 1}`;

  //   clone.style.height = '100px';
  //   clone.value = '';
  //   document.getElementById(positionId).appendChild(clone);
  //   setTimeout(() => {
  //     clone.focus();
  //   }, 100);
  // }
}
