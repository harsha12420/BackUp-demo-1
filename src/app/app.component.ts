import { AfterViewInit, Component } from '@angular/core';
import { UtilityService } from '../app/services/utility.service';

type Status = "success" | "fail" | "pending";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'erp-admin-pwa';

  constructor(private utility: UtilityService) {}

  ngAfterViewInit(): void {
    this.utility.hideLoading();
  }

  test(status: Status){
    if(status === "fail"){

    }
  }




}
