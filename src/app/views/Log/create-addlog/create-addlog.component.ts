import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import { NodeService } from '../../Log/nodeservice';
import { AllCheckingLog } from '../models/all-checking-logModel';
import { LogService } from '../log.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { TableType } from '../models/table-typeModel';
import { Key } from 'protractor';
import { number } from 'echarts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { TreeNode } from '../../mrk/NodeModel/treenode';
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
        isActive: [false, Validators.compose([Validators.required])],
        requestType: [null, Validators.compose([Validators.required])],
        tableType: [null, Validators.compose([Validators.required])],
      });
    }
  selectedFile: TreeNode;
  selectedFiles: TreeNode[];

  nodes: TreeNode[];
  data:AllCheckingLog[]=new Array<AllCheckingLog>()
  tableTypes:TableType[]=new Array<TableType>()
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
  getAllLogs(){
    
    this._logServices.getAllLog(100).subscribe((res: Result<AllCheckingLog[]>) => {
      if(res.success){
        
        this.data=res.data['items']
        this.addNodesTochild();
        var counter=0;
        // let treeNode:TreeNode[]=new Array<TreeNode>()
        // this.nodes.forEach(x=>{
        //  if(x.children.length==0 ){
        //   treeNode.push(x)
          
        //  }
        //  counter++;
        // })
        // treeNode.forEach(x=>{
        //   var finder=this.nodes.findIndex(y=>y.key===x.key)
        //   if(finder!=-1){
        //     this.nodes.splice(finder,1)

        //   }
        // })
      }
    
  
    })
  }
  addTableTypetoNode(){
    this.nodes=new Array<TreeNode>()
    this.tableTypes.forEach(x=>{
      this.nodes.push(
        {
            key: x.value.toString(),
            label: x.title,
            children: []
        },
    
    )
    })
    this.getAllLogs()

  }
  addRequestNode(){
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

  

  this.getAllLogs()

  }
  addNodesTochild(){
    this.nodes.forEach(x=>{
      var saveChilderen:TreeNode[]=new Array<TreeNode>()
      let counter=0;
      this.data.forEach(y=>{
        if(y.tableType==Number(x.key) || x.requestType==y.requestType){
          saveChilderen.push({ key: '0-'+counter, label: y.title,parentkey:Number(x.key),data: 'https://angular.io', type: 'url',id:y.id,checked:y.isActive  },
          )
          counter++
        }
      })
      x.children=[]
      x.children.push(...saveChilderen)
    })
  }

  OpenModal(content:any){
    this.modalService

      .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          this.addNewLogModel.requestType=Number(this.addNewLogModel.requestType)
          this.addNewLogModel.tableType=Number(this.addNewLogModel.tableType)
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
        },
        (reason) => {
    
        }
      );
  }
  onCheckboxChange(event: any,id:number) {
    var updateindex=this.data.findIndex(x=>x.id==id)
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
        
      }
    
  
    })
  }
  updateLog(){
    console.log(this.selectedFiles)
  }
nodeRemove(id:number){

  this._logServices.removeLog(id).subscribe((res) => {
    if(res.success){
    
    let finder=  this.data.findIndex(x=>x.id==id)
    if(finder!=-1){

      this.data.splice(finder,1)
      this.addNodesTochild()
    }
    this.toastr.success(res.message, 'با موفقیت حذف شد', {
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
  var updateindex=this.data.findIndex(x=>x.id==id)

this.addNewLogModel=this.data[updateindex]
  this.modalService

  .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
  .result.then(
    (result: boolean) => {
      this.addNewLogModel.requestType=Number(this.addNewLogModel.requestType)
      this.addNewLogModel.tableType=Number(this.addNewLogModel.tableType)
      this._logServices.updateList(this.addNewLogModel).subscribe((res: Result<AllCheckingLog>) => {
        if(res.success){
          let finder=  this.data.findIndex(x=>x.id==id)
          if(finder!=-1){
            this.data[finder]=this.addNewLogModel
            this.addNodesTochild()
          }        
          this.toastr.success(res.message, 'با موفقیت ویرایش شد', {
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
}
