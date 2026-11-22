# DENTRO DA FARDA · Episódio 1 · Relatório de produção e verificação

Este relatório diz o que foi executado e conferido, e também o que **não** foi possível conferir.

## 1. Entregáveis

| Arquivo | O que é |
|---|---|
| `dentro_da_farda_ep01.mp4` | Vídeo final: 1080×1920, 30 fps, H.264 + AAC 256 kbps |
| `capa_ep01.jpg` | Capa 1080×1920; título e personagem dentro do recorte 4:5 do perfil |
| `legendas_ep01.srt` | 68 blocos por frase, ancorados nos inícios reais de voz |
| `post.md` | Legenda do post, comentário fixado e observações |
| `roteiro_final.md` | Roteiro com os tempos reais de cada fala e a ação de cada cena |
| `lista_de_cenas.md` | 7 cenas com início, fim, falas e momentos marcados |
| `storyboard/` | Os 12 quadros do storyboard e a folha usada na revisão |
| `folha_de_personagens.png` | Os 6 personagens, de frente e de perfil |
| `audio/falas/` | 27 falas individuais (WAV), cortadas dos 6 arquivos do ElevenLabs |
| `audio/ep01_dialogos_em_ordem.wav` | Só as falas, na ordem narrativa e com as pausas da edição |
| `audio/ep01_mix_final.wav` | Voz, trilha e efeitos: a faixa que está no MP4 |
| `../../../roteiros/dentro-da-farda/estado.json` | Estado atualizado (cânone travado, promessas do voto, pontas abertas) |
| Projeto editável | `serie/src/dentro-da-farda/`, `serie/scripts/dentro-da-farda/` e `serie/public/dentro-da-farda/` |

## 2. Ambiente (o que foi conferido antes de prometer)

- **Remotion 4.0.545** com React e TypeScript. O render usa o `chrome-headless-shell` do Playwright que já estava instalado.
- **ffmpeg** do sistema, usado para medir, separar, normalizar e extrair quadros.
- **Python com numpy**, para separar as falas, montar a timeline, sintetizar a trilha e os efeitos e mixar.
- **Sem reconhecimento de fala:** os modelos do Whisper e do Vosk não baixam, porque a rede bloqueia esses hosts.
- **Sem geração de voz:** as vozes são as que você gerou no ElevenLabs. Nenhuma voz foi criada ou imitada aqui.
- **Fontes:** o Chromium do render não passa pelo proxy, então o Google Fonts não carregava. As fontes Anton, Inter e JetBrains Mono (licença SIL OFL) foram baixadas para `public/fontes/` e são carregadas localmente.
- **Componente de áudio:** o `Audio` do pacote principal está marcado como obsoleto nesta versão, e o `@remotion/media` ainda é experimental. Usei o `Html5Audio`, que é o estável.
- **Pacote do briefing:** os arquivos 02 a 06 e o `estado_inicial.json` citados no briefing **não estavam no ambiente**. O roteiro segue o briefing mestre e o `ep01_roteiro_v2.md`.

## 3. Áudio

**Separação das falas.** Cada arquivo do ElevenLabs traz todas as falas de um personagem. As pausas entre falas (0,3 a 1 s) têm o mesmo tamanho das pausas dentro das falas, então cortar só pelos silêncios erraria. O corte foi escolhido por programação dinâmica, cruzando os silêncios com o tamanho esperado de cada fala (proporcional às sílabas).

- **Resultado:** as 27 falas foram separadas, com o número certo de falas em cada personagem: narrador 9, Arthur 6, Diego 4, Mendes 4, Helena 3, Victor 1.
- **Conferência visual:** `audio/verificacao_cortes_das_falas.png` mostra a forma de onda de cada arquivo com os cortes.
- **Ruídos nas bordas:** um estalo antes das falas 03 e 05 (Diego) e respirações no fim da 06 (Arthur) e da 20 (Diego) ficaram fora do corte.

**Tempo das legendas.** Não há reconhecimento de fala neste ambiente, então o tempo de cada palavra é **estimado** a partir da forma de onda.

- **Versão 1, corrigida depois da sua observação de que estava fora de sincronia:** acendia palavra por palavra com tempos estimados por sílabas. Nas frases sem pausa, as palavras adiantavam ou atrasavam alguns décimos. Na fala 13, frases inteiras caíam no trecho de voz errado.
- **Versão 2, a atual:**
  1. Cada fala é dividida em frases na pontuação. Uma programação dinâmica decide qual trecho de voz pertence a qual frase, mantendo constante o ritmo de sílabas por segundo e penalizando silêncios longos dentro de uma frase.
  2. Os blocos de legenda quebram na pontuação e têm no máximo 44 caracteres (duas linhas).
  3. Cada bloco gruda no início de voz real mais próximo e entra 0,05 s antes da voz. Isso vale para 57 dos 68 blocos; os outros 11 começam no meio de frases sem pausa e dependem da estimativa.
  4. O acendimento palavra por palavra foi retirado, porque era o que mais expunha erros pequenos.
- **Conferência visual:** `verificacao_legendas_sobre_a_voz.png` mostra a faixa de diálogos inteira com o início de cada bloco.
- **Tentativa descartada:** alinhar por DTW contra uma voz sintética do espeak-ng. Na fala 13, esse método espremeu as palavras finais, então não foi usado.

**Duração.** As vozes somam cerca de 90 s. Com as pausas e os 3,2 s finais no voto, o episódio tem **1:49,7**. Nenhuma voz foi acelerada e nenhuma pausa dentro das falas foi cortada. Só as pausas entre falas foram ajustadas. É mais longo que os 60 a 75 s ideais para Reels; para encurtar, o caminho é regravar o narrador num ritmo mais rápido.

**Equilíbrio do voto.** INTERROGAR (fala 25) dura 7,00 s e SEGUIR (fala 26) dura 7,02 s. As duas metades da tela ficam 7,42 s cada.

**Silêncios narrativos.** A trilha some depois da interrupção do áudio do Victor e durante a não-resposta da Helena. No primeiro silêncio ficam a goteira e o estalo do pisca-alerta, de propósito, porque o pisca continua na tela.

**Trilha e efeitos.** Tudo foi sintetizado no script, com semente fixa e sem bancos de terceiros:
- **Trilha:** drone grave, pulso lento e uma tensão que cresce no voto.
- **Efeitos:** goteira, relé do pisca-alerta, passos, notificação, toque na tela, teclado distante, zumbido de lâmpada, portas, tique de relógio, impacto no prazo e no voto, isqueiro e carro passando.

**Medições na faixa final.**

| Medida | Valor |
|---|---|
| Volume integrado | −15,3 LUFS (alvo −14; o limite de pico verdadeiro de −1,5 dBTP segurou o ganho) |
| Pico | −1,4 dBFS |
| Voz acima da trilha durante as falas | mediana 17,2 dB, mínimo 12,8 dB |
| Áudio do MP4 contra a timeline (correlação, animática) | 0 ms de deslocamento |

**Não conferido:** eu **não consigo ouvir**. Não avaliei de ouvido a interpretação das vozes, se alguma fala saiu com erro de leitura do ElevenLabs, nem o gosto da trilha. Isso precisa de uma escuta sua.

## 4. Imagem

- **Folha de personagens:** cada um tem uma marca de silhueta que nenhum outro tem.
  - **Arthur:** topete.
  - **Helena:** rabo de cavalo.
  - **Mendes:** o maior do elenco, de gravata.
  - **Diego:** boné virado pra trás.
  - **Victor:** gola alta.
  - **Segurança:** capuz.
- **Corrigido na folha:** três acessórios pareciam rosto num personagem sem rosto. O elástico da Helena parecia um olho, a abertura do boné do Diego parecia uma boca e o rabo de cavalo parecia um bico.
- **Storyboard (12 quadros) revisado antes do render pesado:** personagens reconhecíveis em todos os planos, contador no canto desde o prazo, voto legível.
- **Corrigido depois do storyboard e de quadros extras:**
  - personagens inteiros tingidos de ciano pela luz do celular;
  - Diego e Arthur sobrepostos;
  - Victor pequeno demais na lembrança;
  - legenda sobre as pernas do Arthur;
  - a cabeça do Arthur cobrindo o relógio no close;
  - luminárias atravessando a cartela de voto;
  - o contador escurecido pelo fundo da cartela;
  - a pergunta da cartela apagando (um problema de ordem de pintura do CSS).
- **Animática em 540×960** conferida pelos quadros das transições e dos movimentos rápidos: a lanterna, a virada para o Diego, o corte seco do áudio, a entrada da tela dividida e a mudança de perfil para frente.
- **Tempo e repetição:** todo o tempo vem do frame atual, então qualquer instante pode ser renderizado sozinho. Ruídos, cintilação e tremor de câmera usam sementes.

## 5. Narrativa e voto

- **Abertura:** começa no conflito, no primeiro quadro, sem vinheta.
- **Apresentação:** o Arthur aparece em ação antes de o narrador apresentá-lo.
- **Prazo:** os 31 dias são ditos pelo Mendes e repetidos pelo narrador, e o contador DIA 1/31 entra nesse momento.
- **Rede de corrupção:** é sugerida pelo áudio do Victor, pelo celular tomado e pela testemunha solta, sem revelar quem está envolvido.
- **As duas opções** têm o mesmo número de palavras, a mesma estrutura (ação, vantagem, custo), o mesmo tempo de tela e uma defensora cada (Diego e Helena).
- **Cartela final:** INTERROGAR e SEGUIR com o mesmo tamanho e a mesma entrada, "Escreva nos comentários" e 3,2 s parados no voto.
- **Nenhum resultado inventado:** o `estado.json` mantém `votacao.resultado = null`. O episódio 2 não foi escrito nem produzido.

## 6. Verificação do vídeo final

- **Arquivo:** `dentro_da_farda_ep01.mp4`, 32 MB.
  - Vídeo: H.264 High, 1080×1920, 30 fps, **3291 quadros** (o mesmo número da timeline), `yuv420p` em faixa de cor padrão (BT.709). O render saiu em `yuvj420p` (faixa completa) e foi convertido para evitar alteração de contraste no Instagram; o brilho médio mudou menos de 1 em 255.
  - Áudio: AAC 48 kHz estéreo. Volume integrado −15,3 LUFS.
  - Duração: 1:49,7.
- **Sincronia do áudio no MP4 final**, medida por correlação contra a mixagem: 0 ms de deslocamento nos trechos 5–15 s, 50–60 s e 95–105 s.
- **12 quadros extraídos do MP4 final** nos mesmos tempos do storyboard (`storyboard/quadros_do_mp4_final.png`): todas as correções presentes, nenhum texto cortado, contador visível desde o prazo, legendas fora dos personagens nas cenas de diálogo.
- **Último quadro (109,65 s):** parado no voto, com INTERROGAR | SEGUIR, "O QUE O ARTHUR FAZ?" e "Escreva nos comentários". Nada vem depois do voto.

## 7. Limites conhecidos (honestamente)

- **Duração:** 1:49,7 é mais longo que o ideal para Reels. O ritmo vem das vozes; encurtar exige regravar com um ritmo mais rápido ou cortar texto.
- **Legendas sem reconhecimento de fala:** os inícios de frase estão presos à voz real. Dentro de frases longas sem pausa, a divisão em blocos é estimada. Para sincronia exata palavra a palavra, falta um reconhecedor de fala: o ambiente bloqueia o download do modelo (huggingface.co e o host de modelos do Whisper), ou dá para usar os tempos exportados pelo ElevenLabs.
- **Não ouvido:** não consigo ouvir. A interpretação das vozes, eventuais erros de leitura do ElevenLabs e o resultado estético da trilha sintetizada precisam da sua escuta antes de publicar.
- **Movimento conferido por quadros:** os movimentos foram conferidos em quadros soltos e na animática, não assistindo em tempo real. Caminhadas e viradas de perfil para frente são simples (a virada é um corte de pose, sem quadros intermediários).
- **Estilo dos personagens:** os bonecos são figuras 2D vetoriais. Não usei o aspecto 3D com sombreamento suave da referência, porque o briefing pede desenho próprio.
