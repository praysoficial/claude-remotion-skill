F=[
("NARRADOR","Três dias com a porta aberta. E ninguém achou estranho."),
("ARTHUR","Diego. O celular dele tá aqui."),
("DIEGO","Celular de rico. Deve ter bateria."),
("VICTOR","Se alguém achar isso… não leva pra delegacia. Tem gente lá dentro que—"),
("DIEGO","…A gente é a delegacia, né?"),
("ARTHUR","É. Esse é o problema."),
("NARRADOR","Esse é o Arthur. Vinte e quatro anos, primeiro caso de verdade. E a primeira prova dele pede pra não chegar… na polícia."),
("MENDES","Victor Sales. Empresário sumido, família na imprensa. Vocês têm trinta e um dias."),
("ARTHUR","E depois?"),
("MENDES","Depois arquiva. Ordem de cima. O celular."),
("ARTHUR","Tá na perícia, eu ia—"),
("MENDES","Agora, Arthur."),
("NARRADOR","Trinta e um dias. Depois, caso fechado e provas sumidas. O celular, ele entregou. O áudio… já tinha copiado."),
("HELENA","Você copiou o áudio."),
("ARTHUR","Como é que você sabe?"),
("HELENA","Porque eu teria copiado. Apaga. Hoje."),
("ARTHUR","Você conhecia o Victor?"),
("NARRADOR","Ela não respondeu. Guarda essa."),
("NARRADOR","A única testemunha: o segurança do estacionamento. O Diego trouxe ele. Do jeito do Diego."),
("DIEGO","Três horas sem abrir a boca. Nem água ele pediu."),
("MENDES","Solta ele às dez. Não tem nada contra ele."),
("NARRADOR","Treze minutos. Duas jogadas."),
("DIEGO","Entra lá agora. Eu seguro a porta."),
("HELENA","Deixa ele sair. Quem tá com medo liga pra alguém."),
("NARRADOR","Interrogar: entrar agora, contra a ordem do Mendes. Pode sair com um nome, mas quem está por trás fica sabendo."),
("NARRADOR","Seguir: deixar ele sair e ir atrás. Pode descobrir pra quem ele trabalha, mas se for visto, perde a testemunha."),
("NARRADOR","Ele decide em treze minutos. Vocês, nos comentários. Escreve: interrogar… ou seguir."),
]
if __name__=="__main__":
    from collections import Counter
    t=0;c=Counter()
    for i,(q,s) in enumerate(F,1):
        n=len(s.replace('…',' ').replace('—',' ').split()); t+=n; c[q]+=n
        if i in (23,24,25,26): print(i,q,n)
    print(t,"palavras ~",round(t/2.6),"s de fala", dict(c))
