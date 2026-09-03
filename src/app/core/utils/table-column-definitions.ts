import { LABELS } from "@core/constants/labels";
import { TableColumn } from "@core/interfaces/table.interface";
import { Country } from "@core/models/country";
import { TableColumnType } from "@core/enums/table-column-type.enum";
import { Align } from "@core/enums/align";
import { TerritorialDivision } from "@core/models/territorial-division";
import { Holiday } from "@core/models/holiday";
import { Schedule } from "@core/models/schedule";
import { ScheduleDetail } from "@core/interfaces/schedule-detail.interface";
import { Supervisor } from "@core/models/Supervisor";
import { ISupervisorCategory } from "@core/interfaces/supervisor-category.interface";
import { IncidentTitle } from "@core/interfaces/incident-title";
import { ObserverGroup } from "@core/interfaces/observer-group.inteface.";
import { Enterprise } from "@core/models/Enterprise";
import { Branch } from "@core/interfaces/branch.interface";
import { ISla } from "@core/interfaces/sla.inteface.";
import { ICostCenter } from "@core/interfaces/cost-center.inteface.";
import { TeamWithMembers } from "@core/models/Team";
import { CategoryResponse } from "@core/models/Category";
import { Role } from "@core/models/Role";
import { Parameter } from "@core/models/Parameter";
import { Permission } from "@core/models/Permission";
import { User } from "@core/models/user";
import { TicketHistory } from "@core/interfaces/ticket.interface";

export class TableColumnDefinitions {
  static getCountriesColumnsDefinition(): TableColumn<Country>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'createdBy', header: LABELS.createdBy },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'createdAt', header: LABELS.creationDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true },
        { field: 'updatedAt', header: LABELS.updateDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true }
      ];
  }
  
  static getTerritorialDivisionsColumnsDefinition(): TableColumn<TerritorialDivision>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'territorialDivisionType', header: LABELS.type },
        { field: 'createdBy', header: LABELS.createdBy },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'createdAt', header: LABELS.creationDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true },
        { field: 'updatedAt', header: LABELS.updateDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true }
      ];
  }

  static getHolidaysColumnsDefinition(): TableColumn<Holiday>[] {
    return [
        { field: 'day', header: LABELS.day, align: Align.right },
        { field: 'month', header: LABELS.month, align: Align.right },
        { field: 'year', header: LABELS.year, align: Align.right },
        { field: 'reason', header: LABELS.reason },
        { field: 'holidayType', header: LABELS.typeHoliday },
        { field: 'countryName', header: LABELS.country },
        { field: 'territorialDivisionName', header: LABELS.territorialDivision }
      ];
  }

  static getSchedulesColumnsDefinition(): TableColumn<Schedule>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'createdBy', header: LABELS.createdBy },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'createdAt', header: LABELS.creationDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true },
        { field: 'updatedAt', header: LABELS.updateDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true }
      ];
  }

  static getScheduleDetailsColumnsDefinition(): TableColumn<ScheduleDetail>[] {
    return [
        { field: 'dayOfWeek', header: LABELS.day },
        { field: 'startHour', header: LABELS.checkInTime },
        { field: 'endHour', header: LABELS.checkOutTime },
        { field: 'breakStartHour', header: LABELS.launchStartTime },
        { field: 'breakEndHour', header: LABELS.launchEndtTime }
      ];
  }

  static getSupervisorsColumnsDefinition(): TableColumn<Supervisor>[] {
    return [
      { field: 'name', header: LABELS.name },
      { field: 'supervisorCredentialEmail', header: LABELS.user },
      { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS }
    ];
  }

  static getSupervisorCategoriesColumnsDefinition(): TableColumn<ISupervisorCategory>[] {
    return [
        { field: 'enterpriseName', header: LABELS.enterprise },
        { field: 'categoryName', header: LABELS.category },
        { field: 'subCategoryName', header: LABELS.subcategory }
      ];
  }

  static getIncidentTitlesColumnsDefinition(): TableColumn<IncidentTitle>[] {
    return [
        { field: 'title', header: LABELS.title },
        { field: 'createdBy', header: LABELS.createdBy },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'createdAt', header: LABELS.creationDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true },
        { field: 'updatedAt', header: LABELS.updateDate, columnType: TableColumnType.DATETIME, align: Align.right, hideSortIcon: true, notfilterByThisfield: true }
      ];
  }

  static getObserverGroupsColumnsDefinition(): TableColumn<ObserverGroup>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'enterpriseName', header: LABELS.enterprise },
        { field: 'observersString', header: LABELS.observers },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS }
      ];
  }

  static getEnterprisesColumnsDefinition(): TableColumn<Enterprise>[] {
    return [
        { field: 'code', header: LABELS.code },
        { field: 'name', header: LABELS.name },
        { field: 'domain', header: LABELS.domain },
        { field: 'hasCostCenter', header: LABELS.costCenter, columnType: TableColumnType.STATUS, align: Align.center },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS, align: Align.center },
        { field: 'logo', header: LABELS.image, columnType: TableColumnType.IMAGE, hideSortIcon: true, notfilterByThisfield: true },
      ];
  }

  static getBranchColumnsDefinition(): TableColumn<Branch>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'location', header: LABELS.ubication },
        { field: 'countryName', header: LABELS.country },
        { field: 'territorialDivisionName', header: LABELS.territorialDivision }
      ];
  }
  
  static getSlaColumnsDefinition(): TableColumn<ISla>[] {
    return [
        { field: 'enterprise', header: LABELS.enterprise },
        { field: 'ticketTypeParameter', header: LABELS.ticketType },
        { field: 'staffAvailability', header: LABELS.staffAvailability },
        { field: 'ticketPriorityParameter', header: LABELS.priority },
        { field: 'firstResponseTime', header: LABELS.firstResponseTime }
      ];
  }

  static getCostCenterColumnsDefinition(): TableColumn<ICostCenter>[] {
    return [
        { field: 'code', header: LABELS.code },
        { field: 'name', header: LABELS.name },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS }
      ];
  }

  static getTeamColumnsDefinition(): TableColumn<TeamWithMembers>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'leaderCredentialEmail', header: LABELS.leader },
        { field: 'teamMembersString', header: LABELS.members },
        { field: 'technicalAutomatic', header: LABELS.autoTechnicians, columnType: TableColumnType.BOOLEAN, align: Align.center, hideSortIcon: true },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS },
      ];
  }

  static getCategoriesColumnsDefinition(): TableColumn<CategoryResponse>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'createdBy', header: LABELS.createdBy },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'image', header: LABELS.image, columnType: TableColumnType.IMAGE, hideSortIcon: true, notfilterByThisfield: true },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS, align: Align.center },
      ];
  }
  
  static getSubcategoriesColumnsDefinition(): TableColumn<CategoryResponse>[] {
    return [
        { field: 'name', header: LABELS.name },
        { field: 'description', header: LABELS.description },
        { field: 'createdBy', header: LABELS.createdBy },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS, align: Align.center },
      ];
  }
  
  static getRoleColumnsDefinition(): TableColumn<Role>[] {
    return [
        { field: 'code', header: LABELS.code },
        { field: 'name', header: LABELS.name },
        { field: 'description', header: LABELS.description }
      ];
  }
  
  static getParameterColumnsDefinition(): TableColumn<Parameter>[] {
    return [
        { field: 'ranking', header: LABELS.ranking },
        { field: 'value', header: LABELS.value },
        { field: 'updatedBy', header: LABELS.updatedBy },
        { field: 'color', header: LABELS.color, columnType: TableColumnType.COLOR, hideSortIcon: true },
        { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS, align: Align.center },
      ];
  }
  
  static getPermissionColumnsDefinition(): TableColumn<Permission>[] {
    return [
      { field: 'code', header: LABELS.code, columnType: TableColumnType.TEXT },
      { field: 'name', header: LABELS.name, columnType: TableColumnType.TEXT },
      { field: 'url', header: LABELS.url, columnType: TableColumnType.TEXT },
      { field: 'httpMethod', header: LABELS.method, columnType: TableColumnType.TEXT, align: Align.center }
    ];
  }
  
  static getUserColumnsDefinition(): TableColumn<User>[] {
    return [
      { field: 'username', header: LABELS.user, columnType: TableColumnType.TEXT },
      { field: 'email', header: LABELS.email, columnType: TableColumnType.TEXT },
      { field: 'phone', header: LABELS.cell, columnType: TableColumnType.TEXT, align: Align.right },
      { field: 'ubication', header: LABELS.ubication, columnType: TableColumnType.TEXT},
      { field: 'ldap', header: LABELS.ldap, columnType: TableColumnType.BOOLEAN, align: Align.center},
      { field: 'active', header: LABELS.status, columnType: TableColumnType.STATUS},
      { field: 'rolesString', header: LABELS.roles, columnType: TableColumnType.TEXT},
    ];
  }
  
  static getTicketsHistoricalColumnsDefinition(): TableColumn<TicketHistory>[] {
    return [
        { field: 'code', header: LABELS.code, columnType: TableColumnType.TEXT },
        { field: 'title', header: LABELS.title, columnType: TableColumnType.TEXT, showTooltip: true },
        { field: 'enterprise', header: LABELS.enterprise, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'costCenter', header: LABELS.costCenter, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'category', header: LABELS.category, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'subCategory', header: LABELS.subcategory, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'requester', header: LABELS.requester, columnType: TableColumnType.TEXT},
        { field: 'technician', header: LABELS.technician, columnType: TableColumnType.TEXT},
        { field: 'flowStatus', header: LABELS.status, columnType: TableColumnType.TEXT},
        { field: 'approver', header: LABELS.approver, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'moderator', header: LABELS.moderator, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'createdAt', header: LABELS.creationDate, align: Align.right, columnType: TableColumnType.TEXT },
        { field: 'initiatedAt', header: LABELS.initialDate, align: Align.right, columnType: TableColumnType.TEXT },
        { field: 'resolvedAt', header: LABELS.finishDate, align: Align.right, columnType: TableColumnType.TEXT },
        { field: 'closedAt', header: LABELS.closeDate, align: Align.right, columnType: TableColumnType.TEXT },
        { field: 'cycleTime', header: LABELS.cycleTime, columnType: TableColumnType.TEXT, align: Align.right, hideSortIcon: true },
        { field: 'leadTime', header: LABELS.totalTime, columnType: TableColumnType.TEXT, align: Align.right, hideSortIcon: true },
        { field: 'ticketPriorityParameter', header: LABELS.priority, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'ticketTypeParameter', header: LABELS.ticketType, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'estimatedStartDate', header: LABELS.estimatedStartDate, align: Align.right, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'estimatedEndDate', header: LABELS.estimatedEndDate, align: Align.right, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'associatedTickets', header: LABELS.associatedTickets, columnType: TableColumnType.TEXT, initiallyHidden: true },
        { field: 'tag', header: LABELS.tag, columnType: TableColumnType.TEXT, initiallyHidden: true },
      ];;
  }

}
