import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';

@Component({
  selector: 'app-feed-stock-details',
  templateUrl: './feed-stock-details.component.html',
  styleUrls: ['./feed-stock-details.component.scss'],
})
export class FeedStockDetailsComponent implements OnInit {
  public feedId: any = this.activatedRoute.snapshot.paramMap.get('id');
  private page: number = 0;
  private size: number = 20;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private feedApiService: FeedApiService,
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
    const feedStockSearchCriteriaDto = {
      feedId: this.feedId,
      page: this.page,
      size: this.size,
      // sortBy: this.sortBy,
      // sortOrder: this.sortOrder.toUpperCase(),
      // cageCategory: this.cageCategory,
      // active: this.active
    }

    this.feedApiService.searchFeedStock(feedStockSearchCriteriaDto).subscribe(feedStocks => {
      console.log(feedStocks)
      // this.infiniteEggCategories = [...this.infiniteEggCategories, ...eggCategories.content];
      // this.eggCategories = new MatTableDataSource<EggCategoryDto>(this.infiniteEggCategories);

      // if (event) {
      //   event.target.complete();
      //   event.returnValue = false;
      // }
    })
  }
}