# 🍴 EasyEats - Gestão Inteligente de Receitas

O **EasyEats** é uma plataforma Full-Stack desenvolvida para o Projeto Integrador (PI), focada em oferecer uma experiência moderna e segura para amantes da culinária. O sistema permite o gerenciamento dinâmico de receitas, autenticação robusta e persistência de dados.

## 🚀 Tecnologias Utilizadas
- **Frontend:** React.js com Vite (Interface SPA rápida e reativa).
- **Backend:** Node.js com Express (Arquitetura baseada em rotas e middlewares).
- **Banco de Dados:** MySQL (Persistência relacional para usuários e conteúdo).
- **Segurança:** - Criptografia de senhas com **Bcrypt**.
  - Autenticação via **JWT (JSON Web Tokens)**.
  - Middlewares de proteção de rotas sensíveis.
  - Persistência local de preferências (Favoritos) via **LocalStorage API**.

## 🛠️ Funcionalidades Principais
- [x] **Autenticação:** Cadastro e Login de usuários com tokens de sessão.
- [x] **Gestão de Conteúdo:** Busca dinâmica e exibição de receitas vindas do banco de dados.
- [x] **Área do Cozinheiro:** Formulário protegido para adição de novas receitas (apenas para usuários logados).
- [x] **Favoritos:** Sistema de marcação de receitas favoritas com salvamento automático no navegador.
- [x] **Canal de Contato:** Formulário de feedback integrado diretamente ao MySQL.

## 📋 Como Executar o Projeto
1. **Banco de Dados:** Inicie o MySQL (via XAMPP) e execute o script `database.sql` para criar as tabelas.
2. **Ambiente:** No diretório `/backend`, configure o arquivo `.env` com suas credenciais.
3. **Instalação:** - Na raiz: `npm install`
   - Em `/backend`: `npm install`
4. **Execução:**
   - Backend: `node server.js`
   - Frontend: `npm run dev`

---
*Desenvolvido como parte do currículo acadêmico de Tecnologia.*
