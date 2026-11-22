# DENTRO DA FARDA · fluxo de produção de um episódio

1. **Vozes:** um arquivo por personagem (ElevenLabs), com as falas na ordem do episódio, em
   `public/dentro-da-farda/epNN/bruto/<personagem>.mp3`. As falas ficam em `falas_epNN.py`.
2. **Reconhecimento de fala (uma vez por ambiente):**
   ```bash
   pip install --no-deps vosk && pip install cffi tqdm requests websockets
   curl -LO https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip && unzip vosk-model-small-pt-0.3.zip
   export MODELO_VOSK=$PWD/vosk-model-small-pt-0.3
   export PYTHONPATH=$PWD/scripts/dentro-da-farda/py_stub   # o pacote "srt" não compila no Python 3.13; o vosk só o importa
   ```
   O host `alphacephei.com` precisa estar liberado na rede do ambiente.
3. **Separar as falas e marcar cada palavra:** `python3 scripts/dentro-da-farda/alinhar_vosk.py`.
   Ele avisa se alguma fala estiver AUSENTE na gravação.
4. **Timeline, trilha, efeitos, mixagem (−14 LUFS) e legendas:** `python3 scripts/dentro-da-farda/montar_timeline.py`.
5. **Conferir legenda × áudio:** `python3 scripts/dentro-da-farda/conferir_legendas.py`.
6. **Quadros soltos e storyboard:** `node scripts/dentro-da-farda/quadros.mjs <pasta> <segundos...>`.
7. **Render:** `npx remotion render src/index.ts DDF-Ep01 out/...mp4`, depois converter para `yuv420p` (ver relatório).

O `separar_falas.py` antigo (corte por tamanho) fica só como referência: ele não sabe o que é
dito e erra quando falta uma fala na gravação.
