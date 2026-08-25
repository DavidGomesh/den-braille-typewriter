# Motor da máquina Braille como transição pura

O motor da máquina Braille será um módulo profundo e independente de interface, dispositivo e efeitos colaterais. Sua interface receberá intenções lógicas, aplicará uma transição pura sobre o estado e retornará o novo estado, um snapshot observável e eventos semânticos; essa forma concentra as regras de acordes em uma seam testável e permite substituir React, DOM, áudio e adapters sem reimplementar o comportamento da máquina.

## Consequências

- Adapters coordenam teclado, toque, ponteiro e tecnologias assistivas antes de enviar um único fluxo lógico ao motor.
- Um acorde acumula pontos distintos desde a primeira pressão até a liberação de todos, quando produz exatamente uma célula Braille.
- O motor produz células, espaço, retrocesso e mudança de linha como eventos; não traduz células em caracteres nem altera o documento.
- Espaço, retrocesso e mudança de linha produzem uma operação por ciclo de pressão e liberação, sem repetição automática.
- Entradas inesperadas preservam o estado e produzem rejeição ou diagnóstico; cancelamentos limpam o acorde sem confirmar uma célula.
- Ações do produto, apresentação, foco, áudio, grafia, documento e regras de prática ou desafio permanecem fora do motor.
- O estado usa valores TypeScript imutáveis e serializáveis, sem depender de React ou `Immutable.js`.
