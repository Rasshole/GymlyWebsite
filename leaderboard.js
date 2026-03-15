/**
 * Gymly Leaderboard – premium rangliste med Gymly Score
 * Mock data for venner, lokal, global × uge, måned, all time
 */
(function() {
  var CURRENT_USER_ID = 'patrick';

  function gymlyScore(u) {
    return Math.round(
      (u.checkins || 0) * 10 +
      (u.streak || 0) * 3 +
      (u.minutes || 0) * 0.2 +
      (u.groupActivity || 0) * 5 +
      (u.badges || 0) * 15
    );
  }

  function buildUser(id, name, initials, city, gym, checkins, streak, minutes, groupActivity, topBadge) {
    var u = {
      id: id,
      name: name,
      initials: initials,
      city: city,
      gym: gym,
      checkins: checkins,
      streak: streak,
      minutes: minutes,
      groupActivity: groupActivity || 0,
      topBadge: topBadge || null
    };
    u.badges = topBadge ? 1 : 0;
    u.score = gymlyScore(u);
    return u;
  }

  var DATA = {
    friends: {
      week: [
        buildUser('mia', 'Mia', 'M', 'København', 'PureGym Fields', 18, 14, 420, 3, 'Elite'),
        buildUser('lars', 'Lars', 'L', 'København', 'SATS Adelgade', 16, 7, 380, 2, 'Silver Flame'),
        buildUser('sofia', 'Sofia', 'S', 'København', 'Urban Gym', 15, 5, 360, 2, 'Bronze Beast'),
        buildUser('jonas', 'Jonas', 'J', 'København', 'Fitness World Nørrebro', 14, 3, 320, 1),
        buildUser('alex', 'Alex', 'A', 'København', 'SATS Valby', 13, 4, 290, 1),
        buildUser('freja', 'Freja', 'F', 'København', 'PureGym Lygten', 12, 2, 260, 0),
        buildUser('lucas', 'Lucas', 'L', 'København', 'Fitness World Østerbro', 11, 1, 240, 0),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 12, 5, 280, 1),
        buildUser('emil', 'Emil', 'E', 'København', 'Urban Gym', 10, 3, 220, 0),
        buildUser('sara', 'Sara', 'S', 'København', 'PureGym Fields', 9, 2, 180, 0)
      ],
      month: [
        buildUser('mia', 'Mia', 'M', 'København', 'PureGym Fields', 42, 21, 980, 8, 'Elite'),
        buildUser('lars', 'Lars', 'L', 'København', 'SATS Adelgade', 38, 14, 890, 6, 'Silver Flame'),
        buildUser('sofia', 'Sofia', 'S', 'København', 'Urban Gym', 35, 12, 820, 5, 'Bronze Beast'),
        buildUser('jonas', 'Jonas', 'J', 'København', 'Fitness World Nørrebro', 32, 10, 750, 4),
        buildUser('alex', 'Alex', 'A', 'København', 'SATS Valby', 30, 8, 680, 3),
        buildUser('freja', 'Freja', 'F', 'København', 'PureGym Lygten', 28, 7, 620, 2),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 26, 6, 580, 2),
        buildUser('lucas', 'Lucas', 'L', 'København', 'Fitness World Østerbro', 24, 5, 540, 1),
        buildUser('emil', 'Emil', 'E', 'København', 'Urban Gym', 22, 4, 480, 1),
        buildUser('sara', 'Sara', 'S', 'København', 'PureGym Fields', 20, 3, 420, 0)
      ],
      all: [
        buildUser('mia', 'Mia', 'M', 'København', 'PureGym Fields', 156, 42, 3840, 25, 'Elite'),
        buildUser('lars', 'Lars', 'L', 'København', 'SATS Adelgade', 142, 38, 3520, 22, 'Silver Flame'),
        buildUser('sofia', 'Sofia', 'S', 'København', 'Urban Gym', 128, 35, 3180, 18, 'Bronze Beast'),
        buildUser('jonas', 'Jonas', 'J', 'København', 'Fitness World Nørrebro', 115, 28, 2850, 15),
        buildUser('alex', 'Alex', 'A', 'København', 'SATS Valby', 98, 22, 2420, 12),
        buildUser('freja', 'Freja', 'F', 'København', 'PureGym Lygten', 86, 18, 2100, 10),
        buildUser('lucas', 'Lucas', 'L', 'København', 'Fitness World Østerbro', 74, 14, 1780, 8),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 68, 12, 1620, 6),
        buildUser('emil', 'Emil', 'E', 'København', 'Urban Gym', 58, 10, 1420, 5),
        buildUser('sara', 'Sara', 'S', 'København', 'PureGym Fields', 45, 7, 1120, 3)
      ]
    },
    local: {
      week: [
        buildUser('thomas', 'Thomas', 'T', 'København', 'SATS Frederiksberg', 20, 12, 480, 4, 'Elite'),
        buildUser('anna', 'Anna', 'A', 'København', 'Fitness World Østerbro', 19, 10, 450, 3, 'Silver Flame'),
        buildUser('mads', 'Mads', 'M', 'København', 'Fitness World Nørrebro', 17, 8, 410, 3, 'Bronze Beast'),
        buildUser('mia', 'Mia', 'M', 'København', 'PureGym Fields', 18, 14, 420, 3),
        buildUser('lars', 'Lars', 'L', 'København', 'SATS Adelgade', 16, 7, 380, 2),
        buildUser('emma', 'Emma', 'E', 'København', 'Urban Gym', 15, 6, 350, 2),
        buildUser('sofia', 'Sofia', 'S', 'København', 'Urban Gym', 15, 5, 360, 2),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 12, 5, 280, 1),
        buildUser('jonas', 'Jonas', 'J', 'København', 'Fitness World Nørrebro', 14, 3, 320, 1),
        buildUser('oliver', 'Oliver', 'O', 'København', 'PureGym Lygten', 11, 4, 260, 0)
      ],
      month: [
        buildUser('thomas', 'Thomas', 'T', 'København', 'SATS Frederiksberg', 48, 28, 1120, 12, 'Elite'),
        buildUser('anna', 'Anna', 'A', 'København', 'Fitness World Østerbro', 45, 25, 1050, 11, 'Silver Flame'),
        buildUser('mads', 'Mads', 'M', 'København', 'Fitness World Nørrebro', 42, 22, 980, 10, 'Bronze Beast'),
        buildUser('mia', 'Mia', 'M', 'København', 'PureGym Fields', 42, 21, 980, 8),
        buildUser('lars', 'Lars', 'L', 'København', 'SATS Adelgade', 38, 14, 890, 6),
        buildUser('emma', 'Emma', 'E', 'København', 'Urban Gym', 36, 12, 840, 5),
        buildUser('sofia', 'Sofia', 'S', 'København', 'Urban Gym', 35, 12, 820, 5),
        buildUser('jonas', 'Jonas', 'J', 'København', 'Fitness World Nørrebro', 32, 10, 750, 4),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 26, 6, 580, 2),
        buildUser('oliver', 'Oliver', 'O', 'København', 'PureGym Lygten', 24, 5, 540, 1)
      ],
      all: [
        buildUser('thomas', 'Thomas', 'T', 'København', 'SATS Frederiksberg', 185, 52, 4420, 35, 'Elite'),
        buildUser('anna', 'Anna', 'A', 'København', 'Fitness World Østerbro', 172, 48, 4080, 32, 'Silver Flame'),
        buildUser('mads', 'Mads', 'M', 'København', 'Fitness World Nørrebro', 158, 42, 3720, 28, 'Bronze Beast'),
        buildUser('mia', 'Mia', 'M', 'København', 'PureGym Fields', 156, 42, 3840, 25),
        buildUser('lars', 'Lars', 'L', 'København', 'SATS Adelgade', 142, 38, 3520, 22),
        buildUser('emma', 'Emma', 'E', 'København', 'Urban Gym', 128, 35, 3180, 18),
        buildUser('sofia', 'Sofia', 'S', 'København', 'Urban Gym', 128, 35, 3180, 18),
        buildUser('jonas', 'Jonas', 'J', 'København', 'Fitness World Nørrebro', 115, 28, 2850, 15),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 68, 12, 1620, 6),
        buildUser('oliver', 'Oliver', 'O', 'København', 'PureGym Lygten', 62, 10, 1480, 5)
      ]
    },
    global: {
      week: [
        buildUser('niko', 'Niko', 'N', 'Helsinki', 'Fitness24Seven', 22, 18, 520, 5, 'Elite'),
        buildUser('lena', 'Lena', 'L', 'Berlin', 'McFit', 21, 16, 490, 4, 'Silver Flame'),
        buildUser('viktor', 'Viktor', 'V', 'Stockholm', 'SATSE', 20, 14, 460, 4, 'Bronze Beast'),
        buildUser('zara', 'Zara', 'Z', 'Oslo', 'SATS', 19, 12, 440, 3),
        buildUser('marco', 'Marco', 'M', 'Milan', 'Virgin Active', 18, 11, 410, 3),
        buildUser('yuki', 'Yuki', 'Y', 'Tokyo', 'Anytime Fitness', 17, 10, 390, 2),
        buildUser('sophie', 'Sophie', 'S', 'Paris', 'Basic Fit', 16, 9, 370, 2),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 12, 5, 280, 1),
        buildUser('david', 'David', 'D', 'London', 'PureGym', 15, 8, 350, 2),
        buildUser('julia', 'Julia', 'J', 'Amsterdam', 'TrainMore', 14, 7, 330, 1)
      ],
      month: [
        buildUser('niko', 'Niko', 'N', 'Helsinki', 'Fitness24Seven', 52, 28, 1240, 14, 'Elite'),
        buildUser('lena', 'Lena', 'L', 'Berlin', 'McFit', 48, 25, 1150, 12, 'Silver Flame'),
        buildUser('viktor', 'Viktor', 'V', 'Stockholm', 'SATSE', 45, 22, 1080, 11, 'Bronze Beast'),
        buildUser('zara', 'Zara', 'Z', 'Oslo', 'SATS', 42, 20, 980, 9),
        buildUser('marco', 'Marco', 'M', 'Milan', 'Virgin Active', 40, 18, 920, 8),
        buildUser('yuki', 'Yuki', 'Y', 'Tokyo', 'Anytime Fitness', 38, 16, 880, 7),
        buildUser('sophie', 'Sophie', 'S', 'Paris', 'Basic Fit', 36, 14, 840, 6),
        buildUser('david', 'David', 'D', 'London', 'PureGym', 34, 12, 780, 5),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 26, 6, 580, 2),
        buildUser('julia', 'Julia', 'J', 'Amsterdam', 'TrainMore', 32, 10, 720, 4)
      ],
      all: [
        buildUser('niko', 'Niko', 'N', 'Helsinki', 'Fitness24Seven', 212, 65, 5120, 48, 'Elite'),
        buildUser('lena', 'Lena', 'L', 'Berlin', 'McFit', 198, 58, 4780, 42, 'Silver Flame'),
        buildUser('viktor', 'Viktor', 'V', 'Stockholm', 'SATSE', 185, 52, 4450, 38, 'Bronze Beast'),
        buildUser('zara', 'Zara', 'Z', 'Oslo', 'SATS', 172, 48, 4120, 35),
        buildUser('marco', 'Marco', 'M', 'Milan', 'Virgin Active', 158, 42, 3780, 30),
        buildUser('yuki', 'Yuki', 'Y', 'Tokyo', 'Anytime Fitness', 145, 38, 3450, 26),
        buildUser('sophie', 'Sophie', 'S', 'Paris', 'Basic Fit', 132, 35, 3120, 22),
        buildUser('david', 'David', 'D', 'London', 'PureGym', 118, 28, 2780, 18),
        buildUser('julia', 'Julia', 'J', 'Amsterdam', 'TrainMore', 105, 25, 2450, 15),
        buildUser('patrick', 'Patrick', 'P', 'København', 'SATS KBH Valby', 68, 12, 1620, 6)
      ]
    }
  };

  var PERIOD_LABELS = { week: 'Denne uge', month: 'Denne måned', all: 'All time' };
  var SCOPE_LABELS = { friends: 'Venner', local: 'Lokal', global: 'Global' };

  var state = { tab: 'friends', filter: 'week', search: '' };

  function getData() {
    var list = DATA[state.tab][state.filter].slice();
    list.sort(function(a, b) { return b.score - a.score; });
    list.forEach(function(u, i) { u.rank = i + 1; });
    return list;
  }

  function filterAndSearch(list) {
    var q = state.search.toLowerCase().trim();
    if (!q) return list;
    return list.filter(function(u) {
      return u.name.toLowerCase().indexOf(q) >= 0 ||
             u.gym.toLowerCase().indexOf(q) >= 0 ||
             u.city.toLowerCase().indexOf(q) >= 0;
    });
  }

  function getMotivation(me, list) {
    var rank = me.rank;
    var next = list.find(function(u) { return u.rank === rank - 1; });
    var prev = list.find(function(u) { return u.rank === rank + 1; });
    if (next) {
      var diff = next.score - me.score;
      if (diff <= 50) return 'Du er tæt på at overhale ' + next.name + ' – bare ' + (diff <= 10 ? 'et par' : 'få') + ' point mere!';
      return 'Du mangler ' + diff + ' point for at overhale ' + next.name;
    }
    if (prev && rank <= 3) return 'Du er i top 3! Hold momentumet!';
    if (rank === 1) return 'Du er #1! Fantastisk arbejde!';
    if (rank <= 5) return '2 sessions mere og du er i top 3';
    return 'Hold consistency – hver træning tæller!';
  }

  function renderPodiumCard(user, rank) {
    var rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze';
    var badgeClass = rank === 1 ? 'elite' : rank === 2 ? 'silver-flame' : 'bronze-beast';
    var badge = rank === 1 ? 'Elite' : rank === 2 ? 'Silver Flame' : 'Bronze Beast';
    return '<div class="lb-podium-card rank-' + rank + '">' +
      '<div class="lb-podium-rank ' + rankClass + '">' + rank + '</div>' +
      '<div class="lb-podium-avatar">' + user.initials + '</div>' +
      '<div class="lb-podium-name">' + user.name + '</div>' +
      '<div class="lb-podium-gym">' + user.gym + '</div>' +
      '<div class="lb-podium-score">' + user.score + ' pts</div>' +
      '<span class="lb-podium-badge ' + badgeClass + '">' + badge + '</span>' +
    '</div>';
  }

  function renderRow(user, isCurrentUser) {
    var rankClass = user.rank <= 3 ? 'gold' : 'normal';
    if (user.rank === 2) rankClass = 'silver';
    if (user.rank === 3) rankClass = 'bronze';
    var rowClass = 'lb-row' + (isCurrentUser ? ' current-user' : '');
    var badgeHtml = user.topBadge ? '<span class="lb-row-badge">' + user.topBadge + '</span>' : '';
    return '<div class="' + rowClass + '" data-rank="' + user.rank + '">' +
      '<span class="lb-rank ' + rankClass + '">' + user.rank + '</span>' +
      '<div class="lb-row-user">' +
        '<div class="lb-avatar">' + user.initials + '</div>' +
        '<div>' +
          '<div class="lb-row-name">' + user.name + (badgeHtml ? ' ' + badgeHtml : '') + '</div>' +
          '<div class="lb-row-gym">' + user.gym + '</div>' +
        '</div>' +
      '</div>' +
      '<span class="lb-row-stat"><strong>' + user.checkins + '</strong></span>' +
      '<span class="lb-row-stat">🔥 <strong>' + user.streak + '</strong></span>' +
      '<span class="lb-row-stat"><strong>' + user.minutes + '</strong></span>' +
      '<span class="lb-row-score">' + user.score + '</span>' +
    '</div>';
  }

  function updateUserCard(me, filtered, fullList) {
    var card = document.getElementById('userCard');
    var meData = me || fullList.find(function(u) { return u.id === CURRENT_USER_ID; });
    if (!card || !meData) return;
    document.getElementById('userCardAvatar').textContent = meData.initials;
    if (me && filtered.some(function(u) { return u.id === me.id; })) {
      document.getElementById('userCardSub').textContent = 'Placering #' + me.rank + ' blandt ' + SCOPE_LABELS[state.tab].toLowerCase() + ' · ' + PERIOD_LABELS[state.filter];
      document.getElementById('userCardRank').textContent = '#' + me.rank;
      document.getElementById('userCardScore').textContent = me.score;
      document.getElementById('userCardCheckins').textContent = me.checkins;
      document.getElementById('userCardStreak').textContent = me.streak;
      document.getElementById('userCardMotivation').innerHTML = getMotivation(me, filtered);
    } else {
      document.getElementById('userCardSub').textContent = 'Du er ikke i denne liste · ' + SCOPE_LABELS[state.tab] + ' · ' + PERIOD_LABELS[state.filter];
      document.getElementById('userCardRank').textContent = '#' + (meData.rank || '-');
      document.getElementById('userCardScore').textContent = meData.score;
      document.getElementById('userCardCheckins').textContent = meData.checkins;
      document.getElementById('userCardStreak').textContent = meData.streak;
      document.getElementById('userCardMotivation').innerHTML = 'Tilpas søgning eller filter for at se din placering.';
    }
  }

  function render() {
    var list = getData();
    var filtered = filterAndSearch(list);
    var me = filtered.find(function(u) { return u.id === CURRENT_USER_ID; });
    var top3 = filtered.slice(0, 3);
    var rest = filtered.slice(3);

    var top3El = document.getElementById('top3');
    var listEl = document.getElementById('leaderboardList');
    var emptyEl = document.getElementById('emptyState');
    var headerEl = document.getElementById('listHeader');

    if (filtered.length === 0) {
      if (top3El) top3El.innerHTML = '';
      if (listEl) listEl.innerHTML = '';
      if (headerEl) headerEl.style.display = 'none';
      if (emptyEl) {
        emptyEl.style.display = 'block';
        document.getElementById('emptyTitle').textContent = state.search ? 'Ingen brugere fundet' : 'Der er endnu ingen aktivitet';
        document.getElementById('emptyText').textContent = state.search ? 'Prøv at ændre søgeordet eller filteret.' : 'Invitér venner og start ranglisten!';
      }
      updateUserCard(null, [], list);
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (headerEl) headerEl.style.display = 'grid';

    if (top3El) {
      top3El.innerHTML = top3.map(function(u, i) { return renderPodiumCard(u, i + 1); }).join('');
    }

    if (listEl) {
      listEl.innerHTML = rest.map(function(u) {
        return renderRow(u, u.id === CURRENT_USER_ID);
      }).join('');
    }

    updateUserCard(me, filtered, list);
  }

  function init() {
    document.getElementById('tabs').addEventListener('click', function(e) {
      var btn = e.target.closest('[data-tab]');
      if (!btn) return;
      this.querySelectorAll('.lb-tab').forEach(function(t) { t.classList.remove('active'); });
      btn.classList.add('active');
      state.tab = btn.getAttribute('data-tab');
      render();
    });

    document.getElementById('filters').addEventListener('click', function(e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      this.querySelectorAll('.lb-filter').forEach(function(f) { f.classList.remove('active'); });
      btn.classList.add('active');
      state.filter = btn.getAttribute('data-filter');
      render();
    });

    document.getElementById('search').addEventListener('input', function() {
      state.search = this.value;
      render();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
