export const PLAY_STORE_TICKET_MOBILE_URL = 'https://play.google.com/store/apps/details?id=com.endesyc.ticket';

// TODO: ticket-mobile aun no esta publicada en App Store.
// A diferencia de Play Store, el link de App Store no se puede deducir del bundle id
// (com.endesyc.ticket, ver ticket-mobile/ios/Runner.xcodeproj/project.pbxproj) porque Apple
// asigna un identificador numerico (idXXXXXXXXXX) recien al publicar la app en App Store Connect.
// Reemplazar por el link real una vez publicada.
export const APP_STORE_TICKET_MOBILE_URL = 'https://apps.apple.com/app/idXXXXXXXXXX';
