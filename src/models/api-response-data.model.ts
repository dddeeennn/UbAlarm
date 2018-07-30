import { ApiResponseDataItemModel } from './api-response-data-ite.model';
export interface ApiResponseDataModel {
    total_count: number,
    list: ApiResponseDataItemModel[];
}