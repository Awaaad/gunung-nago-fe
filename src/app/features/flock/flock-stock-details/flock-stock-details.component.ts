import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';

@Component({
  selector: 'app-flock-stock-details',
  templateUrl: './flock-stock-details.component.html',
  styleUrls: ['./flock-stock-details.component.scss'],
})
export class FlockStockDetailsComponent implements OnInit {
  public flockId: any = this.activatedRoute.snapshot.paramMap.get('id');
  private page: number = 0;
  private size: number = 20;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private flockApiService: FlockApiService,
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
    const flockStockSearchCriteriaDto = {
      flockId: this.flockId,
      page: this.page,
      size: this.size,
      // sortBy: this.sortBy,
      // sortOrder: this.sortOrder.toUpperCase(),
      // cageCategory: this.cageCategory,
      // active: this.active
    }

    this.flockApiService.searchFlockStock(flockStockSearchCriteriaDto).subscribe(flockStocks => {
      console.log(flockStocks)
      // this.infiniteEggCategories = [...this.infiniteEggCategories, ...eggCategories.content];
      // this.eggCategories = new MatTableDataSource<EggCategoryDto>(this.infiniteEggCategories);

      // if (event) {
      //   event.target.complete();
      //   event.returnValue = false;
      // }
    })
  }
}