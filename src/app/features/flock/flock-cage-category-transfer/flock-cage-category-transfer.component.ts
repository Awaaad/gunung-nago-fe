import { CdkDragDrop, copyArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FlockCageTransferDto, FlockCategory } from 'generated-src/model';
import { FlockToCage, DropCage, FlockCageIncompatibleFrontDto } from 'generated-src/model-front';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { cloneDeep } from 'lodash';
const _ = { cloneDeep };

@Component({
  selector: 'app-flock-cage-category-transfer',
  templateUrl: './flock-cage-category-transfer.component.html',
  styleUrls: ['./flock-cage-category-transfer.component.scss'],
})
export class FlockCageCategoryTransferComponent implements OnInit {
  public language = "en";
  public flocks: FlockCageIncompatibleFrontDto[] = [];
  public flockToCageList: FlockToCage[] = [];
  public dropCages: DropCage[] = [];
  public flockCageTransferDtoList: FlockCageTransferDto[] = [];
  public disableSave: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private flockApiService: FlockApiService,
    private cageApiService: CageApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getFlocksWithIncompatibleCages();
    this.getAllFreeCages();
    this.dropCages = [{
      flockToCage: []
    }]
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getAllFreeCages(): void {
    this.cageApiService.getAllInactiveCages().subscribe(cages => {
      cages.forEach(cage => {
        const flockToCage: FlockToCage[] = [{
          cageId: cage.id,
          flockId: null,
          cageName: cage.name,
          name: '',
          cageCategory: cage.cageCategory,
          quantity: 0
        }]
        this.dropCages[0].flockToCage.push(flockToCage);
      })
    })
  }

  private getFlocksWithIncompatibleCages(): void {
    this.flockApiService.findFlocksWithIncompatibleCages().subscribe(flocks => {
      this.flocks = flocks;
      this.flocks.forEach(flock => {
        flock.quantity = flock.initialQuantity;
      })
    })
  }

  public drop(event: CdkDragDrop<any[]>): void {
    console.log(event.container);
    if (event.container.data.length > 1) {
      return;
    } else {
      copyArrayItem(
        this.flocks,
        event.container.data,
        this.flocks.findIndex(flock => flock.flockId === (event.item.data as unknown as FlockCageIncompatibleFrontDto).flockId),
        1,
      );
    }
    if (event.container.data[1].initialFlockCategory != event.container.data[0].cageCategory as FlockCategory) {
      event.container.data.splice(1, 1);
    }
  }

  public remove(flock: any): void {
    console.log(flock);
    const x: FlockCageIncompatibleFrontDto = flock[1];
    const retrievedFlock = this.flocks.find(flock => flock.flockId === x.flockId);
    if (retrievedFlock != null) {
      retrievedFlock.quantity = retrievedFlock.initialQuantity;
    }
    flock.splice(1, 1);
  }

  public decreaseFlockQuantity(event: any, flockToCage: any) {
    console.log(flockToCage)
    this.disableSave = false;
    const flock = this.flocks.find(flock => flock.flockId === flockToCage[1].flockId);

    if ((this.dropCages.map(dropCage => dropCage.flockToCage)[0]
      .filter((dropCage: any) => dropCage.length > 1)
      .filter((dropCage: any) => dropCage[1].flockId === flockToCage[1].flockId)
      .map((dropCage: any) => dropCage[0])
      .map((dropCage: any) => dropCage.quantity) as number[]).reduce((acc, value) => acc + value, 0) > flock?.initialQuantity) {
      this.disableSave = true;
    }

    if (flock != null) {
      flock.quantity = flock.initialQuantity - (this.dropCages.map(dropCage => dropCage.flockToCage)[0]
        .filter((dropCage: any) => dropCage.length > 1)
        .filter((dropCage: any) => dropCage[1].flockId === flockToCage[1].flockId)
        .map((dropCage: any) => dropCage[0])
        .map((dropCage: any) => dropCage.quantity) as number[]).reduce((acc, value) => acc + value, 0);
    }
  }

  public cancelTransfer(): void {
    this.flockCageTransferDtoList = [];
    this.getFlocksWithIncompatibleCages();
    this.getAllFreeCages();
    this.dropCages = [{
      flockToCage: []
    }]
  }

  public saveTransfer(): void {
    this.mapFlockToCageDto();
    this.utilsService.presentLoading();
    this.flockApiService.transferFlockToCage(this.flockCageTransferDtoList).subscribe({
      next: (data: string) => {
        this.cancelTransfer();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock(s) transferred to cage(s) successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public mapFlockToCageDto(): void {
    this.flockCageTransferDtoList = [];
    this.dropCages.map(dropCage => dropCage.flockToCage)[0].forEach((flockCage: any) => {
      if (flockCage.length > 1) {
        const flockCageTransferDto: FlockCageTransferDto = {
          flockId: flockCage[1].flockId,
          cageId: flockCage[0].cageId,
          quantity: flockCage[0].quantity
        }
        this.flockCageTransferDtoList.push(flockCageTransferDto);
      }
    });
    console.log(this.flockCageTransferDtoList);
  }
}
