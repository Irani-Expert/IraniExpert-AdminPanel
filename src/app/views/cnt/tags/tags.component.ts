import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ArticleService } from '../article/article/article.service';
import { GroupIdModel, tagModel } from './tagModel/tag.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { ToastrService } from 'ngx-toastr';
import { number } from 'echarts';
import { GroupService } from 'src/app/views/bas/group/group.service';
import { Page } from 'src/app/shared/models/Base/page';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  filterHolder: FilterModel = new FilterModel();
  @ViewChild('firstNameField') firstNameField;
  page: Page = new Page();

  randomColor: string = '';
  colorHolder: string = '';
  items: tagModel[] = new Array<tagModel>();
  addItem: tagModel = new tagModel();
  editable = false;
  updateId: number;
  addItemIput: string = '';
  updateTitle: string;
  editeType: number = 0;
  previousGroupId: number;
  dropDownTitleHolder: string = 'تمام هشتک‌ها';
  checkedMeta: boolean = false;
  selectedID: number;
  selectedText:string;
  selectedMeta:boolean;

  listItem = new Array<{
    backgroundColor: string;
    id: number;
    text: string;
    isMeta : boolean;
    groupIdEdiet : number;
  }>();
  colors: string[] = ['#d2e2e1', '#74b3be', '#a6887d', '#e8d3cc', '#0cead0'];
  constructor(
    private _articleService: ArticleService,
    private toastr: ToastrService,
    private _groupService: GroupService,

  ) {
    this.page.pageNumber = 0;
    this.page.size = 60;
  }
  // =========[گروپ آیدی]=======
  groupList: GroupIdModel[] = new Array<GroupIdModel>();
  selectedGroupId : GroupIdModel;

  // =========[مدال]======
  visibleEdited: boolean = false;
  visibleCreat: boolean = false;
  visibleDeleted : boolean = false;

  showModalEdited(id:number , text:any , meta:boolean , groupId : number) {
      this.selectedID = id;
      if (this.selectedGroupId == null || undefined) {
        this.selectedGroupId = this.groupList.find(it => it.value == 1);
      }
      else {
        this.selectedGroupId = this.groupList.find(it => it.value == groupId );
      }
      this.selectedText = text;
      this.visibleEdited = true;
      this.selectedMeta =meta;
  }
  showModalDelited(id : number){
    this.visibleDeleted = true;
    this.selectedID = id;
  }

  // ==========
  ngOnInit(): void {
    this.getData(null);
    this.getGroupList();
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;
    this.getData(this.previousGroupId);
  }
  pushData() {
    let counter = 0;
    this.listItem = [];
    this.randomColor = '';
    this.items.forEach((xi) => {
      if (counter == 5) {
        counter = 0;
      }
      this.colorHolder = this.randomColor;
      this.randomColor = this.colors[counter];

      if (this.randomColor !== this.colorHolder) {
        this.listItem.push({
          backgroundColor: this.randomColor,
          id: xi.id,
          text: xi.title,
          isMeta :xi.isSharp,
          groupIdEdiet : xi.groupID
        });
      }
      counter++;
    });
  }
  async getGroupList() {
    this._groupService
      .getTitleValues(0, 10000, 'ID', null, 'Group')
      .subscribe((res: Result<Paginate<any[]>>) => {
        this.groupList = res.data.items;
        
        console.log(this.groupList);
        
        //  this.page.totalElements = res.data.length;
      });
  }

  getData(groupID: number) {
    this.previousGroupId = groupID;
    this.filterHolder.groupID = groupID;
    this._articleService
      .getTags(
        this.filterHolder,
        this.page.pageNumber !== 0
          ? this.page.pageNumber - 1
          : this.page.pageNumber,
        this.page.size
      )
      .subscribe(
        (res: Result<Paginate<tagModel[]>>) => {
          this.items = [];
          this.items = res.data['items'];
          this.page.totalElements = res.data.totalCount;

          this.pushData();
        },
        (error) => {}
      );
  }
  selectGroupId(id: number, Name: string) {
    this.dropDownTitleHolder = Name;
    this.addItem.groupID = id;
    this.getData(id);
  }
  editFunction( text: string) {
    this.selectedText = text;
  }
  updateTags(id: number) {
    var index = this.listItem.findIndex((x) => x.id == id);
    this.items[index].title = this.listItem[index].text;
    this.items[index].isSharp = this.listItem[index].isMeta;
    this.items[index].groupID = this.listItem[index].groupIdEdiet;
    this._articleService.updateTags(id, this.items[index]).subscribe((data) => {
      if (data.success) {
        this.toastr.success(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
    this.visibleEdited = false;
        
      } else {
        this.toastr.error(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    });
  }
  onContentChange(id: number) {
    console.log(this.checkedMeta);
      var index = this.listItem.findIndex((x) => x.id == id);
      console.log(this.listItem[index].text);
      // if (this.selectedText[0] != '#') {
      //   var isPersian = /^[\u0600-\u06FF\s]+$/;

      //   if (isPersian.test(this.selectedText[0])) {
      //     this.selectedText = this.selectedText + '#';
      //   } else {
      //     this.selectedText = '#' + this.selectedText;
      //   }
      // }
        this.listItem[index].text = this.selectedText;
        this.listItem[index].isMeta = this.checkedMeta;
        this.listItem[index].groupIdEdiet = this.selectedGroupId.value;
       
        this.updateTags(id);
      
    
  }
  deletetags(id: number) {
    this._articleService.delete(id, 'LinkTag').subscribe((res) => {
      if (res.success) {
        this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
          timeOut: 3000,
          positionClass: 'toast-top-left',
        });
        this.getData(this.previousGroupId);
      } else {
        this.toastr.error('خطا در حذف', res.message, {
          timeOut: 3000,
          positionClass: 'toast-top-left',
        });
      }
    });
    this.visibleDeleted = false;
  }
  addTagService() {
    if (this.addItemIput.length > 0) {
      // this.addItemIput = this.addItemIput.replace(/#/g, '');
      // if (this.addItemIput[0] != '#') {
      //   var isPersian = /^[\u0600-\u06FF\s]+$/;

      //   if (isPersian.test(this.addItemIput[0])) {
      //     this.addItemIput = this.addItemIput + '#';
      //   } else {
      //     this.addItemIput = '#' + this.addItemIput;
      //   }
      // }
      this.addItem.isSharp = this.checkedMeta;
      this.addItem.groupID = this.selectedGroupId.value;
      this.addItem.title = this.addItemIput;
      console.log(this.addItem.groupID);
      this._articleService.addLinkTag(this.addItem).subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.getData(this.previousGroupId);
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
      this.addItemIput = '';
    }
    this.visibleCreat = false;
  }
  changeSituation(type: number) {
    this.editable = false;
    
    if (type == 1) {
      this.visibleCreat = true;
    }
    if (type == this.editeType) {
      this.editeType = 0;
    } else {
      this.editeType = type;
    }
    if (this.editeType == 2) {
      // this.editable=!this.editable
      this.editable = true;
    }
  }

  onToggle() {
    this.editable = false;
    this.editeType = 0;
  }
  closeModal(){
    this.visibleEdited = false;
    this.visibleCreat = false;
    this.visibleDeleted = false;
  }
  
}
