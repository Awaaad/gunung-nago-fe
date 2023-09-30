import { AquisitionType, CageCategory, CustomerDto, FeedSurveyDto, FlockCategory, FlockSaleDetailsDto, HealthSurveyDto } from "./model";

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
    goodEggs!: number | null | undefined;
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
    flockSaleDetailsDtoList!: FlockSaleDetailsDto[] | [] | null | undefined;
    newCustomer!: boolean | null | undefined;
}


export class CustomerFrontDto {
    id!: number | null | undefined | any;
    firstName!: string | null | undefined | any;
    lastName!: string | null | undefined | any;
    address!: string | null | undefined | any;
    telephoneNumber!: number | null | undefined | any;
    totalAmountDue!: number | null | undefined | any;
}