/* Baby Buddy
 *
 * Default namespace for the Baby Buddy app.
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Baby Asst requires jQuery.')
}

function setUpAJAX() {
  var csrftoken = getCookie('csrftoken');
  jQuery.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });
}


function getCookie (name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function csrfSafeMethod (method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var BabyBuddy = function () {
    const $timerCountSpan = $('#timers-count');

    var BabyBuddy = {
      host: () => {
        return `${window.location.protocol}//${window.location.host}`;
      },
      ApiRoutes: {
        activeTimersCount: () => {
          return `/api/active-timers/`;
        },
        children: () => {
          return '/api/children/';
        },
        child: (childId) => {
          return `/api/children/${childId}/`;
        },
        childTimeline: (childId, dateStr) => {
          return `/api/children/${childId}/timeline/${dateStr}/`;
        },
        notification: (notificationId) => {
          return `/api/notifications/${notificationId}/`;
        },
        account: (accountId) => {
          return `/api/accounts/${accountId}/`;
        },
        accountApplyPromo: (accountId) => {
          return `/api/accounts/${accountId}/apply-promo-code/`;
        },
        accounts: () => {
          return '/api/accounts/';
        },
        diaperChanges: (childId) => {
          return `/api/children/${childId}/changes/`;
        },
        diaperChangeDetail: (childId, changeId) => {
          return `/api/children/${childId}/changes/${changeId}/`;
        },
        feedings: (childId) => {
          return `/api/children/${childId}/feeding/`;
        },
        feedingDetail: (childId, feedingId) => {
          return `/api/children/${childId}/feeding/${feedingId}/`;
        },
        notes: (childId) => {
          return `/api/children/${childId}/notes/`;
        },
        noteDetail: (childId, noteId) => {
          return `/api/children/${childId}/notes/${noteId}/`;
        },
        sleeping: (childId) => {
          return `/api/children/${childId}/sleep/`;
        },
        sleepingDetail: (childId, sleepId) => {
          return `/api/children/${childId}/sleep/${sleepId}/`;
        },
        temperatures: (childId) => {
          return `/api/children/${childId}/temperature/`;
        },
        temperatureDetail: (childId, temperatureId) => {
          return `/api/children/${childId}/temperature/${temperatureId}/`;
        },
        tummyTime: (childId) => {
          return `/api/children/${childId}/tummy-time/`;
        },
        tummyTimeDetail: (childId, tummyTimeId) => {
          return `/api/children/${childId}/tummy-time/${tummyTimeId}/`;
        },
        weight: (childId) => {
          return `/api/children/${childId}/weight/`;
        },
        weightDetail: (childId, weightId) => {
          return `/api/children/${childId}/weight/${weightId}/`;
        },
        timers: () => {
          return `/api/timers/`;
        },
        timerDetail: (timerId) => {
          return `/api/timers/${timerId}/`;
        }
      },
      ChildTimeActivityDao: () => {
        let activitiesMap = new Map();
        let filteredActivitiesMap = new Map();
        let fetchedAllData = false;

        const fetch = (url, start, end) => {
          let fetchMoreData = true;
          activitiesMap.forEach((activity, id) => {
            const actTime = moment(activity.time);
            if (start.isSameOrBefore(actTime) && end.isSameOrAfter(actTime) && !filteredActivitiesMap.has(activity.id)) {
              filteredActivitiesMap.set(activity.id, activity);
            } else if (start.isAfter(actTime)) {
              fetchMoreData = false;
            }
          });
          
          if (!fetchedAllData && fetchMoreData && url) {
            return $.get(url).then(response => {
              fetchedAllData = !Boolean(response.previous);
              response.results.forEach((activity) => {
                if (!activitiesMap.has(activity.id)) {
                  activitiesMap.set(activity.id, activity);
                }
              });
              return fetch(response.previous, start, end);
            });
          }
          const copy = Array.from(filteredActivitiesMap.values());
          filteredActivitiesMap = new Map();
          return new Promise((resolve, reject) => resolve(copy));
        };

        return {
          fetch
        };
      },
      ChildDurationActivityDao: () => {
        let activitiesMap = new Map();
        let filteredActivitiesMap = new Map();
        let fetchedAllData = false;
  
        const fetch = (url, start, end) => {
          let fetchMoreData = true;

          activitiesMap.forEach((activity, id) => {
            const actStart = moment(activity.start);
            const actEnd = moment(activity.end);
            if (start.isSameOrBefore(actStart) && end.isSameOrAfter(actEnd) && !filteredActivitiesMap.has(activity.id)) {
              filteredActivitiesMap.set(activity.id, activity);
            } else if (start.isAfter(actStart)) {
              fetchMoreData = false;
            }
          });
          if (!fetchedAllData && fetchMoreData && url) {
            return $.get(url).then(response => {
              fetchedAllData = !Boolean(response.previous);
              response.results.forEach((activity) => {
                if (!activitiesMap.has(activity.id)) {
                  activitiesMap.set(activity.id, activity);
                }
              });
              return fetch(response.previous, start, end);
            });
          }
          const copy = Array.from(filteredActivitiesMap.values());
          filteredActivitiesMap = new Map();
          return new Promise((resolve, reject) => resolve(copy));
        };
  
        return {
          fetch
        };
      },
      DiaperChangeChart: () => {
        const plot = ($chart, $chartContainer, diaperChanges, startDate, endDate) => {
          $chart.empty();
          const marginX = 46;
          const marginY = 40;
          const w = $chartContainer.width();
          const h = 380;
          const wetFill = '#007bff';
          const solidFill = '#ff8f00';
          const chartId = $chart.prop('id');
          const svg = d3.select(`#${chartId}`)
                        .attr('width', w)
                        .attr('height', h);

          const curDate = startDate.clone();
          const xDomain = [];
          while(curDate.isSameOrBefore(endDate)) {
            xDomain.push(curDate.startOf('day').toDate());
            curDate.add(1, 'days');
          }

          const scaleX = d3.scaleBand()
                            .padding(0.1)
                            .domain(xDomain)
                            .range([marginX, w]);
          const grouped = _.groupBy(diaperChanges, (s) => moment(s.time).startOf('day').toDate());
          const diaperChangesPerDay = Object.keys(grouped).map(day => {
            const changes = grouped[day];
            let wet = 0;
            let solid = 0;
            for (let change of changes) {
              if (change.wet) {
                wet++;
              }
              if (change.solid) {
                solid++;
              }
            }
            return {
              day,
              wet,
              solid
            };
          });

          diaperChangesPerDay.forEach(c => {
            const xVal = scaleX(c.day);
            console.log(`${c.day} ${c.wet} ${c.solid} ${xVal}`);
          });

          const stack = d3.stack().keys(['wet','solid']);
          const series = stack(diaperChangesPerDay);

          const maxChanges = d3.max(diaperChangesPerDay, (change) => change.wet + change.solid);
          const scaleY = d3.scaleLinear()
                            .domain([0, maxChanges])
                            .range([h - 2 * marginY, marginY]);

          svg.selectAll('g').data(series)
              .enter()
                .append('g')
                .attr('fill', d => d.key === 'wet' ? wetFill : solidFill)
                .selectAll('rect')
                .data(d => d)
                .enter()
                  .append('rect')
                  .attr('x', d => {
                    const xDay = scaleX(d.data.day);
                    console.log('day ' + d.data.day + ' xDay ' + xDay);
                    return xDay;
                  })
                  .attr('y', d => {
                    const y = scaleY(d[1]);
                    console.log('y', y);
                    return y;
                  })
                  .attr('height', d => {
                    const gHt = scaleY(d[0]) - scaleY(d[1]);
                    return gHt;
                  })
                  .attr('width', scaleX.bandwidth());

          svg.selectAll('.diaperchange-bar-text').data(series)
              .enter()
                .append('g')
                .selectAll('text')
                .data(d => d)
                .enter()
                  .append('text')
                  .classed('diaperchange-bar-text', true)
                  .attr('x', d => {
                    const xDay = scaleX(d.data.day);
                    return xDay;
                  })
                  .attr('dx', scaleX.bandwidth() * 0.5)
                  .attr('y', d => {
                    const y = scaleY(d[1]);
                    console.log('y', y);
                    return y;
                  })
                  .attr('dy', d => {
                    const gHt = scaleY(d[0]) - scaleY(d[1]);
                    return gHt * (gHt < 140 ? 0.7 : 0.52);
                  })
                  .attr('fill', 'white')
                  .text(d => {
                    const cnt = d[0] === 0 ? d.data.wet : d.data.solid;
                    return '' + (cnt > 0 ? cnt : '');
                  });
          const xAxis = d3.axisBottom(scaleX).tickFormat(d3.timeFormat('%b-%e'));
          const yAxis = d3.axisLeft(scaleY);
    
          svg.append('g')
              .attr('class', 'x-axis')
              .attr('transform', 'translate(0, '+ (h - 2 * marginY) +')')
              .call(xAxis);
          svg.append('g')
              .attr('class', 'y-axis')
              .attr('transform', 'translate('+ marginX +',0)')
              .call(yAxis);


          const labelY = Math.floor(h * 0.5);
          svg.append('text')
              .attr('x', 14)
              .attr('y', labelY)
              .attr('fill', 'white')
              .classed('sleep-chart-axis-label', true)
              .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
              .text('Changes per Day');

          const wetCX = w * 0.32;
          const solidCX = w * 0.62;
          svg.append('circle')
                  .attr('cx', wetCX)
                  .attr('cy', 10)
                  .attr('r', 10)
                  .attr('fill', wetFill);
          svg.append('circle')
                  .attr('cx', solidCX)
                  .attr('cy', 10)
                  .attr('r', 10)
                  .attr('fill', solidFill);
          svg.append('text')
                  .classed('diaperchange-legend-text', true)
                  .attr('x', wetCX + 36)
                  .attr('y', 15)
                  .attr('fill', 'white')
                  .text('wet');
          svg.append('text')
                  .classed('diaperchange-legend-text', true)
                  .attr('x', solidCX + 40)
                  .attr('y', 15)
                  .attr('fill', 'white')
                  .text('solid');

        };
        return {
          plot
        };
      },
      SleepChart: () => {
        const plot = ($chart, $chartContainer, sleepSessions, startDate, endDate) => {
          $chart.empty();
          const w = $chartContainer.width();
          const h = 350;
          const marginX = 50;
          const marginY = 50;
          const chartId = $chart.prop('id');
          const svg = d3.select(`#${chartId}`).attr('width', w).attr('height', h);
          const curDate = startDate.clone();
          const xDomain = [];
          while(curDate.isSameOrBefore(endDate)) {
            xDomain.push(curDate.toDate());
            curDate.add(1, 'days');
          }
          const scaleX = d3.scaleBand()
                            .padding(0.1)
                            .domain(xDomain)
                            .range([marginX, w - marginX]);
          let grouped = _.groupBy(sleepSessions, (s) => moment(s.start).startOf('day'));
          const sleepTotalPerDay = _.reduce(
              grouped,
              (days, sleepThatDay, day) => {
                days.push(sleepThatDay.reduce((totalSleep, s) => {
                  totalSleep.hours += moment.duration(s.duration).asHours();
                  return totalSleep;
                }, {day: day, hours: 0}))
                return days;
              }, [])

          const maxSleep = d3.max(sleepTotalPerDay, (daySleep) => daySleep.hours);
          const scaleY = d3.scaleLinear()
                            .domain([0, maxSleep])
                            .range([h - marginY, marginY]);
          const xAxis = d3.axisBottom(scaleX).tickFormat(d3.timeFormat('%b-%e'));
          const yAxis = d3.axisLeft(scaleY);
    
          svg.append('g')
              .attr('class', 'x-axis')
              .attr('transform', 'translate(0, '+ (h - marginY) +')')
              .call(xAxis);
        
          svg.append('g')
              .attr('class', 'y-axis')
              .attr('transform', 'translate('+ marginX +',0)')
              .call(yAxis);
          
          const labelY = Math.floor(h * 0.5);
          svg.append('text')
              .attr('x', 14)
              .attr('y', labelY)
              .attr('fill', 'white')
              .classed('sleep-chart-axis-label', true)
              .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
              .text('Hours per Day');
    
          svg.selectAll('.sleep-chart-bar')
              .data(sleepTotalPerDay)
                .enter()
                .append('rect')
                .classed('sleep-chart-bar', true)
                .attr('x', d => scaleX(moment(d.day).toDate()))
                .attr('y', d => scaleY(d.hours))
                .attr('width', scaleX.bandwidth())
                .attr('height', d => h - marginY - scaleY(d.hours));
        };
  
        return {
          plot
        };
      },
      DurationFormHandler: function($form, $startPicker, $endPicker){
        var $startInput = $startPicker.find('input');
        if ($startInput && $startInput.val()) {
          $startInput.val(moment($startInput.val()).format('YYYY-MM-DD hh:mm a'));
        }

        var $endInput = $endPicker.find('input');
        if ($endInput && $endInput.val()) {
          $endInput.val(moment($endInput.val()).format('YYYY-MM-DD hh:mm a'));
        }
        $startPicker.datetimepicker({
          format: 'YYYY-MM-DD hh:mm a',
          defaultDate: 'now',
        });
        $startPicker.on('change.datetimepicker', function(evt){
          $endPicker.datetimepicker('minDate', evt.date);
        });
    
        $endPicker.datetimepicker({
          defaultDate: 'now',
          format: 'YYYY-MM-DD hh:mm a'
        });
        $form.submit(function(evt){
          if ($startInput && $startInput.val() && $endInput && $endInput.val()) {
            var start = moment($startInput.val(), 'YYYY-MM-DD hh:mm a');
            var end = moment($endInput.val(), 'YYYY-MM-DD hh:mm a');
            $startInput.val(start.format('YYYY-MM-DD HH:mm'));
            $endInput.val(end.format('YYYY-MM-DD HH:mm'));
          } else {
            evt.preventDefault();
          }
        });
      },
      TimeFormHandler: function($form, $timePicker) {
        var $timeInput = $timePicker.find('input');
        if ($timeInput && $timeInput.val()) {
          $timeInput.val(moment($timeInput.val()).format('YYYY-MM-DD hh:mm a'));
        }
        $timePicker.datetimepicker({
          defaultDate: 'now',
          format: 'YYYY-MM-DD hh:mm a'
        });
        $form.submit(function(evt){
          if ($timeInput && $timeInput.val()) {
            var time = moment($timeInput.val(), 'YYYY-MM-DD hh:mm a');
            $timeInput.val(time.format('YYYY-MM-DD HH:mm'));
          } else {
            evt.preventDefault();
          }
        });
      },
      updateTimerNavSpan: () => {
        if ($timerCountSpan) {
          return $.get(BabyBuddy.ApiRoutes.activeTimersCount()).then(response => {
            $timerCountSpan.html(''+response.length);
          });
        }
      }
    };

    window.addEventListener('focus', BabyBuddy.updateTimerNavSpan, false);

    return BabyBuddy;
}();

setUpAJAX();
