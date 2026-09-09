# Capacidade de Preferências do simulador

## Responsabilidade

A capacidade `preferences` define as escolhas permanentes da pessoa, valida e
migra seu formato serializado e oferece uma seam pequena para carregamento e
persistência. Ela não conhece React, Sessão de digitação, Documento Braille,
áudio nem APIs do navegador.

O schema atual, identificado por `version: 2`, preserva:

- visualização Braille ou a tinta;
- leitura falada explícita com localidade, preferência lógica de voz,
  velocidade, pitch e volume;
- sons opcionais da máquina;
- códigos físicos associados aos controles configuráveis;
- Modo de simulação Assistido ou Fidelidade física.

## Interface pública

Consumidores e testes importam somente `preferences/public.ts`. A interface
oferece:

- `createDefaultSimulatorPreferences` para criar um snapshot válido;
- `loadSimulatorPreferences` para carregar, validar, migrar ou aplicar fallback;
- `saveSimulatorPreferences` para persistir sem propagar falhas do adapter;
- `applySimulatorPreferenceChange` para produzir um novo snapshot imutável;
- `resolveEffectiveSessionConfiguration` para combinar preferências e Requisitos
  da experiência sem alterar escolhas permanentes;
- adapters de memória e de armazenamento local web para a mesma
  `PreferencesStorage`.

## Carregamento, migração e fallback

O carregamento sempre devolve preferências válidas e um resultado observável:

| Status      | Significado                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `loaded`    | O payload da versão atual foi validado.                                |
| `migrated`  | Escolhas das versões 0 ou 1 foram convertidas para a versão atual.     |
| `defaulted` | Os padrões foram usados por ausência, invalidade ou indisponibilidade. |

Payloads incompletos, códigos físicos vazios ou duplicados, versões desconhecidas
e JSON inválido não atravessam a interface. Falhas de leitura e escrita são
convertidas em resultados; elas não interrompem nem revertem a Sessão de
digitação corrente.

Snapshots da versão 1 recebem as novas preferências sem persistir nomes
concretos de vozes. Uma migração válida tenta gravar imediatamente o schema atual. Se essa gravação
falhar, as escolhas migradas continuam ativas na sessão corrente e o resultado
expõe `migrationPersistence: 'failed'`.

## Configuração efetiva

O Modo de simulação define a política permanente atualmente suportada:
Assistido descarta um acorde interrompido e Fidelidade física o confirma. Um
Requisito da experiência pode substituir essa política somente no resultado de
`resolveEffectiveSessionConfiguration`. O snapshot persistido permanece
inalterado, e `overriddenPreferences` torna a substituição observável.

## Adapters

O adapter web usa a chave estável `den-braille-typewriter.preferences` no
`localStorage`; a versão fica dentro do payload para permitir migrações sem
trocar silenciosamente de namespace. O adapter de memória é determinístico e
serve ao mesmo contrato sem depender do navegador.

Neste corte, os atalhos do Modo livre permitem alterar e persistir as escolhas
de apresentação e áudio. Bindings e Modo de simulação já são validados,
carregados e aplicados quando presentes no snapshot, mas sua edição por uma
interface própria pertence à evolução planejada da apresentação de
preferências.

## Estratégia de testes

- `preferences.test.ts` verifica valores válidos, migração, fallback, mudanças
  imutáveis e Configuração efetiva pela interface pública;
- `tests/contracts/preferences-storage.test.ts` aplica o mesmo contrato aos
  adapters web e de memória;
- `tests/journeys/free-mode.test.tsx` verifica persistência entre Sessões de
  digitação, bindings carregados e continuidade após falha de escrita.

## Referências

- `CONTEXT.md`
- `docs/adr/0003-sessao-de-digitacao-como-coordenadora-pura.md`
- `docs/adr/0004-experiencias-compoem-sessoes-independentes.md`
- `docs/adr/0006-acessibilidade-como-contrato-arquitetural.md`
- `docs/architecture/modules.md`
- `docs/architecture/migration-plan.md`
