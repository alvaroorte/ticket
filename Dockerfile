# Utiliza una imagen de Node.js para construir la aplicación Angular
FROM node:18-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de la aplicación
COPY package.json package-lock.json /app/

# Instala las dependencias y el Angular CLI
RUN npm install -g @angular/cli
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . /app/

# Expone el puerto 4200 utilizado por el servidor de desarrollo de Angular
EXPOSE 4200

# Comando para iniciar el servidor de desarrollo de Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
