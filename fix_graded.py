# -*- coding: utf-8 -*-
import re

js_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme-engine.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# We already added groupGradedItemsByDay.

populate_graded_replacement = '''function populateGradedCards(container, items, presetId, nicknames) {
    if (!container) return;
    container.innerHTML = '';
    
    var activeCid = getActiveCourseId();
    var filteredItems = items || [];
    if (activeCid) {
      filteredItems = filteredItems.filter(function(item) {
        if (item.courseId && String(item.courseId) === String(activeCid)) return true;
        if (item.href && item.href.indexOf('/courses/' + activeCid) !== -1) return true;
        return false;
      });
    }

    var dismissedGraded = getDismissedGraded();
    filteredItems = filteredItems.filter(function(item) {
      var k = item.key || ('graded_' + (item.id || (item.title + '_' + (item.courseId || item.course || '') + '_' + (item.score !== null ? item.score : '') + '_' + (item.grade || ''))));
      item.key = k;
      return !dismissedGraded[k];
    });

    var counter = document.getElementById('vibe-graded-counter');
    if (counter) {
      counter.textContent = String(filteredItems.length);
    }

    if (filteredItems.length === 0) {
      var emptyMsg = activeCid ? '? No recently completed items for this course.' : '? No recently completed items found.';
      container.innerHTML = '<div class="vibe-todo-empty">' + emptyMsg + '</div>';
      return;
    }

    var groups = groupGradedItemsByDay(filteredItems);

    var cardIndex = 0;
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      var groupEl = document.createElement('div');
      groupEl.className = 'vibe-minimal-day-section';
      groupEl.setAttribute('data-day-key', group.key);

      var labelClass = 'vibe-minimal-day-label';
      if (group.header.isToday) labelClass += ' is-today';

      var countStr = String(group.items.length);

      groupEl.innerHTML =
        '<div class="vibe-minimal-day-label' + (group.header.isToday ? ' is-today' : '') + '">' +
          '<span class="vibe-minimal-day-text">' + group.header.text + '</span>' +
          '<span class="vibe-minimal-day-count">' + countStr + '</span>' +
        '</div>';

      var groupList = document.createElement('div');
      groupList.className = 'vibe-minimal-list';

      for (var i = 0; i < group.items.length; i++) {
        (function(item, idx) {
          var row = document.createElement('div');
          row.className = 'vibe-minimal-row vibe-graded-card';
          row.style.animationDelay = (cardIndex * 0.03) + 's';
          row.setAttribute('data-key', item.key);
          cardIndex++;

          var hasNumericalScore = (item.score !== null && item.score !== undefined);
          var hasGradeStr = !!item.grade;
          var isCompleted = !hasNumericalScore && !hasGradeStr && !item.isSubmitted;

          var scoreClass = 'vibe-minimal-score-tag';
          var scoreText = '';
          if (hasNumericalScore) {
            var raw = parseFloat(item.score);
            var max = parseFloat(item.points_possible || item.maxScore);
            var displayScore = (raw % 1 === 0) ? raw : raw.toFixed(2);
            var displayMax = (max % 1 === 0) ? max : max.toFixed(2);
            scoreText = !isNaN(max) ? (displayScore + '/' + displayMax) : displayScore;
            
            if (!isNaN(max) && max > 0) {
              var pct = raw / max;
              if (pct >= 0.9) scoreClass += ' score-good';
              else if (pct >= 0.7) scoreClass += ' score-ok';
              else scoreClass += ' score-bad';
            } else if (raw > 0) {
              scoreClass += ' score-good';
            }
          } else if (hasGradeStr) {
            scoreText = String(item.grade);
            if (scoreText.toLowerCase() === 'complete' || scoreText.toLowerCase() === 'done') scoreClass += ' score-good';
            else if (scoreText.toLowerCase() === 'incomplete') scoreClass += ' score-bad';
            else if (['A','B','A+','A-','B+','B-'].indexOf(scoreText.toUpperCase()) !== -1) scoreClass += ' score-good';
            else if (['C','C+','C-'].indexOf(scoreText.toUpperCase()) !== -1) scoreClass += ' score-ok';
            else scoreClass += ' score-bad';
          } else if (item.isSubmitted) {
            scoreText = 'Submitted';
            scoreClass += ' score-good';
          } else if (isCompleted) {
            scoreText = '? Done';
          } else {
            scoreText = 'Graded';
          }

          var courseTitle = getNiceCourseName(item.courseId, item.course, nicknames);
          var cleanTitle = sanitizeTitle(item.title || 'Assignment');

          row.innerHTML = 
            '<div class="vibe-minimal-content">' +
              '<a href="' + (item.href || '#') + '" class="vibe-minimal-title" title="' + cleanTitle + '">' +
                '<span class="vibe-minimal-icon-check">?</span>' +
                '<span class="vibe-minimal-text">' + cleanTitle + '</span>' +
              '</a>' +
              '<div class="vibe-minimal-meta">' +
                '<span class="vibe-minimal-course">' + courseTitle + '</span>' +
                '<span class="vibe-minimal-dot">&middot;</span>' +
                '<span class="vibe-minimal-date">' + (item.timeStr || 'Today') + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="vibe-minimal-right">' +
              '<div class="' + scoreClass + '">' + scoreText + '</div>' +
              '<button class="vibe-minimal-dismiss" title="Dismiss" aria-label="Dismiss"></button>' +
            '</div>';

          var dismissBtn = row.querySelector('.vibe-minimal-dismiss');
          if (dismissBtn) {
            dismissBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              row.classList.add('vibe-row-completed');
              removeManuallyCompletedTask(item.key);
              unDismissTask(item.key);
              cachedPlannerItems = null;

              var dismissed = getDismissedGraded();
              dismissed[item.key] = true;
              try {
                localStorage.setItem('vibe_dismissed_graded_v1', JSON.stringify(dismissed));
              } catch (err) {}

              setTimeout(function() {
                var parentGroup = row.closest('.vibe-minimal-day-section');
                if (row.parentNode) row.parentNode.removeChild(row);
                if (parentGroup) {
                  var remainingInGroup = parentGroup.querySelectorAll('.vibe-minimal-row:not(.vibe-row-completed)').length;
                  if (remainingInGroup === 0 && parentGroup.parentNode) {
                    parentGroup.parentNode.removeChild(parentGroup);
                  } else {
                    var countEl = parentGroup.querySelector('.vibe-minimal-day-count');
                    if (countEl) countEl.textContent = String(remainingInGroup);
                  }
                }
                updateGradedWidgetCount();
              }, 180);
            });
          }

          groupList.appendChild(row);
        })(group.items[i], i);
      }
      groupEl.appendChild(groupList);
      container.appendChild(groupEl);
    }
  }'''

js = re.sub(r'function populateGradedCards\(container, items, presetId, nicknames\)\s*\{[\s\S]*?(?=function insertNewlyCompletedToGradedList)', populate_graded_replacement + '\n\n  ', js)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated populateGradedCards via python file')
