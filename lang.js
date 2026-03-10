/**
 * Gymly – flersproget support (i18n)
 * Sæt sprog via setLanguage('da'), gemmes i localStorage, hele siden opdateres.
 */
(function() {
  var STORAGE_KEY = 'gymly_lang';
  var DEFAULT_LANG = 'da';

  var LANG_NAMES = {
    da: 'Dansk',
    en: 'English (US)',
    pl: 'Polski',
    de: 'Deutsch',
    sv: 'Svenska',
    no: 'Norsk',
    fr: 'Français',
    es: 'Español',
    it: 'Italiano',
    nl: 'Nederlands',
    pt: 'Português',
    fi: 'Suomi'
  };

  var t = {
    da: {
      nav: { home: 'Hjem', online: 'Online', checkin: 'Tjek ind', messages: 'Beskeder', profile: 'Profil', settings: 'Indstillinger', notifications: 'Notifikationer', download: 'Download', logout: 'Log ud' },
      footer: { privacy: 'Privatlivspolitik', terms: 'Vilkår og betingelser', collab: 'Samarbejde', support: 'Support', moreLangs: 'Flere sprog...' },
      home: { greeting: 'Hej, apple User! 👋', subtitle: 'Klar til at træne i dag?', friendsNow: 'Venner i gym lige nu', seeDetails: 'Tryk for at se flere detaljer', join: 'Deltag', suggested: 'Foreslåede venner', addFriend: 'Tilføj ven' },
      login: { title: 'Log på Gymly', emailPlaceholder: 'E-mail eller mobilnummer', passwordPlaceholder: 'Adgangskode', loginBtn: 'Log på', forgotPw: 'Glemt adgangskode?', signup: 'Opret ny konto', meta: 'Gymly – Dit fitness fælleskab', downloadApp: 'Download appen', heading1: 'Træn sammen med dem,', heading2: 'du kender.' },
      signup: { title: 'Opret konto', acceptTerms: 'Jeg accepterer Vilkår og betingelser og Privatlivspolitik' },
      support: { title: 'Support', intro: 'Har du brug for hjælp eller har du spørgsmål? Vi er her for dig. Kontakt os via telefon eller e-mail – vi svarer så hurtigt vi kan.', contact: 'Kontakt os', follow: 'Følg os', followDesc: 'Hold dig opdateret og følg os på de sociale medier.' },
      samarbejde: { title: 'Samarbejde', intro: 'Vil du samarbejde med Gymly? Udfyld formularen herunder, så vender vi tilbage til dig.' },
      checkin: { title: 'Tjek ind', yourCenter: 'Dit center', planTraining: 'Planlæg træning', swipeToCheckin: 'Swipe for at tjekke ind', soloTraining: 'Solo træning', soloDesc: 'Skjul denne træning for venner' },
      messages: { title: 'Beskeder', searchPlaceholder: 'Søg efter beskeder...', groupMessages: 'Gruppebeskeder', groupDesc: 'Chat med alle i gruppen – alle medlemmer kan skrive og deltage i samtalen.', privateMessages: 'Privat beskeder' },
      groups: { title: 'Grupper', myGroups: 'Mine Grupper', otherGroups: 'Andre Grupper', create: 'Opret' },
      common: { cancel: 'Annuller', save: 'Gem', close: 'Luk', back: 'Tilbage', search: 'Søg', loading: 'Indlæser...' },
      langModal: { title: 'Vælg sprog', chooseLanguage: 'Vælg dit foretrukne sprog' }
    },
    en: {
      nav: { home: 'Home', online: 'Online', checkin: 'Check in', messages: 'Messages', profile: 'Profile', settings: 'Settings', notifications: 'Notifications', download: 'Download', logout: 'Log out' },
      footer: { privacy: 'Privacy Policy', terms: 'Terms and Conditions', collab: 'Collaboration', support: 'Support', moreLangs: 'More languages...' },
      home: { greeting: 'Hej, apple User! 👋', subtitle: 'Ready to train today?', friendsNow: 'Friends at the gym now', seeDetails: 'Tap for more details', join: 'Join', suggested: 'Suggested friends', addFriend: 'Add friend' },
      login: { title: 'Log in to Gymly', emailPlaceholder: 'Email or phone number', passwordPlaceholder: 'Password', loginBtn: 'Log in', forgotPw: 'Forgot password?', signup: 'Create new account', meta: 'Gymly – Your fitness community', downloadApp: 'Download the app', heading1: 'Train together with', heading2: 'people you know.' },
      signup: { title: 'Create account', acceptTerms: 'I accept Terms and Conditions and Privacy Policy' },
      support: { title: 'Support', intro: 'Need help or have questions? We are here for you. Contact us by phone or email – we respond as soon as possible.', contact: 'Contact us', follow: 'Follow us', followDesc: 'Stay updated and follow us on social media.' },
      samarbejde: { title: 'Collaboration', intro: 'Want to collaborate with Gymly? Fill out the form below and we will get back to you.' },
      checkin: { title: 'Check in', yourCenter: 'Your center', planTraining: 'Plan training', swipeToCheckin: 'Swipe to check in', soloTraining: 'Solo training', soloDesc: 'Hide this workout from friends' },
      messages: { title: 'Messages', searchPlaceholder: 'Search messages...', groupMessages: 'Group messages', groupDesc: 'Chat with everyone in the group – all members can write and join the conversation.', privateMessages: 'Private messages' },
      groups: { title: 'Groups', myGroups: 'My Groups', otherGroups: 'Other Groups', create: 'Create' },
      common: { cancel: 'Cancel', save: 'Save', close: 'Close', back: 'Back', search: 'Search', loading: 'Loading...' },
      langModal: { title: 'Choose language', chooseLanguage: 'Select your preferred language' }
    },
    pl: {
      nav: { home: 'Strona główna', online: 'Online', checkin: 'Zamelduj się', messages: 'Wiadomości', profile: 'Profil', settings: 'Ustawienia', notifications: 'Powiadomienia', download: 'Pobierz', logout: 'Wyloguj' },
      footer: { privacy: 'Polityka prywatności', terms: 'Regulamin', collab: 'Współpraca', support: 'Wsparcie', moreLangs: 'Więcej języków...' },
      home: { greeting: 'Cześć, apple User! 👋', subtitle: 'Gotowy na trening dziś?', friendsNow: 'Znajomi na siłowni', seeDetails: 'Dotknij, aby zobaczyć więcej', join: 'Dołącz', suggested: 'Proponowani znajomi', addFriend: 'Dodaj znajomego' },
      login: { title: 'Zaloguj się do Gymly', emailPlaceholder: 'E-mail lub numer telefonu', passwordPlaceholder: 'Hasło', loginBtn: 'Zaloguj się', forgotPw: 'Zapomniałeś hasła?', signup: 'Utwórz konto', meta: 'Gymly – Twoja społeczność fitness', downloadApp: 'Pobierz aplikację', heading1: 'Trenuj razem z', heading2: 'ludźmi, których znasz.' },
      signup: { title: 'Utwórz konto', acceptTerms: 'Akceptuję Regulamin i Politykę prywatności' },
      support: { title: 'Wsparcie', intro: 'Potrzebujesz pomocy? Jesteśmy tutaj. Skontaktuj się z nami telefonicznie lub e-mailem.', contact: 'Skontaktuj się', follow: 'Obserwuj nas', followDesc: 'Bądź na bieżąco i obserwuj nas w mediach społecznościowych.' },
      samarbejde: { title: 'Współpraca', intro: 'Chcesz współpracować z Gymly? Wypełnij formularz poniżej.' },
      checkin: { title: 'Zamelduj się', yourCenter: 'Twoje centrum', planTraining: 'Zaplanuj trening', swipeToCheckin: 'Przesuń, aby się zamelduć', soloTraining: 'Trening solo', soloDesc: 'Ukryj ten trening przed znajomymi' },
      messages: { title: 'Wiadomości', searchPlaceholder: 'Szukaj wiadomości...', groupMessages: 'Wiadomości grupowe', groupDesc: 'Czatuj ze wszystkimi w grupie – wszyscy członkowie mogą pisać.', privateMessages: 'Wiadomości prywatne' },
      groups: { title: 'Grupy', myGroups: 'Moje grupy', otherGroups: 'Inne grupy', create: 'Utwórz' },
      common: { cancel: 'Anuluj', save: 'Zapisz', close: 'Zamknij', back: 'Wstecz', search: 'Szukaj', loading: 'Ładowanie...' },
      langModal: { title: 'Wybierz język', chooseLanguage: 'Wybierz preferowany język' }
    },
    de: {
      nav: { home: 'Startseite', online: 'Online', checkin: 'Einchecken', messages: 'Nachrichten', profile: 'Profil', settings: 'Einstellungen', notifications: 'Benachrichtigungen', download: 'Download', logout: 'Abmelden' },
      footer: { privacy: 'Datenschutz', terms: 'AGB', collab: 'Zusammenarbeit', support: 'Support', moreLangs: 'Weitere Sprachen...' },
      home: { greeting: 'Hallo, apple User! 👋', subtitle: 'Bereit zum Trainieren?', friendsNow: 'Freunde im Gym', seeDetails: 'Tippen für Details', join: 'Beitreten', suggested: 'Vorgeschlagene Freunde', addFriend: 'Freund hinzufügen' },
      login: { title: 'Bei Gymly anmelden', emailPlaceholder: 'E-Mail oder Handynummer', passwordPlaceholder: 'Passwort', loginBtn: 'Anmelden', forgotPw: 'Passwort vergessen?', signup: 'Konto erstellen', meta: 'Gymly – Deine Fitness-Community', downloadApp: 'App herunterladen', heading1: 'Trainiere mit', heading2: 'Menschen, die du kennst.' },
      signup: { title: 'Konto erstellen', acceptTerms: 'Ich akzeptiere AGB und Datenschutz' },
      support: { title: 'Support', intro: 'Brauchst du Hilfe? Wir sind für dich da. Kontaktiere uns per Telefon oder E-Mail.', contact: 'Kontakt', follow: 'Folge uns', followDesc: 'Bleib auf dem Laufenden und folge uns in den sozialen Medien.' },
      samarbejde: { title: 'Zusammenarbeit', intro: 'Möchtest du mit Gymly zusammenarbeiten? Fülle das Formular aus.' },
      checkin: { title: 'Einchecken', yourCenter: 'Dein Center', planTraining: 'Training planen', swipeToCheckin: 'Wischen zum Einchecken', soloTraining: 'Solo-Training', soloDesc: 'Dieses Training vor Freunden verbergen' },
      messages: { title: 'Nachrichten', searchPlaceholder: 'Nachrichten suchen...', groupMessages: 'Gruppennachrichten', groupDesc: 'Chatte mit allen in der Gruppe – alle Mitglieder können schreiben.', privateMessages: 'Private Nachrichten' },
      groups: { title: 'Gruppen', myGroups: 'Meine Gruppen', otherGroups: 'Andere Gruppen', create: 'Erstellen' },
      common: { cancel: 'Abbrechen', save: 'Speichern', close: 'Schließen', back: 'Zurück', search: 'Suchen', loading: 'Laden...' },
      langModal: { title: 'Sprache wählen', chooseLanguage: 'Wähle deine bevorzugte Sprache' }
    },
    sv: { nav: { home: 'Hem', online: 'Online', checkin: 'Checka in', messages: 'Meddelanden', profile: 'Profil', settings: 'Inställningar', notifications: 'Notiser', download: 'Ladda ner', logout: 'Logga ut' }, footer: { privacy: 'Integritetspolicy', terms: 'Villkor', collab: 'Samarbete', support: 'Support', moreLangs: 'Fler språk...' }, home: { greeting: 'Hej, apple User! 👋', subtitle: 'Redo att träna idag?', friendsNow: 'Vänner i gymmet', seeDetails: 'Tryck för mer', join: 'Delta', suggested: 'Föreslagna vänner', addFriend: 'Lägg till vän' }, login: { title: 'Logga in på Gymly', emailPlaceholder: 'E-post eller telefon', passwordPlaceholder: 'Lösenord', loginBtn: 'Logga in', forgotPw: 'Glömt lösenord?', signup: 'Skapa konto', meta: 'Gymly – Din fitnessgemenskap', downloadApp: 'Ladda ner appen', heading1: 'Träna tillsammans med', heading2: 'de du känner.' }, support: { title: 'Support', intro: 'Behöver du hjälp? Vi är här för dig.', contact: 'Kontakta oss', follow: 'Följ oss', followDesc: 'Håll dig uppdaterad.' }, samarbejde: { title: 'Samarbete', intro: 'Vill du samarbeta med Gymly?' }, checkin: { title: 'Checka in', yourCenter: 'Ditt center', planTraining: 'Planera träning', swipeToCheckin: 'Svep för att checka in', soloTraining: 'Solo-träning', soloDesc: 'Dölj denna träning för vänner' }, messages: { title: 'Meddelanden', searchPlaceholder: 'Sök meddelanden...', groupMessages: 'Gruppmeddelanden', groupDesc: 'Chatta med alla i gruppen.', privateMessages: 'Privata meddelanden' }, groups: { title: 'Grupper', myGroups: 'Mina grupper', otherGroups: 'Andra grupper', create: 'Skapa' }, common: { cancel: 'Avbryt', save: 'Spara', close: 'Stäng', back: 'Tillbaka', search: 'Sök', loading: 'Laddar...' }, langModal: { title: 'Välj språk', chooseLanguage: 'Välj ditt föredragna språk' } },
    no: { nav: { home: 'Hjem', online: 'Online', checkin: 'Sjekk inn', messages: 'Meldinger', profile: 'Profil', settings: 'Innstillinger', notifications: 'Varsler', download: 'Last ned', logout: 'Logg ut' }, footer: { privacy: 'Personvern', terms: 'Vilkår', collab: 'Samarbeid', support: 'Support', moreLangs: 'Flere språk...' }, home: { greeting: 'Hei, apple User! 👋', subtitle: 'Klar for trening i dag?', friendsNow: 'Venner på treningssenteret', seeDetails: 'Trykk for mer', join: 'Bli med', suggested: 'Foreslåtte venner', addFriend: 'Legg til venn' }, login: { title: 'Logg inn på Gymly', emailPlaceholder: 'E-post eller telefon', passwordPlaceholder: 'Passord', loginBtn: 'Logg inn', forgotPw: 'Glemt passord?', signup: 'Opprett konto', meta: 'Gymly – Ditt fitnessfellesskap', downloadApp: 'Last ned appen', heading1: 'Trene sammen med', heading2: 'de du kjenner.' }, support: { title: 'Support', intro: 'Trenger du hjelp? Vi er her for deg.', contact: 'Kontakt oss', follow: 'Følg oss', followDesc: 'Hold deg oppdatert.' }, samarbejde: { title: 'Samarbeid', intro: 'Vil du samarbeide med Gymly?' }, checkin: { title: 'Sjekk inn', yourCenter: 'Ditt senter', planTraining: 'Planlegg trening', swipeToCheckin: 'Sveip for å sjekke inn', soloTraining: 'Solo-trening', soloDesc: 'Skjul denne treningen for venner' }, messages: { title: 'Meldinger', searchPlaceholder: 'Søk meldinger...', groupMessages: 'Gruppemeldinger', groupDesc: 'Chat med alle i gruppen.', privateMessages: 'Private meldinger' }, groups: { title: 'Grupper', myGroups: 'Mine grupper', otherGroups: 'Andre grupper', create: 'Opprett' }, common: { cancel: 'Avbryt', save: 'Lagre', close: 'Lukk', back: 'Tilbake', search: 'Søk', loading: 'Laster...' }, langModal: { title: 'Velg språk', chooseLanguage: 'Velg foretrukket språk' } },
    fr: { nav: { home: 'Accueil', online: 'En ligne', checkin: 'Enregistrer', messages: 'Messages', profile: 'Profil', settings: 'Paramètres', notifications: 'Notifications', download: 'Télécharger', logout: 'Déconnexion' }, footer: { privacy: 'Confidentialité', terms: 'Conditions', collab: 'Collaboration', support: 'Support', moreLangs: 'Plus de langues...' }, home: { greeting: 'Salut, apple User! 👋', subtitle: 'Prêt à t\'entraîner?', friendsNow: 'Amis à la salle', seeDetails: 'Appuyer pour plus', join: 'Rejoindre', suggested: 'Amis suggérés', addFriend: 'Ajouter un ami' }, login: { title: 'Connexion à Gymly', emailPlaceholder: 'E-mail ou téléphone', passwordPlaceholder: 'Mot de passe', loginBtn: 'Connexion', forgotPw: 'Mot de passe oublié?', signup: 'Créer un compte', meta: 'Gymly – Ta communauté fitness', downloadApp: 'Télécharger l\'app', heading1: 'Entraîne-toi avec', heading2: 'les gens que tu connais.' }, support: { title: 'Support', intro: 'Besoin d\'aide? Nous sommes là.', contact: 'Contactez-nous', follow: 'Suivez-nous', followDesc: 'Restez informé.' }, samarbejde: { title: 'Collaboration', intro: 'Voulez-vous collaborer avec Gymly?' }, checkin: { title: 'Enregistrer', yourCenter: 'Ton centre', planTraining: 'Planifier l\'entraînement', swipeToCheckin: 'Glisser pour enregistrer', soloTraining: 'Entraînement solo', soloDesc: 'Cacher cet entraînement aux amis' }, messages: { title: 'Messages', searchPlaceholder: 'Rechercher...', groupMessages: 'Messages de groupe', groupDesc: 'Discutez avec tout le groupe.', privateMessages: 'Messages privés' }, groups: { title: 'Groupes', myGroups: 'Mes groupes', otherGroups: 'Autres groupes', create: 'Créer' }, common: { cancel: 'Annuler', save: 'Enregistrer', close: 'Fermer', back: 'Retour', search: 'Rechercher', loading: 'Chargement...' }, langModal: { title: 'Choisir la langue', chooseLanguage: 'Sélectionnez votre langue préférée' } },
    es: { nav: { home: 'Inicio', online: 'En línea', checkin: 'Registrarse', messages: 'Mensajes', profile: 'Perfil', settings: 'Ajustes', notifications: 'Notificaciones', download: 'Descargar', logout: 'Cerrar sesión' }, footer: { privacy: 'Privacidad', terms: 'Términos', collab: 'Colaboración', support: 'Soporte', moreLangs: 'Más idiomas...' }, home: { greeting: '¡Hola, apple User! 👋', subtitle: '¿Listo para entrenar?', friendsNow: 'Amigos en el gym', seeDetails: 'Toca para más', join: 'Unirse', suggested: 'Amigos sugeridos', addFriend: 'Añadir amigo' }, login: { title: 'Iniciar sesión en Gymly', emailPlaceholder: 'Email o teléfono', passwordPlaceholder: 'Contraseña', loginBtn: 'Iniciar sesión', forgotPw: '¿Olvidaste la contraseña?', signup: 'Crear cuenta', meta: 'Gymly – Tu comunidad fitness', downloadApp: 'Descargar la app', heading1: 'Entrena con', heading2: 'gente que conoces.' }, support: { title: 'Soporte', intro: '¿Necesitas ayuda? Estamos aquí.', contact: 'Contáctanos', follow: 'Síguenos', followDesc: 'Mantente actualizado.' }, samarbejde: { title: 'Colaboración', intro: '¿Quieres colaborar con Gymly?' }, checkin: { title: 'Registrarse', yourCenter: 'Tu centro', planTraining: 'Planificar entrenamiento', swipeToCheckin: 'Desliza para registrarte', soloTraining: 'Entrenamiento solo', soloDesc: 'Ocultar este entrenamiento a amigos' }, messages: { title: 'Mensajes', searchPlaceholder: 'Buscar mensajes...', groupMessages: 'Mensajes de grupo', groupDesc: 'Chatea con todo el grupo.', privateMessages: 'Mensajes privados' }, groups: { title: 'Grupos', myGroups: 'Mis grupos', otherGroups: 'Otros grupos', create: 'Crear' }, common: { cancel: 'Cancelar', save: 'Guardar', close: 'Cerrar', back: 'Atrás', search: 'Buscar', loading: 'Cargando...' }, langModal: { title: 'Elegir idioma', chooseLanguage: 'Selecciona tu idioma preferido' } },
    it: { nav: { home: 'Home', online: 'Online', checkin: 'Registrati', messages: 'Messaggi', profile: 'Profilo', settings: 'Impostazioni', notifications: 'Notifiche', download: 'Scarica', logout: 'Esci' }, footer: { privacy: 'Privacy', terms: 'Termini', collab: 'Collaborazione', support: 'Supporto', moreLangs: 'Altre lingue...' }, home: { greeting: 'Ciao, apple User! 👋', subtitle: 'Pronto ad allenarti?', friendsNow: 'Amici in palestra', seeDetails: 'Tocca per più', join: 'Partecipa', suggested: 'Amici suggeriti', addFriend: 'Aggiungi amico' }, login: { title: 'Accedi a Gymly', emailPlaceholder: 'Email o telefono', passwordPlaceholder: 'Password', loginBtn: 'Accedi', forgotPw: 'Password dimenticata?', signup: 'Crea account', meta: 'Gymly – La tua community fitness', downloadApp: 'Scarica l\'app', heading1: 'Allenati con', heading2: 'le persone che conosci.' }, support: { title: 'Supporto', intro: 'Serve aiuto? Siamo qui.', contact: 'Contattaci', follow: 'Seguici', followDesc: 'Resta aggiornato.' }, samarbejde: { title: 'Collaborazione', intro: 'Vuoi collaborare con Gymly?' }, checkin: { title: 'Registrati', yourCenter: 'Il tuo centro', planTraining: 'Pianifica allenamento', swipeToCheckin: 'Scorri per registrarti', soloTraining: 'Allenamento solo', soloDesc: 'Nascondi questo allenamento agli amici' }, messages: { title: 'Messaggi', searchPlaceholder: 'Cerca messaggi...', groupMessages: 'Messaggi di gruppo', groupDesc: 'Chatta con tutto il gruppo.', privateMessages: 'Messaggi privati' }, groups: { title: 'Gruppi', myGroups: 'I miei gruppi', otherGroups: 'Altri gruppi', create: 'Crea' }, common: { cancel: 'Annulla', save: 'Salva', close: 'Chiudi', back: 'Indietro', search: 'Cerca', loading: 'Caricamento...' }, langModal: { title: 'Scegli lingua', chooseLanguage: 'Seleziona la tua lingua preferita' } },
    nl: { nav: { home: 'Home', online: 'Online', checkin: 'Inchecken', messages: 'Berichten', profile: 'Profiel', settings: 'Instellingen', notifications: 'Meldingen', download: 'Downloaden', logout: 'Uitloggen' }, footer: { privacy: 'Privacy', terms: 'Voorwaarden', collab: 'Samenwerking', support: 'Support', moreLangs: 'Meer talen...' }, home: { greeting: 'Hallo, apple User! 👋', subtitle: 'Klaar om te trainen?', friendsNow: 'Vrienden in de sportschool', seeDetails: 'Tik voor meer', join: 'Deelnemen', suggested: 'Voorgestelde vrienden', addFriend: 'Vriend toevoegen' }, login: { title: 'Inloggen bij Gymly', emailPlaceholder: 'E-mail of telefoon', passwordPlaceholder: 'Wachtwoord', loginBtn: 'Inloggen', forgotPw: 'Wachtwoord vergeten?', signup: 'Account aanmaken', meta: 'Gymly – Jouw fitnesscommunity', downloadApp: 'App downloaden', heading1: 'Train samen met', heading2: 'mensen die je kent.' }, support: { title: 'Support', intro: 'Hulp nodig? We zijn er voor je.', contact: 'Neem contact op', follow: 'Volg ons', followDesc: 'Blijf op de hoogte.' }, samarbejde: { title: 'Samenwerking', intro: 'Wil je samenwerken met Gymly?' }, checkin: { title: 'Inchecken', yourCenter: 'Jouw centrum', planTraining: 'Training plannen', swipeToCheckin: 'Veeg om in te checken', soloTraining: 'Solo-training', soloDesc: 'Verberg deze training voor vrienden' }, messages: { title: 'Berichten', searchPlaceholder: 'Zoek berichten...', groupMessages: 'Groepsberichten', groupDesc: 'Chat met iedereen in de groep.', privateMessages: 'Privéberichten' }, groups: { title: 'Groepen', myGroups: 'Mijn groepen', otherGroups: 'Andere groepen', create: 'Aanmaken' }, common: { cancel: 'Annuleren', save: 'Opslaan', close: 'Sluiten', back: 'Terug', search: 'Zoeken', loading: 'Laden...' }, langModal: { title: 'Kies taal', chooseLanguage: 'Selecteer je voorkeurstaal' } },
    pt: { nav: { home: 'Início', online: 'Online', checkin: 'Registar', messages: 'Mensagens', profile: 'Perfil', settings: 'Definições', notifications: 'Notificações', download: 'Transferir', logout: 'Sair' }, footer: { privacy: 'Privacidade', terms: 'Termos', collab: 'Colaboração', support: 'Suporte', moreLangs: 'Mais idiomas...' }, home: { greeting: 'Olá, apple User! 👋', subtitle: 'Pronto para treinar?', friendsNow: 'Amigos no ginásio', seeDetails: 'Toque para mais', join: 'Participar', suggested: 'Amigos sugeridos', addFriend: 'Adicionar amigo' }, login: { title: 'Entrar no Gymly', emailPlaceholder: 'Email ou telefone', passwordPlaceholder: 'Palavra-passe', loginBtn: 'Entrar', forgotPw: 'Esqueceu a palavra-passe?', signup: 'Criar conta', meta: 'Gymly – A tua comunidade fitness', downloadApp: 'Transferir a app', heading1: 'Treina com', heading2: 'pessoas que conheces.' }, support: { title: 'Suporte', intro: 'Precisas de ajuda? Estamos aqui.', contact: 'Contacta-nos', follow: 'Segue-nos', followDesc: 'Mantém-te atualizado.' }, samarbejde: { title: 'Colaboração', intro: 'Queres colaborar com o Gymly?' }, checkin: { title: 'Registar', yourCenter: 'O teu centro', planTraining: 'Planear treino', swipeToCheckin: 'Desliza para te registares', soloTraining: 'Treino solo', soloDesc: 'Ocultar este treino dos amigos' }, messages: { title: 'Mensagens', searchPlaceholder: 'Pesquisar mensagens...', groupMessages: 'Mensagens de grupo', groupDesc: 'Conversa com todo o grupo.', privateMessages: 'Mensagens privadas' }, groups: { title: 'Grupos', myGroups: 'Os meus grupos', otherGroups: 'Outros grupos', create: 'Criar' }, common: { cancel: 'Cancelar', save: 'Guardar', close: 'Fechar', back: 'Voltar', search: 'Pesquisar', loading: 'A carregar...' }, langModal: { title: 'Escolher idioma', chooseLanguage: 'Seleciona o teu idioma preferido' } },
    fi: { nav: { home: 'Koti', online: 'Online', checkin: 'Kirjaudu', messages: 'Viestit', profile: 'Profiili', settings: 'Asetukset', notifications: 'Ilmoitukset', download: 'Lataa', logout: 'Kirjaudu ulos' }, footer: { privacy: 'Tietosuoja', terms: 'Ehdot', collab: 'Yhteistyö', support: 'Tuki', moreLangs: 'Lisää kieliä...' }, home: { greeting: 'Hei, apple User! 👋', subtitle: 'Valmis treenaamaan?', friendsNow: 'Ystävät salilla', seeDetails: 'Napauta lisätietoja', join: 'Liity', suggested: 'Ehdotetut ystävät', addFriend: 'Lisää ystävä' }, login: { title: 'Kirjaudu Gymlyyn', emailPlaceholder: 'Sähköposti tai puhelin', passwordPlaceholder: 'Salasana', loginBtn: 'Kirjaudu', forgotPw: 'Unohtuiko salasana?', signup: 'Luo tili', meta: 'Gymly – Fitness-yhteisösi', downloadApp: 'Lataa sovellus', heading1: 'Treenaa yhdessä', heading2: 'tuntemiesi kanssa.' }, support: { title: 'Tuki', intro: 'Tarvitsetko apua? Olemme täällä.', contact: 'Ota yhteyttä', follow: 'Seuraa meitä', followDesc: 'Pysy ajan tasalla.' }, samarbejde: { title: 'Yhteistyö', intro: 'Haluatko tehdä yhteistyötä Gymlyn kanssa?' }, checkin: { title: 'Kirjaudu', yourCenter: 'Keskustasi', planTraining: 'Suunnittele treeni', swipeToCheckin: 'Pyyhkäise kirjautuaksesi', soloTraining: 'Solo-treeni', soloDesc: 'Piilota tämä treeni ystäviltä' }, messages: { title: 'Viestit', searchPlaceholder: 'Hae viestejä...', groupMessages: 'Ryhmäviestit', groupDesc: 'Keskustele koko ryhmän kanssa.', privateMessages: 'Yksityisviestit' }, groups: { title: 'Ryhmät', myGroups: 'Omat ryhmät', otherGroups: 'Muut ryhmät', create: 'Luo' }, common: { cancel: 'Peruuta', save: 'Tallenna', close: 'Sulje', back: 'Takaisin', search: 'Hae', loading: 'Ladataan...' }, langModal: { title: 'Valitse kieli', chooseLanguage: 'Valitse haluamasi kieli' } }
  };

  function getLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored && t[stored] ? stored : DEFAULT_LANG;
    } catch (e) { return DEFAULT_LANG; }
  }

  function setLang(code) {
    if (!t[code]) code = DEFAULT_LANG;
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
    document.documentElement.lang = code;
    window.location.reload();
  }

  function tr(path) {
    var lang = getLang();
    var obj = t[lang] || t[DEFAULT_LANG];
    var parts = path.split('.');
    for (var i = 0; i < parts.length && obj; i++) obj = obj[parts[i]];
    return (typeof obj === 'string') ? obj : path;
  }

  function apply() {
    var lang = getLang();
    document.documentElement.lang = lang;
    var langVal = document.getElementById('settingsLangValue');
    if (langVal && LANG_NAMES[lang]) langVal.textContent = LANG_NAMES[lang];
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var val = tr(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      el.placeholder = tr(el.getAttribute('data-i18n-placeholder'));
    });
  }

  function initLangLinks() {
    document.querySelectorAll('[data-lang]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        setLang(this.getAttribute('data-lang'));
      });
    });
    document.querySelectorAll('[data-lang-more]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        showLangModal();
      });
    });
  }

  function showLangModal() {
    var existing = document.getElementById('langModalBackdrop');
    if (existing) return;
    var backdrop = document.createElement('div');
    backdrop.id = 'langModalBackdrop';
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;';
    backdrop.onclick = function(e) { if (e.target === backdrop) closeModal(); };
    var box = document.createElement('div');
    box.style.cssText = 'background:white;border-radius:16px;padding:1.5rem;max-width:360px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.2);';
    box.onclick = function(e) { e.stopPropagation(); };
    var title = tr('langModal.title');
    box.innerHTML = '<h3 style="margin:0 0 1rem;font-size:1.25rem;font-weight:700;">' + title + '</h3><div id="langModalList" style="display:flex;flex-direction:column;gap:0.5rem;"></div>';
    var list = box.querySelector('#langModalList');
    Object.keys(LANG_NAMES).forEach(function(code) {
      var btn = document.createElement('button');
      btn.textContent = LANG_NAMES[code];
      btn.style.cssText = 'padding:0.75rem 1rem;text-align:left;border:1px solid #e0e0e0;border-radius:10px;background:white;cursor:pointer;font-size:1rem;transition:background 0.2s;';
      btn.onmouseover = function() { this.style.background = '#f5f5f5'; };
      btn.onmouseout = function() { this.style.background = 'white'; };
      btn.onclick = function() { setLang(code); };
      list.appendChild(btn);
    });
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);
    function closeModal() { backdrop.remove(); }
  }

  window.getLanguage = getLang;
  window.setLanguage = setLang;
  window.t = tr;
  window.LANG_NAMES = LANG_NAMES;
  window.showLangModal = showLangModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      apply();
      initLangLinks();
    });
  } else {
    apply();
    initLangLinks();
  }
})();
