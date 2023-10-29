/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-10-26 21:20:22.

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
    telephoneNumberTwo!: number;
    telephoneNumberThree!: number;
    totalAmountDue!: number;
}

export class CustomerSearchCriteriaDto {
    name!: string;
    address!: string;
    telephoneNumber!: number;
}

export class EggSaleSaveDto {
    big!: boolean;
    medium!: boolean;
    small!: boolean;
    bad!: boolean;
    customerDto!: CustomerDto;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    bigGoodPiece!: number;
    bigGoodPricePerPiece!: number;
    bigGoodTie!: number;
    bigGoodPricePerTie!: number;
    bigGoodTray!: number;
    bigGoodPricePerTray!: number;
    mediumGoodPiece!: number;
    mediumGoodPricePerPiece!: number;
    mediumGoodTie!: number;
    mediumGoodPricePerTie!: number;
    mediumGoodTray!: number;
    mediumGoodPricePerTray!: number;
    smallGoodPiece!: number;
    smallGoodPricePerPiece!: number;
    smallGoodTie!: number;
    smallGoodPricePerTie!: number;
    smallGoodTray!: number;
    smallGoodPricePerTray!: number;
    badPiece!: number;
    badPricePerPiece!: number;
    badTie!: number;
    badPricePerTie!: number;
    badTray!: number;
    badPricePerTray!: number;
    newCustomer!: boolean;
}

export class EggSaleSaveDtoBuilder {
}

export class EggStockDto {
    goodEggs!: number;
    bigEggs!: number;
    mediumEggs!: number;
    smallEggs!: number;
    badEggs!: number;
    totalEggs!: number;
}

export class EggStockDtoBuilder {
}

export class EggTransferDto {
    bigGoodToBadEggs!: number;
    bigGoodBrokenEggs!: number;
    mediumGoodToBadEggs!: number;
    mediumGoodBrokenEggs!: number;
    smallGoodToBadEggs!: number;
    smallGoodBrokenEggs!: number;
    badBrokenEggs!: number;
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
    supplierId!: number;
    supplierName!: string;
}

export class FeedSearchCriteriaDto {
    name!: string;
    feedCategory!: FeedCategory;
    supplierId!: number;
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
    tax!: number;
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

export class FlockSaleDetailsDto {
    cageId!: number;
    flockId!: number;
    quantitySoldForSterile!: number;
    quantitySoldForGood!: number;
    pricePerChickenForSterile!: number;
    pricePerChickenForGood!: number;
}

export class FlockSaleSaveDto {
    customerDto!: CustomerDto;
    flockSaleDetailsDtos!: FlockSaleDetailsDto[];
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    newCustomer!: boolean;
}

export class FlockSaveDto {
    id!: number;
    name!: string;
    cageId!: number;
    active!: boolean;
    initialAge!: number;
    initialQuantity!: number;
    bonusQuantity!: number;
    aquisitionDate!: Date;
    aquisitionType!: AquisitionType;
    death!: number;
    sterile!: number;
    badEggs!: number;
    goodEggs!: number;
    wholesalePrice!: number;
    pricePerChicken!: number;
    discount!: number;
    tax!: number;
    createdDate!: Date;
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

export class FlockStockCountDto {
    alive!: number;
    sterile!: number;
    good!: number;
    dead!: number;
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
    supplierId!: number;
    supplierName!: string;
}

export class HealthProductSearchCriteriaDto {
    name!: string;
    healthType!: HealthType;
    active!: boolean;
    supplierId!: number;
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
    tax!: number;
    createdDate!: Date;
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

export class ManureSaleSaveDto {
    customerDto!: CustomerDto;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    quantity!: number;
    price!: number;
    driverId!: number;
    comment!: string;
    newCustomer!: boolean;
}

export class ManureSaleSaveDtoBuilder {
}

export class ManureStockDto {
    id!: number;
    weight!: number;
    bags!: number;
}

export class ManureStockDtoBuilder {
}

export class PaymentDto {
    id!: number;
    amountPaid!: number;
    paymentDeadline!: Date;
    previousPaymentType!: PaymentType;
    paymentType!: PaymentType;
}

export class PaymentSaveDto {
    amountPaid!: number;
    paymentDeadline!: Date;
    previousPaymentType!: PaymentType;
    paymentType!: PaymentType;
}

export class SaleDetailsDto {
    salesInvoiceType!: SalesInvoiceType;
    quantity!: number;
    price!: number;
    eggType!: EggType;
    eggQuantityType!: EggQuantityType;
    cageId!: number;
    flockId!: number;
    flockType!: FlockType;
}

export class SaleSaveDto {
    customerDto!: CustomerDto;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    saleDetailsDtos!: SaleDetailsDto[];
    newCustomer!: boolean;
}

export class FeedPurchaseDto {
    invoiceNumber!: string;
    discount!: number;
    supplierId!: number;
    comment!: string;
    purchaseDetailsDtos!: PurchaseDetailsDto[];
}

export class FlockPurchaseDto {
    invoiceNumber!: string;
    discount!: number;
    supplierId!: number;
    comment!: string;
    purchaseDetailsDtos!: PurchaseDetailsDto[];
}

export class HealthProductPurchaseDto {
    invoiceNumber!: string;
    discount!: number;
    supplierId!: number;
    comment!: string;
    purchaseDetailsDtos!: PurchaseDetailsDto[];
}

export class PurchaseDetailsDto {
    purchaseInvoiceType!: PurchaseInvoiceType;
    healthProductId!: number;
    feedId!: number;
    name!: string;
    flockName!: string;
    feedName!: string;
    healthProductName!: string;
    age!: number;
    description!: string;
    healthType!: HealthType;
    weight!: number;
    feedCategory!: FeedCategory;
    unitsPerBox!: number;
    wholesalePrice!: number;
    expiryDate!: Date;
    feedExpiryDate!: Date;
    healthProductExpiryDate!: Date;
    discount!: number;
    tax!: number;
    quantity!: number;
    bonus!: number;
    price!: number;
}

export class PurchaseSaveDto {
    invoiceNumber!: string;
    discount!: number;
    supplierId!: number;
    comment!: string;
    purchaseDetailsDtos!: PurchaseDetailsDto[];
}

export class PurchaseInvoiceDetailsDto {
    id!: number;
    number!: string;
    supplierName!: string;
    supplierAddress!: string;
    supplierTelephoneNumber!: number;
    supplierTelephoneNumberTwo!: number;
    supplierTelephoneNumberThree!: number;
    createdBy!: string;
    createdDate!: Date;
    discount!: number;
    totalPrice!: number;
    comment!: string;
    purchaseDetailsDtos!: PurchaseDetailsDto[];
}

export class PurchaseInvoiceDto {
    id!: number;
    totalPrice!: number;
    createdBy!: string;
    createdDate!: Date;
    supplierName!: string;
    number!: string;
    discount!: number;
}

export class PurchaseInvoiceSearchCriteriaDto {
    invoiceNumber!: string;
    supplierId!: number;
    createdBy!: string;
    dateFrom!: Date;
    dateTo!: Date;
    purchaseInvoiceType!: PurchaseInvoiceType;
    farmId!: number;
}

export class ReceiptDetailsDto {
    id!: number;
    salesInvoiceId!: number;
    totalPrice!: number;
    soldAt!: number;
    createdBy!: string;
    createdDate!: Date;
    customerFirstName!: string;
    customerLastName!: string;
    customerAddress!: string;
    customerTelephoneNumber!: number;
    driverFirstName!: string;
    driverLastName!: string;
    salesPerson!: string;
    salesInvoiceCategory!: SalesInvoiceCategory;
    salesInvoiceStatus!: SalesInvoiceStatus;
    comment!: string;
    saleDetailsDtos!: SaleDetailsDto[];
    paymentDtos!: PaymentDto[];
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
    bigEggs!: number;
    mediumEggs!: number;
    smallEggs!: number;
    badEggsInTray!: number;
    badEggsNotInTray!: number;
    totalEggs!: number;
    percentageHD!: number;
    surveyDate!: Date;
    bagsEaten!: number;
    comment!: string;
    eggTray!: number;
    productionRate!: number;
    manureBags!: number;
    amountOfChickenWeighted!: number;
    totalWeight!: number;
    averageWeight!: number;
    healthReportDtos!: HealthReportDto[];
}

export class SalesInvoiceDetailsDto {
    id!: number;
    receiptId!: number;
    totalPrice!: number;
    soldAt!: number;
    createdBy!: string;
    createdDate!: Date;
    customerFirstName!: string;
    customerLastName!: string;
    customerAddress!: string;
    customerTelephoneNumber!: number;
    driverFirstName!: string;
    driverLastName!: string;
    salesPerson!: string;
    salesInvoiceCategory!: SalesInvoiceCategory;
    salesInvoiceStatus!: SalesInvoiceStatus;
    comment!: string;
    saleDetailsDtos!: SaleDetailsDto[];
}

export class SalesInvoiceDto {
    id!: number;
    receiptId!: number;
    salesInvoiceType!: SalesInvoiceType;
    totalPrice!: number;
    soldAt!: number;
    createdBy!: string;
    createdDate!: Date;
    customerFirstName!: string;
    customerLastName!: string;
    driverFirstName!: string;
    driverLastName!: string;
    salesInvoiceCategory!: SalesInvoiceCategory;
    salesInvoiceStatus!: SalesInvoiceStatus;
}

export class SalesInvoiceSearchCriteriaDto {
    customerName!: string;
    createdBy!: string;
    driverId!: number;
    dateFrom!: Date;
    dateTo!: Date;
    salesInvoiceStatus!: SalesInvoiceStatus;
    salesInvoiceCategory!: SalesInvoiceCategory;
    farmId!: number;
}

export class SalesInvoiceLineDto {
    id!: number;
    salesInvoiceId!: number;
    feedStockId!: number;
    boxesOrdered!: number;
    unitsOrdered!: number;
    totalPrice!: number;
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
    telephoneNumberTwo!: number;
    telephoneNumberThree!: number;
    address!: string;
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
    bigEggs!: number;
    mediumEggs!: number;
    smallEggs!: number;
    alive!: number;
    totalSterile!: number;
    comment!: string;
    manureBags!: number;
    amountOfChickenWeighted!: number;
    totalWeight!: number;
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

export enum SalesInvoiceCategory {
    IN_STORE = 'IN_STORE',
    DELIVERY = 'DELIVERY',
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

export enum PaymentType {
    CASH = 'CASH',
    CREDIT = 'CREDIT',
    CARD = 'CARD',
    CHEQUE = 'CHEQUE',
    ELECTRONIC = 'ELECTRONIC',
}

export enum SalesInvoiceType {
    FLOCK = 'FLOCK',
    EGG = 'EGG',
    FEED = 'FEED',
    MANURE = 'MANURE',
}

export enum EggType {
    BIG = 'BIG',
    MEDIUM = 'MEDIUM',
    SMALL = 'SMALL',
    BAD = 'BAD',
}

export enum EggQuantityType {
    TIE = 'TIE',
    TRAY = 'TRAY',
    PIECE = 'PIECE',
}

export enum FlockType {
    GOOD = 'GOOD',
    STERILE = 'STERILE',
}

export enum PurchaseInvoiceType {
    FLOCK = 'FLOCK',
    FEED = 'FEED',
    HEALTH_PRODUCT = 'HEALTH_PRODUCT',
}

export enum SalesInvoiceStatus {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    APPROVED = 'APPROVED',
    COMPLETED = 'COMPLETED',
    PAID = 'PAID',
}
