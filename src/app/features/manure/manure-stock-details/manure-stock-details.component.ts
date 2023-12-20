import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';

@Component({
  selector: 'app-manure-stock-details',
  templateUrl: './manure-stock-details.component.html',
  styleUrls: ['./manure-stock-details.component.scss'],
})
export class ManureStockDetailsComponent implements OnInit {
  public manureId: any = this.activatedRoute.snapshot.paramMap.get('id');
  private page: number = 0;
  private size: number = 20;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private manureStockApiService: ManureStockApiService,
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
    const manureStockSearchCriteriaDto = {
      manureId: this.manureId,
      page: this.page,
      size: this.size,
      // sortBy: this.sortBy,
      // sortOrder: this.sortOrder.toUpperCase(),
      // cageCategory: this.cageCategory,
      // active: this.active
    }

    this.manureStockApiService.searchManureStock(manureStockSearchCriteriaDto).subscribe(manureStocks => {
      console.log(manureStocks)
      // this.infiniteEggCategories = [...this.infiniteEggCategories, ...eggCategories.content];
      // this.eggCategories = new MatTableDataSource<EggCategoryDto>(this.infiniteEggCategories);

      // if (event) {
      //   event.target.complete();
      //   event.returnValue = false;
      // }
    })
  }
}