import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  x: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', x: 'x' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', x: 'x' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', x: 'x' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', x: 'x' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', x: 'x' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', x: 'x' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', x: 'x' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', x: 'x' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', x: 'x' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', x: 'x' },
];


@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent implements OnInit {
  public language = "en";

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialiseStocks();
  }


  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['cage', 'date', 'duration', 'umurAyam', 'populasi', 'mati', 'afkir', 'sisa', 'ikat', 'butir', 'pcah', 'perHD', 'totalButir', 'upDownProduction', 'vaksinObat', 'stdPakan', 'pakanKarung', 'eggTray'];
  // private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  // private verticalPosition: MatSnackBarVerticalPosition = 'top';
  public virtualStocks: any[] = [];
  public stocks = new MatTableDataSource<any>;

  public airportForm = new FormGroup({
    cageId: new FormControl('', Validators.compose([
    ])),
    region: new FormControl('', Validators.compose([
    ])),
    city: new FormControl('', Validators.compose([
    ])),
    airportCode: new FormControl('', Validators.compose([
    ])),
  });


  private initialiseStocks() {
    this.virtualStocks = [
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'B',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'C',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'C',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'A',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'D',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
      {
        cage: 'F',
        date: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        duration: 18,
        umurAyam: 2,
        populasi: 4000,
        mati: 1,
        afkir: 2,
        sisa: 10,
        ikat: 2,
        butir: 2,
        pcah: 9,
        perHD: 0.545,
        totalButir: 10,
        upDownProduction: 1,
        vaksinObat: 'Vaccine name',
        stdPakan: 9,
        pakanKarung: 8,
        eggTray: 10
      },
    ]

    this.stocks = new MatTableDataSource<any>(this.virtualStocks);
  }

  displayedColumnss: string[] = ['position', 'name', 'weight', 'symbol', 'x'];
  dataSource = ELEMENT_DATA;
}
