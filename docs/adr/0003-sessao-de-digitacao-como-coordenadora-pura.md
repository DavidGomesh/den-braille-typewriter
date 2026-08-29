# Sessão de digitação como coordenadora pura

A Sessão de digitação será um módulo profundo e puro que coordena motor, Documento Braille, edição, revisão e captura sem depender de React, DOM, áudio ou dispositivo. Sua interface recebe estado, Preferências do simulador e uma entrada normalizada, e devolve novo estado, snapshot observável e eventos semânticos; essa forma concentra a aplicação das Operações da máquina e elimina as cópias concorrentes mantidas hoje no `textarea`, nos estados de teclas e nas listas de celas.

## Consequências

- O estado autoritativo contém documento, Posições de edição e revisão, estado do motor, captura, fonte responsável, Perfil de grafia e eventual Reformatação do papel pendente; interpretação e apresentação são derivadas.
- A captura começa inativa, exige ativação intencional e termina por uma Interrupção da captura quando perde foco, é pausada ou a página fica oculta.
- Adapters enviam somente sua identidade estável e Intenções da máquina; a primeira fonte que inicia um acorde responde por ele até seu término.
- Acorde direto e Composição assistida cruzam a mesma seam, enquanto leitores de tela e linhas Braille usam a semântica exposta ao navegador, sem protocolo próprio de hardware.
- A Posição de revisão permite navegação acessível sem mover a escrita; comandos explícitos conectam revisão e edição quando a pessoa deseja alterar uma coordenada examinada.
- Presets Assistido e Fidelidade física são combinações coerentes de políticas de interrupção, Retrocesso, escrita em posição ocupada, transbordamento, Apagamento físico, limites e troca de folha; o modo Personalizado aceita somente combinações validadas.
- Preferências permanecem fora da sessão, são recebidas somente para leitura e usam uma interface própria de carregamento e persistência.
- Efeitos de áudio, DOM, persistência e Experiências do simulador consomem eventos da sessão e não fazem parte de sua implementação.
