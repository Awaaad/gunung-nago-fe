/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-09-27 21:49:39.

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
    farmId!: number;
}

export class Sortable {
    sortBy!: string;
    sortOrder!: Order;
}

export class CustomerDto {
    id!: number;
    firstName!: string;
    lastName!: string;
    address!: string;
    telephoneNumber!: number;
    totalAmountDue!: number;
}

export class CustomerSearchCriteriaDto {
    name!: string;
    address!: string;
    telephoneNumber!: number;
}

export class FarmDto {
    id!: number;
    name!: string;
    telephoneNumber!: number;
    address!: string;
}

export class FeedDto {
    id!: number;
    feedCategory!: FeedCategory;
    name!: string;
    recommendedWeight!: number;
}

export class FeedSearchCriteriaDto {
    name!: string;
    feedCategory!: FeedCategory;
    farmId!: number;
}

export class FeedStockAllocationDto {
    cageName!: string;
    cageCategory!: CageCategory;
    bagsLeft!: number;
    flockId!: number;
    feedStockId!: number;
    bagsAllocated!: number;
}

export class FeedStockDto {
    id!: number;
    bags!: number;
    createdDate!: Date;
    price!: number;
    weight!: number;
    name!: string;
    feedCategory!: FeedCategory;
    feedId!: number;
}

export class FeedStockSaveDto {
    id!: number;
    bagsReceived!: number;
    bonusBagsReceived!: number;
    createdDate!: Date;
    wholesalePrice!: number;
    pricePerBag!: number;
    discount!: number;
    weight!: number;
    feedId!: number;
    name!: string;
    feedCategory!: FeedCategory;
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
    farmId!: number;
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
    unitsPerBox!: number;
}

export class HealthProductSearchCriteriaDto {
    name!: string;
    healthType!: HealthType;
    active!: boolean;
    farmId!: number;
}

export class HealthProductStockDto {
    id!: number;
    quantity!: number;
    unitsPerBox!: number;
    unitsTotal!: number;
    pricePerBox!: number;
    expiryDate!: Date;
    createdDate!: Date;
    healthProductId!: number;
}

export class HealthProductStockSaveDto {
    healthProductId!: number;
    name!: string;
    description!: string;
    healthType!: HealthType;
    boxesReceived!: number;
    bonusBoxesReceived!: number;
    unitsPerBox!: number;
    wholesalePrice!: number;
    pricePerBox!: number;
    expiryDate!: Date;
    discount!: number;
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

export class FeedPurchaseDto {
    invoiceNumber!: string;
    discount!: number;
    supplierId!: number;
    feedStockDtos!: FeedStockSaveDto[];
}

export class HealthProductPurchaseDto {
    invoiceNumber!: string;
    discount!: number;
    supplierId!: number;
    healthProductStockDtos!: HealthProductStockSaveDto[];
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
    bagsEaten!: number;
    comment!: string;
    eggTray!: number;
    productionRate!: number;
    healthReportDtos!: HealthReportDto[];
}

export class AuthenticatedUserDetailsDto {
    username!: string;
    role!: string[];
    farmId!: number;
}

export class AuthenticatedUserDto {
    userDto!: UserDto;
    token!: string;
}

export class LoginParamDto {
    username!: string;
    password!: string;
    farmId!: number;
}

export class RoleDto {
    roleId!: number;
    role!: string;
}

export class UserDto {
    id!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    dateOfBirth!: Date;
    email!: string;
    phone!: number;
    password!: string;
    roles!: RoleDto[];
    farms!: FarmDto[];
}

export class UserSearchCriteriaDto {
    name!: string;
}

export class SupplierDto {
    id!: number;
    name!: string;
    email!: string;
    telephoneNumber!: number;
    address!: string;
    farmId!: number;
}

export class SupplierSearchCriteriaDto {
    name!: string;
    email!: string;
    telephoneNumber!: number;
    address!: string;
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

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum FeedCategory {
    DOC = 'DOC',
    DARA = 'DARA',
    NORM = 'NORM',
}

export enum FlockCategory {
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
