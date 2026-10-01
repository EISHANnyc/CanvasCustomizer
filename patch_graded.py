import re

with open('content/theme-engine.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 2. Fix the header generation in populateGradedCards
js = re.sub(
    r"groupEl\.innerHTML =[\s\S]*?groupList\.className = 'vibe-minimal-list';",
    '''var labelClass = 'vibe-minimal-day-label' + (group.header.isToday ? ' is-today' : (group.header.isTomorrow ? ' is-tomorrow' : ''));
      groupEl.innerHTML =
        '<div class="vibe-minimal-day-header">' +
          '<span class="' + labelClass + '">' + group.header.label + '</span>' +
          '<span class="vibe-minimal-day-line"></span>' +
          '<span class="vibe-minimal-day-count">' + countStr + '</span>' +
        '</div>' +
        '<div class="vibe-minimal-list"></div>';

      var groupList = groupEl.querySelector('.vibe-minimal-list');''',
    js
)

# 3. Fix the row HTML in populateGradedCards
js = re.sub(
    r"row\.innerHTML =[\s\S]*?</div>';",
    '''row.innerHTML =
            '<div class="vibe-minimal-check checked" style="cursor:default;" title="Completed">' +
              '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
            '</div>' +
            '<div class="vibe-minimal-body">' +
              '<a href="' + (item.href || '#') + '" class="vibe-minimal-title vibe-minimal-title-link" style="text-decoration: none;" title="' + cleanTitle + '">' + cleanTitle + '</a>' +
              '<div class="vibe-minimal-meta">' +
                '<span class="vibe-minimal-course">' + courseTitle + '</span>' +
                '<span class="vibe-minimal-sep">&#183;</span>' +
                '<span class="vibe-minimal-time">' + (getUrgencyDetails(item.gradedDateObj || item.dueDateObj || item.dateObj, item).label || 'Today') + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="vibe-minimal-actions" style="opacity: 1; display: flex; align-items: center; gap: 8px;">' +
              '<div class="' + scoreClass + '">' + scoreText + '</div>' +
              '<button class="vibe-minimal-dismiss" type="button" title="Dismiss task" aria-label="Dismiss task">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
              '</button>' +
            '</div>';''',
    js, count=1
)

with open('content/theme-engine.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Patched theme-engine.js")
