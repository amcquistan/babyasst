
BabyBuddy.ChildDetail = function(root) {
  var $ = root.$,
      _ = root._,
      $el = null,
      $timelinePrevBtn = null,
      $timelineNextBtn = null,
      $timelineContainer = null,
      $currentTimelineDate = null,
      childId = null,
      child = {},
      today = moment().startOf('day'),
      childBirthDate = null,
      timelineDays = [],
      timelineDate = moment().startOf('day'),
      currentTimeline = {},

      self = null;

  var ChildDetail = {
    init: function(id, el) {
      self = this;
      $el = $('#' + el);
      $timelinePrevBtn = $el.find('#prev-timeline-day');
      $timelineNextBtn = $el.find('#next-timeline-day');
      $timelineContainer = $el.find('#timeline-container');
      $currentTimelineDate = $el.find('#timeline-current-date');
      childId = id;

      $timelinePrevBtn.click(function(evt){
        evt.preventDefault();
        self.showPrevDayTimeline();
      });
      $timelineNextBtn.click(function(evt){
        evt.preventDefault();
        self.showNextDayTimeline();
      });
      self.fetchTimeline(timelineDate.toISOString());
      self.fetchChild();
    },
    fetchChild: function() {
      return $.get(BabyBuddy.ApiRoutes.child(childId))
        .then(function(response){
          console.log(response);
          childBirthDate = moment(response.birth_date).startOf('day');
          child = response;
          return response;
        });
    },
    fetchTimeline: function(dateStr) {
      var timeline = timelineDays.filter(function(tl){
        return tl.date === dateStr;
      });
      if (timeline && timeline.lengh) {
        currentTimeline = timeline[0];
        self.showTimeline();
      } else {
        $.get(BabyBuddy.ApiRoutes.childTimeline(childId, dateStr))
          .then(function(response){
            console.log('fetchTimeline', response);
            timelineDays.push(response);
            currentTimeline = response;
            self.showTimeline();
            return response;
          });
      }
    },
    showPrevDayTimeline: function() {
      if (!childBirthDate.isSame(timelineDate)) {
        timelineDate.subtract('days', 1);
        self.fetchTimeline(timelineDate.toISOString());
      }
      self.validateTimelineNavigation();
    },
    showNextDayTimeline: function() {
      if (!today.isSame(timelineDate)) {
        timelineDate.add('days', 1);
        self.fetchTimeline(timelineDate.toISOString());
      }
      self.validateTimelineNavigation();
    },
    validateTimelineNavigation: function() {
      if (childBirthDate.isSame(timelineDate)) {
        $timelinePrevBtn.prop('disabled', true);
      } else {
        $timelinePrevBtn.prop('disabled', false);
      }
      if (today.isSame(timelineDate)) {
        $timelineNextBtn.prop('disabled', true);
      } else {
        $timelineNextBtn.prop('disabled', false);
      }
    },
    showTimeline: function() {
      $timelineContainer.empty();
      $currentTimelineDate.html(timelineDate.format('LL'));
      var html = '<li class="${li-timeline-class}">'
        + '<div class="timeline-badge ${activity-bg}"><i class="icon ${activity-icon}"></i></div>'
        + '<div class="card text-right" style="border-color:#3c4248;">'
          + '<div class="card-body">${event}</div>'
          + '<div class="card-footer text-muted text-center">${times-since}</div>'
        + '</div>'
        + '</li>';
      if (!_.isEmpty(currentTimeline) && currentTimeline.items.length) {
        let tlHTML = currentTimeline.items.map(function(item, i){
          const liClass = i % 2 === 0 ? 'timeline-inverted' : '';
          const activityBG = item.type === 'start' ? 'bg-success' : item.type === 'end' ? 'bg-danger' : 'bg-info';
          const activityIcon = 'icon-' + item.model_name;
          const timeSince = moment(item.time).format('LT');
          return `
          <li class="${liClass}">
            <div class="timeline-badge ${activityBG}"><i class="icon ${activityIcon}"></i></div>
            <div class="card text-center" style="border-color:#3c4248;">
              <div class="card-body">${item.event}</div>
              <div class="card-footer text-muted text-center">${item.detail} at ${timeSince}</div>
            </div>
          </li>
          `
        }).join('\n');
        $timelineContainer.html(tlHTML);
      } else {
        $timelineContainer.html('<li class="text-center">No Data</li>');
      }
    }
  };

  return ChildDetail;
} (window);
