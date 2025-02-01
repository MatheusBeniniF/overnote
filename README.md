# Overnote Application

## Descrição

Overnote é uma aplicação web de gerenciamento de notas que permite aos usuários criar, editar, excluir e organizar notas. Notas podem ser mantidas privadas ou tornadas públicas para compartilhar com outros. Esta solução foi desenvolvida com uma arquitetura moderna utilizando tecnologias como React, Next.js, MySQL e Prisma.

---

## Tecnologias Utilizadas

- **Frontend:** React, TailwindCSS, Shadcn
- **Backend:** Next.js (API Routes)
- **Banco de Dados:** MySQL (em desenvolvimento), PostgreSQL (em produção - Supabase)
- **ORM:** Prisma
- **Deploy:** Supabase (para banco de dados), Vercel (para frontend/backend)
- **Outras Ferramentas:** Docker, React Query, Toastify

---

## Decisões Importantes

1. **Gerenciamento de Estado:** Utilização do React Query para gerenciar estados assíncronos e otimizar as chamadas às APIs.
2. **Persistência dos Dados:** Durante o desenvolvimento, usamos MySQL local via Docker. Para produção, migramos os dados para PostgreSQL usando o Supabase.
3. **UI e UX:** Integração com Shadcn para componentes visuais e uma experiência de usuário elegante.

---

## Como Executar Localmente

### **1. Clonar o Repositório**

```bash
 git clone git@github.com:MatheusBeniniF/overnote.git
 code overnote
```

### **2. Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
MYSQL_PASSWORD="root"
MYSQL_USER="root"
MYSQL_DB="main"
DATABASE_URL="mysql://root:root@localhost:3305/main"
AUTH_SECRET="chave-secreta-para-auth"
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### **3. Subir o Banco de Dados com Docker**

Certifique-se de que o Docker está instalado e em execução:

```bash
docker-compose up -d
```

### **4. Instalar Dependências**

```bash
npm install
```

### **5. Executar Migrações**

```bash
npx prisma migrate dev
```

### **6. Gerar Cliente Prisma**

```bash
npx prisma generate
```

### **7. Rodar a Aplicação Localmente**

```bash
npm run dev
```

Acesse [http://localhost:3000/login](http://localhost:3000/login) no navegador.

---

## Como Migrar para o Supabase

1. **Exportar Dados do MySQL:**

```bash
docker exec -i overnote-mysql-1 mysqldump -u root -proot main > dump.sql
```

2. **Importar Dados no Supabase:**

Conecte-se ao banco de dados PostgreSQL fornecido pelo Supabase e importe os dados:

```bash
psql "postgresql://usuario:senha@host:5432/postgres" < dump.sql
```

3. **Atualizar o `.env`:**

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/postgres"
```

4. **Deploy das Migrações:**

```bash
npx prisma migrate deploy
```

---

## Comandos Utilitários

- **Executar Testes:**
  ```bash
  npm test
  ```
- **Build para Produção:**
  ```bash
  npm run build
  ```

---

## Problemas Conhecidos e Soluções

- **Erro `Access Denied` ao Exportar Dados do MySQL:** Verifique se a senha e o nome do banco de dados estão corretos.
- **Erro `Connection Refused` ao Conectar ao Supabase:** Certifique-se de que a URL e as credenciais estão corretas.

---

## Contribuição

Sinta-se à vontade para abrir issues e enviar pull requests. Todas as contribuições são bem-vindas!

---

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais informações.
