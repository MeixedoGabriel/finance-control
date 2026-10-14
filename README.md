# 💰 Finance Control

**Uma aplicação web para controle financeiro pessoal, desenvolvida com Python e Flask.**

O Finance Control permite registrar receitas e despesas, acompanhar o saldo financeiro e visualizar movimentações por meio de um dashboard interativo com gráficos e análises por categoria.

O projeto está sendo desenvolvido como parte da minha evolução em desenvolvimento Full Stack, com foco especial em backend, persistência de dados, APIs, visualização de informações e boas práticas de desenvolvimento.

## 📌 Funcionalidades

### 💳 Gerenciamento de movimentações

- **Criar:** registrar receitas e despesas com descrição, valor, categoria, tipo e data.
- **Consultar:** visualizar as movimentações cadastradas.
- **Editar:** atualizar informações de uma movimentação existente.
- **Excluir:** remover movimentações com confirmação antes da exclusão.
- **Histórico:** consultar as movimentações recentes e acessar a listagem completa.

### 📊 Dashboard financeiro

- Resumo de receitas, despesas e saldo.
- Contagem de movimentações cadastradas.
- Exibição das cinco movimentações mais recentes.
- Navegação para consultar o histórico completo.

### 📈 Gráficos e análise financeira

- Visualização interativa de receitas e despesas.
- Alternância entre os períodos semanal, mensal e anual.
- Agrupamento de valores por dia ou mês, conforme o período selecionado.
- Consulta das movimentações associadas aos pontos do gráfico.
- Acesso às opções de edição e exclusão diretamente pelo gráfico.
- Análise das cinco categorias com maior volume de despesas.
- Barras proporcionais para facilitar a comparação entre categorias.

### 🎨 Interface

- Layout organizado com cards e componentes reutilizáveis.
- Estilização com CSS e variáveis para cores, espaçamentos, bordas e sombras.
- Formulários com validações básicas de entrada.
- Modais para exibir informações sem sair da página.
- Ajustes de responsividade para melhorar a experiência em telas menores.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| Python | Linguagem principal do backend |
| Flask | Framework para rotas e requisições HTTP |
| Flask-SQLAlchemy | Integração entre Flask e banco de dados |
| SQLAlchemy | Mapeamento de objetos Python para tabelas relacionais |
| SQLite | Persistência local das movimentações |
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade e atualização dos gráficos |
| Chart.js | Construção dos gráficos financeiros |
| Jinja2 | Renderização de páginas HTML no servidor |
| Git e GitHub | Versionamento e gerenciamento do código |

## 🏗️ Arquitetura e funcionamento

A aplicação utiliza Flask no backend, SQLAlchemy para trabalhar com os dados e HTML, CSS e JavaScript no frontend.

De maneira simplificada, o fluxo de uma operação é:

```text
Usuário
   │
   ▼
Interface HTML/CSS/JavaScript
   │
   ▼
Requisição HTTP
   │
   ▼
Rota Flask
   │
   ▼
Consulta ou alteração via SQLAlchemy
   │
   ▼
Banco de dados SQLite
   │
   ▼
Resposta ao usuário
```

### APIs de análise

O projeto possui endpoints que fornecem dados financeiros em formato JSON para o frontend.

**`GET /api/analytics`**

Retorna os valores agrupados por período, os rótulos do gráfico e as movimentações correspondentes. O período pode ser selecionado pelo parâmetro `period`.

Exemplos:

```http
GET /api/analytics?period=week
GET /api/analytics?period=month
GET /api/analytics?period=year
```

**`GET /api/categories`**

Retorna as principais categorias de despesas do período selecionado, ordenadas pelo valor total.

Exemplos:

```http
GET /api/categories?period=week
GET /api/categories?period=month
GET /api/categories?period=year
```

O JavaScript utiliza essas respostas para atualizar os gráficos e apresentar informações detalhadas sem precisar renderizar novamente toda a página.

## 📂 Estrutura do projeto

A estrutura principal do repositório é:

```text
finance-control/
├── app/
│   ├── __init__.py
│   ├── extensions.py
│   ├── models.py
│   ├── routes.py
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── analytics.js
│   └── templates/
│       ├── base.html
│       ├── index.html
│       ├── movimentacoes.html
│       ├── nova_movimentacao.html
│       └── editar_movimentacao.html
├── requirements.txt
├── run.py
└── README.md
```

*Observação: a estrutura acima representa a organização lógica do projeto. Os nomes e subdiretórios devem ser ajustados caso algum arquivo esteja organizado de maneira diferente na versão atual do repositório.*

## 🚀 Como executar localmente

### Pré-requisitos

- Python instalado.
- Git instalado.
- Terminal, como o PowerShell no Windows.

### 1. Clone o repositório

```bash
git clone https://github.com/MeixedoGabriel/finance-control.git
cd finance-control
```

### 2. Crie um ambiente virtual

No Windows:

```powershell
python -m venv venv
```

### 3. Ative o ambiente virtual

No PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

No Git Bash:

```bash
source venv/Scripts/activate
```

### 4. Instale as dependências

```bash
python -m pip install -r requirements.txt
```

### 5. Execute a aplicação

```bash
python run.py
```

Abra no navegador o endereço local informado pelo Flask no terminal, normalmente:

```text
http://127.0.0.1:5000
```

Para encerrar a aplicação, pressione `Ctrl + C` no terminal. Para desativar o ambiente virtual:

```bash
deactivate
```

## 🧠 Principais aprendizados

O desenvolvimento do Finance Control envolve conceitos importantes de desenvolvimento web e backend:

- Construção de operações CRUD (*Create, Read, Update, Delete*).
- Criação de rotas e tratamento de requisições HTTP com Flask.
- Persistência de dados e consultas com SQLAlchemy.
- Separação entre modelos, rotas, templates e arquivos estáticos.
- Criação de endpoints que retornam JSON.
- Integração entre frontend e backend utilizando `fetch()`.
- Manipulação de dados para gerar indicadores e gráficos.
- Organização de estilos com variáveis CSS.
- Uso de Git e GitHub para versionamento incremental do projeto.

## 🗺️ Próximos passos

O projeto continuará evoluindo por etapas. Entre os objetivos planejados estão:

- Implementar cadastro e login de usuários.
- Armazenar senhas de maneira segura.
- Relacionar usuários e movimentações por meio de chaves estrangeiras.
- Proteger as rotas e garantir que cada usuário acesse somente seus próprios dados.
- Melhorar a validação dos dados e a cobertura de testes.
- Continuar aprimorando a experiência visual e a responsividade.

Essas funcionalidades representam o planejamento de evolução e não devem ser consideradas implementadas até serem concluídas e testadas.

## 👨‍💻 Autor

**Gabriel Meixedo Costa Nunes**

Estudante de Ciência da Computação na UNISO, interessado em desenvolvimento Full Stack, engenharia de software, backend com Python e construção de aplicações web.

- GitHub: [@MeixedoGabriel](https://github.com/MeixedoGabriel)
- Projeto: [Finance Control](https://github.com/MeixedoGabriel/finance-control)

---

*Projeto desenvolvido para fins de aprendizado prático em desenvolvimento de software, com evolução contínua das funcionalidades e da arquitetura.*