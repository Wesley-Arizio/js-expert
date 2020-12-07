# Projeto final modulo 01

Esse projeto foi feito durante modulo 1 do curso js expert do erick wendel, focado em praticas de teste durante o desenvolvimento de uma aplicação.
A aplicação se trata de aluguel de carros, para praticar ainda mais os conceitos de testes decidi ir um pouco além e desenvolver algumas funcionalidades a mais, junto a isso, desenvolvi uma api rest usando modulos nativos do node js.

<br />

### Tecnologias usadas

- node 14
- instabul para test coverage
- mocha
- chai
- faker para dados mockados
- sinon para substituir saidas de funções ou requisições durante os testes
- supertest para testar os endpoints da api
- Joi para validar entradas

<br />

## Funcionalidades adicionais

<br />

<b>getAllCategories</b> => Retorna todas as categorias junto com o numero de carros nela.

<br />

<b>getCarsFromCarCategoryByIds</b> => Retorna os dados de carros de acordo com os ids dentro de cada categoria.

<br />

<b>getCarCategoryWithCarsList</b> => Retorna dados da categoria junto com dados dos carros que estão nelas.

<br />

## Rotas da API

<b>GET /cars </b> => Retorna o carro de acordo com id passado no parametro

<br />

<b>GET /car-categories </b> => Retorna todas as categorias no banco e remove o carIds

<br />

<b>GET /cars-by-categories </b> => Retorna todos os carros de acordo com id da categoria passado como parametro de url

<br />

<b>POST /calculate-final-price</b> => Retorna o preço final de acordo com os dados passados no corpo da requisição.

<br />

<b>POST /get-available-car </b> => Retorna um carro disponivel de acordo com a categoria passada.

<br />

<b>POST /rent </b> => Retorna um recibo de aluguel de carro de acordo com os dados fornecidos no corpo da requisição.

<br />
<br />

## Rodando o projeto

Para rodar os projetos deste repositório é necessario utilizar node versão 14.

    git clone https://github.com/Wesley-Arizio/js-expert.git

Navegar até o diretório do projeto escolhido

    cd Modulo01/aula05-projeto

Instalar as dependencias

    yarn install

Rodando os testes

    yarn test

    ou

    yarn test:coverage

rodando o yarn test:coverage, você pode ver o quanto de testes o projeto está coberto,
basta abrir o index.html da pasta coverage no navegador e prontinho.
