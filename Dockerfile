# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Instala o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"] 