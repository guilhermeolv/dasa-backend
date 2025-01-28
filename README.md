# API de Catálogo de Produtos

API REST desenvolvida com NestJS para gerenciamento de produtos, categorias e usuários, com cache em Redis para melhor performance.

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js
- [TypeORM](https://typeorm.io/) - ORM para TypeScript
- [SQLite](https://www.sqlite.org/) - Banco de dados
- [Redis](https://redis.io/) - Cache distribuído
- [Swagger](https://swagger.io/) - Documentação da API
- [Jest](https://jestjs.io/) - Framework de testes

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Docker e Docker Compose (para Redis)

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
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

## Estrutura do Projeto

- `src/` - Código fonte do projeto
- `src/entities/` - Entidades do banco de dados
- `src/services/` - Serviços para manipulação de dados
- `src/controllers/` - Controladores para manipulação de rotas
- `src/modules/` - Módulos do projeto
- `src/modules/auth/` - Módulo de autenticação
- `src/modules/products/` - Módulo de produtos
- `src/modules/categories/` - Módulo de categorias
- `src/modules/users/` - Módulo de usuários

## 🔐 Recursos da API

### Usuários
- Criar usuário
- Listar usuários
- Buscar usuário por ID

### Produtos
- Criar produto
- Listar produtos
- Buscar produto por ID
- Atualizar produto
- Deletar produto
- Associar produto a categoria
- Listar produtos por proprietário

### Categorias
- Criar categoria
- Listar categorias
- Buscar categoria por ID
- Atualizar categoria
- Deletar categoria
- Listar categorias por proprietário

## 🚀 Implementações

- Cache com Redis para melhor performance
- Testes unitários com Jest
- Documentação completa com Swagger
- Containerização com Docker
- Validação de dados com class-validator
- Migrations para versionamento do banco