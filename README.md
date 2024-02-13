# Metrum.js

W pełni darmowy, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify**, **Deezer**, **SoundCloud**, oraz **800+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

## Pliki ukryte w folderze *.secret/* niezbędne do działania bota:

- 🍪 **cookies.json**:\
  Zgodnie z instrukcją pod [tym linkiem](https://distube.js.org/#/docs/DisTube/main/general/cookie).
    
- 🪪 **database.json**:\
  domyślnie pusta tablica, w której będą zapisywane dane dla konkretnych serwerów po ich ID

- 🗝️ **config.json**:\
  wszystkie domyślne ustawienia bota w wartościach `string`, zgodnie ze schematem:
  ```
  {
    "bot": { name, prefix, id, token, invite },
    "color": { error, primary, secondary },
    "website": { link, donate, opinion },
    "author": { name, nick id },
    "dev_guild_id"
  }
  ```
