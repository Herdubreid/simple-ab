import { FormRequest } from 'e1-service';

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
