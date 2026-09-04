# Módulos e dependências

Um módulo apresenta uma interface e esconde sua implementação. Uma seam é o lugar dessa interface. Um adapter satisfaz uma interface numa seam e permite trocar comportamento sem alterar o consumidor. A profundidade vem do quanto de comportamento útil o módulo oferece por unidade de interface que o consumidor precisa aprender.

## Catálogo de capacidades

### `braille`

Responsável pelas regras independentes de experiência, dispositivo e apresentação.

- `machine`: transforma estado e Intenções da máquina em novo estado, snapshot e eventos semânticos.
- `document`: preserva Impressões de cela, Grade Braille, Configuração de papel e posições utilizadas.
- `orthography`: interpreta o Documento Braille conforme um Perfil de grafia e relaciona resultados às celas de origem.

Sua interface pública oferece valores imutáveis e transições puras. Não conhece React, DOM, áudio, persistência, Sessão de digitação ou Experiências do simulador.

### `preferences`

Responsável pelas Preferências do simulador, por seus valores válidos e por sua interface de carregamento e persistência. Adapters como `local-storage` satisfazem essa interface sem expor armazenamento aos consumidores.

### `session`

Responsável por coordenar Motor, Documento Braille, Posição de edição, Posição de revisão e captura numa Sessão de digitação. Recebe Intenções da máquina e Comandos da sessão e devolve novo estado, snapshot e eventos semânticos.

O adapter `session/adapters/web/keyboard` converte eventos do teclado físico em Intenções da máquina. A UI controla a região focável e informa ativações e interrupções; regras de acorde e captura não ficam em React.

### `experiences`

Responsável pelos ciclos de vida e regras próprias de cada Experiência do simulador.

- `free`: preserva e edita Documentos Braille sem objetivo imposto.
- `challenge`: mantém a resposta esperada, avalia a Sequência Braille e controla tentativa, correção, desistência e reinício.
- `lesson`: somente será criado quando o Modo lição existir como capacidade real.

Não existe uma interface genérica obrigatória entre as experiências. Elas compartilham a composição da Sessão de digitação, não uma abstração artificial.

### `feedback`

Responsável por transformar fatos semânticos, Preferências do simulador e capacidades do ambiente em um plano de Feedback multimodal. Seu núcleo decide conteúdo, prioridade, repetição, interrupção e silêncio. Adapters executam texto visual, mensagens acessíveis, Leitura falada do aplicativo e sons da máquina.

Falha de um adapter não altera o estado do domínio nem impede os outros meios.

### `ui`

Responsável pela apresentação React, estrutura semântica, foco do DOM, controles e estado visual efêmero. Recebe estados observáveis e envia Intenções da máquina, Comandos da sessão e Ações da experiência. Não modifica diretamente o Documento Braille nem escolhe regras de feedback.

`ui/shared` aceita somente módulos visuais com reutilização real ou contrato acessível que precise permanecer uniforme.

### `app`

É a composition root. Define bootstrap, rotas, páginas finas, recuperação global de falhas e estilos globais mínimos. Cria estados, seleciona adapters e conecta capacidades. Não contém regras do domínio e não funciona como store global.

## Matriz de dependências

| Consumidor | Interfaces públicas que pode conhecer |
|---|---|
| `braille` | nenhuma capacidade do produto |
| `preferences` | nenhuma capacidade do produto |
| `session` | `braille`, `preferences` |
| `experiences` | `session`, `braille`, `preferences` |
| `feedback` | produtores dos fatos semânticos que consome e `preferences` |
| `ui` | capacidades que apresenta |
| `app` | todas, somente para composição |

As permissões são limites máximos, não dependências obrigatórias. Uma capacidade não deve importar outra apenas porque a matriz permite.

## Regras das interfaces públicas

- Cada capacidade, exceto `app`, possui um `public.ts` deliberado.
- Consumidores externos não importam `internal/` nem caminhos internos equivalentes.
- `public.ts` não é um barrel automático; cada export atende a um caso de uso conhecido.
- Tipos de React, DOM, armazenamento e áudio não aparecem nas interfaces dos módulos puros.
- Adapters específicos de plataforma podem ser exportados pela capacidade, mas permanecem nomeados como específicos dessa plataforma.
- Interfaces incluem tipos, invariantes, ordem das operações, erros, configuração exigida e resultados observáveis.
- Testes e consumidores atravessam a mesma interface.
- Mudanças incompatíveis numa interface pública atualizam consumidores, testes e README da capacidade.

## Regras dos adapters

Um adapter fica junto da capacidade proprietária da seam que satisfaz. O nome da plataforma aparece quando a implementação não é portátil, por exemplo `adapters/web/keyboard` ou `adapters/web/speech`.

Não se cria uma seam apenas para antecipar variação. Uma interface para adapters é justificada quando existem ao menos duas implementações relevantes, normalmente a implementação de produção e uma implementação determinística de teste, ou quando a dependência é externa e precisa ser isolada.

## Verificação

A implantação deverá incluir regras automáticas que:

- rejeitem imports externos de detalhes internos;
- rejeitem ciclos entre capacidades;
- executem testes de contrato para adapters da mesma seam;
- executem testes dos módulos por suas interfaces públicas;
- sinalizem, na revisão, mudanças de interface sem atualização da documentação relacionada.

A ferramenta específica pode ser escolhida durante a implementação. O contrato arquitetural não depende de um linter particular.
