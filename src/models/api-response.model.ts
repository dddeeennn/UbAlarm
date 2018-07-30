import { ApiResponseDataModel } from './api-response-data.model';
export interface ApiResponseModel {
    success: boolean;
    data: ApiResponseDataModel;
}