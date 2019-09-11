import {TopProductsService} from '../../shared/services/top-products.service';
import {ENDPOINTS} from '../../shared/constants/api.constants';
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public top4 = [];
  imgPath: string = ENDPOINTS.products.getProductImage;

  constructor(private topSold: TopProductsService) {
  }

  ngOnInit() {
    this.topSold.getTopSoldProducts(4).subscribe(data => {
      this.top4 = data;
      console.log(data);
    });
  }

  // getTopSoldProducts(){
  //   this.topSold.getTopSoldProducts(4).subscribe((res: any) => {
  //
  //       this.top4.push(res);
  //     },
  //     (error: any) => {
  //       console.log(error);
  //     });
  // }

}
