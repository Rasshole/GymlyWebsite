# Gymly – deeplinks (iOS / web)

Denne fil ligger i **website-repoet**. Selve URL-scheme-håndtering skal implementeres i **iOS-appens** Xcode-projekt (eller Expo `app.config`).

## Hvad hjemmesiden gør

| Kontekst | Primær handling | Fallback |
|----------|-----------------|----------|
| **Mobil** (UA eller ≤768px) | `gymly://confirmed` ved tryk på **Åbn Gymly** | **iOS:** App Store-link · **Android/øvrigt:** `https://gymlyapp.com/download` |
| **Desktop** | Kun web: *Til forsiden* og *Download appen* – ingen custom scheme automatisk |

Hvis appskemaet eller path **ikke** matcher det appen registrerer, kan iOS stadig åbne “dialog” og derefter fejle med *“Something went wrong. The app could not be opened.”*

---

## 1. Xcode – URL scheme `gymly`

### Info.plist (URL Types)

Tilføj **URL Types** med:

- **URL Schemes:** `gymly` (uden `://`)

Eksempel (XML-indhold til reference):

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.gymly.app</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>gymly</string>
    </array>
  </dict>
</array>
```

- **Identifiers:** Brug dit rigtige bundle id i `CFBundleURLName`.

Efter tilføjelse skal **`gymly://confirmed`** (host/path `confirmed`) kunne parses af applink-håndteringen.

---

## 2. Expo (managed / prebuild)

I `app.json` eller `app.config.js`:

```json
{
  "expo": {
    "scheme": "gymly"
  }
}
```

Kør prebuild og tjek den genererede **Info.plist** for `CFBundleURLSchemes`.

Ekstra: `expo-linking` og `Linking.addEventListener('url', …)` (se nedenfor).

---

## 3. React Native – `Linking` / React Navigation

**Prefixes** skal inkludere custom scheme:

```javascript
const linking = {
  prefixes: ['gymly://'],
  config: {
    screens: {
      // Eksempel – tilpas til jeres navigator:
      Main: '',
      ConfirmSuccess: 'confirmed',
      Home: 'home',
    },
  },
};
```

Vigtigt: Webbens primære deeplink er **`gymly://confirmed`** → der skal være en **screen/route der matcher path `confirmed`** (eller et catch-all der parser URL’en og navigerer til Home/onboarding).

Tilpas også gerne aliases hvis I vil understøtte flere variationer ved app-start:

| URL | Forslag |
|-----|--------|
| `gymly://confirmed` | Efter email-bekræftelse (**bruges på websitet nu**) |
| `gymly://auth/success` | Valgfrit alias → samme som `confirmed` |
| `gymly://home` | Direkte til home (valgfrit) |

---

## 4. Lyttere (kold start og genåbning)

### React Native

```javascript
import { Linking, AppState } from 'react-native';

function handleUrl(url) {
  if (!url) return;
  // Parse url, naviger til Home / fortsæt onboarding efter bekræftelse
}

Linking.getInitialURL().then(handleUrl);

const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));

// AppState: nogle flows kræver refresh når app kommer tilbage i forgrunden
```

### SwiftUI (kun reference)

Implementer **`onOpenURL`** / **`scene(_:openURLContexts:)`** og dispatch til samme “handle deep link”-logik som `Linking` i RN.

---

## 5. “App kunne ikke åbnes” / Safari “forsøger hele tiden…”

Typiske årsager:

1. **`gymly` findes ikke** i **CFBundleURLSchemes**.
2. **Path mismatch:** Web sender `gymly://confirmed` men app kun håndterer fx `gymly://auth/confirmed` (ret enten web eller native – de skal være ens).
3. **App crasher ved launch** på den modtagne URL → iOS viser stadig systemfejl.
4. **Dobbelt navigation** til custom scheme (flere timers / iframes) → Safari klager over gentagne forsøg. Website bruger nu **én** `location.href` pr. tryk + debounce.

---

## 6. Testflow

1. Ren install af app med opdateret Info.plist.
2. Opret bruger → åbn bekræftelsesmail → **Safari** på `gymlyapp.com/confirm`.
3. Tryk **Åbn Gymly** → app starter → land på **Home** eller næste onboarding-trin (efter session).
4. App i forgrunden → åbn samme link igen → skal stadig håndtere URL uden crash.

---

## TestFlight

Brug samme **bundle id** og scheme som produktion, eller opdater websitets fallback til TestFlight-URL hvis I kun distribuerer der i en periode (pt. peger iOS-fallback til **App Store**).
