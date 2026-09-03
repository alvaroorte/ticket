interface LogoType {
    light: string,
    dark: string
}

export interface Environment {
    production: boolean,
    image_logo: LogoType,
    server_url: string,
    recaptcha_site_key: string
}