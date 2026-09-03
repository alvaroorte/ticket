import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IFieldForFuntion } from "@core/interfaces/modal-description";

export class FormUtils {

    static getFromGroupByFieldsOfNameFunction(fieldsModalDescription: IFieldForFuntion[]): FormGroup {
        let form  = new FormGroup({});
        fieldsModalDescription.forEach( field => {
            if (field.formControlName) {
                form.addControl(field.formControlName, new FormControl(null, field.required? Validators.required: Validators.nullValidator))
            }
        });
        return form;
    }

}