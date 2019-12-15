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
    let timerCheckIntervalId;

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
        childTimeline: (childId, start, end) => {
          return `/api/children/${childId}/timeline/${start}/${end}/`;
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
        baths: (childId) => {
          return `/api/children/${childId}/baths/`;
        },
        bathDetail: (childId, bathId) => {
          return `/api/children/${childId}/baths/${bathId}/`;
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
      setDurationPickerConstraints: (initialized, startDefault, endDefault, $startPicker, $endPicker) => {
        if (!initialized) {
          $startPicker.datetimepicker({
            defaultDate: startDefault,
            format: 'YYYY-MM-DD hh:mm a'
          });
    
          $endPicker.datetimepicker({
            defaultDate: endDefault,
            format: 'YYYY-MM-DD hh:mm a'
          });
        } else {
          $startPicker.datetimepicker('date', startDefault);
          $endPicker.datetimepicker('date', endDefault);
        }

        // $startPicker.datetimepicker('viewDate', startDefault);
        // $endPicker.datetimepicker('viewDate', endDefault);
  
        $startPicker.on('change.datetimepicker', function(evt){
          let minEndDate = moment(evt.date).add(1, 'minutes');
          if (minEndDate.isAfter(moment())) {
            minEndDate = moment();
          }
          $endPicker.datetimepicker('minDate', minEndDate);
        });
        $endPicker.on('change.datetimepicker', function(evt){
          $startPicker.datetimepicker('maxDate', moment(evt.date).subtract(1, 'minutes'));
        });
      },
      ChildTimeActivityDao: (timeField='time') => {
        let activitiesMap = new Map();
        let filteredActivitiesMap = new Map();
        let fetchedAllData = false;

        const fetch = (url, start, end) => {
          let fetchMoreData = true;
          activitiesMap.forEach((activity, id) => {
            const actTime = moment(activity[timeField]);
            if (start.isSameOrBefore(actTime) && end.isSameOrAfter(actTime) && !filteredActivitiesMap.has(activity.id)) {
              filteredActivitiesMap.set(activity.id, activity);
            } else if (start.isAfter(actTime)) {
              fetchMoreData = false;
            }
          });
          
          if (!fetchedAllData && fetchMoreData && url) {
            return $.get(url).then(response => {
              fetchedAllData = !Boolean(response.next);
              response.results.forEach((activity) => {
                if (!activitiesMap.has(activity.id)) {
                  activitiesMap.set(activity.id, activity);
                }
              });
              return fetch(response.next, start, end);
            });
          }
          const copy = Array.from(filteredActivitiesMap.values());
          filteredActivitiesMap = new Map();
          activitiesMap = new Map();
          fetchedAllData = false;
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
              fetchedAllData = !Boolean(response.next);
              response.results.forEach((activity) => {
                if (!activitiesMap.has(activity.id)) {
                  activitiesMap.set(activity.id, activity);
                }
              });
              return fetch(response.next, start, end);
            });
          }
          const copy = Array.from(filteredActivitiesMap.values());
          filteredActivitiesMap = new Map();
          activitiesMap = new Map();
          fetchedAllData = false;
          return new Promise((resolve, reject) => resolve(copy));
        };
  
        return {
          fetch
        };
      },
      DiaperChangeChart: () => {
        const plot = ($chartContainer, diaperChanges, startDate, endDate) => {
          const $barChartDays = $chartContainer.find('#diaperchange-chart-days');
          const $hoursChart = $chartContainer.find('#diaperchange-chart-hours');
          
          $barChartDays.empty();
          $hoursChart.empty();
          const hoursHt = 85;
          const marginX = 38;
          const marginY = 30;
          const w = $chartContainer.width();
          const h = 320;
          const hoursBandHt = 17;
          const wetFill = '#007bff';
          const solidFill = '#ff8f00';

          const barChartSVG = d3.select(`#${$barChartDays.prop('id')}`).attr('width', w).attr('height', h);
          const hoursChartSVG = d3.select(`#${$hoursChart.prop('id')}`).attr('width', w).attr('height', hoursHt);
          
          let diaperChangeHrs = {};
          diaperChanges.forEach(dc => {
            const diaperChangeTime = moment(dc.time);
            const hr = diaperChangeTime.toDate().getHours();
            if (diaperChangeTime.isValid()) {
              if (hr in diaperChangeHrs) {
                diaperChangeHrs[hr].wet += (dc.wet ? 1 : 0);
                diaperChangeHrs[hr].solid += (dc.solid ? 1 : 0);
              } else {
                diaperChangeHrs[hr] = {
                  wet: (dc.wet ? 1 : 0),
                  solid: (dc.solid ? 1 : 0),
                  hour: hr,
                  hourOfDay: removeZeroFromHour(diaperChangeTime.format('hh a'))
                };
              }
            }
          });
          
          diaperChangeHrs = Object.values(diaperChangeHrs);
          const startOfDay = moment().startOf('day');
          const endOfDay = startOfDay.clone().endOf('day');
          const hoursOfDay = [];
          while(startOfDay.isBefore(endOfDay)) {
            let hrOfDay = removeZeroFromHour(startOfDay.format('hh a'));
            hoursOfDay.push(hrOfDay);
            const match = diaperChangeHrs.find(c => c.hourOfDay === hrOfDay);
            if (!match) {
              diaperChangeHrs.push({
                wet: 0,
                solid: 0,
                hour: startOfDay.toDate().getHours(),
                hourOfDay: hrOfDay
              });
            }

            startOfDay.add(1, 'hours');
          }
          const hoursOfDayScaleX = d3.scaleBand().domain(hoursOfDay).range([marginX, w]);
          const hoursOfDayScaleWetColor = d3.scaleLinear()
                                      .domain([0, d3.max(diaperChangeHrs, x => x.wet)])
                                      .range(["white", wetFill]);
          const hoursOfDayScaleSolidColor = d3.scaleLinear()
                                      .domain([0, d3.max(diaperChangeHrs, x => x.solid)])
                                      .range(["white", solidFill]);

          hoursChartSVG.selectAll('.hours-count')
                        .data(diaperChangeHrs)
                        .enter()
                          .append('rect')
                            .classed('.hours-count', true)
                            .attr('x', d => hoursOfDayScaleX(d.hourOfDay))
                            .attr('y', 0)
                            .attr('height', hoursBandHt)
                            .attr('width', hoursOfDayScaleX.bandwidth())
                            .attr('fill', d => hoursOfDayScaleSolidColor(d.solid));
          hoursChartSVG.selectAll('.hours-count')
                          .data(diaperChangeHrs)
                          .enter()
                            .append('rect')
                            .classed('.hours-count', true)
                            .attr('x', d => hoursOfDayScaleX(d.hourOfDay))
                            .attr('y', hoursBandHt)
                            .attr('height', hoursBandHt)
                            .attr('width', hoursOfDayScaleX.bandwidth())
                            .attr('fill', d => hoursOfDayScaleWetColor(d.wet));
                            
          const xAxisHoursChart = d3.axisBottom(hoursOfDayScaleX);
          hoursChartSVG.append('g')
                        .attr('class', 'x-axis hours-axis')
                        .attr('transform', `translate(0, ${hoursBandHt * 2})`)
                        .call(xAxisHoursChart);
          d3.selectAll('.hours-axis text')
                              .each(function(x, i){
                                const remove = w < 800 && i > 0 && i % 3 !== 0;
                                if (remove) {
                                  d3.select(this).remove();
                                }
                              });
          
          hoursChartSVG.append('text')
                          .classed('diaperchange-legend-text', true)
                          .attr('x', marginX + ((w - marginX) * 0.5))
                          .attr('y', hoursHt - 8)
                          .attr('fill', 'white')
                          .text('Hourly Frequency');

          const xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);

          const barChartScaleX = d3.scaleBand()
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

          const stack = d3.stack().keys(['wet','solid']);
          const series = stack(diaperChangesPerDay);

          const maxChanges = d3.max(diaperChangesPerDay, (change) => change.wet + change.solid);
          const barChartScaleY = d3.scaleLinear()
                            .domain([0, maxChanges])
                            .range([h - 2 * marginY, marginY]);

          barChartSVG.selectAll('g').data(series)
              .enter()
                .append('g')
                .attr('fill', d => d.key === 'wet' ? wetFill : solidFill)
                .selectAll('rect')
                .data(d => d)
                .enter()
                  .append('rect')
                  .attr('x', d => {
                    const xDay = barChartScaleX(d.data.day);
                    return xDay;
                  })
                  .attr('y', d => {
                    const y = barChartScaleY(d[1]);
                    return y;
                  })
                  .attr('height', d => {
                    const gHt = barChartScaleY(d[0]) - barChartScaleY(d[1]);
                    return gHt;
                  })
                  .attr('width', barChartScaleX.bandwidth());

          barChartSVG.selectAll('.diaperchange-bar-text').data(series)
              .enter()
                .append('g')
                .selectAll('text')
                .data(d => d)
                .enter()
                  .append('text')
                  .classed('diaperchange-bar-text', true)
                  .attr('x', d => {
                    const xDay = barChartScaleX(d.data.day);
                    return xDay;
                  })
                  .attr('dx', barChartScaleX.bandwidth() * 0.5)
                  .attr('y', d => {
                    const y = barChartScaleY(d[1]);
                    return y;
                  })
                  .attr('dy', d => {
                    const gHt = barChartScaleY(d[0]) - barChartScaleY(d[1]);
                    return gHt * (gHt < 140 ? 0.7 : 0.52);
                  })
                  .attr('fill', 'white')
                  .text(d => {
                    const cnt = d[0] === 0 ? d.data.wet : d.data.solid;
                    return '' + (cnt > 0 ? cnt : '');
                  });
          const xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
          const yAxisBarChart = d3.axisLeft(barChartScaleY);
    
          barChartSVG.append('g')
              .attr('class', 'x-axis')
              .attr('transform', 'translate(0, '+ (h - 2 * marginY) +')')
              .call(xAxisBarChart)
              .selectAll('text')
                .attr('transform', 'rotate(-45) translate(-22, 2)');

          barChartSVG.append('g')
              .attr('class', 'y-axis')
              .attr('transform', 'translate('+ marginX +',0)')
              .call(yAxisBarChart);

          const labelY = Math.floor(h * 0.5);
          barChartSVG.append('text')
              .attr('x', 14)
              .attr('y', labelY)
              .attr('fill', 'white')
              .classed('sleep-chart-axis-label', true)
              .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
              .text('Changes per Day');

          const wetCX = w * (w < 600 ? 0.32 : 0.42);
          const solidCX = w * (w < 600 ? 0.62 : 0.54);
          barChartSVG.append('circle')
                  .attr('cx', wetCX)
                  .attr('cy', 10)
                  .attr('r', 10)
                  .attr('fill', wetFill);
          barChartSVG.append('circle')
                  .attr('cx', solidCX)
                  .attr('cy', 10)
                  .attr('r', 10)
                  .attr('fill', solidFill);
          barChartSVG.append('text')
                  .classed('diaperchange-legend-text', true)
                  .attr('x', wetCX + 36)
                  .attr('y', 15)
                  .attr('fill', 'white')
                  .text('wet');
          barChartSVG.append('text')
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
      FeedingChart: () => {
        const plot = ($chartContainer, feedings, startDate, endDate) => {
          const $hoursChart = $chartContainer.find('#feeding-chart-hours');
          const $durationChart = $chartContainer.find('#feeding-chart-duration');
          const $bottleChart = $chartContainer.find('#feeding-chart-bottle');
          $hoursChart.empty();
          $durationChart.empty();
          $bottleChart.empty();

          const w = $chartContainer.width();
          const h = 320;
          const hoursHt = 68;
          const marginX = 44;
          const marginY = 44;

          const hoursChartSVG = d3.select(`#${$hoursChart.prop('id')}`).attr('width', w).attr('height', hoursHt);

          const hourlyData = BabyBuddy.makeHourlyChartingData(feedings, hoursChartSVG, '#226f97', { w, h:hoursHt, marginX, marginY });

          const xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);

          const barChartScaleX = d3.scaleBand()
                            .padding(0.1)
                            .domain(xDomain)
                            .range([marginX, w]);

          const matcher = /breast*/;
          const breastFeedings = feedings.filter(f => matcher.test(f.method));
          const bottleFeedings = feedings.filter(f => !matcher.test(f.method));

          if (!_.isEmpty(breastFeedings)) {
            const durationChartSVG = d3.select(`#${$durationChart.prop('id')}`).attr('width', w).attr('height', h);
            const leftFill = '#d77fa1';
            const rightFill = '#e6b2c6';
            const grouped = _.groupBy(breastFeedings, (s) => moment(s.start).startOf('day').toDate());
            const breastFeedsPerDay = Object.keys(grouped).map(day => {
              const breastFeeds = grouped[day];
              let left = 0;
              let right = 0;
              for (let feed of breastFeeds) {
                const d = moment.duration(feed.duration);
                if (d.isValid()) {
                  const incr = d.asMinutes() * (feed.method === 'both breasts' ? 0.5 : 1);
                  if (['left breast', 'both breasts'].includes(feed.method)) {
                    left += incr;
                  } else {
                    right += incr;
                  }
                }
              }
              return {
                day,
                left,
                right
              };
            });
  
            const stack = d3.stack().keys(['left','right']);
            const series = stack(breastFeedsPerDay);
  
            const maxDuration = d3.max(breastFeedsPerDay, (f) => f.left + f.right);
            const scaleY = d3.scaleLinear()
                              .domain([0, maxDuration])
                              .range([h - 2 * marginY, marginY]);
  
            durationChartSVG.selectAll('g').data(series)
                .enter()
                  .append('g')
                  .attr('fill', d => d.key === 'left' ? leftFill : rightFill)
                  .selectAll('rect')
                  .data(d => d)
                  .enter()
                    .append('rect')
                    .attr('x', d => {
                      const xDay = barChartScaleX(d.data.day);
                      return xDay;
                    })
                    .attr('y', d => {
                      const y = scaleY(d[1]);
                      return y;
                    })
                    .attr('height', d => {
                      const gHt = scaleY(d[0]) - scaleY(d[1]);
                      return gHt;
                    })
                    .attr('width', barChartScaleX.bandwidth());
  
            durationChartSVG.selectAll('.breast-feeding-bar-text').data(series)
                .enter()
                  .append('g')
                  .selectAll('text')
                  .data(d => d)
                  .enter()
                    .append('text')
                    .classed('breast-feeding-bar-text', true)
                    .attr('x', d => {
                      const xDay = barChartScaleX(d.data.day);
                      return xDay;
                    })
                    .attr('dx', barChartScaleX.bandwidth() * 0.5)
                    .attr('y', d => {
                      const y = scaleY(d[1]);
                      return y;
                    })
                    .attr('dy', d => {
                      const gHt = scaleY(d[0]) - scaleY(d[1]);
                      return gHt * (gHt < 140 ? 0.7 : 0.52);
                    })
                    .attr('fill', 'white')
                    .text(d => {
                      const cnt = d[0] === 0 ? d.data.left : d.data.right;
                      return '' + (cnt > 0 ? Math.round(cnt) : '');
                    });
            const xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
            const yAxisBarChart = d3.axisLeft(scaleY);
      
            durationChartSVG.append('g')
                .attr('class', 'x-axis')
                .attr('transform', 'translate(0, '+ (h - 2 * marginY) +')')
                .call(xAxisBarChart)
                .selectAll('text')
                  .attr('transform', 'rotate(-45) translate(-22, 2)');
  
            durationChartSVG.append('g')
                .attr('class', 'y-axis')
                .attr('transform', 'translate('+ marginX +',0)')
                .call(yAxisBarChart);
  
            const labelY = Math.floor(h * 0.43);
            durationChartSVG.append('text')
                .attr('x', 14)
                .attr('y', labelY)
                .attr('fill', 'white')
                .classed('chart-axis-label', true)
                .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
                .text('Minutes per Day');
  
            const leftCX = w * (w < 600 ? 0.32 : 0.42);
            const rightCX = w * (w < 600 ? 0.62 : 0.54);
            durationChartSVG.append('circle')
                    .attr('cx', leftCX)
                    .attr('cy', 10)
                    .attr('r', 10)
                    .attr('fill', leftFill);
            durationChartSVG.append('circle')
                    .attr('cx', rightCX)
                    .attr('cy', 10)
                    .attr('r', 10)
                    .attr('fill', rightFill);
            durationChartSVG.append('text')
                    .classed('breast-feeding-legend-text', true)
                    .attr('x', leftCX + 36)
                    .attr('y', 15)
                    .attr('fill', 'white')
                    .text('left');
            durationChartSVG.append('text')
                    .classed('breast-feeding-legend-text', true)
                    .attr('x', rightCX + 40)
                    .attr('y', 15)
                    .attr('fill', 'white')
                    .text('right');
          }


          if (!_.isEmpty(bottleFeedings)) {
            const bottleChartSVG = d3.select(`#${$bottleChart.prop('id')}`).attr('width', w).attr('height', h);
            let groupedByDays = _.groupBy(bottleFeedings, (s) => moment(s.start).startOf('day'));

            const amountPerDay = _.reduce(
                groupedByDays,
                (days, amtThatDay, day) => {
                  days.push(amtThatDay.reduce((totalAmt, f) => {
                    totalAmt.amount += f.amount;
                    return totalAmt;
                  }, {day: day, amount: 0}))
                  return days;
                }, [])
  
            const maxAmt = d3.max(amountPerDay, (f) => f.amount);
            const scaleY = d3.scaleLinear()
                              .domain([0, maxAmt])
                              .range([h - marginY, marginY]);
            const xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
            const yAxisBarChart = d3.axisLeft(scaleY);
      
            bottleChartSVG.append('g')
                .attr('class', 'x-axis')
                .attr('transform', 'translate(0, '+ (h - marginY) +')')
                .call(xAxisBarChart)
                .selectAll('text')
                  .attr('transform', 'rotate(-45) translate(-22, 2)');
                
          
            bottleChartSVG.append('g')
                .attr('class', 'y-axis')
                .attr('transform', 'translate('+ marginX +',0)')
                .call(yAxisBarChart);
            
            const labelY = Math.floor(h * 0.5);
            bottleChartSVG.append('text')
                .attr('x', 12)
                .attr('y', labelY)
                .attr('fill', 'white')
                .classed('chart-axis-label', true)
                .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
                .text('Ounces per Day');
      
            bottleChartSVG.selectAll('.feeding-chart-bar')
                .data(amountPerDay)
                  .enter()
                  .append('rect')
                  .classed('feeding-chart-bar', true)
                  .attr('x', d => barChartScaleX(moment(d.day).toDate()))
                  .attr('y', d => scaleY(d.amount))
                  .attr('width', barChartScaleX.bandwidth())
                  .attr('height', d => h - marginY - scaleY(d.amount));
          }
          
        };

        return {
          plot
        }
      },
      SleepChart: () => {
        const plot = ($chartContainer, sleepSessions, startDate, endDate) => {
          const $barChart = $chartContainer.find('#sleep-chart-days')
          const $hoursChart = $chartContainer.find('#sleep-chart-hours');
          $barChart.empty();
          $hoursChart.empty();
          const w = $chartContainer.width();
          const h = 320;
          const hoursHt = 68;
          const marginX = 44;
          const marginY = 44;

          const barChartSVG = d3.select(`#${$barChart.prop('id')}`).attr('width', w).attr('height', h);
          const hoursChartSVG = d3.select(`#${$hoursChart.prop('id')}`).attr('width', w).attr('height', hoursHt);
          
          const hourlyData = BabyBuddy.makeHourlyChartingData(
            sleepSessions,
            hoursChartSVG,
            '#ff8f00', {
              w,
              h:hoursHt,
              marginX,
              marginY
          });

          const xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);

          const barChartScaleX = d3.scaleBand()
                            .padding(0.1)
                            .domain(xDomain)
                            .range([marginX, w - marginX]);
          let groupedByDays = _.groupBy(sleepSessions, (s) => moment(s.start).startOf('day'));

          const sleepTotalPerDay = _.reduce(
              groupedByDays,
              (days, sleepThatDay, day) => {
                days.push(sleepThatDay.reduce((totalSleep, s) => {
                  totalSleep.hours += moment.duration(s.duration).asHours();
                  return totalSleep;
                }, {day: day, hours: 0}))
                return days;
              }, [])

          const maxSleep = d3.max(sleepTotalPerDay, (daySleep) => daySleep.hours);
          const barChartScaleY = d3.scaleLinear()
                            .domain([0, maxSleep])
                            .range([h - marginY, marginY]);
          const xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
          const yAxisBarChart = d3.axisLeft(barChartScaleY);
    
          barChartSVG.append('g')
              .attr('class', 'x-axis')
              .attr('transform', 'translate(0, '+ (h - marginY) +')')
              .call(xAxisBarChart)
              .selectAll('text')
                .attr('transform', 'rotate(-45) translate(-22, 2)');
              
        
          barChartSVG.append('g')
              .attr('class', 'y-axis')
              .attr('transform', 'translate('+ marginX +',0)')
              .call(yAxisBarChart);
          
          const labelY = Math.floor(h * 0.5);
          barChartSVG.append('text')
              .attr('x', 12)
              .attr('y', labelY)
              .attr('fill', 'white')
              .classed('sleep-chart-axis-label', true)
              .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
              .text('Hours per Day');
    
          barChartSVG.selectAll('.sleep-chart-bar')
              .data(sleepTotalPerDay)
                .enter()
                .append('rect')
                .classed('sleep-chart-bar', true)
                .attr('x', d => barChartScaleX(moment(d.day).toDate()))
                .attr('y', d => barChartScaleY(d.hours))
                .attr('width', barChartScaleX.bandwidth())
                .attr('height', d => h - marginY - barChartScaleY(d.hours));
        };
  
        return {
          plot
        };
      },
      TummyTimeChart: () => {
        const plot = ($chartContainer, tummyTimeSessions, startDate, endDate) => {

          const $barChart = $chartContainer.find('#tummytime-chart');
          $barChart.empty();

          const w = $chartContainer.width();
          const h = 320;
          const marginX = 44;
          const marginY = 44;

          const barChartSVG = d3.select(`#${$barChart.prop('id')}`).attr('width', w).attr('height', h);

          const xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);

          const barChartScaleX = d3.scaleBand()
                            .padding(0.1)
                            .domain(xDomain)
                            .range([marginX, w - marginX]);
          let groupedByDays = _.groupBy(tummyTimeSessions, (t) => moment(t.start).startOf('day'));

          const totalPerDay = _.reduce(
              groupedByDays,
              (days, timeThatDay, day) => {
                days.push(timeThatDay.reduce((totalTime, s) => {
                  totalTime.minutes += moment.duration(s.duration).asMinutes();
                  return totalTime;
                }, {day: day, minutes: 0}))
                return days;
              }, [])

          const maxTime = d3.max(totalPerDay, (t) => t.minutes);
          const barChartScaleY = d3.scaleLinear()
                            .domain([0, maxTime])
                            .range([h - marginY, marginY]);
          const xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
          const yAxisBarChart = d3.axisLeft(barChartScaleY);
    
          barChartSVG.append('g')
              .attr('class', 'x-axis')
              .attr('transform', 'translate(0, '+ (h - marginY) +')')
              .call(xAxisBarChart)
              .selectAll('text')
                .attr('transform', 'rotate(-45) translate(-22, 2)');
              
        
          barChartSVG.append('g')
              .attr('class', 'y-axis')
              .attr('transform', 'translate('+ marginX +',0)')
              .call(yAxisBarChart);
          
          const labelY = Math.floor(h * 0.5);
          barChartSVG.append('text')
              .attr('x', 12)
              .attr('y', labelY)
              .attr('fill', 'white')
              .classed('chart-axis-label', true)
              .attr('transform', 'rotate(-90, 14, ' + labelY + ')')
              .text('Minutes per Day');
    
          barChartSVG.selectAll('.tummytime-chart-bar')
              .data(totalPerDay)
                .enter()
                .append('rect')
                .classed('tummytime-chart-bar', true)
                .attr('x', d => barChartScaleX(moment(d.day).toDate()))
                .attr('y', d => barChartScaleY(d.minutes))
                .attr('width', barChartScaleX.bandwidth())
                .attr('height', d => h - marginY - barChartScaleY(d.minutes));

        };
        
        return {
          plot
        };
      },
      makeHourlyChartingData: (sessions, hoursChartSVG, color, { w, h, marginX, marginY }) => {
        let sessionHours = {};
        sessions.forEach(s => {
          const start = moment(s.start);
          const end = moment(s.end);
          while(start.isValid() && end.isValid() && end.isValid() && start.isBefore(end)) {
            const hr = start.toDate().getHours();
            if (hr in sessionHours) {
              sessionHours[hr].count++;
            } else {
              sessionHours[hr] = {
                count:1,
                hour:hr,
                hourOfDay: removeZeroFromHour(start.format('hh a'))
              };
            }
            start.add(1, 'hours');
          }
        });
        
        sessionHours = Object.values(sessionHours);

        const startOfDay = moment().startOf('day');
        const endOfDay = startOfDay.clone().endOf('day');
        const hoursOfDay = [];
        while(startOfDay.isBefore(endOfDay)) {
          let hrOfDay = removeZeroFromHour(startOfDay.format('hh a'));
          hoursOfDay.push(hrOfDay);
          const match = sessionHours.find(c => c.hourOfDay === hrOfDay);
          if (!match) {
            sessionHours.push({
              count: 0,
              hour: startOfDay.toDate().getHours(),
              hourOfDay: hrOfDay
            });
          }

          hoursOfDay.push(hrOfDay);
          startOfDay.add(1, 'hours');
        }

        const hoursOfDayScaleX = d3.scaleBand().domain(hoursOfDay).range([marginX, w - marginX]);
        const hoursOfDayScaleColor = d3.scaleLinear()
                                    .domain([0, d3.max(sessionHours, x => x.count)])
                                    .range(["white", color]);

        hoursChartSVG.selectAll('.hours-count')
                                    .data(sessionHours)
                                    .enter()
                                      .append('rect')
                                      // .classed('.hours-count', true)
                                      .classed('hours-count', true)
                                      .attr('x', d => hoursOfDayScaleX(d.hourOfDay))
                                      .attr('y', 0)
                                      .attr('height', h - 45)
                                      .attr('width', hoursOfDayScaleX.bandwidth())
                                      .attr('fill', d => hoursOfDayScaleColor(d.count));
                          
        const xAxisHoursChart = d3.axisBottom(hoursOfDayScaleX);
        hoursChartSVG.append('g')
                      .attr('class', 'x-axis hours-axis')
                      .attr('transform', 'translate(0, ' + (h - 45) +')')
                      .call(xAxisHoursChart);
        d3.selectAll('.hours-axis text')
                            .each(function(x, i){
                              const remove = w < 800 && i > 0 && i % 3 !== 0;
                              if (remove) {
                                d3.select(this).remove();
                              }
                            });
        hoursChartSVG.append('text')
                      .classed('sleep-chart-axis-label', true)
                      .attr('x', marginX + ((w - marginX) * 0.5))
                      .attr('y', h - 8)
                      .attr('fill', 'white')
                      .text('Hourly Frequency');
                            
        return { sessionHours, hoursOfDay, hoursOfDayScaleX, hoursOfDayScaleColor };
      },
      makeDaysDomain: (startDate, endDate) => {
        const curDate = startDate.clone();
        const domain = [];
        while(curDate.isSameOrBefore(endDate)) {
          domain.push(curDate.startOf('day').toDate());
          curDate.add(1, 'days');
        }
        return domain;
      },
      updateTimerNavSpan: () => {
        if ($timerCountSpan) {
          return $.get(BabyBuddy.ApiRoutes.activeTimersCount()).then(response => {
            const n = response.length;
            $timerCountSpan.html(''+n);
            if (n) {
              $timerCountSpan.show();
            } else {
              $timerCountSpan.hide();
            }
          });
        }
      }
    };

    window.addEventListener('focus', BabyBuddy.updateTimerNavSpan, false);
    if (!timerCheckIntervalId && $timerCountSpan) {
      BabyBuddy.updateTimerNavSpan();
      timerCheckIntervalId = setInterval(BabyBuddy.updateTimerNavSpan, 6500);
      $(window).on('beforeunload', () => {
        clearInterval(timerCheckIntervalId);
      });
    }

    return BabyBuddy;
}();

function removeZeroFromHour(hourOfDay) {
  if (hourOfDay.startsWith('0', '')) {
    return hourOfDay.replace('0', '');
  }
  return hourOfDay;
} 

setUpAJAX();
