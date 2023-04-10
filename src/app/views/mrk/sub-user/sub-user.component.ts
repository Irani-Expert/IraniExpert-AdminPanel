import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { UserData } from '../NodeModel/UserData.interface';
import { log } from 'console';
@Component({
  selector: 'app-sub-user',
  templateUrl: './sub-user.component.html',
      providers: [MessageService],

  styleUrls: ['./sub-user.component.scss']
})


export class SubUserComponent implements OnInit {
  files: TreeNode[];
  data1: TreeNode[];
  public mySentences:UserData[] = [
    {firstname: "mohammad", lastName: "toroghi",accountNumber: 23,node: 0,parentAccountNumber:0},
    {firstname: "javad", lastName: "abasi",accountNumber: 10,node: 1,parentAccountNumber:23},    
    {firstname: "ali", lastName: "ziba",accountNumber: 12,node: 1,parentAccountNumber:23},   
     {firstname: "parham", lastName: "afghahi",accountNumber: 101,node: 2,parentAccountNumber:10},

];

  data: TreeNode[];
  calcNode:number=0;
  selectedNode: TreeNode;
  nodeData: TreeNode[];
  constructor(private messageService: MessageService) { }
 
  Users: TreeNode[] = [];
  ngOnInit() {
    
      this.data=[{
      type: 'person',
      styleClass: 'p-person',
      data: {firstname:'', lastName:"",accountNumber:null,parentAccountNumber:null},
      children:[],
    }]
 
    this.counterListSize()
    this.creatingListData()
    this.Users = [{
      type: 'person',
      styleClass: 'p-person',
      data: {firstname:'Walter', lastName:"sss",accountNumber:12,parentAccountNumber:null},
      children:[],
  }];
    // this.Users[0].data={firstname: this.mySentences[0].firstname, lastName: this.mySentences[0].lastName,
    //   accountNumber: this.mySentences[0].accountNumber,node: this.mySentences[0].node,
    //   parentAccountNumber:this.mySentences[0].parentAccountNumber},
    this.Users[0].children.push({ type: 'person',
    styleClass: 'p-person',
    data: {firstname:'test2', lastName:"toroghi",accountNumber:12,parentAccountNumber:null}}      
     ,)
     debugger
//     this.data2 = [{
      
     
//       type: 'person',
//       styleClass: 'p-person',
//       data: {firstname:'Walter', lastName:"sss",accountNumber:12,parentAccountNumber:null},
//       children: [
//           {
       
//               type: 'person',
//               styleClass: 'p-person',
//               data: {firstname:'Walter', lastName:"sss",node:1,accountNumber:12,parentAccountNumber:12},
         
//           },
//           {
          
          
//               type: 'person',
//               styleClass: 'p-person',
//               data: {firstname:'Walter White', lastName:"sss",node:1,accountNumber:12,parentAccountNumber:12},
//               children:[{},
// ]
//           }
//       ]
//   }];

}
counterListSize(){
  this.mySentences.forEach(x=>{
    if(x.node>this.calcNode){
      this.calcNode=x.node
    }
  })
}
creatingListData(){
  for (let x = 0; x <= this.calcNode; x++) {
    this.mySentences.forEach(y=>{
      if(y.node==x){
     this.Users[0].children
     }
    })
    debugger
}}
onNodeSelect(event) {
  debugger
}
testonNodeExpand(){debugger}

}
