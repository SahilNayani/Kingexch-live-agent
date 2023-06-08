import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-delete-bet',
  templateUrl: './delete-bet.component.html',
  styleUrls: ['./delete-bet.component.scss']
})
export class DeleteBetComponent implements OnInit {

  constructor(private locationBack: Location) { }

  ngOnInit(): void {

  }

  goToBack() {
    this.locationBack.back();
  }
}
