import { FormRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export interface IAbWordSearchRow extends IRow {
    mnAddressNumber_21: IValue;
    sAlphaName_50: IValue;
    sPrefix_29: IValue;
    sPhoneNumber_30: IValue;
    sAddressLine1_31: IValue;
    sCity_32: IValue;
}

export interface IAbWordSearchResponse extends IFormResponse {
    fs_P01BDWRD_W01BDWRDA: IForm<IFormData<IAbWordSearchRow>>
}

export class AbWordSearchRequest extends FormRequest {
    constructor(search: string) {
        super();
        this.formName = 'P01BDWRD_W01BDWRDA';
        this.formServiceAction = 'R';
        this.formActions = [
            {
                controlID: '18',
                command: 'SetControlValue',
                value: search
            },
            {
                controlID: 15,
                command: 'DoAction'
            }
        ];
    }
}
