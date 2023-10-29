import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CageCategory, CageDto, FeedCategory, FeedStockAllocationDto, FeedStockDto } from 'generated-src/model';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { FlockFeedLineApiService } from 'src/app/shared/apis/flock-feed-line.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

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
  public feedsToBeAllocated: FeedStockDto[] = [];
  public selectedFeedStock!: FeedStockDto;
  public toBeSelectedFeedStock!: FeedStockDto;
  public language = "en";
  public totalBagsAllocatedNorm: number = 0;
  public totalBagsAllocatedDara: number = 0;
  public totalBagsAllocatedDoc: number = 0;
  public disableSave: boolean = false;

  public isChangeInFeedStock: boolean = false;
  public warningMessage: string = '';
  public alertButtons: any[] = [];
  public isResponsePositive: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private feedApiService: FeedApiService,
    private flockFeedLineApiService: FlockFeedLineApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.warningMessage = "Unsaved changes will be discarded. Are you sure you want to proceed?"
    this.initialiseSelectedFeedStock();
    this.findAllFeedStockForAllocation();
    this.initialiseAlertButtons();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private initialiseSelectedFeedStock(): void {
    this.selectedFeedStock = {
      id: 0,
      bags: 0,
      createdDate: new Date(),
      price: 0,
      weight: 0,
      name: '',
      feedCategory: FeedCategory.NORM,
      feedId: 0
    }
  }

  public changedSelectedFeedStock(feedStock: FeedStockDto): void {
    this.toBeSelectedFeedStock = feedStock;
    console.log(this.selectedFeedStock.id != 0 && this.selectedFeedStock.id != feedStock.id)
    if (this.selectedFeedStock.id != 0 && this.selectedFeedStock.id != feedStock.id) {
      this.isChangeInFeedStock = true;
    } else {
      this.selectedFeedStock = feedStock;
      this.cages = [];
      this.cagesNorm = [];
      this.cagesDara = [];
      this.cagesDoc = [];
      this.getFeedStock(this.selectedFeedStock.id, feedStock.feedCategory);
    }
  }

  public getFeedStock(feedStockId: number, category: string): void {
    this.feedApiService.findFeedFormAllocation(feedStockId, category).subscribe(cages => {
      this.cagesDoc = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DOC);
      this.cagesDara = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DARA);
      this.cagesNorm = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM);
    })
  }

  public findAllFeedStockForAllocation(): void {
    this.feedApiService.findAllFeedStockForAllocation().subscribe(feeds => {
      this.feedsToBeAllocated = feeds;
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

  public initialiseAlertButtons(): void {
    this.alertButtons = [
      {
        text: 'No',
        role: false,
        cssClass: 'alert-negative-btn',
        handler: () => {
          this.isResponsePositive = false;
        },
      },
      {
        text: 'Yes',
        role: true,
        cssClass: 'alert-positive-btn',
        handler: () => {
          this.isResponsePositive = true;
        },
      },
    ]
  }

  public setAlertResult(event: any): void {
    this.isResponsePositive = event.detail.role;
    if (this.isChangeInFeedStock && this.isResponsePositive === true) {
      this.selectedFeedStock = this.toBeSelectedFeedStock;
      this.cages = [];
      this.cagesNorm = [];
      this.cagesDara = [];
      this.cagesDoc = [];
      this.getFeedStock(this.selectedFeedStock.id, this.toBeSelectedFeedStock.feedCategory);
      this.isChangeInFeedStock = false;
    } else {
      this.isChangeInFeedStock = false;
    }
  }

  public save(): void {
    this.cages = [];
    this.cages = [...this.cagesNorm, ...this.cagesDara, ...this.cagesDoc];
    this.utilsService.presentLoading();
    this.flockFeedLineApiService.allocateFeedStockToFlock(this.cages).subscribe({
      next: (data: string) => {
        this.cages = [];
        this.cagesNorm = [];
        this.cagesDara = [];
        this.cagesDoc = [];
        this.findAllFeedStockForAllocation();
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
