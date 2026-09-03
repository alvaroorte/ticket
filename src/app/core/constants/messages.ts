import { LIMITS } from "./limits";


export const MESSAGES = {
   deniedCharactersCode:
      'Ingrese solo caracteres alfanuméricos, guiones, guiones bajos y barras inclinadas.',
   deniedCharactersName:
      'Ingrese solo caracteres alfanuméricos, guiones, guiones bajos, barras inclinadas y puntos.',
   requiredMinLength: `Este campo requiere como mínimo ${LIMITS.minLengthFive} caracteres.`,
   requiredMinLengthCode: `Este campo requiere como mínimo ${LIMITS.minLengthThree} caracteres.`,
   requiredMaxLengthDescription: `Este campo acepta como máximo ${LIMITS.maxLengthDescription} caracteres.`,
   recordDeleted: 'El registro se eliminó correctamente',
   recordCreated: 'El registro fué creado correctamente',
   recordUpdated: 'El registro fué editado correctamente',
   expiredSession: 'Su sesión ha caducado.',
   maxlength: 'El campo a superado el numero maximo de caracteres.',
   urlImageMaxlength: 'El campo a superado el numero maximo de 250 caracteres.',
   noOnlySpace: 'El campo no acepta solo espacios en blanco.',
   ticketsSolutionOnlyHrs:
      'Los tickets en estado "SOLUCIONADO" solo permanecerán 48hrs en su bandeja',
   showingFirstToLastOfItems:
      'Mostrando del {first} al {last} de {totalRecords} elementos',
   withOutItems: 'Sin registros.',
   withOutTickets: 'Sin tickets.',
   displayApproverOrModeratorAvailable:
      'Esta pantalla está disponible porque usted tiene el rol de Aprobador o Moderador de tickets. Es importante aprobar los tickets a la brevedad para no afectar los tiempos de atención.',
   welcomePage: 'TickET',
   requiredField: 'Este campo es obligatorio.',
   emailIsRequired: 'El campo Correo es obligatorio.',
   emailIsInvalid: 'El Correo ingresado no es válido.',
   passwordIsRequired: 'El campo Contraseña es obligatorio.',
   captchaVerificationFailed: 'No se pudo verificar el captcha, intenta nuevamente.',
   areYouSureDeleteItemSelected:
      '¿Estas seguro de eliminar el registro seleccionado?',
   fieldsMArketRequired: 'Los campos marcados con * son obligatorios',
   noMessagesInThisConversation:
      'Aun no existen mensajes en esta conversación.',
   selectColumns: 'Seleccione las columnas',
   emptyMessage: 'No se encontraron registros.',
   selectARow: 'Seleccione una fila',
   fieldDescriptionRequiresMinimumFiveCharacters: 'El campo descripción requiere como mínimo 5 caracteres',
   rowWithTimeSuccess: 'Ticket sin iniciar, aún hay tiempo suficiente.',
   rowWithTimeWarning: 'Ticket sin iniciar, el tiempo se está agotando.',
   rowWithTimeDanger: 'Ticket sin iniciar, queda muy poco tiempo.',
   rowWithTimeExceeded: 'Ticket retrasado y aún sin iniciar.',
   invalidFileSize: 'Tamaño del archivo invalido',
   invalidFileSizeDetail: 'El tamaño maximo permitido es de 25 Mb',
   invalidFileType: 'Tipo de archivo invalido',
   excelUploadSuccess: 'Excel cargado con éxito',
   yourSessionExpiredLoginAgain: 'Su sesión ha expirado, ingrese nuevamente',
   firstSelectedACategory: 'Antes debes seleccionar una categoría',
   taskCompletedSuccessfully: 'Acción realizada correctamente',
   labelSuccessfullyUpdated: 'Etiqueta actualizada con exito.',
   noTagsAreAvailabelsForThisCategory: 'No existen etiquetas disponibles para esta categoría.',
   areYouSureWantToTakeThisAction: '¿Esta seguro de realizar esta acción?',
   invalidFileTypeDetail: (typeFiles: string) => `Solo se admiten archivos de tipo: ${typeFiles}`,
   maxNumberField: (number: number) => `Este campo acepta como máximo ${number} carácteres`,
   minNumberField: (number: number) => `Este campo acepta como mínimo ${number} carácteres`,
   ticketAssociationWasCreatedSuccessfully: (code: string) => `Se creó la asociación de ticket correctamente, el nuevo ticket es: ${code}`,
} as const;
