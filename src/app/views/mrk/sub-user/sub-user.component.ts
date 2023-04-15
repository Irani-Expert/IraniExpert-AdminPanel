import { Component, OnInit } from '@angular/core';
import {TreeNode} from '../NodeModel/treenode';
import {MessageService} from 'primeng/api';
import { UserDataModel } from '../NodeModel/UserData.model';
import { SubUserService } from '../sub-user.service';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { count } from 'console';
@Component({
  selector: 'app-sub-user',
  templateUrl: './sub-user.component.html',
      providers: [MessageService],

  styleUrls: ['./sub-user.component.scss']
})


export class SubUserComponent implements OnInit {
  files: TreeNode[];
  data1: TreeNode[];
//   public mySentences:UserData[firstName] = [
//     {firstName: "mohammad", lastName: "toroghi",accountNumber: 23,node: 0,parentAccountNumber:null},
//     {firstName: "javad", lastName: "abasi",accountNumber: 10,node: 1,parentAccountNumber:23},    
//     {firstName: "ali", lastName: "ziba",accountNumber: 12,node: 1,parentAccountNumber:23},   
//      {firstName: "parham", lastName: "afghahi",accountNumber: 101,node: 2,parentAccountNumber:10},

// ];

  userId:number;
  opendList:Array<number>=[];
  rawData:UserDataModel[];
  arrayData:UserDataModel[]=[{userID:2230,email:this._auth.currentUserValue['email'],
    firstName:this._auth.currentUserValue.firstName,lastName:this._auth.currentUserValue.lastName,totalPayment:22,
    parentUserID:null,childsCount:null,phoneNumber:this._auth.currentUserValue['phoneNumber'],accountNumber:this._auth.currentUserValue['accountNumber']}];
    arrayData2:UserDataModel[]=[{userID:3243,email:'000',
      firstName:this._auth.currentUserValue.firstName,lastName:this._auth.currentUserValue.lastName,phoneNumber:"",accountNumber:22,totalPayment:22,
      parentUserID:null,childsCount:null}];
  selectedNode: TreeNode;
  public nodeCounter: number = 0;
  public nodeData: TreeNode[] = [];
  constructor(private messageService: MessageService,
    private _subservice:SubUserService,  private _auth: AuthenticateService
    ) { }
 
 public treeNodes: TreeNode[] = [];
  ngOnInit() {
    console.log(this._auth.currentUserValue)

   //this.userId = this._authService.currentUserValue.userID;
  this.userId=2230;
  this.opendList.push(this.userId)
   this.getUnderUsers(this.userId)
}

getUnderUsers(userId:number){
  this._subservice.GetChildsLevelOne(userId)
  .subscribe((res: Result<UserDataModel[]>)=> {
    if(res.success){
      this.rawData=res.data;
      let counter =0;
      let childGenerator=[] as UserDataModel[]

      this.rawData.forEach(x=>{
        x.parentUserID=userId
       childGenerator[0]=this.arrayData2[0]
        if(x.childsCount!=0){
          childGenerator[0].childsCount=0
          childGenerator[0].parentUserID=x.userID
          childGenerator[0].userID=x.userID*100
         let find= this.rawData.findIndex(x=>{x.parentUserID==childGenerator[0].parentUserID})
         if(find==-1){
         this.rawData.push(childGenerator[0])

         } 
        }
    
        counter++
      })
   
        this.arrayData.push(...this.rawData)
        this.arrayData[0].childsCount=counter
       this.setTree(this.arrayData)
    }
   
 }      
); 
}


 setTree(_searchResponses: UserDataModel[]): void {
  debugger
  var nafar='نفر'
  let treeSearchResponses: TreeNode[] = [];
  let empty: TreeNode[]
  _searchResponses.map((searchResponse) => {
    let treeNode=new TreeNode() ;
    let opendBefor=false
    treeNode.id=searchResponse.userID
    treeNode.accountNumber=searchResponse.accountNumber
    treeNode.childrenCount=searchResponse.childsCount
    
    treeNode.parentId = searchResponse.parentUserID;
    treeNode.title = searchResponse.firstName+' '+searchResponse.lastName;
    treeNode.phoneNumber = searchResponse.phoneNumber;
    treeNode.email = searchResponse.email;
    this.opendList.forEach(x=>{
      if(x==searchResponse.userID){
       opendBefor=true
      }
    })
    if(opendBefor){
      treeNode.expanded=true
    }
    treeNode.type= 'person';
    this.nodeCounter++;
    
    treeSearchResponses.push(treeNode);
  });
  const nest = (items, id = null, link = 'parentId') =>
    items
      .filter((item:TreeNode) => item[link] === id)
      .map((item) => (Object.assign(Object.assign({}, item), { children: nest(items, item.id) })));

  this.treeNodes = nest(treeSearchResponses);
}

 onNodeSelected(n): void {
}
testonNodeExpand(data:any){
  let counter=0;
   let opendBefor=true
 this.opendList.forEach(x=>{
  if(x==data.node.id){
    opendBefor=false
  }
  counter++;
 })
 if(opendBefor){
 this.opendList.push(data.node.id)

  let co=0;
  this.arrayData.forEach(x=>{
    if( x.email==='000'&& data.node.id===x.parentUserID){
     delete this.arrayData[co]

    }
    co++
   })
   
   this.getUnderUsers(data.node.id)

 }



  }


}


