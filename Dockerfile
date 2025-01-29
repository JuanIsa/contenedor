# Usar una imagen base de Node.js
FROM node:22-alpine

# Crear y establecer el directorio de trabajo en el contenedor
WORKDIR /

# Copiar los archivos del proyecto al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto en el que el servidor escuchará
EXPOSE 4500

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
