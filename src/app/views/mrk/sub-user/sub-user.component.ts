import { Component, OnInit } from '@angular/core';
import {TreeNode} from '../NodeModel/treenode';
import {MessageService} from 'primeng/api';
import { UserDataModel } from '../NodeModel/UserData.model';
import { SubUserService } from '../sub-user.service';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { count } from 'console';
import { number } from 'echarts';
import { Utils } from 'src/app/shared/utils';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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
  arrayData:UserDataModel[]=[{userID:54,email:this._auth.currentUserValue['email'],
    firstName:this._auth.currentUserValue.firstName,lastName:this._auth.currentUserValue.lastName,totalPayment:22,
    parentUserID:null,childsCount:null,phoneNumber:this._auth.currentUserValue['phoneNumber'],accountNumber:this._auth.currentUserValue['accountNumber']}];
    arrayData2:UserDataModel[]=[{userID:3243,email:'000',
      firstName:this._auth.currentUserValue.firstName,lastName:this._auth.currentUserValue.lastName,phoneNumber:"",accountNumber:22,totalPayment:22,
      parentUserID:null,childsCount:null}];
  selectedNode: TreeNode;
  public nodeCounter: number = 0;
  public nodeData: TreeNode[] = [];
  constructor(private messageService: MessageService,
    private _subservice:SubUserService,  private _auth: AuthenticateService,
        public router: Router,
        private toastr: ToastrService

    ) { }
 
 public treeNodes: TreeNode[] = [];
 
  ngOnInit() {
    if (Utils.isMobile()) {

     
        this.toastr.warning('لطفا گوشی را به صورت عمودی بچرخانید', null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
    
  }   
  this.userId = this._auth.currentUserValue.userID;
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
       var listOpend=true
       var findi=this.opendList.forEach(user=>{
        if(user==x.userID)
        {
          listOpend=false
        }
       })
        if(x.childsCount!=0 && listOpend){
          debugger
          let UnderExist=true
          childGenerator[0].childsCount=0
          childGenerator[0].parentUserID=x.userID
          childGenerator[0].userID=x.userID*100
          this.arrayData.forEach(x=>{
            if(x.parentUserID==childGenerator[0].parentUserID){
              UnderExist=false
            }
          })
         if(UnderExist){
         this.rawData.push(childGenerator[0])

         } 
        }
    
        counter++
      })
   
        this.arrayData.push(...this.rawData)
        if(userId==this.userId){
          this.arrayData[0].childsCount=counter

        }
       this.setTree(this.arrayData)
    }
   
 }      
); 
}


 setTree(_searchResponses: UserDataModel[]): void {

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
    if( data.node.id===x.parentUserID){
      this.arrayData.splice(co,1)

    }
    co++
   })
   this.getUnderUsers(data.node.id)

 }



  }
  onNodedeSelected(n:any){
   let s=[]
   s.push(2)
   this.arrayData.forEach(x=>{
    
    if(n.node.id==x.parentUserID){ 
          s.push(x.userID)       
      }
   })
  s.splice(1,1);
   s.forEach(data=>{
    var counter=0;
    var find=-1
    this.arrayData.forEach(x=>{
      if(x.userID==data){
       find=counter
      }
      counter++
    })
    if(find!=-1){
      this.arrayData.splice(find,1)
      
    }
   })
   

    
    this.opendList.splice(this.opendList.indexOf(n.node.id),1);
    
    // this.arrayData.forEach(x=>{
    //   var find=this.arrayData.findIndex(y=>y.userID==x.parentUserID)
    //   if(find==-1 && x.userID!=this.userId){
    //     this.arrayData.splice(this.arrayData.indexOf(x),1)
    //   }
    // })
    this.setTree(this.arrayData)
  
   
    
  }



}


