import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-message-setting',
  templateUrl: './message-setting.component.html',
  styleUrls: ['./message-setting.component.scss']
})
export class MessageSettingComponent implements OnInit {

  constructor(private locationBack: Location) { }

  ngOnInit(): void {
  }

  goToBack() {
    this.locationBack.back();
  }

}
