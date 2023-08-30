/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-08-27 22:55:17.

export class CageDto {
    id!: number;
    name!: string;
    active!: boolean;
    cageCategory!: CageCategory;
}

export class CageSearchCriteriaDto {
    name!: string;
    active!: boolean;
    cageCategory!: CageCategory;
}

export class DailyProductionReportDto {
    cageName!: string;
    initialFlockAge!: number;
    initialFlockQuantity!: number;
    initialFlockCategory!: FlockCategory;
    flockAge!: number;
    flockCategory!: FlockCategory;
    deadChicken!: number;
    sterileChicken!: number;
    goodChicken!: number;
    goodEggsInTie!: number;
    goodEggsNotInTie!: number;
    goodEggsInTray!: number;
    goodEggsNotInTray!: number;
    badEggsInTray!: number;
    badEggsNotInTray!: number;
    totalEggs!: number;
    percentageHD!: number;
    surveyDate!: Date;
    healthReportDtos!: HealthReportDto[];
}

export class FeedSaveDto {
    id!: number;
    name!: string;
    feedCategory!: FeedCategory;
    recommendedWeight!: number;
}

export class FeedStockAllocationDto {
    flockId!: number;
    feedStockId!: number;
    bagsAllocated!: number;
}

export class FeedSurveyDto {
    flockFeedLineId!: number;
    bagsEaten!: number;
}

export class FlockDto {
    id!: number;
    active!: boolean;
    initialAge!: number;
    initialFlockCategory!: FlockCategory;
    initialQuantity!: number;
    aquisitionDate!: Date;
    aquisitionType!: AquisitionType;
    cageName!: string;
}

export class FlockFeedLineDto {
    id!: number;
    bagsAllocated!: number;
    bagsEaten!: number;
    bagsLeft!: number;
    createdDate!: Date;
}

export class FlockSaleSaveDto {
    cageId!: number;
    flockId!: number;
    quantitySoldForSterile!: number;
    quantitySoldForGood!: number;
    pricePerChickenForSterile!: number;
    pricePerChickenForGood!: number;
}

export class FlockSaveDto {
    id!: number;
    active!: boolean;
    initialAge!: number;
    initialQuantity!: number;
    aquisitionDate!: Date;
    aquisitionType!: AquisitionType;
    cageId!: number;
    death!: number;
    sterile!: number;
    badEggs!: number;
    goodEggs!: number;
}

export class FlockSearchCriteriaDto {
    active!: boolean;
    initialAge!: number;
    initialFlockCategory!: FlockCategory;
    initialQuantity!: number;
    aquisitionDate!: Date;
    aquisitionType!: AquisitionType;
    cageName!: string;
}

export class FlockStockDto {
    id!: number;
    surveyDate!: Date;
    age!: number;
    flockCategory!: FlockCategory;
    death!: number;
    sterile!: number;
    good!: number;
    flockDto!: FlockDto;
}

export class HealthProductDto {
    id!: number;
    name!: string;
    description!: string;
    healthType!: HealthType;
    active!: boolean;
}

export class HealthProductSearchCriteriaDto {
    name!: string;
    healthType!: HealthType;
    active!: boolean;
}

export class HealthReportDto {
    healthProductName!: string;
    healthType!: HealthType;
    boxesUsed!: number;
    unitsUsed!: number;
}

export class HealthSurveyDto {
    healthProductId!: number;
    healthProductName!: string;
    healthType!: HealthType;
    healthSurveyStockDtos!: HealthSurveyStockDto[];
}

export class HealthSurveyStockDto {
    healthProductStockId!: number;
    boxesTotal!: number;
    unitsPerBox!: number;
    unitsTotal!: number;
    unitsUsed!: number;
    expiryDate!: Date;
}

export class Sortable {
    sortBy!: string;
    sortOrder!: Order;
}

export class SurveyDto {
    cageId!: number;
    flockId!: number;
    flockStockId!: number;
    eggStockId!: number;
    activeFlock!: boolean;
    cageName!: string;
    cageCategory!: CageCategory;
    flockCategory!: FlockCategory;
    age!: number;
    death!: number;
    sterile!: number;
    good!: number;
    badEggs!: number;
    goodEggs!: number;
    alive!: number;
    totalSterile!: number;
    comment!: string;
    healthSurveyDtos!: HealthSurveyDto[];
    feedSurveyDtos!: FeedSurveyDto[];
}

export enum CageCategory {
    DOC = 'DOC',
    DARA = 'DARA',
    NORM = 'NORM',
}

export enum FlockCategory {
    DOC = 'DOC',
    DARA = 'DARA',
    NORM = 'NORM',
}

export enum FeedCategory {
    DOC = 'DOC',
    DARA = 'DARA',
    NORM = 'NORM',
}

export enum AquisitionType {
    PURCHASE = 'PURCHASE',
}

export enum HealthType {
    MEDICINE = 'MEDICINE',
    VACCINE = 'VACCINE',
}

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}