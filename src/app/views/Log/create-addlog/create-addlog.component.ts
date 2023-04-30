import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeService } from '../../Log/nodeservice';
import { AllCheckingLog } from '../models/all-checking-logModel';
import { LogService } from '../log.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { TableType } from '../models/table-typeModel';
import { Key } from 'protractor';
import { number } from 'echarts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { findIndex } from 'rxjs';
import * as moment from 'jalali-moment';
import { TreeData } from '../create-addlog/TreeData';
@Component({
  selector: 'app-create-addlog',
  templateUrl: './create-addlog.component.html',
  styleUrls: ['./create-addlog.component.scss']
})
export class CreateAddlogComponent implements OnInit {
  addLogForm:FormGroup;
  addNewLogModel:AllCheckingLog=new AllCheckingLog;
  constructor(    private modalService: NgbModal, private nodeService: NodeService ,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _logServices:LogService  ) { 
      this.addLogForm = this._formBuilder.group({
        title: [null, Validators.compose([Validators.required])],
        description: [null, Validators.compose([Validators.required])],
        actionDescriptor: [null, Validators.compose([Validators.required])],
        isActive: [false],
        requestType: [null, Validators.compose([Validators.required])],
        tableType: [null, Validators.compose([Validators.required])],
      });
    }
  selectedFile: TreeData;
  selectedFiles: TreeData[];
  infoModal:AllCheckingLog;
  opendNodeList:TreeData[]=new Array<TreeData>
  nodes: TreeData[];
  data:AllCheckingLog[]=new Array<AllCheckingLog>()
  tableTypes:TableType[]=new Array<TableType>()
  filterName:string;
  ngOnInit(): void {
   this.firstSetup()
 
    this.nodes = [
      {
          key: '',
          label: '',
          children: []
      },
  
  ];

  }
  firstSetup(){
    this._logServices.getAllTableType().subscribe((res: Result<TableType[]>) => {
      if(res.success){
        
        this.tableTypes=res.data
        this.addTableTypetoNode();
      }
    
  
    })
  }
  getAllLogs(pageIndex:number,pageSize:number){
    
    this._logServices.getAllLog(pageIndex,pageSize).subscribe((res: Result<AllCheckingLog[]>) => {
      if(res.success){
        
        this.data=res.data['items']
        this.addNodesTochild();
  
      }
    
  
    })
  }
  addTableTypetoNode(){
    this.filterName='جدول'
    this.nodes=new Array<TreeData>()
    this.tableTypes.forEach(addNode=>{
      this.nodes.push(
        {
            key: addNode.value.toString(),
            label: addNode.title,
            children: []
        },
    
    )
    })
    this.getAllLogs(0,200)

  }
  
  addRequestNode(){
    this.filterName='نوع درخواست'

    this.nodes=[      {
      key: '0',
      requestType:0,
      label: 'ویرایش',
      children: []
  },
  {
    key: '1',
    requestType:1,
    label:'افزودن',
    children: []
 },
 {
  key: '2',
  requestType:2,
  label: 'حذف',
  children: []
},]

  

this.getAllLogs(0,100)

  }
  addNodesTochild(){
    this.nodes.forEach(node=>{
      var saveChilderen:TreeData[]=new Array<TreeData>()
      let counter=0;
      this.data.forEach(nodeChilderen=>{
        if(nodeChilderen.tableType==Number(node.key) || node.requestType==nodeChilderen.requestType){
          saveChilderen.push({ key: '0-'+counter, label: nodeChilderen.title,parentkey:Number(node.key),nodeCount:nodeChilderen.loggingCount,data: 'https://angular.io', type: 'url',id:nodeChilderen.id,checked:nodeChilderen.isActive  },
          )
          counter++
        }
      })
      node.children=[]
      node.children.push(...saveChilderen)
      var openedBefore=this.opendNodeList.findIndex(n=>node.key==n.key)
      if(openedBefore!=-1){
        node.expanded=true
      }
    })
  }

  OpenModal(content:any){
    this.modalService

      .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          this.addNewLogModel.requestType=Number(this.addNewLogModel.requestType)
          this.addNewLogModel.tableType=Number(this.addNewLogModel.tableType)
          debugger
        this._logServices.create(this.addNewLogModel,'MainLogging').subscribe(
          (data) => {
        if(data.success){
            
            this.data.push(this.addNewLogModel)
          this.addTableTypetoNode()
          this.toastr.success(data.message, 'موفقیت آمیز!', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        
        }
        else{
          this.toastr.success(data.message, 'عملیات با خطا مواجه شد', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
          }
        );
        this.addNewLogModel=new AllCheckingLog();
        },
        (reason) => {
       this.addNewLogModel=new AllCheckingLog();
        }
      );
  }
  onCheckboxChange(event: any,id:number) {
    var updateindex=this.data.findIndex(finder=>finder.id==id)
    if(event.target.checked){

     this.data[updateindex].isActive=true
     this.ActiveField(this.data[updateindex])
    }
    else{
      this.data[updateindex].isActive=false
      this.ActiveField(this.data[updateindex])
    }
  }
  ActiveField(data:AllCheckingLog){
    this._logServices.updateList(data).subscribe((res: Result<AllCheckingLog>) => {
      if(res.success){
        this.toastr.success(res.message, 'موفقیت آمیز!', {
          timeOut: 3000,
          positionClass: 'toast-top-left',
        });
      }
    
  
    })
  }
  updateLog(){
    console.log(this.selectedFiles)
  }
  changeParent(changeParentModal: NgbModal,nodeId:number) {
    this.modalService
      .open(changeParentModal, {
        ariaLabelledBy: 'modal-basic-title',
        centered: false,
        size: 'xs',
      })
      .result.then(
        (accept) => {
     this.nodeRemove(nodeId)
        },
        (reject) => {
          console.log(reject.message);
        }
      );
  }
nodeRemove(id:number){
  this._logServices.removeLog(id).subscribe((res) => {
    if(res.success){
    
    let finder=  this.data.findIndex(finder=>finder.id==id)
    if(finder!=-1){

      this.data.splice(finder,1)
      this.addNodesTochild()
    }
    this.toastr.success(res.message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-left',
    });
    }
    else{
      this.toastr.error(res.message, 'عملیات با خطا مواجه شد', {
        timeOut: 3000,
        positionClass: 'toast-top-left',
      });
    }
  

  })
}
editModal(content:any,id:number){
  var updateindex=this.data.findIndex(finder=>finder.id==id)

this.addNewLogModel=this.data[updateindex]
  this.modalService

  .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
  .result.then(
    (result: boolean) => {
      this.addNewLogModel.requestType=Number(this.addNewLogModel.requestType)
      this.addNewLogModel.tableType=Number(this.addNewLogModel.tableType)
      this._logServices.updateList(this.addNewLogModel).subscribe((res: Result<AllCheckingLog>) => {
        if(res.success){
          let finder=  this.data.findIndex(finder=>finder.id==id)
          if(finder!=-1){
            this.data[finder]=this.addNewLogModel
            this.addNodesTochild()
          }        
          this.toastr.success(res.message, '', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
        else{
          this.toastr.error(res.message, 'خطا در عملیات', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
        this.addNewLogModel=new AllCheckingLog;

      })
  
    },
    (reason) => {
      this.addNewLogModel=new AllCheckingLog;

    }
  );



}
nodeSelect(event) {
  let findIndex=this.opendNodeList.findIndex(finder=>finder.key==event.node.key)
  if(findIndex!=-1){
    this.opendNodeList.splice(findIndex,1)
  }
  else{
    debugger
    this.opendNodeList.push(event.node)

  }
    this.nodes.forEach(node=>{
      if(node.key==event.node.key){
       node.expanded=!node.expanded
      }
      })
  

}
openDescriptionModal(content:any,node:number){
  let finder=  this.data.findIndex(finder=>finder.id==node)
  if(finder!=-1){
    this.infoModal=this.data[finder]
    this.infoModal.createDate=moment(
      this.infoModal.createDate,
      'YYYY/MM/DD'
    )
      .locale('fa')
      .format('YYYY/MM/DD');
   }
   this.infoModal.updateDate=moment(
     this.infoModal.updateDate,
     'YYYY/MM/DD'
   )
     .locale('fa')
     .format('YYYY/MM/DD');

  this.modalService
  .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
  .result.then(
    (result: boolean) => {
    },
    (reason) => {
    }
  );
}



}
