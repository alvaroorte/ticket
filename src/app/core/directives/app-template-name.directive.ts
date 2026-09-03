import { Directive, TemplateRef, input, inject } from '@angular/core';

@Directive({
  selector: '[appTemplateName]'
})
export class AppTemplateNameDirective {

  templateRef = inject<TemplateRef<any>>(TemplateRef);

  readonly name = input<string>(undefined, { alias: "appTemplateName" });
}