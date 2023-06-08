import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  logo: string;
  public constructor(private titleService: Title) { }
  // title = 'franks-port-admin';
  ngOnInit(): void {
    this.logo =window.location.hostname;
    let domain_name = this.getDomainName(this.logo)
    let b = (domain_name).split('.')
    this.setTitle(b[0])
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  getDomainName(hostName) {
    return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
  }
}
