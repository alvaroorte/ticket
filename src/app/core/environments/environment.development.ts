import { Environment } from "@core/interfaces/environment.interface";

export const environment: Environment = {
    production: false,
    image_logo: {
        light: "endeSyc.webp",
        dark: "endesyc_blanco.webp",
    },
    // server_url: 'https://dev-ticket.endesyc.bo/ticket/',
    server_url: 'http://localhost:8085/ticket/',
    // TODO: reemplazar con la site key registrada en https://www.google.com/recaptcha/admin
    recaptcha_site_key: '6LcadXUtAAAAAI5VGLqzuo_V5eWOvYtSVIORMiDO'
};
