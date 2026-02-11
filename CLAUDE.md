Ten projekt to gra typu Strategy RPG na platformę ForkArcade.

## SDK
SDK jest podpięty w index.html. Używaj:
- `ForkArcade.onReady(cb)` — start gry po połączeniu z platformą
- `ForkArcade.submitScore(score)` — wyślij wynik po zakończeniu bitwy/gry
- `ForkArcade.getPlayer()` — info o zalogowanym graczu

## Typ gry
Turowa strategia z jednostkami na gridzie lub w menu.
Gracz zarządza drużyną, prowadzi bitwy turowe, zdobywa XP i ekwipunek.

## Scoring
Score = (chapters_completed * 1000) + (enemies_killed * 10) + (units_survived * 500) - (turns_total * 5)

## Plik wejściowy
Cała logika gry w `game.js`. Renderowanie na `<canvas id="game">`.
