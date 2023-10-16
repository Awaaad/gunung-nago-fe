import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IonModal } from '@ionic/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { TranslateService } from '@ngx-translate/core';
import { AquisitionType, FlockSaveDto, SupplierDto } from 'generated-src/model';
import { FlockSaveFrontDto } from 'generated-src/model-front';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize, Subscription } from 'rxjs';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-flock-stock',
  templateUrl: './flock-stock.component.html',
  styleUrls: ['./flock-stock.component.scss'],
})
export class FlockStockComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public isModalOpen: boolean = false;
  public language = "en";
  public confirmInvoiceForm!: FormGroup;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public selectedSupplier: any = "";
  public selectedSuppliers: SupplierDto[] = [];
  public searchSupplierCtrl = new FormControl();
  public filteredSuppliers: any;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  private searchSupplierSubscription!: Subscription;
  public today: Date = new Date();
  public showStock!: boolean;
  readonly predicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
  readonly maskitoOptions: MaskitoOptions = { mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] };

  public subTotal = 0;
  public flockStock!: FlockSaveFrontDto;
  public flocksInStock: FlockSaveFrontDto[] = [];
  public flocksInStockTable = new MatTableDataSource<FlockSaveDto>;
  public displayedColumnsStock: string[] = ['name', 'age', 'quantity', 'bonus', 'wholesalePrice', 'price', 'discount', 'tax', 'remove'];

  public errorMessages = {
    invoiceNumber: [
      { type: "required", message: "Invoice number is required" },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private flockApiService: FlockApiService,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.searchSupplier();
  }

  ionViewWillEnter(): void {
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchSupplier(): void {
    if (this.searchSupplierSubscription) {
      this.searchSupplierSubscription.unsubscribe();
    }
    this.searchSupplierSubscription = this.searchSupplierCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredSuppliers = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          const name = {
            page: this.page,
            size: this.size,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder.toUpperCase(),
            name: value
          }
          return this.supplierApiService.search(name).pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        })
      )
      .subscribe((data: any) => {
        this.filteredSuppliers = data.content
      });
  }

  public onSupplierSelected(): void {
    this.selectedSupplier = this.selectedSupplier;
    this.showStock = true;
  }

  public displayWith(value: any): string {
    return value?.name;
  }

  public clearSelection(): void {
    this.selectedSupplier = "";
    this.filteredSuppliers = [];
    this.reset();
  }

  private initialiseFlockSaveDto(): void {
    this.flockStock = {
      id: 0,
      name: null,
      cageId: null,
      active: true,
      initialAge: 0,
      initialQuantity: 0,
      bonusQuantity: 0,
      aquisitionDate: new Date(),
      aquisitionType: AquisitionType.PURCHASE,
      death: 0,
      sterile: 0,
      badEggs: 0,
      goodEggs: 0,
      wholesalePrice: 0,
      pricePerChicken: 0,
      discount: 0,
      tax: 0,
      createdDate: null
    }
  }

  public addFlockToStock(): void {
    this.initialiseFlockSaveDto();
    this.flocksInStock.push(this.flockStock);
    this.flocksInStockTable = new MatTableDataSource<FlockSaveDto>(this.flocksInStock);
  }

  public removeFlockInStock(element: any, index: number): void {
    console.log(element);
    console.log(index);
    this.flocksInStock.splice(index, 1);
    this.flocksInStockTable = new MatTableDataSource<FlockSaveDto>(this.flocksInStock);
    this.calculateInvoice();
  }

  public reset(): void {
    this.showStock = false;
    this.flocksInStock = [];
    this.flocksInStockTable = new MatTableDataSource<FlockSaveDto>(this.flocksInStock);
  }

  public save(): void {
    const flockPurchaseDto = {
      invoiceNumber: this.confirmInvoiceForm.value.invoiceNumber,
      supplierId: this.selectedSupplier.id,
      discount: null,
      comment: this.confirmInvoiceForm.value.comment,
      flockDtos: this.flocksInStockTable.data
    }
    this.utilsService.presentLoading();
    this.flockApiService.updateFlockStock(flockPurchaseDto).subscribe({
      next: (data: string) => {
        this.subTotal = 0;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock(s) stock updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public calculateInvoice() {
    this.subTotal = 0;
    this.flocksInStockTable.data.forEach((product, index) => {
      if (this.flocksInStockTable.data[index].bonusQuantity && this.flocksInStockTable.data[index].tax && this.flocksInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (((this.flocksInStockTable.data[index].initialQuantity - this.flocksInStockTable.data[index].bonusQuantity) * (this.flocksInStockTable.data[index].wholesalePrice * ((this.flocksInStockTable.data[index].tax + 100) / 100))) -
            ((this.flocksInStockTable.data[index].wholesalePrice * ((this.flocksInStockTable.data[index].tax + 100) / 100)) * (this.flocksInStockTable.data[index].discount / 100)));
      } else if (this.flocksInStockTable.data[index].bonusQuantity && this.flocksInStockTable.data[index].tax) {
        this.subTotal = this.subTotal +
          (this.flocksInStockTable.data[index].initialQuantity -
            this.flocksInStockTable.data[index].bonusQuantity) *
          (this.flocksInStockTable.data[index].wholesalePrice * ((this.flocksInStockTable.data[index].tax + 100) / 100));
      } else if (this.flocksInStockTable.data[index].tax && this.flocksInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (((this.flocksInStockTable.data[index].initialQuantity) * (this.flocksInStockTable.data[index].wholesalePrice * ((this.flocksInStockTable.data[index].tax + 100) / 100))) -
            ((this.flocksInStockTable.data[index].wholesalePrice * ((this.flocksInStockTable.data[index].tax + 100) / 100)) * (this.flocksInStockTable.data[index].discount / 100)));
      } else if (this.flocksInStockTable.data[index].bonusQuantity && this.flocksInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (this.flocksInStockTable.data[index].initialQuantity - this.flocksInStockTable.data[index].bonusQuantity) *
          (this.flocksInStockTable.data[index].wholesalePrice * ((100 - this.flocksInStockTable.data[index].discount) / 100));
      } else if (this.flocksInStockTable.data[index].bonusQuantity) {
        this.subTotal =
          this.subTotal +
          (this.flocksInStockTable.data[index].initialQuantity - this.flocksInStockTable.data[index].bonusQuantity) *
          this.flocksInStockTable.data[index].wholesalePrice;
      } else if (this.flocksInStockTable.data[index].tax) {
        this.subTotal =
          this.subTotal +
          (this.flocksInStockTable.data[index].initialQuantity) *
          (this.flocksInStockTable.data[index].wholesalePrice * ((this.flocksInStockTable.data[index].tax + 100) / 100));
      } else if (this.flocksInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (this.flocksInStockTable.data[index].initialQuantity) *
          (this.flocksInStockTable.data[index].wholesalePrice * ((100 - this.flocksInStockTable.data[index].discount) / 100));
      } else {
        this.subTotal =
          this.subTotal +
          (this.flocksInStockTable.data[index].initialQuantity) *
          this.flocksInStockTable.data[index].wholesalePrice;
      }
    });
  }

  private initialiseConfirmPurchaseInvoiceForm(): void {
    this.confirmInvoiceForm = this.formBuilder.group({
      invoiceNumber: new FormControl("", Validators.compose([Validators.required])),
      total: new FormControl({ value: this.subTotal.toFixed(2), disabled: true }, Validators.compose([Validators.required])),
      comment: new FormControl(""),
    });
  }

  public openModal(): void {
    this.initialiseConfirmPurchaseInvoiceForm();
    this.isModalOpen = true;
  }

  public cancel(): void {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }

  public confirm(): void {
    this.modal.dismiss(null, 'confirm');
  }

  public onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isModalOpen = false;
      this.save();
    }
  }
}
