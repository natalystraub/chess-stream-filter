# ♟️ Stream Filter

> Uma vitrine de **streamers de xadrez** feita com React.
> O app busca a lista de streamers na API pública do **Chess.com**, mostra quem está **ao vivo** e leva direto para o canal na **Twitch**.

<p>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="CSS Modules" src="https://img.shields.io/badge/CSS-Modules-1572B6?logo=css&logoColor=white" />
  <img alt="Chess.com API" src="https://img.shields.io/badge/API-Chess.com-81B64C" />
</p>

🔗 **Demo:** [chess-stream-filter.vercel.app](https://chess-stream-filter.vercel.app/)

---

## 📚 Sumário

1. [O que o app faz](#-o-que-o-app-faz)
2. [Rodando em 1 minuto](#-rodando-em-1-minuto)
3. [Como funciona por dentro](#️-como-funciona-por-dentro)
4. [A API do Chess.com](#-a-api-do-chesscom)
5. [Componentes](#-componentes)
6. [Estilos](#-estilos)
7. [Mapa das pastas](#️-mapa-das-pastas)
8. [Comandos](#️-comandos)
9. [O que eu pratiquei neste projeto](#-o-que-eu-pratiquei-neste-projeto)
10. [Próximos passos](#-próximos-passos)

---

## 🎯 O que o app faz

- Busca a lista de streamers de xadrez **assim que a página abre**.
- Mostra cada streamer em um **card** com foto e nome.
- Quando o streamer está **ao vivo**, o card ganha um botão **Twitch** que abre o canal em uma nova aba.
- Mostra **6 streamers por vez**. O botão **"Ver mais"** carrega mais 6, e some quando não há mais ninguém para mostrar.
- Mostra **"Carregando..."** enquanto espera a API e uma **mensagem de erro** se a busca falhar.

---

## 🚀 Rodando em 1 minuto

Você só precisa ter o **[Node.js](https://nodejs.org/)** instalado. Para conferir, rode `node -v` no terminal.

```bash
# 1. Baixe o projeto
git clone git@github.com:natalystraub/chess-stream-filter.git

# 2. Entre na pasta
cd chess-stream-filter

# 3. Instale as dependências (só precisa fazer uma vez)
npm install

# 4. Ligue o app
npm run dev
```

Abra **http://localhost:5173** no navegador.

> Não precisa de chave de API nem de cadastro: a API do Chess.com é pública.

---

## ⚙️ Como funciona por dentro

Toda a lógica fica no componente [`Card.jsx`](src/components/card/Card.jsx). O caminho dos dados é este:

```
 página abre
     │
     ▼
 useEffect chama loadStream()
     │
     ▼
 loading = true  ──▶  tela mostra "Carregando..."
     │
     ▼
 fetch('https://api.chess.com/pub/streamers')
     │
     ├── deu certo  ──▶  users = lista de streamers
     │
     └── deu errado ──▶  error = mensagem  ──▶  tela mostra "Erro: ..."
     │
     ▼
 loading = false  ──▶  tela mostra os cards
```

### Os estados do componente

| Estado    | Começa com | Para que serve                                |
| --------- | ---------- | --------------------------------------------- |
| `users`   | `[]`       | A lista de streamers que veio da API          |
| `loading` | `false`    | Indica se a busca ainda está acontecendo      |
| `error`   | `null`     | Guarda a mensagem de erro, se algo der errado |
| `pages`   | `6`        | Quantos streamers estão aparecendo na tela    |

### A busca na API

```jsx
async function loadStream() {
  try {
    setLoading(true);
    setError(null);

    const req = await fetch('https://api.chess.com/pub/streamers');

    if (!req.ok) {
      throw new Error('Não foi possível carregar os streamers.');
    }

    const json = await req.json();
    setUsers(json.streamers || []);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

- **`try`**: tenta buscar os dados.
- **`if (!req.ok)`**: o `fetch` não considera erro quando a API responde com falha (por exemplo, 500), então essa checagem transforma isso em erro de verdade.
- **`catch`**: guarda a mensagem para mostrar na tela.
- **`finally`**: roda sempre, dando certo ou errado, e desliga o "Carregando...".

### O "Ver mais"

A lista completa fica guardada em `users`, mas só uma parte aparece:

```jsx
users.slice(0, pages)        // mostra só os primeiros `pages` streamers
setPages((v) => v + page)    // cada clique em "Ver mais" soma mais 6
```

O botão só aparece enquanto `pages < users.length`, ou seja, enquanto ainda sobra alguém para mostrar.

> 💡 Para mudar quantos streamers aparecem por vez, troque o valor de `const page = 6` em `Card.jsx`.

### O botão da Twitch

```jsx
{user.is_live && (
  <a href={user.twitch_url} target="_blank" rel="noreferrer">Twitch</a>
)}
```

O botão só é desenhado quando `is_live` é `true`. O `target="_blank"` abre em uma nova aba e o `rel="noreferrer"` é uma proteção de segurança para links externos.

---

## 🌐 A API do Chess.com

**Endereço:** `GET https://api.chess.com/pub/streamers`

A resposta tem uma lista chamada `streamers`. Cada item tem mais ou menos este formato:

```json
{
  "username": "NomeDoStreamer",
  "avatar": "https://images.chesscomfiles.com/...",
  "twitch_url": "https://twitch.tv/nomedostreamer",
  "url": "https://www.chess.com/member/nomedostreamer",
  "is_live": true
}
```

| Campo        | Como o app usa                   |
| ------------ | -------------------------------- |
| `username`   | Nome que aparece no card         |
| `avatar`     | Foto redonda do card             |
| `is_live`    | Decide se o botão Twitch aparece |
| `twitch_url` | Endereço que o botão Twitch abre |

Documentação oficial: [Chess.com Published-Data API](https://www.chess.com/news/view/published-data-api).

---

## 🧩 Componentes

A tela é montada em [`App.jsx`](src/App.jsx), com três componentes:

```
┌───────────────────────────────────────────┐
│  Header        "Stream Filter"            │
├───────────────────────────────────────────┤
│  Description   título + frase explicando  │
│                                           │
│  Card          [ card ] [ card ] [ card ] │
│                [ card ] [ card ] [ card ] │
│                                           │
│                     [ Ver mais ]          │
└───────────────────────────────────────────┘
```

| Componente                                                  | O que faz                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| [`Header`](src/components/header/Header.jsx)                | Mostra o nome do app no topo                                         |
| [`Description`](src/components/description/Description.jsx) | Título "Streamers de **xadrez**" e a frase de apresentação           |
| [`Card`](src/components/card/Card.jsx)                      | Busca os dados, trata carregando/erro, mostra a grade e o "Ver mais" |

---

## 🎨 Estilos

O app usa dois tipos de CSS:

- **[`App.css`](src/App.css)**: estilos globais e as **cores** do app, guardadas em variáveis:

  | Variável                 | Uso                      | Cor       |
  | ------------------------ | ------------------------ | --------- |
  | `--color-background`     | Fundo da página          | `#f6f3fc` |
  | `--color-text`           | Texto principal          | `#2a2140` |
  | `--color-text-secondary` | Texto de apoio           | `#6b6385` |
  | `--color-accent`         | Destaque roxo ("xadrez") | `#7c5cd6` |
  | `--color-card`           | Fundo dos cards          | `#ffffff` |
  | `--color-border`         | Bordas                   | `#e2daf3` |

  Trocar um valor ali muda a cor no app inteiro.

- **[`Card.module.css`](src/components/card/Card.module.css)**: estilos só dos cards, usando **CSS Modules**. As classes viram nomes únicos na hora do build, então não conflitam com nenhuma outra parte do app:

  ```jsx
  import styles from './Card.module.css';

  <div className={styles.card}>...</div>
  ```

---

## 🗂️ Mapa das pastas

```
stream-filter/
├── public/                        arquivos servidos como estão (favicon)
├── src/
│   ├── components/
│   │   ├── card/
│   │   │   ├── Card.jsx           busca na API + grade de streamers
│   │   │   └── Card.module.css    estilos dos cards
│   │   ├── description/
│   │   │   └── Description.jsx    título e frase de apresentação
│   │   └── header/
│   │       └── Header.jsx         topo da página
│   ├── App.jsx                    junta os componentes
│   ├── App.css                    cores e estilos globais
│   ├── index.css                  estilos base
│   └── main.jsx                   ponto de entrada do React
├── index.html                     HTML base
└── vite.config.js                 configuração do Vite e do React Compiler
```

---

## ⌨️ Comandos

| Comando           | Quando usar                                                  |
| ----------------- | ------------------------------------------------------------ |
| `npm install`     | Na primeira vez que baixar o projeto                         |
| `npm run dev`     | Para trabalhar no app com atualização automática             |
| `npm run build`   | Para gerar a versão final em `dist/`                         |
| `npm run preview` | Para ver a versão final rodando localmente antes de publicar |
| `npm run lint`    | Para procurar problemas no código                            |

---

## 🧠 O que eu pratiquei neste projeto

- Consumir uma **API REST** com `fetch` e `async/await`
- Usar **`useEffect`** para buscar dados quando o componente aparece
- Controlar a tela com **`useState`** (dados, carregando, erro e paginação)
- Tratar **erros** com `try / catch / finally`
- **Renderização condicional** (botão da Twitch, "Ver mais", carregando e erro)
- Listas com **`.map()`** e paginação com **`.slice()`**
- **CSS Modules** e **variáveis CSS** para organizar os estilos

---

## 🔭 Próximos passos

Ideias para evoluir o projeto:

- [ ] Filtro para mostrar **só quem está ao vivo**
- [ ] **Busca** por nome do streamer
- [ ] Layout **responsivo** (hoje a grade tem sempre 3 colunas)
- [ ] Link para o **perfil no Chess.com** (campo `url` da API)
- [ ] Tela de carregamento com **skeleton** no lugar do texto

---

Feito por **Nátaly Straub** · [LinkedIn](https://www.linkedin.com/in/nataly-straub) · [GitHub](https://github.com/natalystraub)
