import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FeedCategory, FeedDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { FeedApiService } from 'src/app/shared/api/feed.api.service';
import { UtilsService } from 'src/app/shared/util/utils.service';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'feedCategory', 'recommendedWeight'];
  public feeds = new MatTableDataSource<FeedDto>;
  private infiniteFeeds: FeedDto[] = [];
  public feedSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public feedCategories: string[] = [];
  public feedName: string = '';
  public feedCategory: FeedCategory | string = '';

  constructor(
    private feedApiService: FeedApiService,
    private translateService: TranslateService,
    private utilService: UtilsService
  ) { }

  ionViewWillEnter(): void {
    this.feedCategories = Object.keys(FeedCategory);
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchByFeedName(feedName: any): void {
    this.feedSearchSubscription.unsubscribe();
    this.feeds = new MatTableDataSource<FeedDto>;
    this.page = 0;
    this.feedName = feedName;
    this.search();
  }

  public ionChangeFeedCategory(event: any): void {
    this.feedCategory = event.detail.value;
    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteFeeds = [];
      this.feeds = new MatTableDataSource<FeedDto>([]);
    }
    const cageSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      name: this.feedName,
      feedCategory: this.feedCategory
    }

    this.feedSearchSubscription = this.feedApiService.search(cageSearchCriteriaDto).subscribe(feeds => {
      this.infiniteFeeds = [...this.infiniteFeeds, ...feeds.content];
      this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.feedName = '';
    this.feedCategory = '';
    this.sortOrder = 'asc'.toLocaleUpperCase();
    this.sortBy = 'name';
    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  onScroll(event: any) {
    event.returnValue = false;
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction.toUpperCase();

    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }
}
