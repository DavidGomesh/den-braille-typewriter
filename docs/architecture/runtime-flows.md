# Fluxos em execução

Os diagramas mostram relações duráveis. Eles omitem nomes de funções e detalhes internos para continuarem úteis durante refatorações.

## Digitação e feedback

Escopo: da entrada por teclado físico à atualização do Documento Braille e ao Feedback multimodal. Atualizado em 2026-09-04. Interfaces relacionadas: `session`, `braille` e `feedback`.

```mermaid
sequenceDiagram
    actor Pessoa
    participant UI as ui/session
    participant Entrada as adapter web de teclado
    participant Composicao as app/composition
    participant Sessao as Sessão de digitação
    participant Motor as Motor
    participant Documento as Documento Braille
    participant Feedback as Feedback multimodal
    participant Saidas as adapters de saída

    Pessoa->>UI: foca a região e usa o teclado
    UI->>Entrada: entrega eventos enquanto a captura está ativa
    Entrada->>Composicao: entrega fonte e Intenção da máquina
    Composicao->>Sessao: aplica a entrada normalizada
    Sessao->>Motor: aplica a intenção ao estado do motor
    Motor-->>Sessao: devolve estado, snapshot e eventos
    Sessao->>Documento: aplica a Operação da máquina
    Documento-->>Sessao: devolve o documento atualizado
    Sessao-->>Composicao: devolve estado e fatos semânticos
    Composicao-->>UI: entrega o estado observável
    Composicao->>Feedback: entrega os fatos semânticos
    Feedback-->>Saidas: produz o plano de feedback
    Saidas-->>Pessoa: apresenta meios disponíveis
```

A composition root conecta fatos semânticos ao Feedback multimodal. O diagrama não implica que a Sessão de digitação execute efeitos ou conheça adapters de saída.

## Interrupção da captura

Escopo: perda de foco, pausa ou ocultação da página durante um Acorde Braille. Atualizado em 2026-09-04. Decisões relacionadas: ADRs 0001, 0003 e 0006.

```mermaid
sequenceDiagram
    actor Pessoa
    participant UI as ui/session
    participant Sessao as Sessão de digitação
    participant Motor as Motor
    participant Feedback as Feedback multimodal

    Pessoa->>UI: sai da região de captura
    UI->>Sessao: envia Interrupção da captura
    Sessao->>Motor: aplica a política efetiva
    alt política descarta
        Motor-->>Sessao: descarta os pontos acumulados
    else política confirma
        Motor-->>Sessao: confirma os pontos acumulados
    end
    Sessao-->>UI: devolve o estado sem captura residual
    Sessao-->>Feedback: disponibiliza o fato semântico
```

## Experiência do simulador

Escopo: uma ação numa experiência guiada que usa sua própria Sessão de digitação. Atualizado em 2026-09-04. Interfaces relacionadas: `experiences`, `session`, `braille`, `ui` e `feedback`.

```mermaid
sequenceDiagram
    actor Pessoa
    participant Pagina as página fina
    participant UI as apresentação da experiência
    participant Composicao as app/composition
    participant Experiencia as Experiência do simulador
    participant Sessao as Sessão de digitação
    participant Grafia as Grafia Braille
    participant Feedback as Feedback multimodal

    Pessoa->>UI: solicita uma Ação da experiência
    UI->>Composicao: envia a ação
    Composicao->>Experiencia: aplica a Ação da experiência
    Experiencia->>Sessao: consulta o snapshot da sessão própria
    Experiencia->>Grafia: solicita interpretação quando necessário
    Grafia-->>Experiencia: devolve segmentos rastreáveis às celas
    Experiencia-->>Composicao: devolve estado, resultado e fatos semânticos
    Composicao-->>UI: entrega estado e resultado
    UI-->>Pagina: apresenta o novo estado
    Composicao->>Feedback: entrega os fatos semânticos
```

A experiência controla seu ciclo de vida e seus Requisitos da experiência. Ela não altera as Preferências do simulador e não executa áudio, foco ou persistência diretamente.

## Sistema de documentação

Escopo: localização da informação arquitetural. Atualizado em 2026-09-04. Decisão relacionada: ADR 0011.

```mermaid
flowchart TD
    glossary["CONTEXT.md<br/>vocabulário do domínio"]
    adr["docs/adr<br/>decisões e razões"]
    architecture["docs/architecture<br/>arquitetura vigente"]
    local["README da capacidade<br/>interface e manutenção local"]
    code["Código e testes<br/>comportamento executável"]

    glossary --> architecture
    adr --> architecture
    architecture --> local
    local --> code
```
