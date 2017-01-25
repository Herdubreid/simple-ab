import { FormRequest, FormAction } from 'e1-service';

export class AbWordSearchRequest extends FormRequest {
    constructor(search: string) {
        super();
        this.formName = 'P01BDWRD_W01BDWRDA';
        this.formServiceAction = 'R';
        this.formActions = new Array<FormAction>();
        this.formActions.push({
            controlID: '18',
            command: 'SetControlValue',
            value: search
        });
        this.formActions.push({
            controlID: 15,
            command: 'DoAction'
        })
    }
}
