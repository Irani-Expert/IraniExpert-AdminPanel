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
@Component({
  selector: 'app-create-addlog',
  templateUrl: './create-addlog.component.html',
  styleUrls: ['./create-addlog.component.scss']
})
export class CreateAddlogComponent implements OnInit {

  constructor(    private modalService: NgbModal, private nodeService: NodeService ,
    private _logServices:LogService  ) { }
  selectedFile: TreeNode;
  nodes: TreeNode[];
  data:AllCheckingLog[]=new Array<AllCheckingLog>()
  tableTypes:TableType[]=new Array<TableType>()
  ngOnInit(): void {
   
  this._logServices.getAllTableType().subscribe((res: Result<TableType[]>) => {
    if(res.success){
      this.tableTypes=res.data
      this.addTableTypetoNode();
      this.getAllLogs()
    }
  

  })
    this.nodes = [
      {
          key: '0',
          label: 'Introduction',
          children: [
              { key: '0-0', label: 'What is Angular', data: 'https://angular.io', type: 'url' },
              { key: '0-1', label: 'Getting Started', data: 'https://angular.io/guide/setup-local', type: 'url' },
              { key: '0-2', label: 'Learn and Explore', data: 'https://angular.io/guide/architecture', type: 'url' },
              { key: '0-3', label: 'Take a Look', data: 'https://angular.io/start', type: 'url' }
          ]
      },
  
  ];

  }
  getAllLogs(){
    debugger
    this._logServices.getAllLog(100).subscribe((res: Result<AllCheckingLog[]>) => {
      if(res.success){
        this.data=res.data
        this.addNodesTochild();
      }
    
  
    })
  }
  addTableTypetoNode(){
    this.tableTypes.forEach(x=>{
      this.nodes.push(
        {
            key: x.value.toString(),
            label: x.title,
            children: []
        },
    
    )
    })
   
  }
  addNodesTochild(){
    var saveChilderen:TreeNode[]=new Array<TreeNode>()
    this.nodes.forEach(x=>{
      let counter=0;
      this.data.forEach(y=>{
        if(y.tableType==x.parentkey){
          saveChilderen.push({ key: '0-'+counter, label: y.title,parentkey:Number(x.key) },
          )
          counter++
        }
      })
      x.children.push(...saveChilderen)
    })
  }
  OpenModal(content:any){
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
