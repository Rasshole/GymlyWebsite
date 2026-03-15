/**
 * Gymly Activity Feed – mock data og rendering
 */
(function() {
  var TYPES = {
    checkin: { label: 'Check-in', icon: '📍', scope: 'friend' },
    streak: { label: 'Streak', icon: '🔥', scope: 'friend' },
    workout: { label: 'Træning', icon: '⏱', scope: 'friend' },
    groupJoin: { label: 'Gruppe', icon: '👥', scope: 'group' },
    groupCreate: { label: 'Gruppe', icon: '➕', scope: 'group' },
    leaderboard: { label: 'Rangliste', icon: '🏆', scope: 'friend' },
    online: { label: 'Online', icon: '🟢', scope: 'friend' },
    badge: { label: 'Badge', icon: '🏅', scope: 'friend' },
    challenge: { label: 'Challenge', icon: '🎯', scope: 'friend' }
  };

  var MOCK_ACTIVITIES = [
    { id: 1, type: 'checkin', userName: 'Patrick', userInitials: 'P', gym: 'SATS Roskilde', city: 'Roskilde', timestamp: Date.now() - 2*60*1000, scope: 'friend' },
    { id: 2, type: 'streak', userName: 'Mia', userInitials: 'M', streak: 14, text: 'ramte 14 dages streak', timestamp: Date.now() - 14*60*1000, scope: 'friend' },
    { id: 3, type: 'workout', userName: 'Jonas', userInitials: 'J', minutes: 92, text: 'trænede ben i 92 min', gym: 'Fitness World Nørrebro', timestamp: Date.now() - 32*60*1000, scope: 'friend' },
    { id: 4, type: 'groupJoin', userName: 'Sara', userInitials: 'S', groupName: 'Copenhagen Cut Club', timestamp: Date.now() - 60*60*1000, scope: 'group' },
    { id: 5, type: 'leaderboard', userName: 'Emil', userInitials: 'E', rank: 3, text: 'rykkede op på #3 blandt venner', timestamp: Date.now() - 2*60*60*1000, scope: 'friend' },
    { id: 6, type: 'badge', userName: 'Freja', userInitials: 'F', badge: '30 Day Machine', text: 'unlocked "30 Day Machine"', timestamp: Date.now() - 3*60*60*1000, scope: 'friend' },
    { id: 7, type: 'online', userName: 'Alex', userInitials: 'A', gym: 'PureGym Vanløse', text: 'er online', timestamp: Date.now() - 5*60*1000, scope: 'friend' },
    { id: 8, type: 'checkin', userName: 'Lars', userInitials: 'L', gym: 'SATS Adelgade', city: 'København', timestamp: Date.now() - 8*60*1000, scope: 'friend' },
    { id: 9, type: 'groupCreate', userName: 'Lucas', userInitials: 'L', groupName: 'Weekend Warriors', timestamp: Date.now() - 24*60*60*1000, scope: 'group' },
    { id: 10, type: 'streak', userName: 'Sofia', userInitials: 'S', streak: 7, text: 'ramte 7 dages streak', timestamp: Date.now() - 48*60*60*1000, scope: 'friend' },
    { id: 11, type: 'checkin', userName: 'Marie', userInitials: 'M', gym: 'PureGym Lygten', city: 'København', timestamp: Date.now() - 18*60*1000, scope: 'friend' },
    { id: 12, type: 'workout', userName: 'Thomas', userInitials: 'T', minutes: 65, text: 'trænede bryst i 65 min', gym: 'SATS Frederiksberg', timestamp: Date.now() - 4*60*60*1000, scope: 'local' },
    { id: 13, type: 'challenge', userName: 'Anna', userInitials: 'A', text: 'fuldførte "10 check-ins på en uge"', timestamp: Date.now() - 72*60*60*1000, scope: 'friend' }
  ];

  function formatTime(ts) {
    var diff = Date.now() - ts;
    var min = Math.floor(diff / 60000);
    var hour = Math.floor(diff / 3600000);
    var day = Math.floor(diff / 86400000);
    if (min < 1) return 'Lige nu';
    if (min < 60) return min + ' min siden';
    if (hour < 24) return hour + ' time' + (hour > 1 ? 'r' : '') + ' siden';
    if (day < 2) return 'I går';
    if (day < 7) return 'For ' + day + ' dage siden';
    return 'For ' + Math.floor(day / 7) + ' uge' + (day >= 14 ? 'r' : '') + ' siden';
  }

  function getActivityText(a) {
    switch (a.type) {
      case 'checkin': return 'checkede ind';
      case 'streak': return a.text || 'ramte ' + a.streak + ' dages streak';
      case 'workout': return a.text || 'trænede i ' + a.minutes + ' min';
      case 'groupJoin': return 'joined "' + a.groupName + '"';
      case 'groupCreate': return 'oprettede gruppen "' + a.groupName + '"';
      case 'leaderboard': return a.text || 'rykkede op på #' + a.rank + ' blandt venner';
      case 'online': return 'er online';
      case 'badge': return a.text || 'unlocked "' + a.badge + '"';
      case 'challenge': return a.text || 'fuldførte en challenge';
      default: return '';
    }
  }

  function getSubtext(a) {
    if (a.gym) return a.gym;
    if (a.groupName && a.type === 'groupJoin') return '';
    if (a.groupName && a.type === 'groupCreate') return '';
    return '';
  }

  function filterData(list, typeFilter, timeFilter) {
    var out = list.slice();
    if (typeFilter && typeFilter !== 'all') {
      if (typeFilter === 'friends') out = out.filter(function(a) { return a.scope === 'friend'; });
      else if (typeFilter === 'groups') out = out.filter(function(a) { return a.scope === 'group'; });
      else if (typeFilter === 'local') out = out.filter(function(a) { return a.scope === 'local' || a.city; });
      else if (typeFilter === 'trending') out = out.filter(function(a) { return a.type === 'streak' || a.type === 'leaderboard' || a.type === 'badge'; });
    }
    if (timeFilter && timeFilter !== 'all') {
      var now = Date.now();
      if (timeFilter === 'today') out = out.filter(function(a) { return now - a.timestamp < 24*60*60*1000; });
      else if (timeFilter === 'week') out = out.filter(function(a) { return now - a.timestamp < 7*24*60*60*1000; });
    }
    out.sort(function(a, b) { return b.timestamp - a.timestamp; });
    return out;
  }

  function renderCard(a) {
    var meta = TYPES[a.type] || TYPES.checkin;
    var subText = getSubtext(a);
    var badge = '<span class="af-badge af-badge-' + a.type + '">' + meta.icon + ' ' + meta.label + '</span>';
    var subHtml = subText ? '<div class="af-sub">' + subText + '</div>' : '';
    return '<a href="profile.html?user=' + (a.userName || '').toLowerCase() + '" class="af-card af-card-' + a.type + '">' +
      '<div class="af-avatar">' + (a.userInitials || '?') + '</div>' +
      '<div class="af-body">' +
        '<div class="af-text"><strong>' + (a.userName || 'Bruger') + '</strong> ' + getActivityText(a) + '</div>' +
        subHtml +
        '<div class="af-meta">' + formatTime(a.timestamp) + ' · ' + badge + '</div>' +
      '</div>' +
    '</a>';
  }

  function renderEmpty(filter) {
    var msg = 'Ingen aktivitet endnu';
    var desc = 'Dine venner har ikke checket ind endnu.';
    if (filter === 'groups') { msg = 'Ingen gruppeaktivitet'; desc = 'Join en gruppe for at gøre feedet mere levende.'; }
    else if (filter === 'local') { msg = 'Ingen lokal aktivitet'; desc = 'Tjek ind i dit gym for at se andre i området.'; }
    return '<div class="af-empty">' +
      '<div class="af-empty-icon">📭</div>' +
      '<h3 class="af-empty-title">' + msg + '</h3>' +
      '<p class="af-empty-text">' + desc + '</p>' +
      '<div class="af-empty-actions">' +
        '<a href="online.html" class="btn-app-primary">Find venner</a>' +
        '<a href="create-group.html" class="btn-app-secondary">Opret gruppe</a>' +
        '<a href="checkin.html" class="btn-app-ghost">Lav dit første check-in</a>' +
      '</div>' +
    '</div>';
  }

  var state = { typeFilter: 'all', timeFilter: 'week' };

  function render() {
    var list = filterData(MOCK_ACTIVITIES, state.typeFilter, state.timeFilter);
    var container = document.getElementById('afFeed');
    var summary = document.getElementById('afSummary');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = renderEmpty(state.typeFilter);
    } else {
      container.innerHTML = list.map(renderCard).join('');
    }

    if (summary) {
      var today = MOCK_ACTIVITIES.filter(function(a) { return Date.now() - a.timestamp < 24*60*60*1000; });
      var friends = today.filter(function(a) { return a.scope === 'friend'; });
      var checkins = today.filter(function(a) { return a.type === 'checkin'; }).length;
      document.getElementById('afSummaryCount').textContent = today.length;
      document.getElementById('afSummaryFriends').textContent = new Set(friends.map(function(a) { return a.userName; })).size;
      document.getElementById('afSummaryCheckins').textContent = checkins;
    }
  }

  function init() {
    var typeChips = document.getElementById('afTypeFilters');
    var timeChips = document.getElementById('afTimeFilters');
    if (typeChips) {
      typeChips.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-filter]');
        if (!btn) return;
        typeChips.querySelectorAll('[data-filter]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.typeFilter = btn.getAttribute('data-filter');
        render();
      });
    }
    if (timeChips) {
      timeChips.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-filter]');
        if (!btn) return;
        timeChips.querySelectorAll('[data-filter]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.timeFilter = btn.getAttribute('data-filter');
        render();
      });
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.afGetActivities = function() { return filterData(MOCK_ACTIVITIES, state.typeFilter, state.timeFilter); };
  window.afFormatTime = formatTime;
})();
