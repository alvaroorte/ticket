import { MenuHeader } from "@core/models/Header";

export const urlsWithPermissions: MenuHeader[] = [
  { routerLink: 'home', label: 'Nuevo ticket', access: ['all', 'leader', 'technical', 'supervisor'] },
  { routerLink: 'tickets/ticket', label: 'Mis Tickets', access: ['all', 'leader', 'technical', 'supervisor'] },
  { routerLink: 'tickets/pending', label: 'Mis Pendientes', access: ['all', 'leader', 'technical', 'supervisor'] },
  { routerLink: 'tickets-historical', label: 'Histórico', access: ['all', 'leader', 'technical', 'supervisor'] },
  { routerLink: 'reports', label: 'Reportes', access: ['leader', 'technical', 'supervisor'] },
  { routerLink: 'follow-up', label: 'Seguimiento', access: ['leader', 'technical', 'supervisor']},
  { routerLink: 'management-teams', label: 'Gestión Equipos', access: ['leader', 'supervisor'] },
  { routerLink: 'supervisor', label: 'Supervisor', access: ['leader', 'supervisor'] },
  { routerLink: 'enterprises', label: 'Empresas', access: ['leader'] },
  { routerLink: 'teams', label: 'Equipos', access: ['leader'] },
  { routerLink: 'categories', label: 'Categorías', access: ['leader'] },
  { routerLink: 'parameters', label: 'Parámetros', access: ['leader']},
  { routerLink: 'roles', label: 'Accesos', access: ['leader']}
];

export const limits: any = {
  minLength: 5,
  maxLength: 200,
  maxLengthDescription: 500
};

export const messages = {
  deniedCharactersCode: 'Ingrese solo caracteres alfanuméricos, guiones, guiones bajos y barras inclinadas.',
  deniedCharactersName: 'Ingrese solo caracteres alfanuméricos, guiones, guiones bajos, barras inclinadas y puntos.',
  requiredMinLength: `Este campo requiere como mínimo ${limits.minLength} caracteres.`,
  requiredMaxLengthDescription: `Este campo acepta como máximo ${limits.maxLengthDescription} caracteres.`,
  requiredEmail: 'El texto introducido no es un correo válido.',
  deleteRow: 'El registro se eliminó correctamente',
  expiredSession: 'Su sesión ha caducado.',
  maxlength: "El campo a superado el numero maximo de caracteres.",
  urlImageMaxlength: "El campo a superado el numero maximo de 250 caracteres.",
  noOnlySpace: "El campo no acepta solo espacios en blanco.",
};

export const regex: any = {
  fieldCode: '^[a-zA-Z0-9/_-]+$',
  fieldName: '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ&@$&,()/_. -]+$'
};

export const highchartsSetOptions: any = {
  lang: {
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    weekdays: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    shortMonths: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ],
    rangeSelectorFrom: 'Desde',
    rangeSelectorTo: 'Hasta',
    downloadCSV: 'Descargar CSV',
    downloadJPEG: 'Descargar JPEG',
    downloadMIDI: 'Descargar MIDI',
    downloadPDF: 'Descargar PDF',
    downloadPNG: 'Descargar PNG',
    downloadSVG: 'Descargar SVG',
    downloadXLS: 'Descargar XLS',
    viewFullscreen: 'Ver en pantalla completa',
    exitFullscreen: 'Salir pantalla completa',
    printChart: 'Imprimir gráfico',
  },
  colors: ['#64748b', '#c9a328', '#3d86eb', '#46d491', '#f59823', '#f52323', 'efd70d', '#42e2c0', '#7d19e1', '#e8137b']
};

