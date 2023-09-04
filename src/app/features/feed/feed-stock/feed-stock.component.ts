import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { FeedCategory, FeedDto, FeedStockDto, FeedStockSaveDto } from 'generated-src/model';
import { FeedStockApiService } from 'src/app/shared/api/feed-stock.api.service';
import { FeedApiService } from 'src/app/shared/api/feed.api.service';
import { UtilsService } from 'src/app/shared/util/utils.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-feed-stock',
  templateUrl: './feed-stock.component.html',
  styleUrls: ['./feed-stock.component.scss'],
})
export class FeedStockComponent {
  public language = "en";
  public displayedColumns: string[] = ['name', 'feedCategory', 'recommendedWeight'];
  public displayedColumnsStock: string[] = ['name', 'feedCategory', 'weight', 'price', 'bags', 'remove'];
  public feeds = new MatTableDataSource<FeedDto>;
  public feedsInStockTable = new MatTableDataSource<FeedStockSaveDto>;
  private infiniteFeeds: FeedDto[] = [];
  public feedSearchSubscription!: Subscription;
  public feedsInStock: FeedStockSaveDto[] = [];
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public feedName: string = '';
  public active: boolean = true;
  public feedCategory: FeedCategory | string = '';
  public showFeedTable: boolean = false;
  public isFeedInStockBox: boolean = false;

  constructor(
    private feedApiService: FeedApiService,
    private feedStockApiService: FeedStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchByFeedName(feedName: any): void {
    if (this.feedSearchSubscription) {
      this.feedSearchSubscription.unsubscribe();
    }
    this.feeds = new MatTableDataSource<FeedDto>;
    this.page = 0;
    this.feedName = feedName;
    this.search();
  }

  public search() {
    if (this.feedName === "") {
      this.showFeedTable = false;
      this.infiniteFeeds = [];
      this.feeds = new MatTableDataSource<FeedDto>([]);
    } else {
      this.showFeedTable = true;
      this.infiniteFeeds = [];
      this.feeds = new MatTableDataSource<FeedDto>([]);
    }
    const feedSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      name: this.feedName,
      feedCategory: this.feedCategory
    }

    this.feedSearchSubscription = this.feedApiService.search(feedSearchCriteriaDto).subscribe(feeds => {
      this.infiniteFeeds = [...this.infiniteFeeds, ...feeds.content];
      this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);
    })
  }

  public async addFeedToStock(row: FeedDto): Promise<void> {
    await this.resolveAddFeedToStock(row).then(exist => {
      if (!exist) {
        this.feedApiService.findFeedStockByFeedId(row.id).subscribe(feed => {
          this.feedsInStock.push(feed);
          this.feedsInStockTable = new MatTableDataSource<FeedStockSaveDto>(this.feedsInStock);
        })
      }
    });
  }

  public resolveAddFeedToStock(feedRow: FeedDto) {
    this.isFeedInStockBox = false;
    return new Promise((resolve) => {
      resolve(
        this.feedsInStock.find(
          (feed) => feed.feedId === feedRow.id
        )
      );
    });
  }

  public checkIfPresent(id: number) {
    return this.feedsInStock.find((feed) => feed.feedId === id);
  }

  public removeHealthProductInStock(element: any): void {
    for (let i = 0; i < this.feedsInStock.length; i++) {
      if (this.feedsInStock[i].feedId === element.feedId) {
        this.feedsInStock.splice(i, 1);
      }
    }
    this.feedsInStockTable = new MatTableDataSource<FeedStockSaveDto>(this.feedsInStock);
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.feedStockApiService.save(this.feedsInStockTable.data).subscribe({
      next: (data: string) => {
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feed stock updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public reset(): void {
    this.showFeedTable = false;
    this.feedsInStock = [];
    this.feedsInStockTable = new MatTableDataSource<FeedStockSaveDto>(this.feedsInStock);
    this.infiniteFeeds = [];
    this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);
  }
}
