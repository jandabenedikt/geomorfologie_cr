# Geomorfologické členění Česka

Webová aplikace pro výuku zeměpisu: atlas a trénink místopisu geomorfologických jednotek Česka a jejich vrcholů. Obsah odpovídá tabulce ze sešitu: 3 provincie, 9 subprovincií, 45 jednotek a 34 vrcholů.

## Co umí

**Atlas.** Mapa Česka s jednotkami v barvách subprovincií. Kliknutím do mapy nebo do tabulky se zobrazí zařazení jednotky (provincie, subprovincie) a její vrcholy. Vrstvy lze zapínat: barvy, názvy, vrcholy, krajská města. Mapa se přibližuje kolečkem, tlačítky nebo dvěma prsty.

**Trénink.**
- Okruhy: provincie, subprovincie, jednotky, vrcholy.
- Úlohy: *Najdi na mapě*, *Co je vyznačeno?* (výběr ze 4 možností nebo napsání názvu), u vrcholů také *Ve které jednotce leží?*
- Výběr subprovincií a počtu otázek, vyhodnocení kola, procvičení chyb.
- Při psaní se nehlídá diakritika a drobné překlepy.
- Historie chyb se ukládá jen v prohlížeči daného zařízení (localStorage).

**Mobil a tablet.** Na úzké obrazovce zůstává mapa při scrollování nahoře a otázka je hned pod ní. Odpovědi jsou ve dvou sloupcích s velkými tlačítky. Klepnutí prstem těsně vedle hranice hledané jednotky se uzná jako správné. V atlasu se mapa přibližuje dvojím klepnutím nebo dvěma prsty a po výběru z tabulky se přiblíží na zvolenou jednotku. Na telefonu otočeném na šířku jsou mapa a panel vedle sebe. Názvy v mapě se nepřekrývají: zobrazí se ty, které se vejdou, a při přiblížení přibývají.

Aplikace je jeden soubor `index.html` bez serveru a bez instalace. Z internetu načítá jen písma z Google Fonts; bez nich funguje s náhradními písmy.

## Zveřejnění přes GitHub Pages

1. Nahrajte obsah této složky do nového repozitáře (např. `geomorfologie-cr`).
2. V repozitáři otevřete **Settings → Pages**.
3. V části *Build and deployment* zvolte **Deploy from a branch**, větev `main` a složku `/ (root)`, uložte.
4. Za minutu až dvě bude aplikace na adrese `https://<uživatel>.github.io/geomorfologie-cr/`.

Stačí i samotný `index.html`: otevře se dvojklikem v prohlížeči nebo jde nahrát do školního webu či Moodlu.

## Struktura

```
index.html                         hotová aplikace (sestavená, vše v jednom souboru)
build.js                           sestavení index.html a export dat
src/sablona.html                   HTML, CSS a JavaScript aplikace se zástupnými značkami
src/jednotky.js                    provincie, subprovincie, jednotky z tabulky a vrcholy
src/geometrie.txt                  hranice jednotek (zakódované, viz src/dekodovani.js)
src/dekodovani.js                  převod geometrie na souřadnice
src/popisky.js                     výpočet míst pro popisky v mapě
data/geomorfologicke-jednotky.geojson   hranice všech celků, subprovincií a použitých oblastí a podcelků
data/vrcholy.geojson               vrcholy z tabulky
```

## Úpravy

Seznam jednotek a vrcholů (názvy, výšky, souřadnice) je v `src/jednotky.js`, vzhled a chování aplikace v `src/sablona.html`. Po úpravě spusťte (potřeba je Node.js):

```
node build.js
```

Skript znovu vytvoří `index.html` a soubory v `data/`.

## Zdroje dat

- **Hranice jednotek:** Geomorfologické jednotky ČR, AOPK ČR, publikováno mapovou službou ČÚZK ([ags.cuzk.cz – GeomorfologickeJednotky](https://ags.cuzk.cz/arcgis/rest/services/GeomorfologickeJednotky/MapServer)). Staženo 13. 10. 2026, převedeno do WGS 84 a zjednodušeno (tolerance asi 300–400 m), proto se hranice sousedních jednotek místy nepatrně nekryjí.
- **Polohy vrcholů:** česká Wikipedie a Wikidata.
- **Krajská města:** Wikipedie / Wikidata.
- **Výšky vrcholů** jsou podle tabulky ze sešitu. Některé aktuální údaje se liší, např. Sněžka 1603 m, Lysá hora 1324 m, Velký Javor 1456 m.

## Poznámky k obsahu

- Většina jednotek jsou geomorfologické celky. Středočeská pahorkatina, Českomoravská vrchovina a Českobudějovická a Třeboňská pánev jsou oblasti, Žďárské vrchy a Oderské vrchy podcelky.
- Českomoravská vrchovina jako oblast zahrnuje i Železné hory a Žďárské vrchy, takže klik do nich se u ní počítá jako správný.
- Trosky leží podle mapy AOPK v Jičínské pahorkatině; v aplikaci jsou podle tabulky u Ralské pahorkatiny.
- Velký Javor (Großer Arber) leží v Německu, Velký Javorník na Slovensku.
