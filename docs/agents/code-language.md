# Idioma do código

Código e contratos técnicos usam inglês idiomático. Esta regra inclui tipos,
funções, métodos, variáveis, parâmetros, propriedades, nomes de módulos,
discriminantes, eventos, comandos, diagnósticos internos, mensagens de exceção,
comentários, descrições de testes e automações de CI.

Não crie interfaces híbridas nem aliases em português. Valores serializáveis ou
persistidos que fazem parte de contratos técnicos também usam inglês.

Documentação, issues, pull requests, mensagens de commit destinadas a pessoas e
demais explicações permanecem em português. Ao citar um identificador, preserve
seu nome em inglês e explique sua relação com o termo português na primeira
ocorrência relevante. Por exemplo, `BrailleCell` representa uma Cela Braille.

Textos apresentados pela aplicação pertencem à camada de apresentação e devem
ser localizáveis. O núcleo e as capacidades não fornecem mensagens técnicas
diretamente à pessoa usuária. Conteúdo português já pertencente ao produto, como
labels, nomes acessíveis e mensagens visíveis, não deve ser traduzido para inglês
por esta convenção.

A convenção é aplicada por revisão de código. Não mantenha uma lista automática
de palavras proibidas, pois ela confundiria conteúdo legítimo da apresentação e
não provaria que os identificadores estão em inglês idiomático.
