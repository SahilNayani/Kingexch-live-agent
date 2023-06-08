import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-import-market',
  templateUrl: './import-market.component.html',
  styleUrls: ['./import-market.component.scss']
})
export class importMarketComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  openModalAddSport(addSport: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      addSport,
      Object.assign({}, { class: 'addSport-modal modal-lg' })
    );
  }

}
