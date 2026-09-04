# Estrutura de diretórios

Esta é a árvore alvo. Ela orienta a modernização incremental e não descreve o estado atual de `src/`. Pastas somente devem ser criadas quando receberem conteúdo real.

```text
src/
├── app/
│   ├── bootstrap/
│   ├── composition/
│   ├── pages/
│   ├── routing/
│   ├── styles/
│   └── main.tsx
├── braille/
│   ├── machine/
│   ├── document/
│   ├── orthography/
│   ├── README.md
│   └── public.ts
├── session/
│   ├── adapters/
│   │   └── web/
│   │       └── keyboard/
│   ├── internal/
│   ├── README.md
│   └── public.ts
├── experiences/
│   ├── free/
│   ├── challenge/
│   ├── README.md
│   └── public.ts
├── feedback/
│   ├── adapters/
│   │   └── web/
│   │       ├── speech/
│   │       ├── sound/
│   │       └── accessible-messages/
│   ├── catalog/
│   ├── internal/
│   ├── README.md
│   └── public.ts
├── preferences/
│   ├── adapters/
│   │   └── web/
│   │       └── local-storage/
│   ├── internal/
│   ├── README.md
│   └── public.ts
└── ui/
    ├── braille/
    ├── session/
    ├── experiences/
    │   ├── free/
    │   └── challenge/
    ├── shared/
    ├── README.md
    └── public.ts

tests/
├── architecture/
├── contracts/
└── journeys/
```

## Regras de localização

1. Código pertence à capacidade cuja regra ou seam ele implementa.
2. Um adapter pertence à capacidade que declara a interface satisfeita por ele.
3. Apresentação React pertence a `ui`, mesmo quando apresenta uma capacidade específica.
4. Bootstrap, páginas, rotas e conexão entre capacidades pertencem a `app`.
5. Testes de um módulo ficam próximos da implementação.
6. Suítes que atravessam módulos ficam em `tests/contracts` ou `tests/journeys`.
7. Regras que verificam a própria estrutura ficam em `tests/architecture`.
8. Não criar pastas globais `components`, `providers`, `services`, `common` ou `utils`.
9. `ui/shared` não é uma área de conveniência. Um módulo entra nela somente por reutilização real ou por um contrato acessível uniforme.
10. `internal` é opcional. Implementações pequenas podem ficar diretamente na capacidade, desde que sua interface pública continue explícita.

## Exemplo de interface local

```text
session/
├── adapters/
├── internal/
├── README.md
├── public.ts
├── session.test.ts
└── session.ts
```

O `README.md` local deve registrar:

- responsabilidade e o que fica fora dela;
- interface pública e exemplos de uso;
- invariantes, ordem das operações e erros;
- dependências permitidas;
- adapters conhecidos;
- estratégia de testes;
- ADRs e documentos arquiteturais relacionados.

## Entrada por teclado físico

O fluxo é dividido sem duplicar regras:

- `ui/session` controla a região focável e o ciclo visual;
- `session/adapters/web/keyboard` converte eventos do navegador em Intenções da máquina;
- `session` arbitra a fonte da captura e coordena o Motor;
- `braille/machine` aplica as regras do Acorde Braille;
- tipos como `KeyboardEvent` não alcançam as interfaces puras.

## Assets

Assets de apresentação ficam próximos da área visual que os usa ou numa área pública exigida pela ferramenta de build. Assets editoriais de Feedback multimodal são resolvidos por um catálogo da capacidade `feedback`. Módulos puros recebem identificadores semânticos e nunca conhecem caminhos ou URLs.
