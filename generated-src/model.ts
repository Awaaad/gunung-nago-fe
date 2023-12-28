/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-12-27 17:46:20.

export class AuditDto {
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}

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
    internal!: boolean;
}

export class CustomerSearchCriteriaDto {
    name!: string;
    address!: string;
    telephoneNumber!: number;
    credit!: boolean;
    isInternal!: boolean;
    nameTel!: string;
}

export class EggCategoryDto {
    id!: number;
    name!: string;
    eggType!: EggType;
    quantity!: number;
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
    weightPerPiece!: number;
    tie!: number;
    pricePerTie!: number;
    weightPerTie!: number;
    tray!: number;
    pricePerTray!: number;
    weightPerTray!: number;
}

export class EggCategorySaleDtoBuilder {
}

export class EggCategorySearchCriteriaDto {
    name!: string;
    eggType!: EggType;
}

export class EggCategoryStockDto extends AuditDto {
    eggCategoryStockId!: number;
    eggCategoryId!: number;
    name!: string;
    eggType!: EggType;
    quantity!: number;
}

export class EggCategoryStockSearchCriteriaDto {
    eggCategoryId!: number;
    createdBy!: string;
    createdDateFrom!: Date;
    createdDateTo!: Date;
    lastModifiedBy!: string;
    lastModifiedDateFrom!: Date;
    lastModifiedDateTo!: Date;
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
    pricePerKg!: number;
    soldAt!: number;
    discount!: number;
    customerDto!: CustomerDto;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    eggCategorySaleDtos!: EggCategorySaleDto[];
    internal!: boolean;
    newCustomer!: boolean;
    toJakarta!: boolean;
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
    bags!: number;
}

export class FeedSaleDetailsDto {
    feedStockId!: number;
    quantity!: number;
    price!: number;
}

export class FeedSaleSaveDto {
    customerDto!: CustomerDto;
    soldAt!: number;
    discount!: number;
    feedSaleDetailsDtos!: FeedSaleDetailsDto[];
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    internal!: boolean;
    newCustomer!: boolean;
}

export class FeedSearchCriteriaDto {
    name!: string;
    feedCategory!: FeedCategory;
    supplierId!: number;
    farmId!: number;
    sale!: boolean;
}

export class FeedStockAllocationDto {
    cageName!: string;
    cageCategory!: CageCategory;
    bagsLeft!: number;
    flockId!: number;
    feedStockId!: number;
    bagsAllocated!: number;
}

export class FeedStockDto extends AuditDto {
    feedStockId!: number;
    initialBags!: number;
    bags!: number;
    bagsSold!: number;
    bagsAllocated!: number;
    recommendedPrice!: number;
    weight!: number;
    name!: string;
    feedCategory!: FeedCategory;
    feedId!: number;
    quantity!: number;
    price!: number;
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

export class FeedStockSearchCriteriaDto {
    feedId!: number;
    createdBy!: string;
    createdDateFrom!: Date;
    createdDateTo!: Date;
    lastModifiedBy!: string;
    lastModifiedDateFrom!: Date;
    lastModifiedDateTo!: Date;
}

export class FeedSurveyDto {
    flockFeedLineId!: number;
    bagsEaten!: number;
}

export class FlockFeedLineReportDto {
    name!: string;
    weight!: number;
    feedCategory!: FeedCategory;
    bagsAllocated!: number;
    bagsEaten!: number;
    bagsLeft!: number;
    createdDate!: Date;
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
    cageId!: number;
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
    internal!: boolean;
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
    name!: string;
    active!: boolean;
    actualAge!: number;
    actualFlockCategory!: FlockCategory;
    actualQuantity!: number;
    aquisitionDate!: Date;
    aquisitionType!: AquisitionType;
    cageId!: number;
    farmId!: number;
}

export class FlockStockCountDto {
    alive!: number;
    sterile!: number;
    good!: number;
    dead!: number;
}

export class FlockStockDto extends AuditDto {
    id!: number;
    surveyDate!: Date;
    age!: number;
    flockCategory!: FlockCategory;
    alive!: number;
    death!: number;
    sterile!: number;
    good!: number;
    totalWeight!: number;
    amountOfChickenWeighted!: number;
    cageName!: string;
    flockDto!: FlockDto;
}

export class FlockStockSearchCriteriaDto {
    flockId!: number;
    createdBy!: string;
    createdDateFrom!: Date;
    createdDateTo!: Date;
    lastModifiedBy!: string;
    lastModifiedDateFrom!: Date;
    lastModifiedDateTo!: Date;
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
    totalQuantity!: number;
    totalUnits!: number;
}

export class HealthProductSearchCriteriaDto {
    name!: string;
    healthType!: HealthType;
    active!: boolean;
    supplierId!: number;
    farmId!: number;
}

export class HealthProductStockDto extends AuditDto {
    id!: number;
    quantity!: number;
    unitsPerBox!: number;
    unitsTotal!: number;
    pricePerBox!: number;
    expiryDate!: Date;
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

export class HealthProductStockSearchCriteriaDto {
    healthProductId!: number;
    createdBy!: string;
    createdDateFrom!: Date;
    createdDateTo!: Date;
    lastModifiedBy!: string;
    lastModifiedDateFrom!: Date;
    lastModifiedDateTo!: Date;
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

export class ManureDto {
    id!: number;
    weight!: number;
    bags!: number;
}

export class ManureSaleDetailsDto {
    manureStockId!: number;
    quantity!: number;
    price!: number;
}

export class ManureSaleSaveDto {
    customerDto!: CustomerDto;
    soldAt!: number;
    discount!: number;
    manureSaleDetailsDtos!: ManureSaleDetailsDto[];
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    internal!: boolean;
    newCustomer!: boolean;
}

export class ManureSaleSaveDtoBuilder {
}

export class ManureSearchCriteriaDto {
    weight!: number;
    farmId!: number;
}

export class ManureStockDto extends AuditDto {
    id!: number;
    manureId!: number;
    cageId!: number;
    cageName!: string;
    weight!: number;
    bags!: number;
    collectedById!: number;
    collectedByFirstName!: string;
    collectedByLastName!: string;
    collectedDate!: Date;
}

export class ManureStockSearchCriteriaDto {
    manureId!: number;
    createdBy!: string;
    createdDateFrom!: Date;
    createdDateTo!: Date;
    lastModifiedBy!: string;
    lastModifiedDateFrom!: Date;
    lastModifiedDateTo!: Date;
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
    feedStockId!: number;
    refundFeedStockId!: number;
    feedName!: string;
    feedWeightPerBag!: number;
    eggCategoryId!: number;
    eggType!: string;
    eggQuantityType!: EggQuantityType;
    eggWeight!: number;
    transfer!: boolean;
    transferEggCategoryId!: number;
    refundProduct!: boolean;
    cageId!: number;
    flockId!: number;
    refundFlockId!: number;
    flockType!: FlockType;
    manureStockId!: number;
    manureWeightPerBag!: number;
}

export class SaleSaveDto {
    customerDto!: CustomerDto;
    soldAt!: number;
    discount!: number;
    paymentSaveDtos!: PaymentSaveDto[];
    salesInvoiceCategory!: SalesInvoiceCategory;
    driverId!: number;
    comment!: string;
    pricePerKg!: number;
    saleDetailsDtos!: SaleDetailsDto[];
    salesInvoiceId!: number;
    internal!: boolean;
    newCustomer!: boolean;
    toJakarta!: boolean;
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
    type!: PurchaseType;
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
    flockId!: number;
    flockStockId!: number;
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
    aliveChicken!: number;
    healthReportDtos!: HealthReportDto[];
    eggCategoryStocks!: EggCategoryStockDto[];
    flockFeedLineReportDtos!: FlockFeedLineReportDto[];
    manureStockDtos!: ManureStockDto[];
}

export class ReturnInvoiceDetailsDto {
    id!: number;
    totalPrice!: number;
    comment!: string;
    createdDate!: Date;
    createdBy!: string;
    customerFirstName!: string;
    customerLastName!: string;
    customerAddress!: string;
    customerTelephoneNumber!: number;
    driverFirstName!: string;
    driverLastName!: string;
    returnDetailsDtos!: ReturnInvoiceLineDetailsDto[];
}

export class ReturnInvoiceDto {
    returnNumber!: number;
    comment!: string;
    totalPrice!: number;
    createdDate!: Date;
    returnInvoiceLineDtos!: ReturnInvoiceLineDto[];
}

export class ReturnInvoiceLineDetailsDto {
    returnInvoiceType!: ReturnInvoiceType;
    price!: number;
    totalPrice!: number;
    feedStockId!: number;
    feedName!: string;
    feedWeightPerBag!: number;
    quantity!: number;
    salesInvoiceLineId!: number;
    eggQuantityType!: EggQuantityType;
    eggCategory!: string;
    eggType!: string;
    cageId!: number;
    flockId!: number;
    flockType!: FlockType;
    manureStockId!: number;
    manureWeightPerBag!: number;
}

export class ReturnInvoiceLineDto {
    returnInvoiceType!: ReturnInvoiceType;
    price!: number;
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
    feedName!: string;
    feedWeightPerBag!: number;
    manureWeightPerBag!: number;
}

export class ReturnInvoiceListDto {
    id!: number;
    returnInvoiceType!: ReturnInvoiceType;
    totalPrice!: number;
    discount!: number;
    createdBy!: string;
    createdDate!: Date;
    customerFirstName!: string;
    customerLastName!: string;
    driverFirstName!: string;
    driverLastName!: string;
    salesInvoiceStatus!: SalesInvoiceStatus;
    salesInvoiceId!: number;
}

export class ReturnInvoiceSearchCriteriaDto {
    returnInvoiceType!: ReturnInvoiceType;
    customerName!: string;
    createdBy!: string;
    dateFrom!: Date;
    dateTo!: Date;
    salesInvoiceStatus!: SalesInvoiceStatus;
    farmId!: number;
    customerId!: number;
    salesInvoiceId!: number;
    returnInvoiceId!: number;
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
    isToJakarta!: boolean;
    pricePerKg!: number;
    saleDetailsDtos!: SaleDetailsDto[];
}

export class SalesInvoiceDetailsForReturnDto {
    id!: number;
    totalPrice!: number;
    soldAt!: number;
    createdBy!: string;
    createdDate!: Date;
    customerId!: number;
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
    containsReturn!: boolean;
    isToJakarta!: boolean;
    salesInvoiceId!: number;
    refundInvoice!: boolean;
    internal!: boolean;
}

export class SalesInvoiceSearchCriteriaDto {
    id!: number;
    salesInvoiceType!: SalesInvoiceType;
    customerName!: string;
    createdBy!: string;
    driverId!: number;
    dateFrom!: Date;
    dateTo!: Date;
    salesInvoiceStatus!: SalesInvoiceStatus;
    eggQuantityType!: EggQuantityType;
    salesInvoiceCategory!: SalesInvoiceCategory;
    farmId!: number;
    customerId!: number;
    credit!: boolean;
    manureId!: number;
    feedName!: string;
    eggCategoryId!: number;
    generateStatement!: boolean;
    isToJakarta!: boolean;
    flockId!: number;
    manureStockId!: number;
    feedStockId!: number;
}

export class SalesInvoiceLineDto {
    salesInvoiceId!: number;
    isToJakarta!: boolean;
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
    feedStockId!: number;
    feedName!: string;
    feedWeightPerBag!: number;
    manureStockId!: number;
    manureWeightPerBag!: number;
    eggWeight!: number;
    invoiceId!: number;
    returnInvoiceLineDetailsDtos!: ReturnInvoiceLineDetailsDto[];
    internal!: boolean;
}

export class SalesInvoiceLineForReturnDto {
    id!: number;
    salesInvoiceType!: SalesInvoiceType;
    quantity!: number;
    price!: number;
    eggCategoryName!: string;
    returnedEggQuantityType!: EggQuantityType;
    salesEggQuantityType!: EggQuantityType;
    eggCategoryId!: number;
    cageId!: number;
    flockId!: number;
    flockType!: FlockType;
    quantityReturned!: number;
    feedId!: number;
    feedStockId!: number;
    feedName!: string;
    feedWeightPerBag!: number;
    manureStockId!: number;
    manureWeightPerBag!: number;
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
    address!: string;
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
    internal!: boolean;
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
    amountOfChickenWeighted!: number;
    totalWeight!: number;
    createdDate!: Date;
    manureStockDtos!: ManureStockDto[];
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

export enum PurchaseType {
    PURCHASE = 'PURCHASE',
    TRANSFER = 'TRANSFER',
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
