# 31 DIAS — Mapa da temporada

Este é o **plano**, não o cânone. Ele muda conforme o público vota. O que já foi ao
ar e não pode mais mudar fica em `estado.json` → `canone.exibido`.

**Legenda:**
- ⭐ PILAR: acontece em qualquer caminho. O voto muda a forma, não o fato.
- **Ev** é Evidência, **Ri** é Risco, **Ca** é Carreira e **Conf H / J / L** é a
  confiança de Helena, Jairo e Lia.
- `flag` é uma marca guardada em `estado.json` que volta a aparecer depois.
- **Variantes** explicam como o episódio muda conforme votos anteriores.

**Medidores no início:** Ev 0 · Ri 1 · Ca 3 · Conf H 0 · Conf J +1 · Conf L −1

---

## SEMANA 1 · Dias 1 a 7 · "O caso"
*Caio entra, recebe o caso e percebe que tem algo errado dentro de casa.*

### Dia 1 · Primeiro dia ⭐ PILAR
**Acontece:**
- Caio chega à UCE com o distintivo novo.
- Helena apresenta o caso: R$ 40 milhões sumidos do cofre do Fórum e o vigia morto
  num "acidente". Explica o prazo de 31 dias para a federalização e o fim da unidade.
- Jairo vira parceiro dele, com piada e café.

**Gancho final:** à noite, no quarto, Caio assiste ao vídeo de segurança e percebe
que **faltam quatro minutos**, de 23h43 a 23h47, exatamente na hora da morte.

**Voto: o que o Caio faz primeiro com os quatro minutos?**
- **A · Conta para a Helena amanhã cedo.**
  - Ganha: Conf H +1 e acesso oficial aos servidores do Fórum.
  - Paga: a informação circula na unidade, Ri +1, e a Lista fica sabendo que alguém reparou.
- **B · Procura sozinho o técnico das câmeras do Fórum.**
  - Ganha: Ev +1, com cópia do registro bruto mostrando que as câmeras foram
    desligadas por um login (`flag: login_correg`).
  - Paga: age por fora da hierarquia. Ca −1 se Helena descobrir no dia 3, e Jairo
    repara no sumiço (Conf J −1).
- **C · Vai ao velório do vigia.**
  - Ganha: conhece a Lia (`flag: conhece_lia`, Conf L passa a 0) e ouve que Sérgio
    "tinha medo de alguém de farda".
  - Paga: perde o dia. O técnico das câmeras "tira férias" e essa pista se fecha.

### Dia 2 · O depósito
**Acontece:**
- Caio e Jairo visitam o depósito.
- O cofre não foi arrombado: foi aberto **com a senha**.
- Moura, o chefe do depósito, sua e evita responder.

**Variantes:**
- A: Helena libera o servidor e Caio vê que o backup de vídeo também foi apagado.
- B: o registro mostra o login `CORREG-02`. Caio ainda não sabe o que é.
- C: Lia aparece no portão filmando e é expulsa. Caio troca um olhar com ela.

**Voto: como pressionar o Moura?**
- **A · Interrogatório formal, com o Jairo na sala.**
  - Ganha: depoimento registrado (Ev +1).
  - Paga: Moura se fecha, e o que ele diz chega à Lista no mesmo dia (Ri +1).
- **B · Conversa sozinho, no estacionamento.**
  - Ganha: Moura deixa escapar "não fui eu que pedi senha nova" (Ev +1).
  - Paga: Jairo pergunta onde Caio estava (Conf J −1).
- **C · Seguir o Moura depois do expediente.**
  - Ganha: vê Moura entregar um envelope a um homem que manca (Brito), Ev +2.
  - Paga: Caio é visto (Ri +2).

### Dia 3 · A senha nova
**Acontece:**
- Caio descobre que a senha do cofre foi trocada três dias antes do roubo, "por
  ordem de cima", num pedido feito pelo sistema de auditoria.
- Helena corta: "Não se mexe com quem investiga a gente."
- Se `login_correg`: Helena descobre que Caio foi ao técnico sozinho (Ca −1).

**Voto: o pedido de troca da senha**
- **A · Obedecer a Helena e largar o assunto.**
  - Ganha: Conf H +1.
  - Paga: nenhuma prova nova, e o pedido é apagado do sistema no dia 6.
- **B · Pedir o documento ao Fórum por conta própria.**
  - Ganha: Ev +1, com o pedido saindo de um login da Corregedoria.
  - Paga: Ca −1.
- **C · Pedir ao Jairo que consiga o documento.**
  - Ganha: Conf J +1. Jairo entrega uma cópia no mesmo dia (Ev +1).
  - Paga: a cópia é adulterada (`flag: doc_falso`) e explode no dia 19.

### Dia 4 · Lia
**Acontece:**
- Lia procura Caio. Se `conhece_lia`, procura com menos hostilidade.
- Ela tem o backup do celular do irmão na nuvem, mas está trancado. Quer a
  exclusiva da matéria em troca.

**Voto: o que fazer com a proposta da Lia?**
- **A · Aceitar a parceria.**
  - Ganha: Conf L +2 e acesso futuro ao backup.
  - Paga: jornalista é vigiada (Ri +1).
- **B · Recusar e mandar o caso para a perícia oficial.**
  - Ganha: Conf H +1 e um caminho legal para a prova.
  - Paga: Conf L −1, e Lia passa a trabalhar contra ele.
- **C · Fingir que aceita e tentar copiar o backup escondido.**
  - Ganha: Ev +1 já, com a cópia trancada (`flag: copia_segura`).
  - Paga: Conf L −2. Lia descobre no dia 6 e publica uma nota atacando a UCE (Ri +1).

### Dia 5 · A foto ⭐ PILAR
**Acontece:** Caio chega em casa e encontra no monitor uma foto dele **dormindo**,
tirada de dentro do quarto. É a primeira ameaça.

**Voto: para quem ele conta?**
- **A · Para a unidade (Helena e Jairo).**
  - Ganha: Jairo se oferece para "ficar de olho" (Conf J +1).
  - Paga: a Lista sabe que funcionou, e Caio passa a ser vigiado de perto pelo próprio parceiro.
- **B · Para a Lia.**
  - Ganha: ela publica "policial novato é ameaçado", e a exposição protege (Ri −1).
  - Paga: Helena fica furiosa com o vazamento (Conf H −1, Ca −1).
  - Se Conf L < 0, a opção vira "procurar a Lia", que recusa.
- **C · Ninguém. Instala uma câmera escondida no quarto.**
  - Ganha: `flag: camera_quarto`, que pega um intruso no dia 9 (Ev +1).
  - Paga: fica sozinho com o medo (Ri +1).

### Dia 6 · A viatura sem placa
**Acontece:**
- Uma pista leva à garagem da frota. As fontes possíveis são o registro, o velório
  ou a mensagem parcial da Lia.
- Na garagem, Jairo tenta tirar Caio de perto do carro 41 sem dar na vista.

**Voto: e o carro 41?**
- **A · Insistir e examinar o carro agora.**
  - Ganha: terra do porto no pneu (Ev +1).
  - Paga: Conf J −1 e Ri +1.
- **B · Confiar no Jairo e seguir a outra pista.**
  - Ganha: Conf J +1.
  - Paga: o carro é lavado de madrugada e a pista some.
- **C · Voltar sozinho de madrugada.**
  - Ganha: terra do porto e um lacre do cofre embaixo do banco (Ev +2).
  - Paga: o vigia da garagem anota o nome dele (Ca −1).

### Dia 7 · O homem que não se mexe
**Acontece:**
- Coletiva de imprensa e cartela "faltam 24 dias".
- **Primeira aparição de Saraiva.** Ele visita a UCE e oferece "todo o apoio da
  Corregedoria". Aperta a mão de Caio e diz: *"Conheci seu pai."*
- Animação: Saraiva não respira.

**Voto: como o Caio responde?**
- **A · Educado e agradecido.**
  - Ganha: Saraiva o subestima (Ri −1).
  - Paga: nenhuma informação nova.
- **B · Pergunta sobre a senha trocada pelo sistema da Corregedoria.**
  - Ganha: vê o sorriso de Saraiva travar, e Helena admira a coragem (Conf H +1).
  - Paga: Ri +2.
- **C · Pede ajuda formal da Corregedoria no caso.**
  - Ganha: acesso ao arquivo da Corregedoria (`flag: acesso_arquivo`), útil no dia 16.
  - Paga: Saraiva passa a ver tudo o que Caio produz (Ri +1).

---

## SEMANA 2 · Dias 8 a 15 · "Para dentro"
*As pistas apontam para dentro da polícia e chegam a quem está do lado dele.*

### Dia 8 · Mensagem 23h47 ⭐ PILAR
**Acontece:** Caio recupera a última mensagem de Sérgio: *"a viatura sem placa
voltou. dois de farda. um eu conheço."*

**Variantes (de onde vem a mensagem):**
- Conf L ≥ 1: Lia destrava esse pedaço do backup.
- Conf H ≥ 1: vem da perícia oficial.
- `copia_segura`: Caio quebra a senha sozinho, a noite inteira, no quarto.

**Voto: para quem mostrar a mensagem?**
- **A · Para a Helena.**
  - Ganha: Conf H +1 e registro oficial.
  - Paga: o computador dela é monitorado (Ri +1).
- **B · Para o Jairo.**
  - Ganha: Jairo empalidece e se sente confiado (Conf J +1). Isso planta a virada dele.
  - Paga: ele avisa Saraiva, mas não tudo (Ri +1).
- **C · Para ninguém. Guardar cópia num lugar seguro.**
  - Ganha: `flag: copia_segura` (Ev +1).
  - Paga: nenhum aliado avança.

### Dia 9 · Seis nomes
**Acontece:**
- A escala daquela noite tem seis policiais que podiam estar no Fórum.
- Se `camera_quarto`: a câmera mostra um intruso mancando no quarto (Ev +1).

**Voto: quem investigar primeiro?**
- **A · Brito**, da Corregedoria, que estava no Fórum sem motivo.
  - Ganha: Ev +1.
  - Paga: Ri +2.
- **B · Paiva**, o sobrenome do Jairo.
  - Ganha: descobre que Jairo mentiu: disse que estava em casa e estava de plantão
    (Ev +1, `flag: mentira_jairo`).
  - Paga: Conf J −1.
- **C · Moura.**
  - Ganha: é seguro, e Moura racha: "Eles me obrigaram" (Ev +1).
  - Paga: nada novo sobre quem estava na viatura.

### Dia 10 · A escuta
**Acontece:** Moura pede um encontro. Quer proteção em troca do que sabe.

**Voto: como fazer o encontro?**
- **A · Gravar escondido.**
  - Ganha: Ev +2.
  - Paga: a gravação é ilegal (`flag: gravacao_ilegal`, Ca −1 se usada no dia 30).
- **B · Levar o Moura direto à Helena para uma delação formal.**
  - Ganha: Conf H +1 e um caminho legal.
  - Paga: a delação vaza e o dia 12 chega pior (Ri +1).
- **C · Levar o Moura até a Lia.**
  - Ganha: depoimento jornalístico (Conf L +1, Ev +1).
  - Paga: Ri +1.

### Dia 11 · Bia
**Acontece:**
- Caio vê Jairo no hospital com a filha, Bia, em tratamento caro. É o primeiro
  momento sem piada do Jairo.
- Jairo pede que Caio o cubra por duas horas. Diz que é o hospital; na verdade vai
  encontrar Brito.

**Voto: cobrir o Jairo?**
- **A · Cobrir.**
  - Ganha: Conf J +2.
  - Paga: Ca −1 se a Helena descobrir.
- **B · Recusar.**
  - Ganha: mantém a ficha limpa.
  - Paga: Conf J −1.
- **C · Cobrir e seguir o Jairo.**
  - Ganha: vê Jairo com o homem que manca (Ev +1, `flag: viu_jairo_brito`).
  - Paga: Ri +1.

### Dia 12 · Moura sumiu ⭐ PILAR
**Acontece:**
- O carro de Moura é achado na beira do rio, sem corpo.
- A imprensa culpa a UCE, e Caio sente o peso do que pode ter causado.

**Voto: o que fazer?**
- **A · Ir sozinho ao local à noite.**
  - Ganha: acha o caderno escondido de Moura (Ev +1, `flag: caderno`).
  - Paga: Ri +1.
- **B · Pedir à Helena uma investigação formal do desaparecimento.**
  - Ganha: Conf H +1.
  - Paga: o caderno é achado pela Corregedoria antes.
- **C · Usar a Lia para pressionar publicamente.**
  - Ganha: a exposição protege (Ri −1), e a viúva de Moura entrega o caderno a Lia
    (`flag: caderno`).
  - Paga: Conf H −1.

### Dia 13 · A Lista
**Acontece:**
- O caderno de Moura (ou, sem ele, um resumo vazado) mostra iniciais e valores
  mensais: é **a Lista**.
- Entre as iniciais está **"J.P."**.

**Voto: e o "J.P."?**
- **A · Confrontar o Jairo agora.**
  - Ganha: Jairo admite que paga "seguro" ("todo mundo paga, garoto"), mas nega o roubo.
  - Paga: Conf J −1 e Ri +1.
- **B · Fingir que não viu e observar.**
  - Ganha: Ev +1, e Jairo continua útil.
  - Paga: Caio passa a mentir para o parceiro.
- **C · Mostrar o caderno para a Helena.**
  - Ganha: Helena confessa que sabe da Lista ("Eu escolhi proteger a unidade").
    Conf H vai para 0, seja qual for o valor anterior.
  - Paga: Caio perde a certeza sobre a chefe.

### Dia 14 · Invasão ao servidor
**Acontece:** Caio descobre que o servidor do depósito guarda um HD de backup
físico que ninguém apagou. Precisa entrar à noite.

**Voto: quem vai com ele?**
- **A · Jairo.**
  - Ganha: Jairo ajuda de verdade, por dentro (Conf J +1, Ev +1).
  - Paga: Saraiva fica sabendo que o HD existe (Ri +1).
- **B · Lia.**
  - Ganha: ela é rápida no servidor (Ev +2). Só disponível se Conf L ≥ 0.
  - Paga: se Ri ≥ 3, Lia é detida na saída e liberada no dia 16 (Conf L −1).
- **C · Sozinho.**
  - Ganha: Ev +1.
  - Paga: Ri +2.

### Dia 15 · Os quatro minutos ⭐ PILAR · MEIO DA TEMPORADA
**Acontece:**
- O vídeo recuperado mostra **três figuras de farda, sem rosto**, carregando o
  cofre numa viatura sem placa.
- Uma usa **boné virado para trás**. Outra **não se mexe**.
- Sérgio entra no quadro e o vídeo corta.

**Voto: o que fazer com o vídeo?**
- **A · Levar à Polícia Federal agora.**
  - Ganha: Ev +2, com prova oficial.
  - Paga: a Lista fica sabendo do vídeo no mesmo dia (Ri +2), e Helena se sente
    traída (Conf H −1).
- **B · Confrontar o Jairo com o vídeo.**
  - Ganha: antecipa a virada do Jairo para o dia 18.
  - Paga: se Conf J ≤ 0, ele foge e avisa Saraiva (Ri +2).
- **C · Esconder o vídeo e investigar a figura que não se mexe.**
  - Ganha: o caminho até Saraiva abre mais cedo (Ev +1).
  - Paga: Caio carrega o vídeo sozinho (Ri +1).

---

## SEMANA 3 · Dias 16 a 23 · "Ninguém é confiável"
*A rede reage, Caio perde o distintivo e o parceiro mostra quem é.*

### Dia 16 · Ernesto
**Acontece:**
- Caio visita o pai, Ernesto.
- Mostrado o vídeo ou o jeito de Saraiva, Ernesto reconhece **"o homem que nunca
  se mexe"**: foi Saraiva quem o expulsou há 10 anos, porque ele não quis pagar.

**Voto: e o pai?**
- **A · Pedir que ele testemunhe.**
  - Ganha: testemunha com histórico (Ev +1, `flag: ernesto_testemunha`).
  - Paga: Ernesto vira alvo, e o Risco dele soma ao do Caio a partir daqui.
- **B · Buscar o processo antigo no arquivo.**
  - Ganha: Ev +1.
  - Paga: Ca −1, a menos que haja `acesso_arquivo` (aí não custa nada).
- **C · Não envolver o pai.**
  - Ganha: protege o Ernesto.
  - Paga: nenhuma prova nova, mas Caio entende o motivo e a raiva dele cresce.

### Dia 17 · O almoço
**Acontece:** Saraiva convida Caio para almoçar. Elogia o trabalho dele e oferece
uma vaga na Corregedoria "quando isso acabar".

**Voto: o que fazer com o convite?**
- **A · Ir e gravar.**
  - Ganha: Saraiva não escorrega, mas revela que sabe do vídeo. Caio descobre que
    há um vazamento perto dele.
  - Paga: Ri +1.
- **B · Recusar educadamente.**
  - Ganha: mantém distância.
  - Paga: Ri +1, porque recusar é resposta.
- **C · Ir e fingir interesse.**
  - Ganha: Saraiva baixa a guarda (Ri −1).
  - Paga: Lia ou Helena veem os dois juntos (Conf L −1 ou Conf H −1, de quem estiver mais alto).

### Dia 18 · No carro
**Acontece:** conversa noturna na viatura. Jairo sabe que Caio tem o vídeo e para
de fazer piada: *"Você não sabe com quem tá mexendo."*

**Voto: o que dizer ao Jairo?**
- **A · Oferecer ajuda para ele sair do esquema.**
  - Ganha: Conf J +1.
  - Paga: Ri +1.
- **B · Ameaçar denunciá-lo.**
  - Ganha: Jairo entrega uma pista por medo (Ev +1).
  - Paga: Conf J −2, e ele corre para o Saraiva (Ri +2).
- **C · Fingir que deixou para lá.**
  - Ganha: compra tempo.
  - Paga: Jairo não acredita.

### Dia 19 · O armário ⭐ PILAR
**Acontece:**
- A Corregedoria faz uma busca na UCE e acha **R$ 200 mil no armário do Caio**.
- Ele é suspenso e **tiram o distintivo**. O cordão fica vazio.
- Ca −1 sempre. Se `doc_falso`, Ca −2, porque a cópia adulterada do dia 3 "prova"
  que ele fraudou documentos.

**Voto: e agora?**
- **A · Fugir antes de ser detido.**
  - Ganha: liberdade para investigar (`status: foragido`).
  - Paga: Ca −1 e Ri +1.
- **B · Se entregar e confiar no processo.**
  - Ganha: Helena o defende se Conf H ≥ 1 (`status: suspenso`).
  - Paga: perde os dias 20 e 21, que mostram os aliados agindo sem ele.
- **C · Pedir ajuda pública pela Lia.**
  - Ganha: a opinião pública fica do lado dele (Ri −1, `status: suspenso`).
  - Paga: Ca −1 e Conf H −1.

### Dia 20 · Sem distintivo
**Acontece:** Caio está sem arma, sem crachá e sem acesso. Só funciona quem
confia nele.

**Voto: a quem pedir ajuda?**
- **A · Helena** (precisa de Conf H ≥ 0).
  - Ganha: acesso por dentro ao inquérito da busca: quem plantou o dinheiro (Ev +1).
- **B · Jairo** (precisa de Conf J ≥ 0).
  - Ganha: uma pista sobre onde está a viatura sem placa (o porto).
- **C · Lia** (precisa de Conf L ≥ 0).
  - Ganha: o backup do Sérgio quase destravado.
- **Paga (qualquer opção):** quem ajuda soma o seu Risco ao do Caio, e os outros dois
  perdem Conf −1 por terem sido deixados de lado.
- Quem tiver Conf < 0 aparece na tela como opção riscada.

### Dia 21 · O celular de Sérgio
**Acontece:**
- O backup abre. Sérgio filmou a viatura chegando e um homem **mancando**: Brito.
- Ao fundo, uma voz no viva-voz diz: *"Sem testemunha."*

**Voto: o que fazer com o vídeo do Sérgio?**
- **A · Ir atrás do Brito.**
  - Ganha: localiza a casa dele (Ev +1).
  - Paga: Ri +2.
- **B · Entregar à Helena.**
  - Ganha: Ev +1, oficial.
  - Paga: se Conf H ≤ 0, Helena guarda o vídeo na gaveta, e Caio só descobre no dia 24.
- **C · Lia publica já.**
  - Ganha: Ri −2, porque o país inteiro está olhando.
  - Paga: Saraiva queima provas (Ev −1) e antecipa o ataque do dia 25.

### Dia 22 · Boné virado ⭐ PILAR
**Acontece:** a verdade do Jairo: **ele dirigiu a viatura**. Não sabia que alguém
ia morrer.

**Variantes:**
- Conf J ≥ 1: Jairo confessa sozinho, na chuva.
- Conf J ≤ 0: Caio o pega entregando as chaves da viatura ao Brito e eles brigam
  (a briga aparece em sombra na parede).

**Voto: o que fazer com o Jairo?**
- **A · Perdoar e fazer dele testemunha.**
  - Ganha: `flag: jairo_testemunha` (Ev +2).
  - Paga: Jairo vira alvo número 1 (Ri +1).
- **B · Entregá-lo à Helena.**
  - Ganha: justiça imediata e Conf H +1.
  - Paga: Jairo é preso, e na prisão a Lista chega nele. Se Ri ≥ 4, é o custo 3 adiantado.
- **C · Deixá-lo ir em troca do endereço do dinheiro.**
  - Ganha: o galpão do porto (`flag: sabe_galpao`).
  - Paga: Jairo some, e é uma testemunha a menos.

### Dia 23 · A conta da Bia
**Acontece:** Saraiva corta o dinheiro do tratamento da Bia para trazer Jairo de
volta (ou para fazê-lo voltar a falar, se ele estiver preso).

**Voto: e a Bia?**
- **A · Lia organiza uma vaquinha pública.**
  - Ganha: Conf J +2 (Jairo fica do lado do Caio de vez).
  - Paga: expõe a família (Ri +1).
- **B · Pressionar o Jairo: "É a sua chance de consertar."**
  - Ganha: depoimento mais rápido (Ev +1).
  - Paga: Conf J −1.
- **C · Esconder o Jairo e a Bia na casa do Ernesto.**
  - Ganha: os dois ficam seguros (Ri −1).
  - Paga: perde um dia, e se `ernesto_testemunha`, junta todos os alvos num lugar só.

---

## SEMANA 4 · Dias 24 a 31 · "A conta"
*A rede revida e cada aliado precisa escolher um lado.*

### Dia 24 · Helena escolhe
**Acontece:** Saraiva oferece à Helena manter a UCE viva se ela entregar o Caio.
Ela o chama para uma conversa.

**Voto: o que o Caio conta para a Helena?**
- **A · Tudo.**
  - Ganha: se Conf H ≥ 1, Helena fica do lado dele de vez (`flag: helena_aliada`, Ev +1).
  - Paga: se Conf H ≤ 0, ela o entrega (Ri +2).
- **B · Nada.**
  - Ganha: está protegido.
  - Paga: Helena fica neutra, e Conf H não sobe mais.
- **C · Uma meia-verdade, para testar.**
  - Ganha: se ela não vazar, Conf H +1.
  - Paga: se vazar, Ri +1. Nos dois casos Caio descobre quem ela é.

### Dia 25 · Invasão ⭐ PILAR
**Acontece:**
- O apartamento da Lia é invadido de madrugada.
- Se Ri ≥ 4, Lia é ferida (custo 2). Se não, ela escapa pela janela.
- O HD do backup é levado. Só sobra a cópia do Caio, se `copia_segura`.

**Voto: o que fazer?**
- **A · Ir proteger a Lia.**
  - Ganha: Conf L +2.
  - Paga: perde a pista dos invasores.
- **B · Seguir os invasores.**
  - Ganha: eles levam ao galpão (`flag: sabe_galpao`, Ev +2).
  - Paga: Lia fica sozinha (Conf L −1).
- **C · Chamar a Helena.**
  - Ganha: viatura oficial na porta e flagrante parcial (Ev +1). Precisa de `helena_aliada`.
  - Paga: sem ela, quem chega é a Corregedoria (Ri +1).

### Dia 26 · O galpão
**Acontece:**
- Caio chega ao galpão do porto: pelo `sabe_galpao`, pela terra no pneu do dia 6,
  ou por eliminação.
- Pela fresta vê as caixas do cofre e o lacre do Fórum.

**Voto: o que fazer no galpão?**
- **A · Entrar já.**
  - Ganha: fotografa o dinheiro e os lacres (Ev +2).
  - Paga: é visto saindo (Ri +2).
- **B · Vigiar de fora e esperar.**
  - Ganha: vê Brito e mais dois chegarem (Ev +1, identifica os outros de farda).
  - Paga: perde um dia de prazo.
- **C · Avisar a PF.**
  - Ganha: tudo fica oficial.
  - Paga: se a PF demora, o dinheiro é removido na madrugada (Ev −1) e Saraiva sabe que Caio sabe.

### Dia 27 · A oferta ⭐ PILAR
**Acontece:**
- Saraiva encontra Caio pessoalmente, perfeitamente imóvel.
- A oferta: o nome do pai limpo, as acusações retiradas e uma promoção. Em troca,
  todas as cópias. *"Você tem até amanhã."*
- Ele revela que foi ele quem aprovou a transferência do Caio.

**Voto: a resposta para Saraiva**
- **A · Aceitar.**
  - Ganha: Ca volta a 3, o pai é reabilitado e o risco cai a 0.
  - Paga: leva ao **Final Sombra**, a menos que um aliado (Conf ≥ 2) desobedeça no dia 29.
- **B · Recusar.**
  - Ganha: mantém a integridade.
  - Paga: Ri vai a 5 (custo no dia 28).
- **C · Fingir que aceita e gravar.**
  - Ganha: Ev +3 se houver um aliado com o equipamento (Lia ou Helena com Conf ≥ 1).
  - Paga: Ri +2, e sem aliado a gravação falha.

### Dia 28 · Brito
**Acontece:** Brito vem atrás do Caio. Fuga pelos telhados, em silhueta contra a
cidade. A perna rígida dele é a vantagem do Caio.

**Voto: como escapar do Brito?**
- **A · Enfrentar.**
  - Ganha: se vencer, o celular do Brito traz as mensagens com o Saraiva (Ev +2).
  - Paga: Caio sai ferido e entra no dia 29 mancando também.
- **B · Fugir para o galpão.**
  - Ganha: chega antes de todo mundo.
  - Paga: leva Brito junto.
- **C · Se render para ganhar tempo para os aliados.**
  - Ganha: os aliados com Conf ≥ 1 agem sem ele.
  - Paga: Caio passa o dia 29 preso, e o clímax é dos outros.

### Dia 29 · A noite do galpão ⭐ PILAR · CLÍMAX
**Acontece:**
- Todos no galpão. Saraiva aparece pessoalmente.
- O aliado de maior Conf chega na hora H. Se `jairo_testemunha`, é o Jairo que se
  põe entre Caio e Brito.
- **Moura está vivo**, escondido ali como "garantia" da Lista.

**Voto: o que fazer com o Saraiva ali?**
- **A · Prender o Saraiva ali mesmo.**
  - Ganha: flagrante com o dinheiro (Ev +2).
  - Paga: se Ri = 5, alguém não sai do galpão (o custo pendente é pago aqui).
- **B · Filmar e sair com o Moura.**
  - Ganha: testemunha viva (Ev +2).
  - Paga: Saraiva escapa até o dia 31.
- **C · Tirar o dinheiro do lugar.**
  - Ganha: tira o poder de barganha da Lista.
  - Paga: Caio vira réu por mover prova (Ca −1). É o caminho mais perigoso para o final.

### Dia 30 · Para quem contar
**Acontece:** Caio tem as provas, ou parte delas, e um dia de prazo.

**Voto: para quem contar? (é a última escolha da temporada)**
- **A · Audiência oficial, levada pela Helena à Justiça e à PF.**
  - Ganha: o caminho que pune de verdade. Precisa de `helena_aliada`.
  - Paga: a gravação ilegal (`gravacao_ilegal`) é anulada (Ev −2).
- **B · Lia transmite ao vivo, com todos os vídeos.**
  - Ganha: impossível de enterrar.
  - Paga: provas expostas antes do processo; a defesa da Lista usa isso (Ev −1).
- **C · Ernesto e Jairo depõem juntos.**
  - Ganha: testemunhas humanas e o nome do pai dito em público.
  - Paga: precisa de `ernesto_testemunha` e `jairo_testemunha`. Faltando uma, Ev −2.

### Dia 31 · Trinta e um ⭐ PILAR · FINAL
**Acontece:** o prazo vence. O final é escolhido pelos medidores, não por um voto.

| Final | Condição | O que acontece |
|---|---|---|
| **Luz** | Ev ≥ 8, Ca ≥ 1, dois ou mais aliados com Conf ≥ 1, e não aceitou a oferta (ou ela foi revertida) | A Lista é exposta e Saraiva é preso. A UCE não é extinta. Caio recebe o distintivo de volta. Último quadro: o cordão brilha de novo. |
| **Sombra** | Aceitou a oferta no dia 27, ou Ev < 5 | A verdade é enterrada. Caio é promovido e o pai reabilitado. Último quadro: Caio no quarto, o monitor apaga e alguém bate à porta, que é a Lia. |
| **Queda** | Qualquer outro caso | A verdade sai, mas Caio paga: é expulso (Ca 0) ou perde alguém (custo 3). Saraiva cai, mas a Lista não morre. |

**Último voto (gancho da temporada 2): "O Caio volta para a polícia?"**
- **A · Sim.**
- **B · Não.**
