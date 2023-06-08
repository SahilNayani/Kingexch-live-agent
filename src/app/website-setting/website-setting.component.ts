import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteSettingService } from '../services/website-setting.service'
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { SocketServiceService } from '../services/socket-service.service';
import { Location } from '@angular/common';




@Component({
  selector: 'app-website-setting',
  templateUrl: './website-setting.component.html',
  styleUrls: ['./website-setting.component.scss']
})
export class WebsiteSettingComponent implements OnInit {
  websiteSetting: FormGroup;
  websiteList: object[];
  submitted = false;
  websiteId: any;
  modalRef: any;
  userPassword: any;
  selectedWebsiteId: any;
  user_id: string;
  updatewebsiteSettingForm: FormGroup;
  checkWebsiteName: string;
  updatecheckWebsiteName: string;
  checkSiteTitle: string;
  checkUpdateTitle: string;
  isSocket: any;
  searchDomain: string;
  state: any;
  constructor(private fb: FormBuilder, private locationBack: Location,
    private websiteSettingService: WebsiteSettingService, private socketService: SocketServiceService,
    private toastr: ToastrService, private modalService: BsModalService,
    private cookie: CookieService
  ) { }

  async ngOnInit() {
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.isSocket = 0;
    this.user_id = localStorage.getItem('userId');
    this.createWebstieSetting();
    this.getAllwebsite();

    // this.socketListenersUser();
  }

  goToBack() {
    this.locationBack.back();
  }

  get f() { return this.websiteSetting.controls; }
  createWebstieSetting() {
    const reg = '(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    this.websiteSetting = this.fb.group({
      host_name: ['', Validators.compose([Validators.required, Validators.pattern(reg)])],
      site_title: ['', [Validators.required, Validators.minLength(3)]],
      domain_name: ['',[Validators.required, Validators.minLength(3)]]
    })
  }


  openModalSetting(setting: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      setting,
      Object.assign({}, { class: 'setting-modal modal-lg' })
    );
  }


  // socketOnEvent(eventName, callback) {
  //   this.socketService.socket.on(eventName, data => callback(data));
  // }

  // socketEmitEvent(eventName, data) {
  //   this.socketService.socket.emit(eventName, data);
  // }

  // socketListenersUser() {

  //   this.socketOnEvent(`createNewWebsite`, data => {

  //     if (data.status == true ) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.getAllwebsite();
  //       this.websiteSetting.reset();
  //       this.submitted = false;
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getWebsiteList`, data => {

  //     if (data.status == true ) {
  //       this.websiteList = data.data;
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateWebsite`, data => {

  //     if (data.status == true ) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     this.getAllwebsite();
  //       this.modalService.hide();
  //     this.websiteId = null;
  //     this.websiteSetting.reset();
  //     this.submitted = false;
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`deleteWebsiteDomain`, data => {

  //     if (data.status == true) {
  //       this.getAllwebsite()
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  // }

  updateWebsite(value) {
    const reg = '(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    this.updatewebsiteSettingForm = this.fb.group({
      id: [value._id],
      host_name: [value.host_name, [Validators.required, Validators.pattern(reg)]],
      site_title: [value.site_title, [Validators.required, Validators.minLength(3)]],
      password: [value.password, [Validators.required]],
      userId: this.user_id
    })
    this.websiteId = value._id
  }

  addWebsite(from?: string) {
    this.submitted = true;
    from = this.state
    // stop here if form is invalid
    if (from == 'update') {
      this.onClickWebsiteName(this.updatewebsiteSettingForm.controls.host_name.value, from)
      if (this.updatewebsiteSettingForm.invalid || this.checkUpdateTitle || this.updatecheckWebsiteName) {
        return;
      }
    } else {
      this.onClickWebsiteName(this.websiteSetting.controls.host_name.value, from)
      if (this.websiteSetting.invalid || this.checkSiteTitle || this.checkWebsiteName) {
        return;
      }
    }
    let requestObject = (from == 'update') ? this.updatewebsiteSettingForm.value : this.websiteSetting.value
    if (this.isSocket != 1) {
      this.websiteSettingService.addUpdateWebsiteSetting(requestObject).subscribe(response => {
        this.toastr.success(response.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.getAllwebsite();
        if (from == 'update') {
          this.modalService.hide();
        }
        this.websiteId = null;
        this.websiteSetting.reset();
        this.submitted = false;
      }, error => {
        console.log(error)
      })
    }
    else {
      if (from != 'update') {
        //   this.socketEmitEvent('create-new-website', 
        //   requestObject
        // );
      }
      else {
        //   this.socketEmitEvent('update-website', 
        //   this.updatewebsiteSettingForm.value
        // );
      }
    }

  }

  getAllwebsite() {
    if (this.isSocket != 1) {
      // stop here if form is invalid
      this.websiteSettingService.getAllwebsite().subscribe(response => {
        this.websiteList = response.data
      }, error => {
        console.log(error)
      })
    }
    else {

      // this.socketEmitEvent('get-website-list', '');


    }

  }

  deletewebsite(website, parent) {
    this.selectedWebsiteId = website._id
    this.modalRef = this.modalService.show(
      parent,
      Object.assign({}, { class: 'parent-modal modal-mn' })
    );

  }




  deleteConfirm() {
    var obj: any = {};
    obj.password = this.userPassword;
    obj.userId = this.user_id
    if (this.userPassword) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this website!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.isSocket != 1) {
            this.websiteSettingService.deleteWebsite(this.selectedWebsiteId, obj).subscribe(response => {
              if (response.status == true) {
                this.getAllwebsite()
                this.modalRef.hide()
                this.toastr.success(response.msg, '', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 1000
                });
              } else {
                this.toastr.error(response.msg, '', {
                  timeOut: 10000,
                });
              }


              // this.websiteList.splice(this.websiteList.indexOf(website), 1);
              // Swal.fire(
              //   'Deleted!',
              //   'Your imaginary file has been deleted.',
              //   'success'
              // )
            }, error => {
              console.log(error)
            })
          }
          else {
            obj.websiteId = this.selectedWebsiteId;
            //   this.socketEmitEvent('delete-website-domain', 
            //   obj
            // );

          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your website is safe :)',
            'error'
          )
        }
      })
    } else {
      this.toastr.error("Please Enter Password", '', {
        timeOut: 10000,
      });
    }
  }
  onClickWebsiteName(WebsiteName, from) {
    this.state = from;
    let controls = from == 'add' ? this.websiteSetting.controls.host_name.errors : this.updatewebsiteSettingForm.controls.host_name.errors
    if (WebsiteName != "" && !controls) {
      this.websiteSettingService.WebsiteNameChecking({ "host_name": WebsiteName }).subscribe(response => {
        console.log("306",response)
        if (response.msg != "Web site name is available. ") {
          if (from == 'add') {
            this.checkWebsiteName = response.msg
            this.websiteSetting.controls.host_name.setErrors({ 'error': 'error' })
          } else {
            this.updatecheckWebsiteName = response.msg
            this.updatewebsiteSettingForm.controls.host_name.setErrors({ 'error': 'error' })
          }


        } else {
          this.updatecheckWebsiteName = ""
          this.checkWebsiteName = ""
          if (from == 'add') {
            this.websiteSetting.controls.host_name.setErrors(null)
            let d_name = WebsiteName.split('//');
            console.log("323",d_name[1]);
            
            this.websiteSetting.controls['domain_name'].setValue(d_name[1]);
          } else {
            this.updatewebsiteSettingForm.controls.host_name.setErrors(null)
          }
        }
      }, error => {
        console.log(error)
      })
    }
  }

  onClickSiteTitle(SiteTitle, from) {
    let controls = from == 'add' ? this.websiteSetting.controls.site_title.errors : this.updatewebsiteSettingForm.controls.site_title.errors
    if (SiteTitle != "" && !controls) {
      this.websiteSettingService.siteTitleChecking({ "site_title": SiteTitle }).subscribe(response => {

        if (response.msg != "Site title data is available. ") {

          if (from == 'add') {
            this.checkSiteTitle = response.msg
            this.websiteSetting.controls.site_title.setErrors({ 'error': 'error' })
          } else {
            this.updatecheckWebsiteName = response.msg
            this.updatewebsiteSettingForm.controls.site_title.setErrors({ 'error': 'error' })
          }
        } else {
          this.checkSiteTitle = ""
          this.websiteSetting.controls.site_title.setErrors(null)
        }
      }, error => {
        console.log(error)
      })
    }
  }

  searchDomainName() {
    let request = {
      "search": this.searchDomain,
      "page": 1,
      "limit": 10
    }
    this.websiteSettingService.WebsiteNameSearch(request).subscribe(response => {
      this.websiteList = response.data
    })
  }
}
