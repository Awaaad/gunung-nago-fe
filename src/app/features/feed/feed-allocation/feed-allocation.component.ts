import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CageCategory, CageDto, FeedCategory, FeedStockAllocationDto, FeedStockDto } from 'generated-src/model';
import { FeedApiService } from 'src/app/shared/api/feed.api.service';
import { FlockFeedLineApiService } from 'src/app/shared/api/flock-feed-line.api.service';
import { UtilsService } from 'src/app/shared/util/utils.service';

@Component({
  selector: 'app-feed-allocation',
  templateUrl: './feed-allocation.component.html',
  styleUrls: ['./feed-allocation.component.scss'],
})
export class FeedAllocationComponent implements OnInit {
  public cagesNorm: FeedStockAllocationDto[] = [];
  public cagesDara: FeedStockAllocationDto[] = [];
  public cagesDoc: FeedStockAllocationDto[] = [];
  public cages: FeedStockAllocationDto[] = [];
  public feedStockNorm: FeedStockDto = new FeedStockDto();
  public feedStockDara: FeedStockDto = new FeedStockDto();
  public feedStockDoc: FeedStockDto = new FeedStockDto();
  public language = "en";
  public showFeedStockNorm: boolean = true;
  public showFeedStockDara: boolean = true;
  public showFeedStockDoc: boolean = true;
  public totalBagsAllocatedNorm: number = 0;
  public totalBagsAllocatedDara: number = 0;
  public totalBagsAllocatedDoc: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private feedApiService: FeedApiService,
    private flockFeedLineApiService: FlockFeedLineApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.findFeedStockForAllocationByFeedCategoryNorm(FeedCategory.NORM);
    this.findFeedStockForAllocationByFeedCategoryNorm(FeedCategory.DARA);
    this.findFeedStockForAllocationByFeedCategoryNorm(FeedCategory.DOC);
    this.getFeedStock();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public getFeedStock(): void {
    this.feedApiService.findFeedFormAllocation().subscribe(cages => {
      this.cagesDoc = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DOC);
      this.cagesDara = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DARA);
      this.cagesNorm = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM);
    })
  }

  public findFeedStockForAllocationByFeedCategoryNorm(feedCategory: FeedCategory): void {
    this.feedApiService.findFeedStockForAllocationByFeedCategory(feedCategory).subscribe(feed => {
      if (feedCategory === FeedCategory.NORM) {
        this.showFeedStockNorm = !(feedCategory === FeedCategory.NORM && !feed);
        this.feedStockNorm = feed;
      } else if (feedCategory === FeedCategory.DARA) {
        this.showFeedStockDara = !(feedCategory === FeedCategory.DARA && !feed);
        this.feedStockDara = feed;
      } else if (feedCategory === FeedCategory.DOC) {
        this.showFeedStockDoc = !(feedCategory === FeedCategory.DOC && !feed);
        this.feedStockDoc = feed;
      }
    })
  }

  public calculateTotalBagsAllocatedForNorm(): void {
    this.totalBagsAllocatedNorm = this.cagesNorm.map(cage => cage.bagsAllocated).reduce((acc, value) => acc + value, 0);
  }

  public calculateTotalBagsAllocatedForDara(): void {
    this.totalBagsAllocatedDara = this.cagesDara.map(cage => cage.bagsAllocated).reduce((acc, value) => acc + value, 0);
  }

  public calculateTotalBagsAllocatedForDoc(): void {
    this.totalBagsAllocatedDoc = this.cagesDoc.map(cage => cage.bagsAllocated).reduce((acc, value) => acc + value, 0);
  }

  public save(): void {
    this.cages = [];
    this.cages = [...this.cagesNorm, ...this.cagesDara, ...this.cagesDoc];
    console.log(this.cages);
    this.utilsService.presentLoading();
    this.flockFeedLineApiService.allocateFeedStockToFlock(this.cages).subscribe({
      next: (data: string) => {
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feeds allocated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public cancel(): void {

  }
}
