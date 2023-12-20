import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';

@Component({
  selector: 'app-egg-stock-details',
  templateUrl: './egg-stock-details.component.html',
  styleUrls: ['./egg-stock-details.component.scss'],
})
export class EggStockDetailsComponent  implements OnInit {
  public eggCategoryId: any = this.activatedRoute.snapshot.paramMap.get('id');
  private page: number = 0;
  private size: number = 20;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private eggCategoryApiService: EggCategoryApiService,
  ) { }

  ngOnInit() {
    this.search();
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      // this.page = 0;
      // this.infiniteEggCategories = [];
      // this.eggCategories = new MatTableDataSource<EggCategoryDto>([]);
    }
    const eggCategoryStockSearchCriteriaDto = {
      eggCategoryId: this.eggCategoryId,
      page: this.page,
      size: this.size,
      // sortBy: this.sortBy,
      // sortOrder: this.sortOrder.toUpperCase(),
      // cageCategory: this.cageCategory,
      // active: this.active
    }

    this.eggCategoryApiService.searchEggCategoryStock(eggCategoryStockSearchCriteriaDto).subscribe(eggCategoryStocks => {
      console.log(eggCategoryStocks)
      // this.infiniteEggCategories = [...this.infiniteEggCategories, ...eggCategories.content];
      // this.eggCategories = new MatTableDataSource<EggCategoryDto>(this.infiniteEggCategories);

      // if (event) {
      //   event.target.complete();
      //   event.returnValue = false;
      // }
    })
  }
}
