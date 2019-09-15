# Trabalho Interdisciplinar de Software III - Figaro: Barbershop Manager

Este programa é um gerenciador de loja, voltado para barbearias,
com módulos de controle de estoque, cadastro de clientes e gerenciamento de vendas.

`Este projeto ainda está em andamento,  e faz parte da disciplina Trabalho Interdisciplinar de Software III, do 3° período
do curso de Engenharia de Software da PUC Minas.`

## Contribuindo

### Ambiente de desenvolvimento

* [Git](https://git-scm.com/)
* [Node v10](https://nodejs.org/en/download/)
* Servidor [MariaDB](https://mariadb.org/download/)
* [Visual Studio Code](https://code.visualstudio.com/) (opcional, recomendado)


### Configuração inicial

Clone o projeto com o git:

`git clone https://github.com/wesleymou/Figaro-TIS-III.git`

Abra a pasta do projeto e instale os módulos do Node com o npm:

`npm i`

Crie um arquivo `.env` na raiz do projeto seguindo o modelo do arquivo [.env-dev](https://github.com/wesleymou/Figaro-TIS-III/blob/master/.env-dev)
e preencha as variaveis de ambiente de acordo com as configurações do seu ambiente.


#### Configurando o banco de dados

*A definir...*

#### Executando em modo desenvolvimento

Execute o script de desenvolvimento.

`npm run dev`

Abra o navegador na url local com a porta configurada na variável `PORT` do arquivo .env (*e.g.* http://localhost:4000).

#### Enviando as alterações

Faça um pull request para a branch `desenvolvimento`.
