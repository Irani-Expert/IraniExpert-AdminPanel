import { Component, ElementRef, HostBinding, HostListener, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../article/article/article.service';
import { tagModel } from './tagModel/tag.model';
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
  filterHolder: FilterModel=new FilterModel;
  @ViewChild("firstNameField") firstNameField;
  page: Page = new Page();

  randomColor: string = '';
  colorHolder: string = '';
  items:tagModel[]=new Array<tagModel>();;
  addItem:tagModel=new tagModel;
  editable = false;
  updateId:number;
  addItemIput:string
  updateTitle:string
  editeType:number=0;
  previousGroupId:number
  dropDownTitleHolder:string='تمام هشتک‌ها'
  groupList: any[] = new Array<any>();
  listItem = new Array<{
    backgroundColor: string;
    id: number;
    text:string
  }>();
  colors: string[] = ['#d2e2e1', '#74b3be', '#a6887d', '#e8d3cc', '#0cead0'];
  constructor(private _articleService: ArticleService,
    private toastr: ToastrService,
    private _groupService: GroupService,

    ) {
      this.page.pageNumber = 0;
      this.page.size = 8;
    }

  ngOnInit(): void {
    this.getData(null)
     this.getGroupList()
  
  }
  setPage(pageInfo: number){
   this.page.pageNumber=pageInfo
   this.getData(this.previousGroupId)
  }
  pushData(){
    let counter=0;
    this.listItem=[]
    this.randomColor =''
    this.items.forEach(xi=>{
      if(counter==5){
        counter=0
      }
      this.colorHolder = this.randomColor;
      this.randomColor =
        this.colors[counter];

      if (this.randomColor !== this.colorHolder) {
        this.listItem.push({ backgroundColor: this.randomColor, id: xi.id,text:xi.title });
      }
      counter++
    })
    console.log(this.listItem);
    
  }
  async getGroupList() {
    this._groupService
      .getTitleValues(0, 10000, 'ID', null, 'Group')
      .subscribe((res: Result<Paginate<any[]>>) => {
        this.groupList = res.data.items;
        //  this.page.totalElements = res.data.length;
      });
  }

  getData(groupID:number) {
  this.previousGroupId=groupID 
    this.filterHolder.groupID=groupID
    this._articleService
      .getTags(
        this.filterHolder,
        this.page.pageNumber !== 0 ?  this.page.pageNumber - 1 :  this.page.pageNumber,
         this.page.size,
         null
      )
      .subscribe((res: Result<Paginate<tagModel[]>>) => {
        this.items=[] 
        this.items=res.data['items']
        this.page.totalElements = res.data.totalCount;

        this.pushData()
        },
        (error) => {
      
        }
      );
  }
  selectGroupId(id:number,Name:string){
  
  this.dropDownTitleHolder=Name
  this.addItem.groupID=id
  this.getData(id)  
}
  editFunction(id:number,text:string){
  this.updateTitle=text
  this.updateId=id
   
  
  }
  updateTags(id:number){
    var index= this.listItem.findIndex(x=>x.id==id)
    this.items[index].title= this.listItem[index].text
    this._articleService
    .updateTags(id, this.items[index])
    .subscribe(
      (data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      }
    );
  }
  onContentChange(id:number){

    if(this.updateId==id){
       var index= this.listItem.findIndex(x=>x.id==id)
       if(this.listItem[index].text!=undefined){
         this.listItem[index].text=this.updateTitle
       if(this.listItem[index].text[0]!='#'){
         this.listItem[index].text='#'+this.listItem[index].text
       }
       this.updateTags(id)

     }
    }
  
  }
  deletetags(id:number){
   this._articleService.delete(id,'LinkTag').subscribe((res) => {
    if (res.success) {
      this.toastr.success(
        'فرایند حذف موفقیت آمیز بود',
        'موفقیت آمیز!',
        {
          timeOut: 3000,
          positionClass: 'toast-top-left',
        }
      );
      this.getData(this.previousGroupId)
    } else {
      this.toastr.error('خطا در حذف', res.message, {
        timeOut: 3000,
        positionClass: 'toast-top-left',
      });
    }
  });
  }
  addTagService(){
    
    this.addItemIput=this.addItemIput.replace(/#/g,"")
    if(this.addItemIput[0]!='#'){
      var isPersian = /^[\u0600-\u06FF\s]+$/;

      if (isPersian.test(this.addItemIput[0])) {
        this.addItemIput=this.addItemIput+'#'
      }
      else{
        this.addItemIput='#'+this.addItemIput
      }
    }
    
    this.addItem.title=this.addItemIput
    this._articleService
    .addLinkTag(this.addItem)
    .subscribe(
      (data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.getData(this.previousGroupId)

        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      }
    );
    this.addItemIput=''
  }
  changeSituation(type:number){
    this.editable=false

    if(type==1){
   this.setFocus()
    }
  if(type==this.editeType){
    this.editeType=0
  }  
  else{
    this.editeType=type
  }
  if(this.editeType==2){
    // this.editable=!this.editable
    this.editable=true
  }
  }
  setFocus(){
    
    setTimeout(() => this.firstNameField.nativeElement.focus(),500); // 2500 is millisecond

  }
  onToggle() {
    
    this.editable = false;
    this.editeType=0

  }
  closeAddTag(){
    this.editeType=0
  }
}
