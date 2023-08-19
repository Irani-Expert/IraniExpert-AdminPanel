import { Component, ElementRef, HostBinding, HostListener, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../article/article/article.service';
import { tagModel } from './tagModel/tag.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { ToastrService } from 'ngx-toastr';
import { number } from 'echarts';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  filterHolder: FilterModel=new FilterModel;
  @ViewChild("firstNameField") firstNameField;

  randomColor: string = '';
  colorHolder: string = '';
  items:tagModel[]=new Array<tagModel>();;
  addItem:tagModel=new tagModel;
  editable = false;
  updateId:number;
  addItemIput:string
  updateTitle:string
  editeType:number=0;
  listItem = new Array<{
    backgroundColor: string;
    id: number;
    text:string
  }>();
  colors: string[] = ['#d2e2e1', '#74b3be', '#a6887d', '#e8d3cc', '#0cead0'];
  constructor(private _articleService: ArticleService,
    private toastr: ToastrService,
    ) {}

  ngOnInit(): void {
    this.getData()
  
  
  }
  pushData(){
    let counter=0;
    this.listItem=[]
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
  }
  getData() {
  
    this._articleService
      .getTags(
        this.filterHolder,
         0,
         100,
         null
      )
      .subscribe(
        (res: Result<tagModel[]>) => {
          
        this.items=res.data['items']
        this.pushData()
        },
        (error) => {
      
        }
      );
  }
  editFunction(id:number,text:string){
  this.updateTitle=text
  this.updateId=id
   
  
  }
  updateTags(id:number){
    var index= this.listItem.findIndex(x=>x.id==id)
    this.items[index].title= this.listItem[index].text
    debugger
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
    debugger
    console.log(this.updateId);
    console.log(this.updateTitle);
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
      this.listItem.slice()
      this.getData()
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
      this.addItemIput='#'+this.addItemIput
    }
    this.addItem.title=this.addItemIput
    this.addItem.groupID=1
    this._articleService
    .addLinkTag(this.addItem)
    .subscribe(
      (data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.getData()

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
