import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-closed-users-accounts',
  templateUrl: './closed-users-accounts.component.html',
  styleUrls: ['./closed-users-accounts.component.scss']
})
export class ClosedUsersAccountsComponent implements OnInit {
  user_id: any;
  userList = [];
  itemsPerPage : number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  usersListReqPageQuery : any;
  levelParentUserId : string= null;
  selectedUserId;
  constructor( private usersService: UsersService, private cookie: CookieService
    ,  private toastr: ToastrService) { }

  ngOnInit(): void {

    this.user_id = localStorage.getItem('userId');

    this.getClosedUserTotalCount(this.user_id);
    this.getClosedUsersList(this.user_id);

  }

  
  
  getClosedUsersList(id) {

    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    this.usersService.getClosedUsersList(id, this.usersListReqPageQuery).subscribe(data => {
      this.userList = data.data;
    }, error => {
      console.log('errror')
    })

  }

  
pageChange(newPage: number) {
  this.currentPage = newPage;
  this.usersListReqPageQuery = {
    page: this.currentPage,
    limit: this.itemsPerPage
  };
  if(this.levelParentUserId != null && this.levelParentUserId != undefined)
        {
          this.getClosedUserTotalCount(this.levelParentUserId)
        this.getSubUserChild();
        }
        else
        {
          this.getClosedUserTotalCount(this.user_id)
          this.getClosedUsersList(this.user_id);
        }

}


  getClosedChild(id)
  {
    this.levelParentUserId = id;
    this.usersListReqPageQuery = {
      page: 1,
      limit: this.itemsPerPage
    };

   this.getClosedUserTotalCount(this.levelParentUserId)
   this.getSubUserChild();

  }
  
  getSubUserChild() {
  
    this.usersService.getClosedUsersList(this.levelParentUserId,this.usersListReqPageQuery).subscribe(data => {
      
      this.userList = data.data;
     
    }, error => {
      console.log('errror')
    })
  }

  
  getClosedUserTotalCount(id) {

    this.usersService.getClosedUserTotalCount(id).subscribe(data => {
      this.total_items = data.count;
    }, error => {
      console.log('errror')
    })

  }

  
  openAccountOfUserAndTheirChilds(userid , self_close_account)
  {

    var obj: any = {};
    var message = '';

    if(self_close_account == 1)
    {
    obj.self_close_account = 0;
    message = "Are you sure you want to reopen this user account!"
    }

    this.selectedUserId = userid;

    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

    this.usersService.closeAndReOpenAccountOfUserAndTheirChilds(this.selectedUserId , obj).subscribe((result) => {
      if(result.status == true ) {
       
        if(this.levelParentUserId != null && this.levelParentUserId != undefined)
        {
          this.getClosedUserTotalCount(this.levelParentUserId)
        this.getSubUserChild();
        }
        else
        {
          this.getClosedUserTotalCount(this.user_id)
          this.getClosedUsersList(this.user_id);
        }

        this.toastr.success(result.msg,'',{
          positionClass: 'toast-bottom-right',
          timeOut:1000
         });
       
      } else {
        this.toastr.error(result.msg,'',{
          timeOut: 10000,
        });
      }
    }, (err) => {
      console.log(err);
    });

  } else if (result.dismiss === Swal.DismissReason.cancel) {
   
  }
})

  }

}
