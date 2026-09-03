import { Environment } from "@core/interfaces/environment.interface";

export const environment: Environment = {
    production: false,
    image_logo: {
        light: "etr_logo.webp",
        dark: "etr_logo.webp",
    },
    server_url: 'https://ticket.endetransmision.bo/ticket/',
    recaptcha_site_key: ''
};
