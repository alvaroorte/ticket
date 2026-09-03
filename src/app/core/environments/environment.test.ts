import { Environment } from "@core/interfaces/environment.interface";

export const environment: Environment = {
    production: false,
    image_logo: {
        light: "endeSyc.webp",
        dark: "endesyc_blanco.webp",
    },
    // server_url: 'http://10.240.74.20:9011/clicket/v2/',
    server_url: 'https://test-ticket.endesyc.bo/ticket/',
    recaptcha_site_key: '6LcadXUtAAAAAI5VGLqzuo_V5eWOvYtSVIORMiDO'
};
