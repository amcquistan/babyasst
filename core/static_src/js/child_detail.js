
BabyBuddy.ChildDetail = function(root) {
  var $ = root.$,
      _ = root._,
      $el = null,
      $timelinePrevBtn = null,
      $timelineNextBtn = null,
      $timelineContainer = null,
      $currentTimelineDate = null,
      $diaperChanges = null,
      $feedings = null,
      $sleep = null,
      $temperature = null,
      $tummyTime = null,
      $weight = null,
      $diaperChangeModal = null,
      $feedingModal = null,
      $sleepModal = null,
      childId = null,
      child = {},
      today = moment().startOf('day'),
      childBirthDate = null,
      timelineDays = [],
      timelineDate = moment().startOf('day'),
      currentTimeline = {},
      changes = [],
      feedings = [],
      sleepSessions = [],
      tummyTime = [],
      fetchedAllChanges = false,
      fetchedAllFeedings = false,
      fetchedAllSleepSessions = false,
      fetchedAllTummyTimeSessions = false,
      self = null;

  var ChildDetail = {
    init: function(id, el) {
      self = this;
      $el = $('#' + el);
      $timelinePrevBtn = $el.find('#prev-timeline-day');
      $timelineNextBtn = $el.find('#next-timeline-day');
      $timelineContainer = $el.find('#timeline-container');
      $currentTimelineDate = $el.find('#timeline-current-date');
      $diaperChanges = $el.find('#diaperchange-card');
      $feedings = $el.find('#feeding-card');
      $sleep = $el.find('#sleep-card');
      $temperature = $el.find('#temperature-card');
      $tummyTime = $el.find('#tummytime-card');
      $weight = $el.find('#weight-card');
      $diaperChangeModal = $el.find('#diaperchange-modal');
      $feedingModal = $el.find('#feeding-modal');
      $sleepModal = $el.find('#sleep-modal');
      childId = id;
      $(window).resize(function(){self.showTimeline();});
      $timelinePrevBtn.click(function(evt){
        evt.preventDefault();
        self.showPrevDayTimeline();
      });
      $timelineNextBtn.click(function(evt){
        evt.preventDefault();
        self.showNextDayTimeline();
      });
      $currentTimelineDate.html(timelineDate.format('LL'));
      self.fetchTimeline(timelineDate.toISOString());
      self.fetchChild();
    },
    fetchChild: function() {
      return $.get(BabyBuddy.ApiRoutes.child(childId))
        .then(function(response){
          console.log(response);
          childBirthDate = moment(response.birth_date).startOf('day');
          child = response;

          const { last_change, last_feeding, last_sleep, last_temperature, last_tummytime, last_weight } = child;

          if (!_.isEmpty(last_change)) {
            let changeType;
            if (last_change.wet && last_change.solid) {
              changeType = 'mixed';
            } else if (last_change.wet) {
              changeType = 'wet';
            } else {
              changeType = 'solid';
            }
            const occured = moment().to(last_change.time);
            $diaperChanges.find('.card-title').html(occured);
            $diaperChanges.find('.card-text').html(`${changeType}, ${last_change.color}`);
          }

          if (!_.isEmpty(last_feeding)) {
            let duration;
            if (last_feeding.duration) {
              duration = moment.duration(last_feeding.duration);
              if (duration && duration.asSeconds() < 60) {
                duration = '';
              }
            }
            const occured = moment().to(last_feeding.start);
            $feedings.find('.card-title').html(`${occured}`);

            let amount = '';
            if (last_feeding.amount && duration) {
              amount = `(${duration.humanize()}, ${last_feeding.amount} oz)`;
            } else if (last_feeding.amount) {
              amount = `(${last_feeding.amount} oz)`;
            } else if (duration) {
              amount = `(${duration.humanize()})`;
            }
            $feedings.find('.card-text').html(`${last_feeding.type} ${last_feeding.method} ${amount}`);
          } 

          if (!_.isEmpty(last_sleep)) {
            const occured = moment().to(last_sleep.start);
            const duration = moment.duration(last_sleep.duration).humanize();
            $sleep.find('.card-title').html(occured);
            $sleep.find('.card-text').html(duration);
          }

          if (!_.isEmpty(last_temperature)) {
            const occured = moment().to(last_temperature.time);
            $temperature.find('.card-title').html(occured);
            $temperature.find('.card-text').html(`${last_temperature.temperature} degrees`)
          }

          if (!_.isEmpty(last_tummytime)) {
            const occured = moment().to(last_tummytime.start);
            $tummyTime.find('.card-title').html(occured);

            const duration = moment.duration(last_tummytime.duration).humanize();
            $tummyTime.find('.card-text').html(duration);
          }

          if (!_.isEmpty(last_weight)) {
            const occured = moment().to(last_weight.date);
            $weight.find('.card-title').html(occured);
            $weight.find('.card-text').html(`${last_weight.weight} lbs`);
          }

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
      $currentTimelineDate.html(timelineDate.format('LL'));
      $el.find('#timeline-chart').empty();
      $el.find('#timeline-top-axis').empty();
      $el.find('#timeline-bottom-axis').empty();

      const { changes, feedings, sleep } = currentTimeline.items;

      const h = 1200;
      const w = $el.find('#timeline-card').width();
      const marginX = 50;
      const marginY = 50;

      const start = timelineDate.clone().startOf('day');
      const end = timelineDate.clone().endOf('day');

      const scaleX = d3.scaleBand()
                        .domain(['Changes', 'Feedings', 'Sleep'])
                        .range([marginX, w - marginX]);
      const scaleY = d3.scaleTime()
                        .domain([start.toDate(), end.toDate()])
                        .range([marginY, h]);

      const maxY = scaleY(end.toDate());
      const axisBottomX = d3.axisBottom(scaleX);
      const axisTopX = d3.axisTop(scaleX);
      const axisY = d3.axisLeft(scaleY).ticks(24, d3.timeFormat('%I %p')).tickSize(w - (marginX * 2));
                        
      const svg = d3.select('#timeline-chart').attr('width',  w).attr('height', h);
                  
      d3.select('#timeline-top-axis')
          .attr('width', w)
          .attr('height', 30)
          .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, 22)')
            .call(axisTopX);

      d3.select('#timeline-bottom-axis')
          .attr('width', w)
          .attr('height', 30)
          .append('g')
            .attr('class', 'x-axis')
            .call(axisBottomX);
            
      svg.append('g').attr('class', 'y-axis')
          .attr('transform', 'translate(' + (w - marginX) + ', 0)')
          .call(axisY)
          .select(".domain").remove();

      const minDuration = scaleY(start.clone().add(moment.duration(23,'minutes')).toDate()) - scaleY(start.toDate());
      const minTextDy = scaleY(start.clone().add(moment.duration(15,'minutes')).toDate()) - scaleY(start.toDate());

      svg.selectAll('.diaper-change-tl')
        .data(changes)
        .enter()
          .append('rect')
          .classed('diaper-change-tl', true)
          .attr('x', scaleX('Changes'))
          .attr('y', d => scaleY(moment(d.time).toDate()))
          .attr('fill', d => d.color)
          .attr('width', scaleX.bandwidth())
          .attr('height', minDuration)
          .on('click', d => self.showDiaperChangeModal(d));
  
      svg.selectAll('.diaper-change-tl-label')
          .data(changes)
          .enter()
            .append('text')
            .classed('diaper-change-tl-label', true)
            .attr('x', scaleX('Changes'))
            .attr('y', d => scaleY(moment(d.time).toDate()))
            .attr('dy', minTextDy)
            .attr('dx', scaleX.bandwidth() * 0.5)
            .attr('fill', d => d.color === 'yellow' ? 'black' : 'white')
            .text(d => {
              let changeType;
              if (d.wet && d.solid) {
                changeType = 'mixed';
              } else if (d.wet) {
                changeType = 'wet';
              } else {
                changeType = 'solid';
              }
              return changeType;
            })
            .on('click', d => self.showDiaperChangeModal(d));
  
      svg.selectAll('.feeding-tl')
          .data(feedings)
          .enter()
            .append('rect')
            .classed('feeding-tl', true)
            .attr('x', scaleX('Feedings'))
            .attr('y', d => scaleY(moment(d.start).toDate()))
            .attr('width', scaleX.bandwidth())
            .attr('height', d => {
                const s = scaleY(moment(d.start).toDate());
                let e = scaleY(moment(d.end).toDate());
                e = e > maxY ? maxY : e;
                const rectHt = e - s;
                return rectHt < minDuration ? minDuration : rectHt;
            })
            .on('click', d => self.showFeedingModal(d));

      svg.selectAll('.feeding-tl-label')
          .data(feedings)
          .enter()
            .append('text')
            .classed('feeding-tl-label', true)
            .attr('x', scaleX('Feedings'))
            .attr('y', d => scaleY(moment(d.start).toDate()))
            .attr('dx', scaleX.bandwidth() * 0.5)
            .attr('fill', 'white')
            .attr('dy', d => {
                const s = scaleY(moment(d.start).toDate());
                let e = scaleY(moment(d.end).toDate());
                e = e > maxY ? maxY : e;
                const dy = (e - s) * 0.65;
                return dy < minTextDy ? minTextDy : dy;
            })
            .text(d => {
              if (d.type !== 'breast milk') {
                return `${d.amount} oz`;
              }

              let text;
              const duration = moment.duration(d.duration);
              if (d.method === 'left breast') {
                return `Left: ${duration.asMinutes()} mins`;
              } else if (d.method === 'right breast') {
                return `Right: ${duration.asMinutes()} mins`;
              }

              return `Both: ${duration.asMinutes()} mins`;
            })
            .on('click', d => self.showFeedingModal(d));
        
      svg.selectAll('.sleep-tl')
          .data(sleep)
          .enter()
            .append('rect')
            .classed('sleep-tl', true)
            .attr('x', scaleX('Sleep'))
            .attr('y', d => scaleY(moment(d.start).toDate()))
            .attr('width', scaleX.bandwidth())
            .attr('height', function(d){
                const s = scaleY(moment(d.start).toDate());
                let e = scaleY(moment(d.end).toDate());
                e = e > maxY ? maxY : e;
                return (e - s);
            })
            .on('click', d => self.showSleepModal(d));
        
      svg.selectAll('.sleep-tl-label')
          .data(sleep)
          .enter()
            .append('text')
            .classed('sleep-tl-label', true)
            .attr('x', scaleX('Sleep'))
            .attr('y', d => scaleY(moment(d.start).toDate()))
            .attr('dx', scaleX.bandwidth() * 0.5)
            .attr('dy', d => {
                const s = scaleY(moment(d.start).toDate());
                let e = scaleY(moment(d.end).toDate());
                e = e > maxY ? maxY : e;
                const dy = e - s;
                return dy < minDuration ? minTextDy : dy * 0.65;
            })
            .text(d => moment.duration(d.duration).humanize())
            .on('click', d => self.showSleepModal(d));
      
    },
    showDiaperChangeModal: function(d) {
      $diaperChangeModal.modal('show');
      $diaperChangeModal.find('#diaperchange-time').val(moment(d.time).format('YYYY-MM-DD hh:mm a'));
      $diaperChangeModal.find('#diaperchange-datetimepicker_time').datetimepicker({
        defaultDate: 'now',
        format: 'YYYY-MM-DD hh:mm a'
      });
      $diaperChangeModal.find('#diaperchange-wet').prop('checked', d.wet);
      $diaperChangeModal.find('#diaperchange-wet').parent().toggleClass('active', d.wet);
      $diaperChangeModal.find('#diaperchange-solid').prop('checked', d.solid);
      $diaperChangeModal.find('#diaperchange-solid').parent().toggleClass('active', d.solid);
      $diaperChangeModal.find('#diaperchange-color').val(d.color);
      $diaperChangeModal.find('#diaperchange-save-btn').click(function(evt){
        const diaperCopy = Object.assign({}, d);
        diaperCopy.time = moment($diaperChangeModal.find('#diaperchange-time').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        diaperCopy.wet = $diaperChangeModal.find('#diaperchange-wet').prop('checked');
        diaperCopy.solid = $diaperChangeModal.find('#diaperchange-solid').prop('checked');
        diaperCopy.color = $diaperChangeModal.find('#diaperchange-color').val();
        $.post(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperCopy.id), diaperCopy)
          .then((response) => {
            $diaperChangeModal.modal('hide');
            self.fetchTimeline(timelineDate.toISOString());
            return response;
          })
          .catch(err => {
            if (err.responseJSON && err.responseJSON.error_message) {
              $diaperChangeModal.find('#error-message').html(err.responseJSON.error_message);
            }
          });
      });
    },
    showFeedingModal: function(d) {
      $feedingModal.modal('show');
      const s = moment(d.start);
      $feedingModal.find('#feeding-start').val(s.format('YYYY-MM-DD hh:mm a'));
      $feedingModal.find('#feeding-datetimepicker_start').datetimepicker({
        defaultDate: s,
        format: 'YYYY-MM-DD hh:mm a'
      });
      $feedingModal.find('#feeding-end').val(moment(d.end).format('YYYY-MM-DD hh:mm a'));
      $feedingModal.find('#feeding-datetimepicker_end').datetimepicker({
        minDate: s.clone().add(1, 'minutes'),
        format: 'YYYY-MM-DD hh:mm a'
      });
      $feedingModal.find('#feeding-datetimepicker_start').on('change.datetimepicker', function(evt){
        $feedingModal.find('#feeding-datetimepicker_end').datetimepicker('minDate', moment(evt.date).add(1, 'minutes'));
      });
      const $type = $feedingModal.find('#feeding-type');
      const $method = $feedingModal.find('#feeding-method');
      const $amount = $feedingModal.find('#feeding-amount');
      $type.val(d.type);
      $method.val(d.method);
      $amount.val(d.amount);
      $type.find('#feeding-end').change((evt) => {
        if (!$type.val()) {
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        } else if ($type.val() === 'breast milk') {
          const validOptions = ['left breast', 'right breast', 'both breasts'];
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', !validOptions.includes($this.prop('value')));
            $this.prop('selected', false);
          });
        } else {
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', $this.prop('value') !== 'bottle');
            $this.prop('selected', $this.prop('value') === 'bottle');
          });
        }
      });
      $feedingModal.find('#feeding-save-btn').click((evt) => {
        const feedingCopy = Object.assign({}, d);
        feedingCopy.start = moment($feedingModal.find('#feeding-start').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feedingCopy.end = moment($feedingModal.find('#feeding-end').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feedingCopy.type = $type.val();
        feedingCopy.method = $method.val();
        feedingCopy.amount = $feedingModal.find('#feeding-amount').val();
        if (feedingCopy.type !== 'breast milk' && !feedingCopy.amount) {
          return;
        }
        $.post(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingCopy.id), feedingCopy)
          .then((response) => {
            $feedingModal.modal('hide');
            self.fetchTimeline(timelineDate.toISOString());
            return response;
          })
          .catch(err => {
            if (err.responseJSON && err.responseJSON.error_message) {
              $feedingModal.find('#error-message').html(err.responseJSON.error_message);
            }
          });
      });
    },
    showSleepModal: function(d) {
      $sleepModal.modal('show');
      const s = moment(d.start);
      $sleepModal.find('#sleep-start').val(s.format('YYYY-MM-DD hh:mm a'));
      $sleepModal.find('#sleep-datetimepicker_start').datetimepicker({
        defaultDate: s,
        format: 'YYYY-MM-DD hh:mm a'
      });
      $sleepModal.find('#sleep-end').val(moment(d.end).format('YYYY-MM-DD hh:mm a'));
      $sleepModal.find('#sleep-datetimepicker_end').datetimepicker({
        minDate: s.clone().add(1, 'minutes'),
        format: 'YYYY-MM-DD hh:mm a'
      });
      $sleepModal.find('#sleep-datetimepicker_start').on('change.datetimepicker', function(evt){
        $sleepModal.find('#sleep-datetimepicker_end').datetimepicker('minDate', moment(evt.date).add(1, 'minutes'));
      });

      $sleepModal.find('#sleep-save-btn').click((evt) => {
        const sleepCopy = Object.assign({}, d);
        sleepCopy.start = moment($sleepModal.find('#sleep-start').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        sleepCopy.end = moment($sleepModal.find('#sleep-end').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        $.post(BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepCopy.id), sleepCopy)
          .then((response) => {
            $sleepModal.modal('hide');
            self.fetchTimeline(timelineDate.toISOString());
            return response;
          })
          .catch(err => {
            if (err.responseJSON && err.responseJSON.error_message) {
              $sleepModal.find('#error-message').html(err.responseJSON.error_message);
            }
          });
      });
    }
  };

  return ChildDetail;
} (window);
