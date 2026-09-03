import { Component, inject, OnInit, signal } from '@angular/core';
import { CountryModule } from './country.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { CountryService } from './services/country.service';
import { Country } from '@core/models/country';
import { TerritorialDivisionComponent } from '../territorial-division/territorial-division.component';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-country',
    imports: [CountryModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, TerritorialDivisionComponent, ModalFormComponent],
    templateUrl: './country.component.html'
})
export class CountryComponent implements OnInit {

  public countryService = inject(CountryService);

  public titleTable = "Lista de paises";
  public countrySelected = signal<Country | null>(null);
  public countries = signal<Country[]>([]);
  public tableColumnCountryDefinitions: TableColumn<Country>[] = TableColumnDefinitions.getCountriesColumnsDefinition();

  ngOnInit(): void {
    this.getCountries();
  }

  public setCountry( country: Country  ) {
    this.countrySelected.set(country);
  }

  public getCountries(): void {
    this.countryService.getAll().subscribe({
      next: (res) => {
        this.countries.set(res);
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<Country>) {
    this.countryService.eventTableComponent.set(table);
  }
}
