import { AquisitionType, CageCategory, EggQuantityType, EggType, FarmDto, FeedCategory, FeedSurveyDto, FlockCategory, FlockSaleDetailsDto, FlockType, HealthSurveyDto, HealthType, PaymentType, PurchaseDetailsDto, PurchaseInvoiceType, RoleDto, SaleDetailsDto, SalesInvoiceCategory, SalesInvoiceStatus, SalesInvoiceType } from "./model";

export class PageResult<T> {
    public content!: Array<T>;
    public empty!: boolean;
    public first!: boolean;
    public last!: boolean;
    public number!: number;
    public numberOfElements!: number;
    public size!: number;
    public totalElements!: number;
    public totalPages!: number;
}

export class SurveyFrontDto {
    cageId!: number | null | undefined;
    flockId!: number | null | undefined;
    flockStockId!: number | null | undefined;
    eggStockId!: number | null | undefined;
    activeFlock!: boolean | null | undefined;
    cageName!: string | null | undefined;
    cageCategory!: CageCategory | null | undefined;
    flockCategory!: FlockCategory | null | undefined;
    age!: number | null | undefined;
    death!: number | null | undefined;
    sterile!: number | null | undefined;
    good!: number | null | undefined;
    badEggs!: number | null | undefined;
    bigEggs!: number | null | undefined;
    mediumEggs!: number | null | undefined;
    smallEggs!: number | null | undefined;
    healthSurveyDtos: HealthSurveyDto[] | null | undefined;
    feedSurveyDtos: FeedSurveyDto[] | null | undefined;
    comment: string | null | undefined;
    manureBags!: number | null | undefined;
    manureWeight!: number | null | undefined;
    amountOfChickenWeighted!: number | null | undefined;
    totalWeight!: number | null | undefined;
    averageWeight!: number | null | undefined;
}

export class FlockSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined;
    flockSaleDetailsDtos!: FlockSaleDetailsDto[] | [] | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    newCustomer!: boolean | null | undefined;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined;
    driverId!: number | null | undefined;
    comment!: string | null | undefined;
    soldAt!: number | null | undefined;
}

export class EggSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    soldAt!: number | null | undefined;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined;
    driverId!: number | null | undefined;
    comment!: string | null | undefined;
    bigGoodPiece!: number | null | undefined;
    bigGoodPricePerPiece!: number | null | undefined;
    bigGoodTie!: number | null | undefined;
    bigGoodPricePerTie!: number | null | undefined;
    bigGoodTray!: number | null | undefined;
    bigGoodPricePerTray!: number | null | undefined;
    mediumGoodPiece!: number | null | undefined;
    mediumGoodPricePerPiece!: number | null | undefined;
    mediumGoodTie!: number | null | undefined;
    mediumGoodPricePerTie!: number | null | undefined;
    mediumGoodTray!: number | null | undefined;
    mediumGoodPricePerTray!: number | null | undefined;
    smallGoodPiece!: number | null | undefined;
    smallGoodPricePerPiece!: number | null | undefined;
    smallGoodTie!: number | null | undefined;
    smallGoodPricePerTie!: number | null | undefined;
    smallGoodTray!: number | null | undefined;
    smallGoodPricePerTray!: number;
    badPiece!: number | null | undefined;
    badPricePerPiece!: number | null | undefined;
    badTie!: number | null | undefined;
    badPricePerTie!: number | null | undefined;
    badTray!: number | null | undefined;
    badPricePerTray!: number | null | undefined;
    newCustomer!: boolean | null | undefined;
    big: boolean | null | undefined;
    medium: boolean | null | undefined;
    small: boolean | null | undefined;
    bad: boolean | null | undefined;
}

export class PaymentSaveFrontDto {
    amountPaid!: number;
    paymentDeadline!: Date | any;
    previousPaymentType!: PaymentType;
    paymentType!: PaymentType;
}


export class CustomerFrontDto {
    id!: number | null | undefined | any;
    firstName!: string | null | undefined | any;
    lastName!: string | null | undefined | any;
    address!: string | null | undefined | any;
    telephoneNumber!: number | null | undefined | any;
    totalAmountDue!: number | null | undefined | any;
}

export class UserFrontDto {
    id!: number | null | undefined | any;
    username!: string | null | undefined | any;
    firstName!: string | null | undefined | any;
    lastName!: string | null | undefined | any;
    dateOfBirth!: Date | null | undefined | any;
    email!: string | null | undefined | any;
    phone!: number | null | undefined | any;
    password!: string | null | undefined | any;
    roles!: RoleDto[] | [] | null | undefined | any;
    farms!: FarmDto[] | [] | null | undefined | any;
}

export class FlockSaveFrontDto {
    id!: number | null | undefined | any;
    name!: string | null | undefined | any;
    cageId!: number | null | undefined | any;
    active!: boolean | null | undefined | any;
    initialAge!: number | null | undefined | any;
    initialQuantity!: number | null | undefined | any;
    bonusQuantity!: number | null | undefined | any;
    aquisitionDate!: Date | null | undefined | any;
    aquisitionType!: AquisitionType | null | undefined | any;
    death!: number | null | undefined | any;
    sterile!: number | null | undefined | any;
    badEggs!: number | null | undefined | any;
    goodEggs!: number | null | undefined | any;
    wholesalePrice!: number | null | undefined | any;
    pricePerChicken!: number | null | undefined | any;
    discount!: number | null | undefined | any;
    tax!: number | null | undefined | any;
    createdDate!: Date | null | undefined | any;
}

export class ManureSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined | any;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined | any;
    quantity!: number | null | undefined | any;
    price!: number | null | undefined | any;
    soldAt!: number | null | undefined | any;
    driverId!: number | null | undefined | any;
    comment!: string | null | undefined | any;
    newCustomer!: boolean | null | undefined | any;
}

export class SaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined;
    driverId!: number | null | undefined;
    comment!: string | null | undefined;
    saleDetailsDtos!: SaleDetailsDto[] | [] | null | undefined;
    newCustomer!: boolean | null | undefined;
    soldAt!: number | null | undefined;
    salesInvoiceId!: number | null | undefined;
}

export class SaleDetailsFrontDto {
    salesInvoiceType!: SalesInvoiceType | null | undefined | any;
    quantity!: number | null | undefined | any;
    price!: number | null | undefined | any;
    eggType!: EggType | null | undefined | any;
    eggQuantityType!: EggQuantityType | null | undefined | any;
    cageId!: number | null | undefined | any;
    flockType!: FlockType | null | undefined | any;
    amount!: number | null | undefined | any;
    sterileChicken!: number | null | undefined | any;
    goodChicken!: number | null | undefined | any;
    flockId!: number | null | undefined | any;
}

export class SalesInvoiceDetailsFrontDto {
    id!: number | null | undefined | any;
    receiptId!: number | null | undefined | any;
    salesInvoiceType!: SalesInvoiceType | null | undefined | any;
    totalPrice!: number | null | undefined | any;
    soldAt!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    customerFirstName!: string | null | undefined | any;
    customerLastName!: string | null | undefined | any;
    customerAddress!: string | null | undefined | any;
    customerTelephoneNumber!: number | null | undefined | any;
    driverFirstName!: string | null | undefined | any;
    driverLastName!: string | null | undefined | any;
    salesPerson!: string | null | undefined | any;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined | any;
    salesInvoiceStatus!: SalesInvoiceStatus | null | undefined | any;
    comment: string | null | undefined | any;
    saleDetailsDtos!: SaleDetailsDto[] | [] | null | undefined;
}

export class ProductStockSaveFrontDto {
    type!: PurchaseInvoiceType | null | undefined | any;

    healthProductId!: number | null | undefined | any;
    feedId!: number | null | undefined | any;

    name!: string | null | undefined | any;
    age!: string | null | undefined | any;
    description!: string | null | undefined | any;
    healthType!: HealthType | null | undefined | any;
    weight!: number | null | undefined | any;
    feedCategory!: FeedCategory | null | undefined | any;

    unitsPerBox!: number | null | undefined | any;
    wholesalePrice!: number | null | undefined | any;

    expiryDate!: Date | null | undefined | any;
    discount!: number | null | undefined | any;
    tax!: number | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    quantity!: number | null | undefined | any;
    bonus!: number | null | undefined | any;
    price!: number | null | undefined | any;
}

export class PurchaseDetailsFrontDto {
    purchaseInvoiceType!: PurchaseInvoiceType | null | undefined | any;
    healthProductId!: number | null | undefined | any;
    feedId!: number | null | undefined | any;
    name!: string | null | undefined | any;
    age!: number | null | undefined | any;
    description!: string | null | undefined | any;
    healthType!: HealthType | null | undefined | any;
    weight!: number | null | undefined | any;
    feedCategory!: FeedCategory | null | undefined | any;
    unitsPerBox!: number | null | undefined | any;
    wholesalePrice!: number | null | undefined | any;
    expiryDate!: Date | null | undefined | any;
    discount!: number | null | undefined | any;
    tax!: number | null | undefined | any;
    quantity!: number | null | undefined | any;
    bonus!: number | null | undefined | any;
    price!: number | null | undefined | any;
}

export class PurchaseInvoiceDetailsFrontDto {
    id!: number | null | undefined | any;
    number!: string | null | undefined | any;
    supplierName!: string | null | undefined | any;
    supplierAddress!: string | null | undefined | any;
    supplierTelephoneNumber!: number | null | undefined | any;
    supplierTelephoneNumberTwo!: number | null | undefined | any;
    supplierTelephoneNumberThree!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    discount!: number | null | undefined | any;
    totalPrice!: number | null | undefined | any;
    comment!: string | null | undefined | any;
    purchaseDetailsDtos!: PurchaseDetailsDto[] | [] | null | undefined;
}

export class EggTransferFrontDto {
    bigGoodToBadEggs: number | null | undefined | any;
    bigGoodBrokenEggs: number | null | undefined | any;
    mediumGoodToBadEggs: number | null | undefined | any;
    mediumGoodBrokenEggs: number | null | undefined | any;
    smallGoodToBadEggs: number | null | undefined | any;
    smallGoodBrokenEggs: number | null | undefined | any;
    badBrokenEggs: number | null | undefined | any;
}

export class FlockToCage {
    cageId: number | null | undefined | any;
    flockId: number | null | undefined | any;
    name!: string | null | undefined | any;
    cageName!: string | null | undefined | any;
    cageCategory!: CageCategory | null | undefined | any;
    quantity!: number | null | undefined | any;
}

export class DropCage {
    flockToCage!: FlockToCage[] | [] | any;
}

export class EggStockFrontDto {
    goodEggs!: number | null | undefined | any;
    bigEggs!: number | null | undefined | any;
    mediumEggs!: number | null | undefined | any;
    smallEggs!: number | null | undefined | any;
    badEggs!: number | null | undefined | any;
    totalEggs!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    lastModifiedBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    lastModifiedDate!: Date | null | undefined | any;
}

export class FlockFrontDto {
    id!: number | null | undefined | any;
    name!: string | null | undefined | any;
    active!: boolean | null | undefined | any;
    initialAge!: number | null | undefined | any;
    actualAge!: number | null | undefined | any;
    initialFlockCategory!: FlockCategory | null | undefined | any;
    actualFlockCategory!: FlockCategory | null | undefined | any;
    initialQuantity!: number | null | undefined | any;
    actualQuantity!: number | null | undefined | any;
    actualGood!: number | null | undefined | any;
    actualSterile!: number | null | undefined | any;
    aquisitionDate!: Date | null | undefined | any;
    aquisitionType!: AquisitionType | null | undefined | any;
    cageName!: string | null | undefined | any;
    quantity!: number | null | undefined | any;
}

export class FlockCageIncompatibleFrontDto {
    cageId!: number | null | undefined | any;
    flockId!: number | null | undefined | any;
    flockStockId!: number | null | undefined | any;
    name!: string | null | undefined | any;
    initialAge!: number | null | undefined | any;
    initialFlockCategory!: FlockCategory | null | undefined | any;
    cageCategory!: CageCategory | null | undefined | any;
    initialQuantity!: number | null | undefined | any;
    cageName!: string | null | undefined | any;
    quantity!: number | null | undefined | any;
}

export class SalesInvoiceSettleCreditPaymentFrontDto {
    invoiceId!: number | null | undefined | any;
    soldAt!: number | null | undefined | any;
    discount!: number | null | undefined | any;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
}
