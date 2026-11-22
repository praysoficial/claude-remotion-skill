"""Gera o roteiro final e a lista de cenas do episódio 1 a partir da timeline REAL."""
import json, os
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
t = json.load(open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/timeline.json")))
DEST = os.path.join(RAIZ, "episodios/dentro-da-farda/ep01")
os.makedirs(DEST, exist_ok=True)

def tc(s):
    m, r = divmod(s, 60)
    return f"{int(m):02d}:{r:05.2f}"

ACAO = {
    "carro": ("Subsolo B2, noite", "Gancho sem vinheta: o feixe da lanterna do Arthur, agachado, varre a porta aberta do sedã do Victor; pisca-alerta vermelho; goteira. Ele acha o celular (a tela acende ciano), levanta e mostra ao Diego, que chega pela esquerda e se debruça no ombro dele. Play: close no celular (áudio não enviado, onda sincronizada à voz) → lembrança do Victor no carro, de gola alta, em tom ciano → a gravação corta no meio → 3 frames de preto → silêncio, só a goteira. Diego se endireita, mão na nuca; Arthur abaixa a cabeça."),
    "arthur": ("Subsolo B2 (fundo desfocado)", "Arthur de frente, iluminado de baixo pelo celular, câmera aproximando. Em 'na polícia' ele olha o celular; ao fundo, Diego levanta as mãos ('não vi nada'). Arthur guarda o celular."),
    "sala": ("Sala do Mendes", "Persiana com listras da luz da rua, abajur quente. Mendes sentado atrás da mesa (gravata), Arthur em pé à esquerda, de perfil. A pasta do caso desliza pela mesa. Em 'trinta e um dias' a câmera fecha no Mendes e entra o contador DIA 1/31. Arthur dá meio passo ('E depois?'). Mendes estende a mão. Arthur leva a mão ao bolso e trava. 'Agora, Arthur.' — a câmera fecha. Arthur entrega o celular; Mendes fecha a mão e guarda. Arthur sai e toca o bolso de trás: brilho ciano do próprio celular (a cópia)."),
    "corredor": ("Corredor da delegacia", "Perspectiva; à esquerda a sala de interrogatório (luz vermelha EM USO), à direita a SAÍDA (ciano). Helena encostada na parede, braços cruzados. Arthur entra pela direita e trava no meio do passo. Em 'Apaga.' ela aponta o bolso dele. Ela vira e anda; ele avança com a mão estendida ('Você conhecia o Victor?'). Ela para de costas. 2 s de silêncio, a lâmpada falha. Ela sai. A câmera fecha no Arthur, que murcha."),
    "testemunha": ("Corredor da delegacia", "Close na janela da sala de interrogatório: o segurança de capuz, imóvel. Abre para o corredor quando o Diego entra gesticulando. A porta do fundo (CHEFIA) abre: Mendes, pequeno na luz quente, manda soltar às dez; a porta fecha. Close no relógio digital 21:47. Volta: Arthur de frente no centro, Diego à esquerda apontando a sala de interrogatório, Helena entra pela direita e põe a mão no ombro dele, inclinando a cabeça para a saída."),
    "jogadas": ("Tela dividida: interrogatório (em cima) / rua (embaixo)", "Duas metades do mesmo tamanho e da mesma duração. INTERROGAR (vermelho, em cima): Arthur abre a porta, encara o segurança sentado; em 'quem está por trás' a persiana da janela se abre — alguém olha. SEGUIR (ciano, embaixo): o segurança fuma na calçada da delegacia; Arthur espia atrás do poste; um carro passa; em 'se for visto' o segurança vira para o lado dele. A metade inativa fica apagada."),
    "voto": ("Corredor da delegacia", "Arthur de frente entre a porta do interrogatório (vermelho) e a saída (ciano), com a pasta numa mão e a chave do carro na outra; pesa uma, pesa a outra, encara a câmera. Em 'Escreve' entra a cartela: INTERROGAR | SEGUIR, mesmo tamanho, mesma entrada, e 'Escreva nos comentários'. A imagem segura 3,2 s no voto. Fim."),
}

linhas = ["# DENTRO DA FARDA · Episódio 1 · Roteiro final (com tempos reais)", "",
          f"Duração: **{tc(t['duracao'])}** ({t['frames']} frames a 30 fps). Tempos medidos dos áudios do ElevenLabs; nada foi acelerado.", "",
          "Texto falado idêntico ao `ep01_roteiro_v2.md`. O que mudou na produção está em `relatorio.md`.", ""]
for c in t["cenas"]:
    lugar, acao = ACAO[c["id"]]
    linhas += [f"## {tc(c['ini'])}–{tc(c['fim'])} · {lugar}", "", acao, ""]
    for l in t["falas"]:
        if l["cena"] == c["id"]:
            linhas.append(f"- **{tc(l['ini'])}** · {l['id']} · **{l['quem']}**: {l['texto']}")
    linhas.append("")
open(os.path.join(DEST, "roteiro_final.md"), "w").write("\n".join(linhas))

cen = ["# DENTRO DA FARDA · Episódio 1 · Lista de cenas", "",
       "| # | Início | Fim | Duração | Lugar | Falas | Momentos marcados |", "|---|---|---|---|---|---|---|"]
M = t["marcas"]
for i, c in enumerate(t["cenas"], 1):
    ids = [l["id"] for l in t["falas"] if l["cena"] == c["id"]]
    marcas = [f"{k} {tc(v)}" for k, v in M.items() if c["ini"] <= v < c["fim"]]
    cen.append(f"| {i} | {tc(c['ini'])} | {tc(c['fim'])} | {c['fim'] - c['ini']:.1f} s | {ACAO[c['id']][0]} | {ids[0]}–{ids[-1]} | {', '.join(marcas)} |")
open(os.path.join(DEST, "lista_de_cenas.md"), "w").write("\n".join(cen) + "\n")
print("ok")
