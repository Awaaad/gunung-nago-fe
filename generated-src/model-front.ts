import { AquisitionType, CageCategory, FeedSurveyDto, FlockCategory, FlockSaleDetailsDto, HealthSurveyDto, PaymentType, PurchaseInvoiceFeedDetailsDto, PurchaseInvoiceHealthProductDetailsDto, PurchaseInvoiceType } from "./model";

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
}

export class FlockSaveFrontDto {
    id!: number | null | undefined;
    active!: boolean | null | undefined;
    initialAge!: number | null | undefined;
    initialQuantity!: number | null | undefined;
    aquisitionDate!: Date | null | undefined | moment.Moment | string;
    aquisitionType!: AquisitionType | null | undefined;
    cageId!: number | null | undefined;
    death!: number | null | undefined;
    sterile!: number | null | undefined;
    badEggs!: number | null | undefined;
    goodEggs!: number | null | undefined;
}

export class FlockSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined;
    flockSaleDetailsDtos!: FlockSaleDetailsDto[] | [] | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
    newCustomer!: boolean | null | undefined;
}

export class EggSaleSaveFrontDto {
    customerDto!: CustomerFrontDto | null | undefined;
    paymentSaveDtos!: PaymentSaveFrontDto[] | [] | null | undefined;
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

export class FeedPurchaseInvoiceDetailsFrontDto {
    id!: number | null | undefined | any;
    number!: string | null | undefined | any;
    supplierName!: string | null | undefined | any;
    supplierAddress!: string | null | undefined | any;
    supplierTelephoneNumber!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    purchaseInvoiceType!: PurchaseInvoiceType | null | undefined | any;
    discount!: number | null | undefined | any;
    totalPrice!: number | null | undefined | any;
    purchaseInvoiceFeedDetailsDtos!: PurchaseInvoiceFeedDetailsDto[] | [] | null | undefined;
}

export class HealthPurchaseInvoiceDetailsFrontDto {
    id!: number | null | undefined | any;
    number!: string | null | undefined | any;
    supplierName!: string | null | undefined | any;
    supplierAddress!: string | null | undefined | any;
    supplierTelephoneNumber!: number | null | undefined | any;
    createdBy!: string | null | undefined | any;
    createdDate!: Date | null | undefined | any;
    purchaseInvoiceType!: PurchaseInvoiceType | null | undefined | any;
    discount!: number | null | undefined | any;
    totalPrice!: number | null | undefined | any;
    purchaseInvoiceHealthProductDetailsDtos!: PurchaseInvoiceHealthProductDetailsDto[] | [] | null | undefined;
}