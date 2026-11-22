# Substituto mínimo do pacote "srt": o vosk só o usa em SrtResult, que não é chamado aqui.
class Subtitle:
    def __init__(self, **kw): self.__dict__.update(kw)
def compose(subs): raise NotImplementedError("srt stub")
