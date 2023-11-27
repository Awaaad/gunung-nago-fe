/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-11-27 12:35:16.

export class BankAccountDto {
    id!: number;
    bankName!: string;
    accountHolder!: string;
    accountNumber!: string;
}

export class BankAccountSearchCriteriaDto {
    bankName!: string;
    accountHolder!: string;
    accountNumber!: string;
}

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
    credit!: boolean;
}

export class EggCategoryDto {
    id!: number;
    name!: string;
    eggType!: EggType;
}

export class EggCategoryReportDto {
    eggCategoryId!: number;
    name!: string;
}

export class EggCategoryReportDtoBuilder {
}

export class EggCategorySaleDto {
    eggCategoryId!: number;
    piece!: number;
    pricePerPiece!: number;
    tie!: number;
    pricePerTie!: number;
    tray!: number;
    pricePerTray!: number;
}

export class EggCategorySaleDtoBuilder {
}

export class EggCategorySearchCriteriaDto {
    name!: string;
    eggType!: EggType;
}

export class EggCategoryStockDto {
    eggCategoryId!: number;
    name!: string;
    eggType!: EggType;
    quantity!: number;
}

export class EggReportDto {
    name!: string;
    date!: Date;
    yesterdayTie!: number;
    yesterdayPiece!: number;
    yesterdayBad!: number;
    todayInTie!: number;
    todayInPiece!: number;
    todayInBad!: number;
    todayOutTie!: number;
    todayOutPiece!: number;
    todayOutBad!: number;
    todayRemainingTie!: number;
    todayRemainingPiece!: number;
    todayRemainingBad!: number;
    eggTransactionInGoodTodayDetailsDtos!: EggTransactionTodayDetailsDto[];
    eggTransactionInBadTodayDetailsDtos!: EggTransactionTodayDetailsDto[];
    eggTransactionOutGoodTodayDetailsDtos!: EggTransactionTodayDetailsDto[];
    eggTransactionOutBadTodayDetailsDtos!: EggTransactionTodayDetailsDto[];
}

export class EggReportDtoBuilder {
}

export class EggReportSearchCriteriaDto {
    detailed!: boolean;
    date!: Date;
    eggCategoryId!: number;
}

export class EggSaleSaveDto {
    soldAt!: number;
    discount!: number;
    customerDto!: CustomerDto;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    eggCategorySaleDtos!: EggCategorySaleDto[];
    newCustomer!: boolean;
}

export class EggSaleSaveDtoBuilder {
}

export class EggStockDto {
    goodEggs!: number;
    badEggs!: number;
    totalEggs!: number;
    eggCategoryStockDtos!: EggCategoryStockDto[];
    createdBy!: string;
    lastModifiedBy!: string;
    createdDate!: Date;
    lastModifiedDate!: Date;
}

export class EggStockDtoBuilder {
}

export class EggTransactionTodayDetailsDto {
    customerFirstName!: string;
    customerLastName!: string;
    comment!: string;
    quantity!: number;
    tie!: number;
    piece!: number;
    eggRecordType!: EggRecordType;
}

export class EggTransactionTodayDetailsDtoBuilder {
}

export class EggTransferDto {
    eggCategoryId!: number;
    bad!: number;
    unsellable!: number;
}

export class EggTransferDtoBuilder {
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

export class FlockCageIncompatibleDto {
    cageId!: number;
    flockId!: number;
    flockStockId!: number;
    name!: string;
    initialAge!: number;
    initialFlockCategory!: FlockCategory;
    cageCategory!: CageCategory;
    initialQuantity!: number;
    cageName!: string;
    createdDate!: Date;
}

export class FlockCageTransferDto {
    flockId!: number;
    cageId!: number;
    quantity!: number;
}

export class FlockDto {
    id!: number;
    name!: string;
    active!: boolean;
    initialAge!: number;
    actualAge!: number;
    initialFlockCategory!: FlockCategory;
    actualFlockCategory!: FlockCategory;
    initialQuantity!: number;
    actualQuantity!: number;
    actualGood!: number;
    actualSterile!: number;
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
    soldAt!: number;
    discount!: number;
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
    actualAge!: number;
    initialQuantity!: number;
    actualGood!: number;
    actualSterile!: number;
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
    soldAt!: number;
    discount!: number;
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
    weight!: number;
    bags!: number;
}

export class ManureStockDtoBuilder {
}

export class PaymentDto {
    id!: number;
    paymentModeId!: number;
    paymentModeName!: string;
    bankAccountId!: number;
    amountPaid!: number;
    paymentDeadline!: Date;
    settled!: boolean;
}

export class PaymentModeDto {
    id!: number;
    name!: string;
    requireBankAccount!: boolean;
}

export class PaymentModeSearchCriteriaDto {
    name!: string;
    requireBankAccount!: boolean;
}

export class PaymentSaveDto {
    paymentModeId!: number;
    bankAccountId!: number;
    amountPaid!: number;
    paymentDeadline!: Date;
}

export class SalesInvoiceSettleCreditPaymentDto {
    invoiceId!: number;
    soldAt!: number;
    discount!: number;
    paymentSaveDtos!: PaymentSaveDto[];
}

export class SettleCustomerCreditPaymentDto {
    customerId!: number;
    paymentDtos!: PaymentDto[];
    soldAtForUnlockedCreditPayments!: number;
    paymentDeadline!: Date;
}

export class SaleDetailsDto {
    id!: number;
    salesInvoiceType!: SalesInvoiceType;
    quantity!: number;
    price!: number;
    eggCategoryId!: number;
    eggType!: string;
    eggQuantityType!: EggQuantityType;
    transferToBad!: boolean;
    cageId!: number;
    flockId!: number;
    flockType!: FlockType;
}

export class SaleSaveDto {
    customerDto!: CustomerDto;
    soldAt!: number;
    discount!: number;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    saleDetailsDtos!: SaleDetailsDto[];
    salesInvoiceId!: number;
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

export class DailyFlockReportDto {
    flockId!: number;
    flockStockId!: number;
    cageName!: string;
    age!: number;
    alive!: number;
    good!: number;
    sterile!: number;
    death!: number;
    amountOfChickenWeighted!: number;
    totalWeight!: number;
    averageWeight!: number;
    surveyDate!: Date;
    createdDate!: Date;
    flockType!: FlockType;
    quantity!: number;
    remainingAlive!: number;
    remainingGood!: number;
    remainingSterile!: number;
}

export class DailyProductionReportDto {
    configurationEggTie!: number;
    configurationEggTray!: number;
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
    eggCategoryStocks!: EggCategoryStockDto[];
}

export class ReturnInvoiceDto {
    returnNumber!: number;
    comment!: string;
    totalPrice!: number;
    createdDate!: Date;
    returnInvoiceLineDtos!: ReturnInvoiceLineDto[];
}

export class ReturnInvoiceLineDto {
    returnInvoiceType!: ReturnInvoiceType;
    pricePerBox!: number;
    totalPrice!: number;
    feedStockId!: number;
    flockId!: number;
    manureStockId!: number;
    quantity!: number;
    salesInvoiceLineId!: number;
    eggQuantityType!: EggQuantityType;
    eggCategory!: string;
    eggType!: EggType;
    flockType!: FlockType;
}

export class SalesInvoiceDetailsDto {
    id!: number;
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

export class SalesInvoiceDetailsForReturnDto {
    id!: number;
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
    discount!: number;
    comment!: string;
    salesInvoiceLineForReturnDtos!: SalesInvoiceLineForReturnDto[];
}

export class SalesInvoiceDto {
    id!: number;
    salesInvoiceType!: SalesInvoiceType;
    totalPrice!: number;
    soldAt!: number;
    discount!: number;
    createdBy!: string;
    createdDate!: Date;
    customerFirstName!: string;
    customerLastName!: string;
    driverFirstName!: string;
    driverLastName!: string;
    salesInvoiceCategory!: SalesInvoiceCategory;
    salesInvoiceStatus!: SalesInvoiceStatus;
    paymentDtos!: PaymentDto[];
    locked!: boolean;
    totalAmountDue!: number;
    totalLockedAmountDue!: number;
    totalUnlockedAmountDue!: number;
}

export class SalesInvoiceSearchCriteriaDto {
    salesInvoiceType!: SalesInvoiceType;
    customerName!: string;
    createdBy!: string;
    driverId!: number;
    dateFrom!: Date;
    dateTo!: Date;
    salesInvoiceStatus!: SalesInvoiceStatus;
    salesInvoiceCategory!: SalesInvoiceCategory;
    farmId!: number;
    customerId!: number;
    credit!: boolean;
}

export class SalesInvoiceLineDto {
    salesInvoiceId!: number;
    salesInvoiceLineId!: number;
    salesInvoiceCategory!: SalesInvoiceCategory;
    salesInvoiceStatus!: SalesInvoiceStatus;
    salesInvoiceType!: SalesInvoiceType;
    flockType!: FlockType;
    eggCategoryName!: string;
    eggType!: EggType;
    eggQuantityType!: EggQuantityType;
    quantity!: number;
    price!: number;
    totalPrice!: number;
    soldAt!: number;
    invoiceTotalPrice!: number;
    invoiceSoldAt!: number;
    discount!: number;
    paymentDtos!: PaymentDto[];
    customerFirstName!: string;
    customerLastName!: string;
    driverFirstName!: string;
    driverLastName!: string;
    createdBy!: string;
    createdDate!: Date;
}

export class SalesInvoiceLineForReturnDto {
    id!: number;
    salesInvoiceType!: SalesInvoiceType;
    quantity!: number;
    price!: number;
    eggQuantityType!: EggQuantityType;
    eggCategoryId!: number;
    cageId!: number;
    flockId!: number;
    flockType!: FlockType;
    quantityReturned!: number;
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
    surveyEggCountDtos!: SurveyEggCountDto[];
    alive!: number;
    totalSterile!: number;
    comment!: string;
    manureBags!: number;
    manureWeight!: number;
    amountOfChickenWeighted!: number;
    totalWeight!: number;
    createdDate!: Date;
    healthSurveyDtos!: HealthSurveyDto[];
    feedSurveyDtos!: FeedSurveyDto[];
}

export class SurveyEggCountDto {
    eggCategoryId!: number;
    quantity!: number;
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

export enum EggType {
    GOOD = 'GOOD',
    BAD = 'BAD',
}

export enum SalesInvoiceCategory {
    IN_STORE = 'IN_STORE',
    DELIVERY = 'DELIVERY',
}

export enum EggRecordType {
    SURVEY = 'SURVEY',
    SALE = 'SALE',
    TRANSFER = 'TRANSFER',
    BURDEN_TRANSFER_BAD_DESTROYED = 'BURDEN_TRANSFER_BAD_DESTROYED',
    RETURN = 'RETURN',
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
    TRANSFER = 'TRANSFER',
}

export enum HealthType {
    MEDICINE = 'MEDICINE',
    VACCINE = 'VACCINE',
}

export enum SalesInvoiceType {
    FLOCK = 'FLOCK',
    EGG = 'EGG',
    FEED = 'FEED',
    MANURE = 'MANURE',
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
    OUTSTANDING = 'OUTSTANDING',
    PAST_DUE = 'PAST_DUE',
    PAID = 'PAID',
    PARTLY_PAID = 'PARTLY_PAID',
    RETURNED = 'RETURNED',
}

export enum ReturnInvoiceType {
    FLOCK = 'FLOCK',
    FEED = 'FEED',
    EGG = 'EGG',
    MANURE = 'MANURE',
}
