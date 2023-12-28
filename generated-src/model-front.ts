import { AquisitionType, CageCategory, EggCategoryStockDto, EggQuantityType, EggType, FarmDto, FeedCategory, FeedSurveyDto, FlockCategory, FlockSaleDetailsDto, FlockType, HealthSurveyDto, HealthType, ManureStockDto, PurchaseDetailsDto, PurchaseInvoiceType, ReturnInvoiceType, RoleDto, SaleDetailsDto, SalesInvoiceCategory, SalesInvoiceStatus, SalesInvoiceType, SurveyEggCountDto } from "./model";

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
    healthSurveyDtos: HealthSurveyDto[] | null | undefined;
    feedSurveyDtos: FeedSurveyDto[] | null | undefined;
    surveyEggCountDtos!: SurveyEggCountDto[] | null | undefined;
    manureStockDtos!: ManureStockFrontDto[] | null | undefined;
    comment: string | null | undefined;
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
    internal!: boolean | null | undefined;
}

export class EggSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    soldAt!: number | null | undefined;
    pricePerKg!: number | null | undefined;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined;
    driverId!: number | null | undefined;
    comment!: string | null | undefined;
    eggCategorySaleDtos!: EggCategorySaleFrontDto[] | [] | null | undefined;
    newCustomer!: boolean | null | undefined;
    isToJakarta!: boolean | null | undefined;
    internal!: boolean | null | undefined;
}

export class EggCategorySaleFrontDto {
    eggCategoryId!: number | null | undefined;
    piece!: number | null | undefined;
    pricePerPiece!: number | null | undefined;
    weightPerPiece!: number | null | undefined;
    tie!: number | null | undefined;
    pricePerTie!: number | null | undefined;
    weightPerTie!: number | null | undefined;
    tray!: number | null | undefined;
    pricePerTray!: number | null | undefined;
    weightPerTray!: number | null | undefined;
}

export class PaymentSaveFrontDto {
    amountPaid!: number;
    paymentDeadline!: Date | any;
    paymentModeId!: any;
    bankAccountId!: number;
}


export class CustomerFrontDto {
    id!: number | null | undefined | any;
    firstName!: string | null | undefined | any;
    lastName!: string | null | undefined | any;
    address!: string | null | undefined | any;
    telephoneNumber!: number | null | undefined | any;
    totalAmountDue!: number | null | undefined | any;
    internal!: boolean | null | undefined | any;
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
    manureSaleDetailsDtos!: ManureSaleDetailsFrontDto[] | [] | null | undefined;
    soldAt!: number | null | undefined | any;
    driverId!: number | null | undefined | any;
    comment!: string | null | undefined | any;
    newCustomer!: boolean | null | undefined | any;
    internal!: boolean | null | undefined;
}

export class ManureSaleDetailsFrontDto {
    manureStockId!: number | null | undefined | any;
    quantity!: number | null | undefined | any;
    price!: number | null | undefined | any;
}
export class FeedSaleDetailsFrontDto {
    feedStockId!: number | null | undefined | any;
    quantity!: number | null | undefined | any;
    price!: number | null | undefined | any;
}
export class FeedSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined | any;
    internal!: boolean | null | undefined | any;
    feedSaleDetailsDtos!: FeedSaleDetailsFrontDto[] | [] | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined | any;
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
    saleDetailsDtos!: SaleDetailsFrontDto[] | [] | null | undefined;
    newCustomer!: boolean | null | undefined;
    soldAt!: number | null | undefined;
    salesInvoiceId!: number | null | undefined;
    pricePerKg!: number | null | undefined;
    toJakarta!: boolean | null | undefined;
    internal!: boolean | null | undefined;
}

export class SaleDetailsFrontDto {
    id: number | null | undefined | any;
    salesInvoiceType!: SalesInvoiceType | null | undefined | any;
    quantity!: number | null | undefined | any;
    price!: number | null | undefined | any;
    eggCategoryId!: number | null | undefined | any;
    eggType!: string | null | undefined | any;
    eggQuantityType!: EggQuantityType | null | undefined | any;
    cageId!: number | null | undefined | any;
    flockType!: FlockType | null | undefined | any;
    amount!: number | null | undefined | any;
    sterileChicken!: number | null | undefined | any;
    goodChicken!: number | null | undefined | any;
    manureBags!: number | null | undefined | any;
    feedBags!: number | null | undefined | any;
    flockId!: number | null | undefined | any;
    feedId!: number | null | undefined | any;
    eggInitialQuantity!: number | null | undefined | any;
    feedStockId!: number | null | undefined | any;
    feedName!: string | null | undefined | any;
    feedWeightPerBag!: number | null | undefined | any;
    manureStockId!: number | null | undefined | any;
    manureWeightPerBag!: number | null | undefined | any;
    eggWeight!: number | null | undefined | any;
    manureStocks: any[] = [];
    feeds: any[] = [];
    feedStocks: any[] = [];
    transfer!: boolean | null | undefined | any;
    refund!: boolean | null | undefined | any;
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
    isToJakarta: boolean | null | undefined | any;
    pricePerKg: number | null | undefined | any;
    saleDetailsDtos!: SaleDetailsDto[] | [] | null | undefined;
}

export class SalesInvoiceDetailsForReturnFrontDto {
    id!: number | null | undefined | any;
    receiptId!: number | null | undefined | any;
    salesInvoiceType!: SalesInvoiceType | null | undefined | any;
    totalPrice!: number | null | undefined | any;
    soldAt!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    customerId!: number | null | undefined | any;
    customerFirstName!: string | null | undefined | any;
    customerLastName!: string | null | undefined | any;
    customerAddress!: string | null | undefined | any;
    customerTelephoneNumber!: number | null | undefined | any;
    driverFirstName!: string | null | undefined | any;
    driverLastName!: string | null | undefined | any;
    salesPerson!: string | null | undefined | any;
    salesInvoiceCategory!: SalesInvoiceCategory | null | undefined | any;
    salesInvoiceStatus!: SalesInvoiceStatus | null | undefined | any;
    discount!: number | null | undefined | any;
    comment: string | null | undefined | any;
    salesInvoiceLineForReturnDtos!: SaleDetailsForReturnFrontDto[] | [] | null | undefined;
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
    badEggs!: number | null | undefined | any;
    totalEggs!: number | null | undefined | any;
    eggCategoryStockDtos!: EggCategoryStockDto[] | [] | any;
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
    cageId!: number | null | undefined | any;
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

export class SettleCustomerCreditPaymentFrontDto {
    customerId!: number | null | undefined | any;
    soldAtForUnlockedCreditPayments!: number | null | undefined | any;
    paymentDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    paymentDeadline!: Date | any;
}

export class EggTransferFrontDto {
    eggCategoryId: number | null | undefined | any;
    bad: number | null | undefined | any;
    unsellable: number | null | undefined | any;
}
export class EggTransferAmountFrontDto {
    eggCategoryId: number | null | undefined | any;
    name: string | null | undefined | any;
    eggType: EggType | null | undefined | any;
    quantity: number | null | undefined | any;
    pieceBad: number | null | undefined | any;
    pieceUnsellable: number | null | undefined | any;
    tieBad: number | null | undefined | any;
    tieUnsellable: number | null | undefined | any;
    trayBad: number | null | undefined | any;
    trayUnsellable: number | null | undefined | any;
}

export class SaleDetailsForReturnFrontDto {
    id!: number;
    salesInvoiceType!: SalesInvoiceType;
    quantity!: number;
    price!: number;
    eggType!: EggType;
    eggCategoryName!: string;
    returnedEggQuantityType!: EggQuantityType;
    salesEggQuantityType!: EggQuantityType;
    cageId!: number;
    flockId!: number;
    flockType!: FlockType;
    quantityReturned!: number;
    eggCategoryId!: number;
    transferToBad!: boolean;
    feedId!: number;
    feedStockId!: number;
    feedName!: string;
    feedWeightPerBag!: number;
    manureStockId!: number;
    manureWeightPerBag!: number;
}

export class ReturnInvoiceFrontDto {
    returnNumber!: number | null | undefined;
    comment!: String | null | undefined;
    totalPrice!: number | null | undefined;
    returnInvoiceLineDtos!: ReturnInvoiceLineFrontDto[] | [] | null | undefined;
    createdDate!: Date | null | undefined | any;

}

export class ReturnInvoiceLineFrontDto {
    returnInvoiceType!: ReturnInvoiceType | null | undefined;
    price!: number | null | undefined;
    totalPrice!: number | null | undefined;
    feedStockId!: number | null | undefined;
    flockId!: number | null | undefined;
    flockType!: FlockType | null | undefined;
    manureStockId!: number | null | undefined;
    quantity!: number | null | undefined;
    salesInvoiceLineId!: number | null | undefined;
    eggCategoryName!: string | null | undefined;
    eggQuantityType!: EggQuantityType | null | undefined;
    eggCategory!: string | null | undefined;
    eggType!: EggType | null | undefined;
    feedName!: string | null | undefined;
    feedWeightPerBag!: number | null | undefined;
    manureWeightPerBag!: number | null | undefined;
}

export class FeedStockFrontDto {
    feedStockId!: number | null | undefined;
    bags!: number | null | undefined;
    createdDate!: Date | null | undefined;
    recommendedPrice!: number | null | undefined;
    weight!: number | null | undefined;
    name!: string | null | undefined;
    feedCategory!: FeedCategory | null | undefined;
    feedId!: number | null | undefined;
    quantity!: number | null | undefined;
    price!: number | null | undefined;
    amount!: number | null | undefined;
}

export class FeedStockSaleDetailsFrontDto {
    feedId!: number | null | undefined;
    weight!: number | null | undefined;
    name!: string | null | undefined;
    feedCategory!: FeedCategory | null | undefined;
    focused: boolean = false;
    feedStockDto: FeedStockFrontDto[] | [] = [];
}


export class ReturnInvoiceDetailsFrontDto {
    id!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    customerFirstName!: string | null | undefined | any;
    customerLastName!: string | null | undefined | any;
    customerAddress!: string | null | undefined | any;
    customerTelephoneNumber!: number | null | undefined | any;
    driverFirstName!: string | null | undefined | any;
    driverLastName!: string | null | undefined | any;
    comment: string | null | undefined | any;
    saleDetailsDtos!: SaleDetailsDto[] | [] | null | undefined;
}

export class ReturnDetailsFrontDto {
    id!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    customerFirstName!: string | null | undefined | any;
    customerLastName!: string | null | undefined | any;
    customerAddress!: string | null | undefined | any;
    customerTelephoneNumber!: number | null | undefined | any;
    driverFirstName!: string | null | undefined | any;
    driverLastName!: string | null | undefined | any;
    comment: string | null | undefined | any;
    totalPrice: number | null | undefined | any;
    returnDetailsDtos: ReturnInvoiceLineDetailsFrontDto[] | [] | null | undefined;
}

export class ReturnInvoiceLineDetailsFrontDto {
    returnInvoiceType: ReturnInvoiceType | null | undefined | any;
    price: number | null | undefined | any;
    totalPrice: number | null | undefined | any;
    feedStockId: number | null | undefined | any;
    feedName: string | null | undefined | any;
    feedWeightPerBag: number | null | undefined | any;
    quantity: number | null | undefined | any;
    salesInvoiceLineId: number | null | undefined | any;
    eggQuantityType: EggQuantityType | null | undefined | any;
    eggCategory: number | null | undefined | any;
    eggType: string | null | undefined | any;
    cageId: number | null | undefined | any;
    flockId: number | null | undefined | any;
    flockType: FlockType | null | undefined | any;
    manureStockId: number | null | undefined | any;
    manureWeightPerBag: number | null | undefined | any;
}

export class ManureStockFrontDto {
    id: number | null | undefined | any;
    manureId: number | null | undefined | any;
    cageId: number | null | undefined | any;
    cageName: string | null | undefined | any;
    weight: number | null | undefined | any;
    bags: number | null | undefined | any;
    collectedById: number | null | undefined | any;
    collectedByFirstName: string | null | undefined | any;
    collectedByLastName: string | null | undefined | any;
    collectedDate: Date | null | undefined | any;
}

export class EggSaleToJakartaFrontDto {
    eggCategoryId: number | null | undefined | any;
    eggQuantityType: EggQuantityType | null | undefined | any;
    weights: number[] | [] | null | undefined;
}
