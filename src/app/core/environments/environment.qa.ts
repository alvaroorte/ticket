import { Environment } from "@core/interfaces/environment.interface";

export const environment: Environment = {
    production: false,
    image_logo: {
        light: "endeSyc.webp",
        dark: "endesyc_blanco.webp",
    },
    // server_url: 'http://10.240.74.20:9021/clicket/v2/',
    server_url: 'https://qa-ticket.endesyc.bo/ticket/',
    // TODO: reemplazar con la site key registrada en https://www.google.com/recaptcha/admin
    recaptcha_site_key: '6LcadXUtAAAAAI5VGLqzuo_V5eWOvYtSVIORMiDO'
};
