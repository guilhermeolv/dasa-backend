# API de Catálogo de Produtos

API REST desenvolvida com NestJS para gerenciamento de produtos, categorias e usuários.

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js
- [TypeORM](https://typeorm.io/) - ORM para TypeScript
- [SQLite](https://www.sqlite.org/) - Banco de dados
- [Swagger](https://swagger.io/) - Documentação da API

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório 
2. Instale as dependências com o comando `npm install` ou `yarn install`
3. Execute as migrações com `npm run migration:run`
4. Execute o comando `npm run dev` ou `yarn dev` para iniciar o servidor

## 📚 Documentação

A documentação da API está disponível através do Swagger UI em:
```
http://localhost:3000/api-docs
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o projeto
- `npm run start` - Inicia o servidor em modo de produção
- `npm run migration:generate` - Gera novas migrações
- `npm run migration:run` - Executa as migrações pendentes
- `npm run migration:revert` - Reverte a última migração
