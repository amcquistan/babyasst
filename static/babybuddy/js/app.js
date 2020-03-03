"use strict";

/* Baby Buddy
 *
 * Default namespace for the Baby Buddy app.
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Baby Asst requires jQuery.');
}

function setUpAJAX() {
  var csrftoken = getCookie('csrftoken');
  jQuery.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });
}

function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}

var BabyBuddy = function () {
  var $timerCountSpan = $('#timers-count');
  var timerCheckIntervalId;
  var BabyBuddy = {
    host: function host() {
      return "".concat(window.location.protocol, "//").concat(window.location.host);
    },
    ApiRoutes: {
      activeTimersCount: function activeTimersCount() {
        return "/api/active-timers/";
      },
      children: function children() {
        return '/api/children/';
      },
      child: function child(childId) {
        return "/api/children/".concat(childId, "/");
      },
      childTimeline: function childTimeline(childId, start, end) {
        return "/api/children/".concat(childId, "/timeline/").concat(start, "/").concat(end, "/");
      },
      notification: function notification(notificationId) {
        return "/api/notifications/".concat(notificationId, "/");
      },
      account: function account(accountId) {
        return "/api/accounts/".concat(accountId, "/");
      },
      accountApplyPromo: function accountApplyPromo(accountId) {
        return "/api/accounts/".concat(accountId, "/apply-promo-code/");
      },
      accounts: function accounts() {
        return '/api/accounts/';
      },
      baths: function baths(childId) {
        return "/api/children/".concat(childId, "/baths/");
      },
      bathDetail: function bathDetail(childId, bathId) {
        return "/api/children/".concat(childId, "/baths/").concat(bathId, "/");
      },
      diaperChanges: function diaperChanges(childId) {
        return "/api/children/".concat(childId, "/changes/");
      },
      diaperChangeDetail: function diaperChangeDetail(childId, changeId) {
        return "/api/children/".concat(childId, "/changes/").concat(changeId, "/");
      },
      feedings: function feedings(childId) {
        return "/api/children/".concat(childId, "/feeding/");
      },
      feedingDetail: function feedingDetail(childId, feedingId) {
        return "/api/children/".concat(childId, "/feeding/").concat(feedingId, "/");
      },
      notes: function notes(childId) {
        return "/api/children/".concat(childId, "/notes/");
      },
      noteDetail: function noteDetail(childId, noteId) {
        return "/api/children/".concat(childId, "/notes/").concat(noteId, "/");
      },
      sleeping: function sleeping(childId) {
        return "/api/children/".concat(childId, "/sleep/");
      },
      sleepingDetail: function sleepingDetail(childId, sleepId) {
        return "/api/children/".concat(childId, "/sleep/").concat(sleepId, "/");
      },
      temperatures: function temperatures(childId) {
        return "/api/children/".concat(childId, "/temperature/");
      },
      temperatureDetail: function temperatureDetail(childId, temperatureId) {
        return "/api/children/".concat(childId, "/temperature/").concat(temperatureId, "/");
      },
      tummyTime: function tummyTime(childId) {
        return "/api/children/".concat(childId, "/tummy-time/");
      },
      tummyTimeDetail: function tummyTimeDetail(childId, tummyTimeId) {
        return "/api/children/".concat(childId, "/tummy-time/").concat(tummyTimeId, "/");
      },
      weight: function weight(childId) {
        return "/api/children/".concat(childId, "/weight/");
      },
      weightDetail: function weightDetail(childId, weightId) {
        return "/api/children/".concat(childId, "/weight/").concat(weightId, "/");
      },
      timers: function timers() {
        return "/api/timers/";
      },
      timerDetail: function timerDetail(timerId) {
        return "/api/timers/".concat(timerId, "/");
      }
    },
    setDurationPickerConstraints: function setDurationPickerConstraints(initialized, startDefault, endDefault, $startPicker, $endPicker) {
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
      } // $startPicker.datetimepicker('viewDate', startDefault);
      // $endPicker.datetimepicker('viewDate', endDefault);


      $startPicker.on('change.datetimepicker', function (evt) {
        var minEndDate = moment(evt.date).add(1, 'minutes');

        if (minEndDate.isAfter(moment())) {
          minEndDate = moment();
        }

        $endPicker.datetimepicker('minDate', minEndDate);
      });
      $endPicker.on('change.datetimepicker', function (evt) {
        $startPicker.datetimepicker('maxDate', moment(evt.date).subtract(1, 'minutes'));
      });
    },
    ChildTimeActivityDao: function ChildTimeActivityDao() {
      var timeField = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'time';
      var activitiesMap = new Map();
      var filteredActivitiesMap = new Map();
      var fetchedAllData = false;

      var fetch = function fetch(url, start, end) {
        var fetchMoreData = true;
        activitiesMap.forEach(function (activity, id) {
          var actTime = moment(activity[timeField]);

          if (start.isSameOrBefore(actTime) && end.isSameOrAfter(actTime) && !filteredActivitiesMap.has(activity.id)) {
            filteredActivitiesMap.set(activity.id, activity);
          } else if (start.isAfter(actTime)) {
            fetchMoreData = false;
          }
        });

        if (!fetchedAllData && fetchMoreData && url) {
          return $.get(url).then(function (response) {
            fetchedAllData = !Boolean(response.next);
            response.results.forEach(function (activity) {
              if (!activitiesMap.has(activity.id)) {
                activitiesMap.set(activity.id, activity);
              }
            });
            return fetch(response.next, start, end);
          });
        }

        var copy = Array.from(filteredActivitiesMap.values());
        filteredActivitiesMap = new Map();
        activitiesMap = new Map();
        fetchedAllData = false;
        return new Promise(function (resolve, reject) {
          return resolve(copy);
        });
      };

      return {
        fetch: fetch
      };
    },
    ChildDurationActivityDao: function ChildDurationActivityDao() {
      var activitiesMap = new Map();
      var filteredActivitiesMap = new Map();
      var fetchedAllData = false;

      var fetch = function fetch(url, start, end) {
        var fetchMoreData = true;
        activitiesMap.forEach(function (activity, id) {
          var actStart = moment(activity.start);
          var actEnd = moment(activity.end);

          if (start.isSameOrBefore(actStart) && end.isSameOrAfter(actEnd) && !filteredActivitiesMap.has(activity.id)) {
            filteredActivitiesMap.set(activity.id, activity);
          } else if (start.isAfter(actStart)) {
            fetchMoreData = false;
          }
        });

        if (!fetchedAllData && fetchMoreData && url) {
          return $.get(url).then(function (response) {
            fetchedAllData = !Boolean(response.next);
            response.results.forEach(function (activity) {
              if (!activitiesMap.has(activity.id)) {
                activitiesMap.set(activity.id, activity);
              }
            });
            return fetch(response.next, start, end);
          });
        }

        var copy = Array.from(filteredActivitiesMap.values());
        filteredActivitiesMap = new Map();
        activitiesMap = new Map();
        fetchedAllData = false;
        return new Promise(function (resolve, reject) {
          return resolve(copy);
        });
      };

      return {
        fetch: fetch
      };
    },
    DiaperChangeChart: function DiaperChangeChart() {
      var plot = function plot($chartContainer, diaperChanges, startDate, endDate) {
        var $barChartDays = $chartContainer.find('#diaperchange-chart-days');
        var $hoursChart = $chartContainer.find('#diaperchange-chart-hours');
        $barChartDays.empty();
        $hoursChart.empty();
        var hoursHt = 85;
        var marginX = 38;
        var marginY = 30;
        var w = $chartContainer.width();
        var h = 320;
        var hoursBandHt = 17;
        var wetFill = '#007bff';
        var solidFill = '#ff8f00';
        var barChartSVG = d3.select("#".concat($barChartDays.prop('id'))).attr('width', w).attr('height', h);
        var hoursChartSVG = d3.select("#".concat($hoursChart.prop('id'))).attr('width', w).attr('height', hoursHt);
        var diaperChangeHrs = {};
        diaperChanges.forEach(function (dc) {
          var diaperChangeTime = moment(dc.time);
          var hr = diaperChangeTime.toDate().getHours();

          if (diaperChangeTime.isValid()) {
            if (hr in diaperChangeHrs) {
              diaperChangeHrs[hr].wet += dc.wet ? 1 : 0;
              diaperChangeHrs[hr].solid += dc.solid ? 1 : 0;
            } else {
              diaperChangeHrs[hr] = {
                wet: dc.wet ? 1 : 0,
                solid: dc.solid ? 1 : 0,
                hour: hr,
                hourOfDay: removeZeroFromHour(diaperChangeTime.format('hh a'))
              };
            }
          }
        });
        diaperChangeHrs = Object.values(diaperChangeHrs);
        var startOfDay = moment().startOf('day');
        var endOfDay = startOfDay.clone().endOf('day');
        var hoursOfDay = [];

        var _loop = function _loop() {
          var hrOfDay = removeZeroFromHour(startOfDay.format('hh a'));
          hoursOfDay.push(hrOfDay);
          var match = diaperChangeHrs.find(function (c) {
            return c.hourOfDay === hrOfDay;
          });

          if (!match) {
            diaperChangeHrs.push({
              wet: 0,
              solid: 0,
              hour: startOfDay.toDate().getHours(),
              hourOfDay: hrOfDay
            });
          }

          startOfDay.add(1, 'hours');
        };

        while (startOfDay.isBefore(endOfDay)) {
          _loop();
        }

        var hoursOfDayScaleX = d3.scaleBand().domain(hoursOfDay).range([marginX, w]);
        var hoursOfDayScaleWetColor = d3.scaleLinear().domain([0, d3.max(diaperChangeHrs, function (x) {
          return x.wet;
        })]).range(["white", wetFill]);
        var hoursOfDayScaleSolidColor = d3.scaleLinear().domain([0, d3.max(diaperChangeHrs, function (x) {
          return x.solid;
        })]).range(["white", solidFill]);
        hoursChartSVG.selectAll('.hours-count').data(diaperChangeHrs).enter().append('rect').classed('.hours-count', true).attr('x', function (d) {
          return hoursOfDayScaleX(d.hourOfDay);
        }).attr('y', 0).attr('height', hoursBandHt).attr('width', hoursOfDayScaleX.bandwidth()).attr('fill', function (d) {
          return hoursOfDayScaleSolidColor(d.solid);
        });
        hoursChartSVG.selectAll('.hours-count').data(diaperChangeHrs).enter().append('rect').classed('.hours-count', true).attr('x', function (d) {
          return hoursOfDayScaleX(d.hourOfDay);
        }).attr('y', hoursBandHt).attr('height', hoursBandHt).attr('width', hoursOfDayScaleX.bandwidth()).attr('fill', function (d) {
          return hoursOfDayScaleWetColor(d.wet);
        });
        var xAxisHoursChart = d3.axisBottom(hoursOfDayScaleX);
        hoursChartSVG.append('g').attr('class', 'x-axis hours-axis').attr('transform', "translate(0, ".concat(hoursBandHt * 2, ")")).call(xAxisHoursChart);
        d3.selectAll('.hours-axis text').each(function (x, i) {
          var remove = w < 800 && i > 0 && i % 3 !== 0;

          if (remove) {
            d3.select(this).remove();
          }
        });
        hoursChartSVG.append('text').classed('diaperchange-legend-text', true).attr('x', marginX + (w - marginX) * 0.5).attr('y', hoursHt - 8).attr('fill', 'white').text('Hourly Frequency');
        var xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);
        var barChartScaleX = d3.scaleBand().padding(0.1).domain(xDomain).range([marginX, w]);

        var grouped = _.groupBy(diaperChanges, function (s) {
          return moment(s.time).startOf('day').toDate();
        });

        var diaperChangesPerDay = Object.keys(grouped).map(function (day) {
          var changes = grouped[day];
          var wet = 0;
          var solid = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = changes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var change = _step.value;

              if (change.wet) {
                wet++;
              }

              if (change.solid) {
                solid++;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return {
            day: day,
            wet: wet,
            solid: solid
          };
        });
        var stack = d3.stack().keys(['wet', 'solid']);
        var series = stack(diaperChangesPerDay);
        var maxChanges = d3.max(diaperChangesPerDay, function (change) {
          return change.wet + change.solid;
        });
        var barChartScaleY = d3.scaleLinear().domain([0, maxChanges]).range([h - 2 * marginY, marginY]);
        barChartSVG.selectAll('g').data(series).enter().append('g').attr('fill', function (d) {
          return d.key === 'wet' ? wetFill : solidFill;
        }).selectAll('rect').data(function (d) {
          return d;
        }).enter().append('rect').attr('x', function (d) {
          var xDay = barChartScaleX(d.data.day);
          return xDay;
        }).attr('y', function (d) {
          var y = barChartScaleY(d[1]);
          return y;
        }).attr('height', function (d) {
          var gHt = barChartScaleY(d[0]) - barChartScaleY(d[1]);
          return gHt;
        }).attr('width', barChartScaleX.bandwidth());
        barChartSVG.selectAll('.diaperchange-bar-text').data(series).enter().append('g').selectAll('text').data(function (d) {
          return d;
        }).enter().append('text').classed('diaperchange-bar-text', true).attr('x', function (d) {
          var xDay = barChartScaleX(d.data.day);
          return xDay;
        }).attr('dx', barChartScaleX.bandwidth() * 0.5).attr('y', function (d) {
          var y = barChartScaleY(d[1]);
          return y;
        }).attr('dy', function (d) {
          var gHt = barChartScaleY(d[0]) - barChartScaleY(d[1]);
          return gHt * (gHt < 140 ? 0.7 : 0.52);
        }).attr('fill', 'white').text(function (d) {
          var cnt = d[0] === 0 ? d.data.wet : d.data.solid;
          return '' + (cnt > 0 ? cnt : '');
        });
        var xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
        var yAxisBarChart = d3.axisLeft(barChartScaleY);
        barChartSVG.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (h - 2 * marginY) + ')').call(xAxisBarChart).selectAll('text').attr('transform', 'rotate(-45) translate(-22, 2)');
        barChartSVG.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + marginX + ',0)').call(yAxisBarChart);
        var labelY = Math.floor(h * 0.5);
        barChartSVG.append('text').attr('x', 14).attr('y', labelY).attr('fill', 'white').classed('sleep-chart-axis-label', true).attr('transform', 'rotate(-90, 14, ' + labelY + ')').text('Changes per Day');
        var wetCX = w * (w < 600 ? 0.32 : 0.42);
        var solidCX = w * (w < 600 ? 0.62 : 0.54);
        barChartSVG.append('circle').attr('cx', wetCX).attr('cy', 10).attr('r', 10).attr('fill', wetFill);
        barChartSVG.append('circle').attr('cx', solidCX).attr('cy', 10).attr('r', 10).attr('fill', solidFill);
        barChartSVG.append('text').classed('diaperchange-legend-text', true).attr('x', wetCX + 36).attr('y', 15).attr('fill', 'white').text('wet');
        barChartSVG.append('text').classed('diaperchange-legend-text', true).attr('x', solidCX + 40).attr('y', 15).attr('fill', 'white').text('solid');
      };

      return {
        plot: plot
      };
    },
    FeedingChart: function FeedingChart() {
      var plot = function plot($chartContainer, feedings, startDate, endDate) {
        var $hoursChart = $chartContainer.find('#feeding-chart-hours');
        var $durationChart = $chartContainer.find('#feeding-chart-duration');
        var $bottleChart = $chartContainer.find('#feeding-chart-bottle');
        $hoursChart.empty();
        $durationChart.empty();
        $bottleChart.empty();
        var w = $chartContainer.width();
        var h = 320;
        var hoursHt = 68;
        var marginX = 44;
        var marginY = 44;
        var hoursChartSVG = d3.select("#".concat($hoursChart.prop('id'))).attr('width', w).attr('height', hoursHt);
        var hourlyData = BabyBuddy.makeHourlyChartingData(feedings, hoursChartSVG, '#226f97', {
          w: w,
          h: hoursHt,
          marginX: marginX,
          marginY: marginY
        });
        var xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);
        var barChartScaleX = d3.scaleBand().padding(0.1).domain(xDomain).range([marginX, w]);
        var matcher = /breast*/;
        var breastFeedings = feedings.filter(function (f) {
          return matcher.test(f.method);
        });
        var bottleFeedings = feedings.filter(function (f) {
          return !matcher.test(f.method);
        });

        if (!_.isEmpty(breastFeedings)) {
          var durationChartSVG = d3.select("#".concat($durationChart.prop('id'))).attr('width', w).attr('height', h);
          var leftFill = '#d77fa1';
          var rightFill = '#e6b2c6';

          var grouped = _.groupBy(breastFeedings, function (s) {
            return moment(s.start).startOf('day').toDate();
          });

          var breastFeedsPerDay = Object.keys(grouped).map(function (day) {
            var breastFeeds = grouped[day];
            var left = 0;
            var right = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = breastFeeds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var feed = _step2.value;
                var d = moment.duration(feed.duration);

                if (d.isValid()) {
                  var incr = d.asMinutes() * (feed.method === 'both breasts' ? 0.5 : 1);

                  if (['left breast', 'both breasts'].includes(feed.method)) {
                    left += incr;
                  } else {
                    right += incr;
                  }
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return {
              day: day,
              left: left,
              right: right
            };
          });
          var stack = d3.stack().keys(['left', 'right']);
          var series = stack(breastFeedsPerDay);
          var maxDuration = d3.max(breastFeedsPerDay, function (f) {
            return f.left + f.right;
          });
          var scaleY = d3.scaleLinear().domain([0, maxDuration]).range([h - 2 * marginY, marginY]);
          durationChartSVG.selectAll('g').data(series).enter().append('g').attr('fill', function (d) {
            return d.key === 'left' ? leftFill : rightFill;
          }).selectAll('rect').data(function (d) {
            return d;
          }).enter().append('rect').attr('x', function (d) {
            var xDay = barChartScaleX(d.data.day);
            return xDay;
          }).attr('y', function (d) {
            var y = scaleY(d[1]);
            return y;
          }).attr('height', function (d) {
            var gHt = scaleY(d[0]) - scaleY(d[1]);
            return gHt;
          }).attr('width', barChartScaleX.bandwidth());
          durationChartSVG.selectAll('.breast-feeding-bar-text').data(series).enter().append('g').selectAll('text').data(function (d) {
            return d;
          }).enter().append('text').classed('breast-feeding-bar-text', true).attr('x', function (d) {
            var xDay = barChartScaleX(d.data.day);
            return xDay;
          }).attr('dx', barChartScaleX.bandwidth() * 0.5).attr('y', function (d) {
            var y = scaleY(d[1]);
            return y;
          }).attr('dy', function (d) {
            var gHt = scaleY(d[0]) - scaleY(d[1]);
            return gHt * (gHt < 140 ? 0.7 : 0.52);
          }).attr('fill', 'white').text(function (d) {
            var cnt = d[0] === 0 ? d.data.left : d.data.right;
            return '' + (cnt > 0 ? Math.round(cnt) : '');
          });
          var xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
          var yAxisBarChart = d3.axisLeft(scaleY);
          durationChartSVG.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (h - 2 * marginY) + ')').call(xAxisBarChart).selectAll('text').attr('transform', 'rotate(-45) translate(-22, 2)');
          durationChartSVG.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + marginX + ',0)').call(yAxisBarChart);
          var labelY = Math.floor(h * 0.43);
          durationChartSVG.append('text').attr('x', 14).attr('y', labelY).attr('fill', 'white').classed('chart-axis-label', true).attr('transform', 'rotate(-90, 14, ' + labelY + ')').text('Minutes per Day');
          var leftCX = w * (w < 600 ? 0.32 : 0.42);
          var rightCX = w * (w < 600 ? 0.62 : 0.54);
          durationChartSVG.append('circle').attr('cx', leftCX).attr('cy', 10).attr('r', 10).attr('fill', leftFill);
          durationChartSVG.append('circle').attr('cx', rightCX).attr('cy', 10).attr('r', 10).attr('fill', rightFill);
          durationChartSVG.append('text').classed('breast-feeding-legend-text', true).attr('x', leftCX + 36).attr('y', 15).attr('fill', 'white').text('left');
          durationChartSVG.append('text').classed('breast-feeding-legend-text', true).attr('x', rightCX + 40).attr('y', 15).attr('fill', 'white').text('right');
        }

        if (!_.isEmpty(bottleFeedings)) {
          var bottleChartSVG = d3.select("#".concat($bottleChart.prop('id'))).attr('width', w).attr('height', h);

          var groupedByDays = _.groupBy(bottleFeedings, function (s) {
            return moment(s.start).startOf('day');
          });

          var amountPerDay = _.reduce(groupedByDays, function (days, amtThatDay, day) {
            days.push(amtThatDay.reduce(function (totalAmt, f) {
              totalAmt.amount += f.amount;
              return totalAmt;
            }, {
              day: day,
              amount: 0
            }));
            return days;
          }, []);

          var maxAmt = d3.max(amountPerDay, function (f) {
            return f.amount;
          });

          var _scaleY = d3.scaleLinear().domain([0, maxAmt]).range([h - marginY, marginY]);

          var _xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));

          var _yAxisBarChart = d3.axisLeft(_scaleY);

          bottleChartSVG.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (h - marginY) + ')').call(_xAxisBarChart).selectAll('text').attr('transform', 'rotate(-45) translate(-22, 2)');
          bottleChartSVG.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + marginX + ',0)').call(_yAxisBarChart);

          var _labelY = Math.floor(h * 0.5);

          bottleChartSVG.append('text').attr('x', 12).attr('y', _labelY).attr('fill', 'white').classed('chart-axis-label', true).attr('transform', 'rotate(-90, 14, ' + _labelY + ')').text('Ounces per Day');
          bottleChartSVG.selectAll('.feeding-chart-bar').data(amountPerDay).enter().append('rect').classed('feeding-chart-bar', true).attr('x', function (d) {
            return barChartScaleX(moment(d.day).toDate());
          }).attr('y', function (d) {
            return _scaleY(d.amount);
          }).attr('width', barChartScaleX.bandwidth()).attr('height', function (d) {
            return h - marginY - _scaleY(d.amount);
          });
        }
      };

      return {
        plot: plot
      };
    },
    SleepChart: function SleepChart() {
      var plot = function plot($chartContainer, sleepSessions, startDate, endDate) {
        var $barChart = $chartContainer.find('#sleep-chart-days');
        var $hoursChart = $chartContainer.find('#sleep-chart-hours');
        $barChart.empty();
        $hoursChart.empty();
        var w = $chartContainer.width();
        var h = 320;
        var hoursHt = 68;
        var marginX = 44;
        var marginY = 44;
        var barChartSVG = d3.select("#".concat($barChart.prop('id'))).attr('width', w).attr('height', h);
        var hoursChartSVG = d3.select("#".concat($hoursChart.prop('id'))).attr('width', w).attr('height', hoursHt);
        var hourlyData = BabyBuddy.makeHourlyChartingData(sleepSessions, hoursChartSVG, '#ff8f00', {
          w: w,
          h: hoursHt,
          marginX: marginX,
          marginY: marginY
        });
        var xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);
        var barChartScaleX = d3.scaleBand().padding(0.1).domain(xDomain).range([marginX, w - marginX]);

        var groupedByDays = _.groupBy(sleepSessions, function (s) {
          return moment(s.start).startOf('day');
        });

        var sleepTotalPerDay = _.reduce(groupedByDays, function (days, sleepThatDay, day) {
          days.push(sleepThatDay.reduce(function (totalSleep, s) {
            totalSleep.hours += moment.duration(s.duration).asHours();
            return totalSleep;
          }, {
            day: day,
            hours: 0
          }));
          return days;
        }, []);

        var maxSleep = d3.max(sleepTotalPerDay, function (daySleep) {
          return daySleep.hours;
        });
        var barChartScaleY = d3.scaleLinear().domain([0, maxSleep]).range([h - marginY, marginY]);
        var xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
        var yAxisBarChart = d3.axisLeft(barChartScaleY);
        barChartSVG.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (h - marginY) + ')').call(xAxisBarChart).selectAll('text').attr('transform', 'rotate(-45) translate(-22, 2)');
        barChartSVG.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + marginX + ',0)').call(yAxisBarChart);
        var labelY = Math.floor(h * 0.5);
        barChartSVG.append('text').attr('x', 12).attr('y', labelY).attr('fill', 'white').classed('sleep-chart-axis-label', true).attr('transform', 'rotate(-90, 14, ' + labelY + ')').text('Hours per Day');
        barChartSVG.selectAll('.sleep-chart-bar').data(sleepTotalPerDay).enter().append('rect').classed('sleep-chart-bar', true).attr('x', function (d) {
          return barChartScaleX(moment(d.day).toDate());
        }).attr('y', function (d) {
          return barChartScaleY(d.hours);
        }).attr('width', barChartScaleX.bandwidth()).attr('height', function (d) {
          return h - marginY - barChartScaleY(d.hours);
        });
      };

      return {
        plot: plot
      };
    },
    TummyTimeChart: function TummyTimeChart() {
      var plot = function plot($chartContainer, tummyTimeSessions, startDate, endDate) {
        var $barChart = $chartContainer.find('#tummytime-chart');
        $barChart.empty();
        var w = $chartContainer.width();
        var h = 320;
        var marginX = 44;
        var marginY = 44;
        var barChartSVG = d3.select("#".concat($barChart.prop('id'))).attr('width', w).attr('height', h);
        var xDomain = BabyBuddy.makeDaysDomain(startDate, endDate);
        var barChartScaleX = d3.scaleBand().padding(0.1).domain(xDomain).range([marginX, w - marginX]);

        var groupedByDays = _.groupBy(tummyTimeSessions, function (t) {
          return moment(t.start).startOf('day');
        });

        var totalPerDay = _.reduce(groupedByDays, function (days, timeThatDay, day) {
          days.push(timeThatDay.reduce(function (totalTime, s) {
            totalTime.minutes += moment.duration(s.duration).asMinutes();
            return totalTime;
          }, {
            day: day,
            minutes: 0
          }));
          return days;
        }, []);

        var maxTime = d3.max(totalPerDay, function (t) {
          return t.minutes;
        });
        var barChartScaleY = d3.scaleLinear().domain([0, maxTime]).range([h - marginY, marginY]);
        var xAxisBarChart = d3.axisBottom(barChartScaleX).tickFormat(d3.timeFormat('%b-%e'));
        var yAxisBarChart = d3.axisLeft(barChartScaleY);
        barChartSVG.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (h - marginY) + ')').call(xAxisBarChart).selectAll('text').attr('transform', 'rotate(-45) translate(-22, 2)');
        barChartSVG.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + marginX + ',0)').call(yAxisBarChart);
        var labelY = Math.floor(h * 0.5);
        barChartSVG.append('text').attr('x', 12).attr('y', labelY).attr('fill', 'white').classed('chart-axis-label', true).attr('transform', 'rotate(-90, 14, ' + labelY + ')').text('Minutes per Day');
        barChartSVG.selectAll('.tummytime-chart-bar').data(totalPerDay).enter().append('rect').classed('tummytime-chart-bar', true).attr('x', function (d) {
          return barChartScaleX(moment(d.day).toDate());
        }).attr('y', function (d) {
          return barChartScaleY(d.minutes);
        }).attr('width', barChartScaleX.bandwidth()).attr('height', function (d) {
          return h - marginY - barChartScaleY(d.minutes);
        });
      };

      return {
        plot: plot
      };
    },
    makeHourlyChartingData: function makeHourlyChartingData(sessions, hoursChartSVG, color, _ref) {
      var w = _ref.w,
          h = _ref.h,
          marginX = _ref.marginX,
          marginY = _ref.marginY;
      var sessionHours = {};
      sessions.forEach(function (s) {
        var start = moment(s.start);
        var end = moment(s.end);

        while (start.isValid() && end.isValid() && end.isValid() && start.isBefore(end)) {
          var hr = start.toDate().getHours();

          if (hr in sessionHours) {
            sessionHours[hr].count++;
          } else {
            sessionHours[hr] = {
              count: 1,
              hour: hr,
              hourOfDay: removeZeroFromHour(start.format('hh a'))
            };
          }

          start.add(1, 'hours');
        }
      });
      sessionHours = Object.values(sessionHours);
      var startOfDay = moment().startOf('day');
      var endOfDay = startOfDay.clone().endOf('day');
      var hoursOfDay = [];

      var _loop2 = function _loop2() {
        var hrOfDay = removeZeroFromHour(startOfDay.format('hh a'));
        hoursOfDay.push(hrOfDay);
        var match = sessionHours.find(function (c) {
          return c.hourOfDay === hrOfDay;
        });

        if (!match) {
          sessionHours.push({
            count: 0,
            hour: startOfDay.toDate().getHours(),
            hourOfDay: hrOfDay
          });
        }

        hoursOfDay.push(hrOfDay);
        startOfDay.add(1, 'hours');
      };

      while (startOfDay.isBefore(endOfDay)) {
        _loop2();
      }

      var hoursOfDayScaleX = d3.scaleBand().domain(hoursOfDay).range([marginX, w - marginX]);
      var hoursOfDayScaleColor = d3.scaleLinear().domain([0, d3.max(sessionHours, function (x) {
        return x.count;
      })]).range(["white", color]);
      hoursChartSVG.selectAll('.hours-count').data(sessionHours).enter().append('rect') // .classed('.hours-count', true)
      .classed('hours-count', true).attr('x', function (d) {
        return hoursOfDayScaleX(d.hourOfDay);
      }).attr('y', 0).attr('height', h - 45).attr('width', hoursOfDayScaleX.bandwidth()).attr('fill', function (d) {
        return hoursOfDayScaleColor(d.count);
      });
      var xAxisHoursChart = d3.axisBottom(hoursOfDayScaleX);
      hoursChartSVG.append('g').attr('class', 'x-axis hours-axis').attr('transform', 'translate(0, ' + (h - 45) + ')').call(xAxisHoursChart);
      d3.selectAll('.hours-axis text').each(function (x, i) {
        var remove = w < 800 && i > 0 && i % 3 !== 0;

        if (remove) {
          d3.select(this).remove();
        }
      });
      hoursChartSVG.append('text').classed('sleep-chart-axis-label', true).attr('x', marginX + (w - marginX) * 0.5).attr('y', h - 8).attr('fill', 'white').text('Hourly Frequency');
      return {
        sessionHours: sessionHours,
        hoursOfDay: hoursOfDay,
        hoursOfDayScaleX: hoursOfDayScaleX,
        hoursOfDayScaleColor: hoursOfDayScaleColor
      };
    },
    makeDaysDomain: function makeDaysDomain(startDate, endDate) {
      var curDate = startDate.clone();
      var domain = [];

      while (curDate.isSameOrBefore(endDate)) {
        domain.push(curDate.startOf('day').toDate());
        curDate.add(1, 'days');
      }

      return domain;
    },
    updateTimerNavSpan: function updateTimerNavSpan() {
      if ($timerCountSpan) {
        return $.get(BabyBuddy.ApiRoutes.activeTimersCount()).then(function (response) {
          var n = response.length;
          $timerCountSpan.html('' + n);

          if (n) {
            $timerCountSpan.show();
          } else {
            $timerCountSpan.hide();
          }
        })["catch"](function (err) {
          $timerCountSpan = null;

          if (timerCheckIntervalId) {
            clearInterval(timerCheckIntervalId);
          }
        });
      }
    }
  };
  window.addEventListener('focus', BabyBuddy.updateTimerNavSpan, false);

  if (!timerCheckIntervalId && $timerCountSpan) {
    BabyBuddy.updateTimerNavSpan();
    timerCheckIntervalId = setInterval(BabyBuddy.updateTimerNavSpan, 6500);
    $(window).on('beforeunload', function () {
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
"use strict";

BabyBuddy.Account = function (root) {
  var $ = root.jQuery;
  var _ = root._;
  var Stripe = root.Stripe;
  var stripeCard = null;
  var userId = null,
      accountId = null,
      user = {},
      account = {},
      stripe = null,
      stripeElements = null,
      $el = null,
      $inviteeInput = null,
      usersToAddBeforeIncurringCost = 0,
      // clicking this means to invite the person to account and, potentially increase subscription
  $inviteeBtn = null,
      $inviteeStripeTokenInput = null,
      $inviteeStripeForm = null,
      $subscriptionStripeTokenInput = null,
      $subscriptionService = null,
      $subscriptionStripeForm = null,
      // if acct is premium, then clicking this means downgrade to free acct
  $freeAcctBtn = null,
      // if acct is free, then clicking this means upgrade to premium
  $premiumAcctBtn = null,
      $paymentModal = null,
      stripeStyle = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      color: "#32325d"
    }
  },
      self = null;
  var Account = {
    init: function init(el, uId, aId, key) {
      self = this;
      userId = uId;
      accountId = aId;
      stripe = Stripe(key);
      stripeElements = stripe.elements();
      $el = $('#' + el);
      $inviteeInput = $el.find('#invitee');
      $inviteeBtn = $el.find('#invitee-btn');
      $inviteeStripeForm = $el.find('#invitee-form');
      $inviteeStripeTokenInput = $el.find('#stripe_invitee_token');
      $subscriptionStripeForm = $el.find('#subscription-form');
      $subscriptionStripeTokenInput = $el.find('#stripe_subscription_token');
      $subscriptionService = $el.find('#stripe_subscription_service');
      $freeAcctBtn = $el.find('#free-plan-btn');
      $premiumAcctBtn = $el.find('#premium-plan-btn');
      $paymentModal = $el.find('#payment-modal');
      $freeAcctBtn.click(function (evt) {
        evt.preventDefault();
        $subscriptionService.val('free');
        $subscriptionStripeForm.submit();
      });
      $inviteeBtn.click(function (evt) {
        evt.preventDefault();
        self.inviteAccountMember();
      });
      $premiumAcctBtn.click(function (evt) {
        evt.preventDefault();
        self.upgradeToPremium();
      }); // Create an instance of the card Element.

      stripeCard = stripeElements.create('card', {
        style: stripeStyle
      });
      self.fetchAccount(accountId);
      $el.find('#delete-account-btn').click(function (evt) {
        evt.preventDefault();
        $el.find('#confirm-delete-account-modal').show();
        $el.find('#confirm-delete-account-btn').click(function (e) {
          $el.find('#delete-account-form').submit();
        });
      });
      $el.find('.deactivate-account-user-btn').click(function (evt) {
        evt.preventDefault();
        var $form = $(this).parent();
        $el.find('#confirm-deactivate-member-modal').modal('show');
        $el.find('#confirm-deactivate-member-btn').click(function (e) {
          $form.submit();
        });
      });
      $el.find('.delete-account-user-btn').click(function (evt) {
        evt.preventDefault();
        var $form = $(this).parent();
        $el.find('#confirm-delete-member-modal').modal('show');
        $el.find('#confirm-delete-member-btn').click(function (e) {
          $form.submit();
        });
      });
    },
    fetchAccount: function fetchAccount(id) {
      return $.get(BabyBuddy.ApiRoutes.account(id)).then(function (response) {
        account = response;
        console.log('account', account);
        return response;
      });
    },
    upgradeToPremium: function upgradeToPremium() {
      $paymentModal.find('#purchase-description').html('Upgrade to premium service');
      var $useExistingPaymentSourceSection = $paymentModal.find('#existing-payment-source-section');
      var $useExistingPaymentSourceCB = $paymentModal.find('#use-existing-payment-source');
      var hasPaymentSource = account && account.payment_source && account.payment_source.has_payment_source;

      if (hasPaymentSource) {
        var paymentSource = account.payment_source.payment_source;
        $paymentModal.find('#payment-brand').html(paymentSource.brand);
        $paymentModal.find('#payment-expmo').html(paymentSource.exp_month);
        $paymentModal.find('#payment-expyr').html(paymentSource.exp_year);
        $paymentModal.find('#payment-last4').html(paymentSource.last4);
        $useExistingPaymentSourceCB.click(function (evt) {
          var useExisting = $useExistingPaymentSourceCB.prop('checked');

          if (useExisting) {
            $paymentModal.find('#cc-container').hide();
          } else {
            $paymentModal.find('#cc-container').show();
          }
        });
      } else {
        $useExistingPaymentSourceSection.empty();
      } // Add an instance of the card Element into the `card-element` <div>.


      stripeCard.mount('#card-element');
      stripeCard.addEventListener('change', function (e) {
        var $displayErrors = $el.find('#card-errors');

        if (e.error) {
          $displayErrors.html(e.error.message);
        } else {
          $displayErrors.html('');
        }
      });
      $paymentModal.modal('show');
      var $paymentBtn = $paymentModal.find('#payment-btn');
      var $promoCode = $paymentModal.find('#promo-code');
      var $promoCodeHelpText = $paymentModal.find('#promo-code-help-text');
      $promoCode.on('input', function (evt) {
        var promoCode = $promoCode.val();

        if (promoCode) {
          $paymentBtn.toggleClass('disabled', true);
          $paymentBtn.prop('disabled', true);
          $promoCodeHelpText.html('Click to apply promo code before submitting payment');
        } else {
          $paymentBtn.toggleClass('disabled', false);
          $paymentBtn.prop('disabled', false);
          $promoCodeHelpText.html('');
        }
      });
      $paymentModal.find('#apply-promo-btn').click(function (evt) {
        evt.preventDefault();
        var promoCode = $promoCode.val();

        if (promoCode) {
          console.log('apply promo code ' + promoCode);
          return $.post(BabyBuddy.ApiRoutes.accountApplyPromo(accountId), {
            promo_code: promoCode
          }).then(function (response) {
            $paymentBtn.toggleClass('disabled', false);
            $paymentBtn.prop('disabled', false);
            $promoCodeHelpText.html(response.message);

            if (!response.requires_purchase) {
              root.location.reload(true);
            }

            return response;
          })["catch"](function (err) {
            $promoCodeHelpText.html("Promo code not found");
          });
        }
      });
      $paymentBtn.click(function (e) {
        e.preventDefault();
        $subscriptionService.val('premium');

        if (hasPaymentSource && $useExistingPaymentSourceCB.prop('checked')) {
          $subscriptionStripeForm.submit();
        } else {
          stripe.createToken(stripeCard).then(function (result) {
            if (result.error) {
              var $displayErrors = $paymentModal.find('#card-errors');
              $displayErrors.html(result.error.message);
            } else {
              $subscriptionStripeTokenInput.val(result.token.id);
              $subscriptionStripeForm.submit();
            }
          });
        }
      });
    },
    inviteAccountMember: function inviteAccountMember() {
      var invitee = $inviteeInput.val();

      if (!invitee || !account.subscription || !account.subscription.is_active) {
        return;
      }

      var addForFree = account.subscription.member_count < account.subscription.max_members;

      if (addForFree) {
        $inviteeStripeForm.submit();
        return;
      }

      $paymentModal.find('#purchase-description').html('Add account member for an additional $1 per month');
      var $useExistingPaymentSourceSection = $paymentModal.find('#existing-payment-source-section');
      var $useExistingPaymentSourceCB = $paymentModal.find('#use-existing-payment-source');
      var hasPaymentSource = account && account.payment_source && account.payment_source.has_payment_source && account.payment_source.payment_source.brand && account.payment_source.payment_source.exp_month && account.payment_source.payment_source.exp_year && account.payment_source.payment_source.last4;

      if (hasPaymentSource) {
        var paymentSource = account.payment_source.payment_source;
        $paymentModal.find('#payment-brand').html(paymentSource.brand);
        $paymentModal.find('#payment-expmo').html(paymentSource.exp_month);
        $paymentModal.find('#payment-expyr').html(paymentSource.exp_year);
        $paymentModal.find('#payment-last4').html(paymentSource.last4);
      } else {
        $useExistingPaymentSourceSection.empty();
      } // Add an instance of the card Element into the `card-element` <div>.


      stripeCard.mount('#card-element');
      stripeCard.addEventListener('change', function (e) {
        var $displayErrors = $paymentModal.find('#card-errors');

        if (e.error) {
          $displayErrors.html(e.error.message);
        } else {
          $displayErrors.html('');
        }
      });
      $paymentModal.modal('show');
      $paymentModal.find('#payment-btn').click(function (e) {
        e.preventDefault();

        if (hasPaymentSource && $useExistingPaymentSourceCB.prop('checked')) {
          $inviteeStripeForm.submit();
        } else {
          stripe.createToken(stripeCard).then(function (result) {
            if (result.error) {
              var $displayErrors = $el.find('#card-errors');
              $displayErrors.html(result.error.message);
            } else {
              $inviteeStripeTokenInput.val(result.token.id);
              $inviteeStripeForm.submit();
            }
          });
        }
      });
    }
  };
  return Account;
}(window);
"use strict";

BabyBuddy.Bath = function () {
  var $el;
  var userId;
  var childId;
  var bathId;
  var bath = {};
  var baths = [];
  var $timePicker;
  var $tableBody;
  var $addBtn;
  var $saveBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var bathDao;
  var sleepChart;
  var detailPickerInitialized = false;
  var self;
  var Bath = {
    init: function init(el, uId, cId) {
      var bId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      bathId = bId;
      $timePicker = $el.find('#bath-datetimepicker_time');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#bath-add-btn');
      $saveBtn = $el.find('#bath-save-btn');
      $addModal = $el.find('#bath-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#bath-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#bath-filter-datetimepicker_end');
      bathDao = BabyBuddy.ChildTimeActivityDao(); // bathChart = BabyBuddy.BathChart();

      $confirmDeleteBtn.click(function (evt) {
        if (childId && bathId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.bathDetail(childId, bathId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            window.location.reload();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!bathId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(30, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      self.syncInputs();
      $addModal.modal('show');
    },
    isValidInputs: function isValidInputs() {
      return $timePicker.datetimepicker('viewDate').isSameOrBefore(moment());
    },
    syncInputs: function syncInputs() {
      var defaultTime = !_.isEmpty(bath) && bath.time ? moment(bath.time) : moment();

      if (!detailPickerInitialized) {
        $timePicker.datetimepicker({
          defaultDate: defaultTime,
          format: 'YYYY-MM-DD'
        });
        detailPickerInitialized = true;
      } else {
        $timePicker.datetimepicker('date', defaultTime);
      }
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(baths)) {
        $tableBody.empty();
        var html = baths.map(function (b) {
          var time = moment(b.time).format('YYYY-MM-DD');
          return "\n            <tr>\n              <td class=\"text-center\">".concat(time, "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-bath=\"").concat(b.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-bath=\"").concat(b.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          bathId = parseInt($target.data('bath'));
          bath = baths.find(function (b) {
            return b.id === bathId;
          });
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          bathId = parseInt($target.data('bath'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(bath)) {
          bath = {};
        }

        bath.child = childId;
        bath.time = $timePicker.datetimepicker('viewDate').toISOString();
      }
    },
    fetch: function fetch() {
      return $.get(BabyBuddy.ApiRoutes.bathDetail(childId, bathId)).then(function (response) {
        bath = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.baths(childId);
      var s = $startFilterPicker.datetimepicker('viewDate');
      var e = $endFilterPicker.datetimepicker('viewDate');
      return bathDao.fetch(url, s.startOf('day'), e.endOf('day')).then(function (response) {
        baths = response;
        self.syncTable();
        $(window).resize(function () {// bathChart.plot($el.find('#bath-chart'), $el.find('#bath-chart-container'), baths, s, e);
        }); // bathChart.plot($el.find('#bath-chart'), $el.find('#bath-chart-container'), baths, s, e);

        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.baths(childId), bath).then(function (response) {
        bath = response;
        bathId = response.id;
        $addModal.modal('hide');
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      $.post(BabyBuddy.ApiRoutes.bathDetail(childId, bathId), bath).then(function (response) {
        bath = response;
        $addModal.modal('hide');
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      bathId = null;
      bath = {};
      var defaultTime = moment();

      if (!detailPickerInitialized) {
        $timePicker.datetimepicker({
          defaultDate: defaultTime,
          format: 'YYYY-MM-DD'
        });
        detailPickerInitialized = true;
      } else {
        $timePicker.datetimepicker('date', defaultTime);
      }
    }
  };
  self = Bath;
  return self;
}();
"use strict";

BabyBuddy.ChildDetail = function (root) {
  var $ = root.$,
      _ = root._,
      $el = null,
      $timelinePrevBtn = null,
      $timelineNextBtn = null,
      $timelineContainer = null,
      $currentTimelineDate = null,
      $baths = null,
      $diaperChanges = null,
      $feedings = null,
      $note = null,
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
      self = null;
  var ChildDetail = {
    init: function init(id, el) {
      self = this;
      $el = $('#' + el);
      $timelinePrevBtn = $el.find('#prev-timeline-day');
      $timelineNextBtn = $el.find('#next-timeline-day');
      $timelineContainer = $el.find('#timeline-container');
      $currentTimelineDate = $el.find('#timeline-current-date');
      $baths = $el.find('#bath-card');
      $diaperChanges = $el.find('#diaperchange-card');
      $feedings = $el.find('#feeding-card');
      $note = $el.find('#note-card');
      $sleep = $el.find('#sleep-card');
      $temperature = $el.find('#temperature-card');
      $tummyTime = $el.find('#tummytime-card');
      $weight = $el.find('#weight-card');
      $diaperChangeModal = $el.find('#diaperchange-modal');
      $feedingModal = $el.find('#feeding-modal');
      $sleepModal = $el.find('#sleep-modal');
      childId = id;
      $(window).resize(function () {
        self.showTimeline();
      });
      $timelinePrevBtn.click(function (evt) {
        evt.preventDefault();
        self.showPrevDayTimeline();
      });
      $timelineNextBtn.click(function (evt) {
        evt.preventDefault();
        self.showNextDayTimeline();
      });
      $currentTimelineDate.html(timelineDate.format('LL'));
      self.fetchTimeline().then(function (response) {
        var endOfDay = moment().endOf('day');
        var startOfDay = moment().startOf('day');
        console.log('child response', response);
        var _response$items = response.items,
            sleep = _response$items.sleep,
            feedings = _response$items.feedings,
            tummytimes = _response$items.tummytimes;
        var sleepDuration = sleep.map(function (s) {
          var end = moment(s.end);
          var start = moment(s.start);

          if (start.isBefore(startOfDay)) {
            return moment.duration(moment(s.end).diff(startOfDay));
          } else if (end.isAfter(endOfDay)) {
            return moment.duration(endOfDay.diff(moment(s.start)));
          }

          return moment.duration(s.duration);
        }).reduce(function (acc, d) {
          return acc.add(d);
        }, moment.duration());

        if (sleepDuration.asMilliseconds()) {
          var durationDisplay;

          if (sleepDuration.hours() && sleepDuration.minutes()) {
            durationDisplay = "".concat(sleepDuration.hours(), " hrs, ").concat(sleepDuration.minutes(), " mins");
          } else if (sleepDuration.hours()) {
            durationDisplay = "".concat(sleepDuration.hours(), " hrs");
          } else if (sleepDuration.minutes()) {
            durationDisplay = "".concat(sleepDuration.minutes(), " mins");
          }

          $el.find('#todays-sleep').find('.card-title').html(durationDisplay);
        }

        if (!_.isEmpty(feedings)) {
          var feedingAmt = feedings.filter(function (f) {
            return f.amount;
          }).reduce(function (acc, f) {
            return acc + f.amount;
          }, 0);
          var lftDuration = feedings.filter(function (f) {
            return ['both breasts', 'left breast'].includes(f.method);
          }).map(function (f) {
            var d = moment.duration();
            var k = f.method === 'both breasts' ? 0.5 : 1;
            d.add(moment.duration(f.duration).asMilliseconds() * k, 'ms');
            return d;
          }).reduce(function (acc, d) {
            return acc.add(d);
          }, moment.duration());
          var rtDuration = feedings.filter(function (f) {
            return ['both breasts', 'right breast'].includes(f.method);
          }).map(function (f) {
            var d = moment.duration();
            var k = f.method === 'both breasts' ? 0.5 : 1;
            d.add(moment.duration(f.duration).asMilliseconds() * k, 'ms');
            return d;
          }).reduce(function (acc, d) {
            return acc.add(d);
          }, moment.duration());
          var feedingTitle;

          if (lftDuration.asMinutes() && rtDuration.asMinutes()) {
            if (feedingAmt) {
              feedingTitle = "Left: ".concat(lftDuration.asMinutes(), " mins; Right: ").concat(rtDuration.asMinutes(), " mins; ").concat(feedingAmt, " oz;");
            } else {
              feedingTitle = "Left: ".concat(lftDuration.asMinutes(), " mins; Right: ").concat(rtDuration.asMinutes(), " mins; ").concat(feedingAmt, " oz;");
            }
          } else if (lftDuration.asMinutes()) {
            if (feedingAmt) {
              feedingTitle = "Left: ".concat(lftDuration.asMinutes(), " mins; ").concat(feedingAmt, " oz;");
            } else {
              feedingTitle = "Left: ".concat(lftDuration.asMinutes(), " mins");
            }
          } else if (rtDuration.asMinutes()) {
            if (feedingAmt) {
              feedingTitle = "Right: ".concat(rtDuration.asMinutes(), " mins; ").concat(feedingAmt, " oz;");
            } else {
              feedingTitle = "Right: ".concat(rtDuration.asMinutes(), " mins");
            }
          } else if (feedingAmt) {
            feedingTitle = "".concat(feedingAmt, " oz");
          }

          var $feedingCard = $el.find('#todays-feedings');
          $feedingCard.find('.card-title').html(feedingTitle);
          $feedingCard.find('.card-text').html("total feeds: ".concat(feedings.length));
        }

        if (!_.isEmpty(tummytimes)) {
          var tummytimeDuration = tummytimes.map(function (t) {
            var end = moment(t.end);
            var start = moment(t.start);

            if (start.isBefore(startOfDay)) {
              return moment.duration(moment(t.end).diff(startOfDay));
            } else if (end.isAfter(endOfDay)) {
              return moment.duration(endOfDay.diff(moment(t.start)));
            }

            return moment.duration(t.duration);
          }).reduce(function (acc, d) {
            return acc.add(d);
          }, moment.duration());

          if (tummytimeDuration.asMilliseconds()) {
            var _durationDisplay;

            if (tummytimeDuration.minutes() && tummytimeDuration.seconds()) {
              _durationDisplay = "".concat(tummytimeDuration.minutes(), " mins, ").concat(tummytimeDuration.seconds(), " secs");
            } else if (tummytimeDuration.minutes()) {
              _durationDisplay = "".concat(tummytimeDuration.minutes(), " mins");
            } else if (tummytimeDuration.seconds()) {
              _durationDisplay = "".concat(tummytimeDuration.seconds(), " secs");
            }

            $el.find('#todays-tummytime').find('.card-title').html(_durationDisplay);
          }
        }
      });
      self.fetchChild();
    },
    fetchChild: function fetchChild() {
      return $.get(BabyBuddy.ApiRoutes.child(childId)).then(function (response) {
        console.log(response);
        childBirthDate = moment(response.birth_date).startOf('day');
        child = response;
        var _child = child,
            last_bath = _child.last_bath,
            last_change = _child.last_change,
            last_feeding = _child.last_feeding,
            last_note = _child.last_note,
            last_sleep = _child.last_sleep,
            last_temperature = _child.last_temperature,
            last_tummytime = _child.last_tummytime,
            last_weight = _child.last_weight;

        if (!_.isEmpty(last_bath)) {
          var occured = moment().to(last_bath.time);
          $baths.find('.card-title').html(occured);
        }

        if (!_.isEmpty(last_change)) {
          var changeType;

          if (last_change.wet && last_change.solid) {
            changeType = 'mixed';
          } else if (last_change.wet) {
            changeType = 'wet';
          } else {
            changeType = 'solid';
          }

          var _occured = moment().to(last_change.time);

          $diaperChanges.find('.card-title').html(_occured);
          $diaperChanges.find('.card-text').html("".concat(changeType, ", ").concat(last_change.color));
        }

        if (!_.isEmpty(last_feeding)) {
          var duration;

          if (last_feeding.duration) {
            duration = moment.duration(last_feeding.duration);

            if (duration && duration.asSeconds() < 60) {
              duration = '';
            }
          }

          var _occured2 = moment().to(last_feeding.end);

          $feedings.find('.card-title').html("finished ".concat(_occured2.replace('hours', 'hrs').replace('minutes', 'mins')));
          var amount = '';

          if (last_feeding.amount && duration) {
            var units = last_feeding.units === 'ounces' ? 'oz' : 'ml';
            amount = "(".concat(Math.floor(duration.asMinutes()), " mins, ").concat(last_feeding.amount, " ").concat(units, ")");
          } else if (last_feeding.amount) {
            amount = "(".concat(last_feeding.amount, " oz)");
          } else if (duration && duration.isValid()) {
            amount = "(".concat(Math.floot(duration.asMinutes()), " mins)");
          }

          $feedings.find('.card-text').html("".concat(last_feeding.type, ", ").concat(last_feeding.method, " ").concat(amount));
        }

        if (!_.isEmpty(last_note)) {
          var _occured3 = moment().to(last_note.time);

          $note.find('.card-title').html(_occured3);
          var note = '';

          if (last_note.note) {
            note = last_note.note.length > 35 ? "".concat(last_note.note.substr(0, 32), " ...") : last_note.note;
          }

          $note.find('.card-text').html(note);
        }

        if (!_.isEmpty(last_sleep)) {
          var _occured4 = moment().to(last_sleep.end);

          var _duration = moment.duration(last_sleep.duration).humanize();

          $sleep.find('.card-title').html("woke ".concat(_occured4.replace('hours', 'hrs').replace('minutes', 'mins')));
          $sleep.find('.card-text').html("for ".concat(_duration));
        }

        if (!_.isEmpty(last_temperature)) {
          var _occured5 = moment().to(last_temperature.time);

          $temperature.find('.card-title').html(_occured5);
          $temperature.find('.card-text').html("".concat(last_temperature.temperature, " degrees"));
        }

        if (!_.isEmpty(last_tummytime)) {
          var _occured6 = moment().to(last_tummytime.start);

          $tummyTime.find('.card-title').html(_occured6);

          var _duration2 = moment.duration(last_tummytime.duration).humanize();

          $tummyTime.find('.card-text').html("for ".concat(_duration2));
        }

        if (!_.isEmpty(last_weight)) {
          var _occured7 = moment().to(last_weight.date);

          $weight.find('.card-title').html(_occured7);
          $weight.find('.card-text').html("".concat(last_weight.weight, " lbs"));
        }

        return response;
      });
    },
    fetchTimeline: function fetchTimeline() {
      var s = timelineDate.clone().startOf('day');
      var e = timelineDate.clone().add(1, 'days').startOf('day');
      var timeline = timelineDays.filter(function (tl) {
        return tl.start === s.toISOString();
      });

      if (timeline && timeline.lengh) {
        currentTimeline = timeline[0];
        self.showTimeline();
      } else {
        return $.get(BabyBuddy.ApiRoutes.childTimeline(childId, s.toISOString(), e.toISOString())).then(function (response) {
          console.log('fetchTimeline', response);
          timelineDays.push(response);
          currentTimeline = response;
          self.showTimeline();
          return response;
        });
      }
    },
    showPrevDayTimeline: function showPrevDayTimeline() {
      if (!childBirthDate.isSame(timelineDate)) {
        timelineDate.subtract('days', 1);
        self.fetchTimeline();
      }

      self.validateTimelineNavigation();
    },
    showNextDayTimeline: function showNextDayTimeline() {
      if (!today.isSame(timelineDate)) {
        timelineDate.add('days', 1);
        self.fetchTimeline();
      }

      self.validateTimelineNavigation();
    },
    validateTimelineNavigation: function validateTimelineNavigation() {
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
    showTimeline: function showTimeline() {
      $currentTimelineDate.html(timelineDate.format('LL'));
      $el.find('#timeline-chart').empty();
      $el.find('#timeline-top-axis').empty();
      $el.find('#timeline-bottom-axis').empty();
      var startOfDay = timelineDate.clone().startOf('day');
      var endOfDay = timelineDate.clone().endOf('day');
      var changes = currentTimeline.items.changes;
      var feedings = currentTimeline.items.feedings.map(function (x) {
        var duration = moment.duration(x.duration);
        var start = moment(x.start);
        var end = moment(x.end);

        if (moment(x.start).isBefore(startOfDay)) {
          start = startOfDay.clone();
          duration = moment.duration(moment(x.end).diff(start));
        } else if (moment(x.end).isAfter(endOfDay)) {
          end = endOfDay.clone();
          duration = moment.duration(end.diff(x.start));
        }

        return Object.assign({
          duration: duration,
          clampedStart: start.toISOString(),
          clampedEnd: end.toISOString()
        }, x);
      });
      var sleep = currentTimeline.items.sleep.map(function (x) {
        var duration = moment.duration(x.duration);
        var start = moment(x.start);
        var end = moment(x.end);

        if (moment(x.start).isBefore(startOfDay)) {
          start = startOfDay.clone();
          duration = moment.duration(moment(x.end).diff(start));
        } else if (moment(x.end).isAfter(endOfDay)) {
          end = endOfDay.clone();
          duration = moment.duration(end.diff(x.start));
        }

        return Object.assign({
          duration: duration,
          clampedStart: start.toISOString(),
          clampedEnd: end.toISOString()
        }, x);
      });
      console.log('feedings', feedings);
      var h = 1200;
      var w = $el.find('#timeline-card').width();
      var marginX = 50;
      var marginY = 50;
      var start = timelineDate.clone().startOf('day');
      var end = timelineDate.clone().endOf('day');
      var scaleX = d3.scaleBand().domain(['Changes', 'Feedings', 'Sleep']).range([marginX, w - marginX]);
      var scaleY = d3.scaleTime().domain([start.toDate(), end.toDate()]).range([marginY, h]);
      var maxY = scaleY(end.toDate());
      var axisBottomX = d3.axisBottom(scaleX);
      var axisTopX = d3.axisTop(scaleX);
      var axisY = d3.axisLeft(scaleY).ticks(24, d3.timeFormat('%I %p')).tickSize(w - marginX * 2);
      var svg = d3.select('#timeline-chart').attr('width', w).attr('height', h);
      d3.select('#timeline-top-axis').attr('width', w).attr('height', 30).append('g').attr('class', 'x-axis').attr('transform', 'translate(0, 22)').call(axisTopX);
      d3.select('#timeline-bottom-axis').attr('width', w).attr('height', 30).append('g').attr('class', 'x-axis').call(axisBottomX);
      svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + (w - marginX) + ', 0)').call(axisY).select(".domain").remove();
      var minDuration = scaleY(start.clone().add(moment.duration(20, 'minutes')).toDate()) - scaleY(start.toDate());
      var minTextDy = scaleY(start.clone().add(moment.duration(15, 'minutes')).toDate()) - scaleY(start.toDate());
      svg.selectAll('.diaper-change-tl').data(changes).enter().append('rect').classed('diaper-change-tl', true).attr('x', scaleX('Changes')).attr('y', function (d) {
        return scaleY(moment(d.time).toDate());
      }).attr('fill', function (d) {
        return d.color;
      }).attr('width', scaleX.bandwidth()).attr('height', minDuration).on('click', function (d) {
        return self.showDiaperChangeModal(d);
      });
      svg.selectAll('.diaper-change-tl-label').data(changes).enter().append('text').classed('diaper-change-tl-label', true).attr('x', scaleX('Changes')).attr('y', function (d) {
        return scaleY(moment(d.time).toDate());
      }).attr('dy', minTextDy).attr('dx', scaleX.bandwidth() * 0.5).attr('fill', function (d) {
        return d.color === 'yellow' ? 'black' : 'white';
      }).text(function (d) {
        var changeType;

        if (d.wet && d.solid) {
          changeType = 'mixed';
        } else if (d.wet) {
          changeType = 'wet';
        } else {
          changeType = 'solid';
        }

        return changeType;
      }).on('click', function (d) {
        return self.showDiaperChangeModal(d);
      });
      svg.selectAll('.feeding-tl').data(feedings).enter().append('rect').classed('feeding-tl', true).attr('x', scaleX('Feedings')).attr('y', function (d) {
        return scaleY(moment(d.clampedStart).toDate());
      }).attr('width', scaleX.bandwidth()).attr('height', function (d) {
        var s = scaleY(moment(d.clampedStart).toDate());
        var e = scaleY(moment(d.clampedEnd).toDate());
        e = e > maxY ? maxY : e;
        var rectHt = e - s;
        return rectHt < minDuration ? minDuration : rectHt;
      }).on('click', function (d) {
        return self.showFeedingModal(d);
      });
      svg.selectAll('.feeding-tl-label').data(feedings).enter().append('text').classed('feeding-tl-label', true).attr('x', scaleX('Feedings')).attr('y', function (d) {
        return scaleY(moment(d.clampedStart).toDate());
      }).attr('dx', scaleX.bandwidth() * 0.5).attr('fill', 'white').attr('dy', function (d) {
        var s = scaleY(moment(d.clampedStart).toDate());
        var e = scaleY(moment(d.clampedEnd).toDate());
        e = e > maxY ? maxY : e;
        var dy = (e - s) * 0.65;
        return dy < minTextDy ? minTextDy : dy;
      }).text(function (d) {
        if (d.method === 'bottle') {
          var units = d.units === 'ounces' ? 'oz' : 'ml';
          return "".concat(d.amount, " ").concat(units);
        }

        var duration = moment.duration(d.duration);

        if (d.method === 'left breast') {
          return "Left: ".concat(duration.asMinutes(), " mins");
        } else if (d.method === 'right breast') {
          return "Right: ".concat(duration.asMinutes(), " mins");
        }

        return "Both: ".concat(duration.asMinutes(), " mins");
      }).on('click', function (d) {
        return self.showFeedingModal(d);
      });
      svg.selectAll('.sleep-tl').data(sleep).enter().append('rect').classed('sleep-tl', true).attr('x', scaleX('Sleep')).attr('y', function (d) {
        return scaleY(moment(d.clampedStart).toDate());
      }).attr('width', scaleX.bandwidth()).attr('height', function (d) {
        var s = scaleY(moment(d.clampedStart).toDate());
        var e = scaleY(moment(d.clampedEnd).toDate());
        e = e > maxY ? maxY : e;
        return e - s;
      }).on('click', function (d) {
        return self.showSleepModal(d);
      });
      svg.selectAll('.sleep-tl-label').data(sleep).enter().append('text').classed('sleep-tl-label', true).attr('x', scaleX('Sleep')).attr('y', function (d) {
        return scaleY(moment(d.clampedStart).toDate());
      }).attr('dx', scaleX.bandwidth() * 0.5).attr('dy', function (d) {
        var s = scaleY(moment(d.clampedStart).toDate());
        var e = scaleY(moment(d.clampedEnd).toDate());
        e = e > maxY ? maxY : e;
        var dy = e - s;
        return dy < minDuration ? minTextDy : dy * 0.65;
      }).text(function (d) {
        return moment.duration(d.duration).humanize();
      }).on('click', function (d) {
        return self.showSleepModal(d);
      });
    },
    showDiaperChangeModal: function showDiaperChangeModal(d) {
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
      $diaperChangeModal.find('#diaperchange-save-btn').click(function (evt) {
        var diaperCopy = Object.assign({}, d);
        diaperCopy.time = moment($diaperChangeModal.find('#diaperchange-time').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        diaperCopy.wet = $diaperChangeModal.find('#diaperchange-wet').prop('checked');
        diaperCopy.solid = $diaperChangeModal.find('#diaperchange-solid').prop('checked');
        diaperCopy.color = $diaperChangeModal.find('#diaperchange-color').val();
        $.post(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperCopy.id), diaperCopy).then(function (response) {
          $diaperChangeModal.modal('hide');
          self.fetchTimeline();
          return response;
        })["catch"](function (err) {
          if (err.responseJSON && err.responseJSON.error_message) {
            $diaperChangeModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
      });
    },
    showFeedingModal: function showFeedingModal(d) {
      $feedingModal.modal('show');
      var s = moment(d.start);
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
      $feedingModal.find('#feeding-datetimepicker_start').on('change.datetimepicker', function (evt) {
        $feedingModal.find('#feeding-datetimepicker_end').datetimepicker('minDate', moment(evt.date).add(1, 'minutes'));
      });
      var $type = $feedingModal.find('#feeding-type');
      var $method = $feedingModal.find('#feeding-method');
      var $amount = $feedingModal.find('#feeding-amount');
      var $units = $feedingModal.find('#feeding-units');
      $type.val(d.type);
      $method.val(d.method);
      $amount.val(d.amount);
      $type.find('#feeding-end').change(function (evt) {
        if (!$type.val()) {
          $method.find('option').each(function (i, el) {
            var $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        } else if ($type.val() !== 'breast milk') {
          var breastOptions = ['left breast', 'right breast', 'both breasts'];
          $method.find('option').each(function (i, el) {
            var $this = $(el);
            $this.prop('disabled', breastOptions.includes($this.prop('value')));
            $this.prop('selected', $this.prop('value') === 'bottle');
          });
        } else {
          $method.find('option').each(function (i, el) {
            var $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        }
      });
      $method.change(function (evt) {
        if ($method.val() === 'bottle') {
          $amount.parent().show();
          $units.parent().show();
        } else {
          $amount.parent().hide();
          $units.parent().hide();
        }
      });
      $feedingModal.find('#feeding-save-btn').click(function (evt) {
        var feedingCopy = Object.assign({}, d);
        feedingCopy.start = moment($feedingModal.find('#feeding-start').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feedingCopy.end = moment($feedingModal.find('#feeding-end').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feedingCopy.type = $type.val();
        feedingCopy.method = $method.val();
        feedingCopy.units = $units.val();
        feedingCopy.amount = $feedingModal.find('#feeding-amount').val();

        if (feedingCopy.type !== 'breast milk' && !feedingCopy.amount) {
          return;
        }

        $.post(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingCopy.id), feedingCopy).then(function (response) {
          $feedingModal.modal('hide');
          self.fetchTimeline();
          return response;
        })["catch"](function (err) {
          if (err.responseJSON && err.responseJSON.error_message) {
            $feedingModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
      });
    },
    showSleepModal: function showSleepModal(d) {
      $sleepModal.modal('show');
      var s = moment(d.start);
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
      $sleepModal.find('#sleep-datetimepicker_start').on('change.datetimepicker', function (evt) {
        $sleepModal.find('#sleep-datetimepicker_end').datetimepicker('minDate', moment(evt.date).add(1, 'minutes'));
      });
      $sleepModal.find('#sleep-save-btn').click(function (evt) {
        var sleepCopy = Object.assign({}, d);
        sleepCopy.start = moment($sleepModal.find('#sleep-start').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        sleepCopy.end = moment($sleepModal.find('#sleep-end').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        $.post(BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepCopy.id), sleepCopy).then(function (response) {
          $sleepModal.modal('hide');
          self.fetchTimeline();
          return response;
        })["catch"](function (err) {
          if (err.responseJSON && err.responseJSON.error_message) {
            $sleepModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
      });
    }
  };
  return ChildDetail;
}(window);
"use strict";

BabyBuddy.DiaperChange = function () {
  var $el;
  var userId;
  var childId;
  var diaperChangeId;
  var diaperChange;
  var diaperChanges = [];
  var $timePicker;
  var $wet;
  var $solid;
  var $color;
  var $tableBody;
  var $saveBtn;
  var $addBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var detailPickerInitialized = false;
  var diaperChangeDao;
  var diaperChangeChart;
  var self;
  var DiaperChange = {
    init: function init(el, uId, cId) {
      var dId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      diaperChangeId = dId;
      $wet = $el.find('#diaperchange-wet');
      $solid = $el.find('#diaperchange-solid');
      $color = $el.find('#diaperchange-color');
      $saveBtn = $el.find('#diaperchange-save-btn');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#diaperchange-add-btn');
      $addModal = $el.find('#diaperchange-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $timePicker = $el.find('#diaperchange-datetimepicker_time');
      $startFilterPicker = $el.find('#diaperchange-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#diaperchange-filter-datetimepicker_end');
      diaperChangeDao = BabyBuddy.ChildTimeActivityDao();
      diaperChangeChart = BabyBuddy.DiaperChangeChart();
      $confirmDeleteBtn.click(function (evt) {
        if (childId && diaperChangeId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!diaperChangeId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(7, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: function syncInputs() {
      var defaultTime = !_.isEmpty(diaperChange) && diaperChange.time ? moment(diaperChange.time) : moment();

      if (!detailPickerInitialized) {
        $timePicker.datetimepicker({
          defaultDate: defaultTime,
          format: 'YYYY-MM-DD hh:mm a'
        });
        detailPickerInitialized = true;
      } else {
        $timePicker.datetimepicker('date', defaultTime);
      }

      $wet.prop('checked', !_.isEmpty(diaperChange) && diaperChange.wet);
      $solid.prop('checked', !_.isEmpty(diaperChange) && diaperChange.solid);
      $wet.parent().toggleClass('active', !_.isEmpty(diaperChange) && diaperChange.wet);
      $solid.parent().toggleClass('active', !_.isEmpty(diaperChange) && diaperChange.solid);
      $color.val(!_.isEmpty(diaperChange) && diaperChange.color ? diaperChange.color : 'yellow');
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(diaperChanges)) {
        $tableBody.empty();
        var html = diaperChanges.map(function (change) {
          var time = moment(change.time).format('YYYY-MM-DD hh:mm a');
          var wetIconClasses = change.wet ? 'icon-true text-success' : 'icon-false text-danger';
          var solidIconClasses = change.solid ? 'icon-true text-success' : 'icon-false text-danger';
          return "\n            <tr>\n              <td class=\"text-center\">".concat(time, "</td>\n              <td class=\"text-center\">\n                <i class=\"icon ").concat(wetIconClasses, "\" aria-hidden=\"true\"></i>\n              </td>\n              <td class=\"text-center\">\n                <i class=\"icon ").concat(solidIconClasses, "\" aria-hidden=\"true\"></i>\n              </td>\n              <td class=\"text-center\">").concat(_.capitalize(change.color), "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-change=\"").concat(change.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-change=\"").concat(change.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          diaperChangeId = parseInt($target.data('change'));
          diaperChange = diaperChanges.find(function (c) {
            return c.id === diaperChangeId;
          });
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          diaperChangeId = parseInt($target.data('change'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(diaperChange)) {
          diaperChange = {};
        }

        diaperChange.child = childId;
        diaperChange.time = $timePicker.datetimepicker('viewDate').toISOString();
        diaperChange.wet = $wet.prop('checked');
        diaperChange.solid = $solid.prop('checked');
        diaperChange.color = $color.val();
      }
    },
    isValidInputs: function isValidInputs() {
      return $timePicker.datetimepicker('viewDate').isValid() && ($wet.prop('checked') || $solid.prop('checked')) && $color.val();
    },
    fetch: function fetch() {
      return $.get(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId)).then(function (response) {
        diaperChange = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.diaperChanges(childId);
      var s = $startFilterPicker.datetimepicker('viewDate');
      var e = $endFilterPicker.datetimepicker('viewDate');
      return diaperChangeDao.fetch(url, s.startOf('day'), e.endOf('day')).then(function (response) {
        diaperChanges = response;
        self.syncTable();
        $(window).resize(function () {
          diaperChangeChart.plot($el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        });
        $(window).on('orientationchange', function () {
          diaperChangeChart.plot($el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        });
        diaperChangeChart.plot($el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.diaperChanges(childId), diaperChange).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      return $.post(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId), diaperChange).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      diaperChange = {};
      diaperChangeId = null;
      var defaultTime = moment();

      if (!detailPickerInitialized) {
        $timePicker.datetimepicker({
          defaultDate: defaultTime,
          format: 'YYYY-MM-DD hh:mm a'
        });
        detailPickerInitialized = true;
      } else {
        $timePicker.datetimepicker('date', defaultTime);
      }

      $wet.prop('checked', false);
      $solid.prop('checked', false);
      $wet.parent().toggleClass('active', false);
      $solid.parent().toggleClass('active', false);
      $color.val('yellow');
    }
  };
  self = DiaperChange;
  return self;
}();
"use strict";

BabyBuddy.Feeding = function () {
  var $el;
  var userId;
  var childId;
  var feedingId;
  var feeding;
  var feedings = [];
  var $startPicker;
  var $endPicker;
  var $type;
  var $method;
  var $units;
  var $amount;
  var $tableBody;
  var $addBtn;
  var $saveBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var detailPickerInitialized = false;
  var feedingDao;
  var feedingChart;
  var self;
  var Feeding = {
    init: function init(el, uId, cId) {
      var fId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      feedingId = fId;
      $startPicker = $el.find('#feeding-datetimepicker_start');
      $endPicker = $el.find('#feeding-datetimepicker_end');
      $type = $el.find('#feeding-type');
      $method = $el.find('#feeding-method');
      $units = $el.find('#feeding-units');
      $amount = $el.find('#feeding-amount');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#feeding-add-btn');
      $saveBtn = $el.find('#feeding-save-btn');
      $addModal = $el.find('#feeding-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#feeding-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#feeding-filter-datetimepicker_end');
      feedingDao = BabyBuddy.ChildDurationActivityDao();
      feedingChart = BabyBuddy.FeedingChart();
      $confirmDeleteBtn.click(function (evt) {
        if (childId && feedingId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $type.change(function (evt) {
        if (!$type.val()) {
          $method.find('option').each(function (i, el) {
            var $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        } else if ($type.val() !== 'breast milk') {
          var breastOptions = ['left breast', 'right breast', 'both breasts'];
          $method.find('option').each(function (i, el) {
            var $this = $(el);
            $this.prop('disabled', breastOptions.includes($this.prop('value')));
            $this.prop('selected', $this.prop('value') === 'bottle');
          });
        } else {
          $method.find('option').each(function (i, el) {
            var $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        }
      });
      $method.change(function (evt) {
        if ($method.val() === 'bottle') {
          $amount.parent().show();
          $units.parent().show();
        } else {
          $amount.val(0);
          $amount.parent().hide();
          $units.parent().hide();
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!feedingId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(7, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: function syncInputs() {
      var hasFeeding = !_.isEmpty(feeding);
      var startDefault = hasFeeding && feeding.start ? moment(feeding.start) : moment().subtract(10, 'minutes');
      var endDefault = hasFeeding && feeding.end ? moment(feeding.end) : moment();
      $type.val(hasFeeding && feeding.type ? feeding.type : '');
      $method.val(hasFeeding && feeding.method ? feeding.method : '');
      $amount.val(hasFeeding && feeding.amount ? feeding.amount : '');
      $units.val(hasFeeding && feeding.units ? feeding.units : 'ounces');
      BabyBuddy.setDurationPickerConstraints(detailPickerInitialized, startDefault, endDefault, $startPicker, $endPicker);
      detailPickerInitialized = true;
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(feedings)) {
        $tableBody.empty();
        var html = feedings.map(function (f) {
          var ended = moment(f.end).format('YYYY-MM-DD hh:mm a');
          var duration = moment.duration(f.duration);
          var durationStr = '';

          if (duration.hours()) {
            if (duration.minutes()) {
              durationStr = "".concat(duration.hours(), " hrs ").concat(duration.minutes(), " mins");
            } else {
              durationStr = "".concat(duration.hours(), " hrs");
            }
          } else if (duration.minutes()) {
            durationStr = "".concat(duration.minutes(), " mins");
          }

          var amount = f.amount ? "".concat(f.amount, " ").concat(f.units === 'ounces' ? 'oz' : 'ml') : '';
          return "\n            <tr>\n              <td class=\"text-center\">".concat(_.capitalize(f.method), "</td>\n              <td class=\"text-center\">").concat(_.capitalize(f.type), "</td>\n              <td class=\"text-center\">").concat(amount, "</td>\n              <td class=\"text-center\">").concat(durationStr, "</td>\n              <td class=\"text-center\">").concat(ended, "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-feeding=\"").concat(f.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-feeding=\"").concat(f.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          feedingId = parseInt($target.data('feeding'));
          feeding = feedings.find(function (c) {
            return c.id === feedingId;
          });
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          feedingId = parseInt($target.data('feeding'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(feeding)) {
          feeding = {};
        }

        feeding.child = childId;
        feeding.start = $startPicker.datetimepicker('viewDate').toISOString();
        feeding.end = $endPicker.datetimepicker('viewDate').toISOString();
        feeding.type = $type.val();
        feeding.units = $units.val();
        feeding.method = $method.val();
        feeding.amount = $amount.val();
      }
    },
    isValidInputs: function isValidInputs() {
      var s = $startPicker.datetimepicker('viewDate');
      var e = $endPicker.datetimepicker('viewDate');
      var datesValid = s.isValid() && e.isValid();

      if (datesValid) {
        datesValid = s.isSame(e) || s.isBefore(e);
      }

      if (!datesValid || !$type.val() || !$method.val()) {
        return false;
      }

      if ($method.val() === 'bottle') {
        try {
          var amt = parseFloat($amount.val());

          if (amt <= 0) {
            return false;
          }
        } catch (err) {
          return false;
        }
      } else if (!['left breast', 'right breast', 'both breasts'].includes($method.val())) {
        return false;
      }

      return true;
    },
    fetch: function fetch() {
      return $.get(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId)).then(function (response) {
        feeding = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.feedings(childId);
      var s = $startFilterPicker.datetimepicker('viewDate').startOf('day');
      var e = $endFilterPicker.datetimepicker('viewDate').endOf('day');
      return feedingDao.fetch(url, s, e).then(function (response) {
        feedings = response;
        self.syncTable();
        var $chartContainer = $el.find('#feeding-container');
        $(window).resize(function () {
          feedingChart.plot($chartContainer, feedings, s, e);
        });
        $(window).on('orientationchange', function () {
          feedingChart.plot($chartContainer, feedings, s, e);
        });
        feedingChart.plot($chartContainer, feedings, s, e);
        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.feedings(childId), feeding).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      return $.post(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId), feeding).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      feeding = {};
      feedingId = null;
      $type.val('');
      $method.val('');
      $amount.val('');
      var startDefault = moment().subtract(10, 'minutes');
      var endDefault = moment();
      BabyBuddy.setDurationPickerConstraints(detailPickerInitialized, startDefault, endDefault, $startPicker, $endPicker);
      detailPickerInitialized = true;
    }
  };
  self = Feeding;
  return self;
}();
"use strict";

BabyBuddy.Note = function () {
  var $el;
  var userId;
  var childId;
  var noteId;
  var note;
  var notes = [];
  var $note;
  var $tableBody;
  var $saveBtn;
  var $addBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var noteDao;
  var self;
  var Note = {
    init: function init(el, uId, cId) {
      var nId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      noteId = nId;
      $note = $el.find('#note');
      $saveBtn = $el.find('#note-save-btn');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#note-add-btn');
      $addModal = $el.find('#note-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#note-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#note-filter-datetimepicker_end');
      noteDao = BabyBuddy.ChildTimeActivityDao();
      $confirmDeleteBtn.click(function (evt) {
        if (childId && noteId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.noteDetail(childId, noteId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!noteId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(7, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      self.syncInputs();
      $addModal.modal('show');
    },
    syncInputs: function syncInputs() {
      if (!_.isEmpty(note)) {
        $note.val(note.note);
      }
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(notes)) {
        $tableBody.empty();
        var html = notes.map(function (n) {
          var time = moment(n.time).format('YYYY-MM-DD hh:mm a');
          return "\n            <tr>\n              <td colspan=\"4\">".concat(n.note, "</td>\n              <td class=\"text-center\">").concat(time, "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-note=\"").concat(n.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-note=\"").concat(n.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          noteId = parseInt($target.data('note'));
          note = notes.find(function (n) {
            return n.id === noteId;
          });
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          noteId = parseInt($target.data('note'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(note)) {
          note = {};
        }

        note.child = childId;
        note.note = $note.val();
      }
    },
    isValidInputs: function isValidInputs() {
      return $note.val();
    },
    fetch: function fetch() {
      return $.get(BabyBuddy.ApiRoutes.noteDetail(childId, noteId)).then(function (response) {
        note = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.notes(childId);
      var s = $startFilterPicker.datetimepicker('viewDate');
      var e = $endFilterPicker.datetimepicker('viewDate');
      return noteDao.fetch(url, s.startOf('day'), e.endOf('day')).then(function (response) {
        notes = response;
        self.syncTable();
        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.notes(childId), note).then(function (response) {
        self.clear();
        $addModal.modal('hide');
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      return $.post(BabyBuddy.ApiRoutes.noteDetail(childId, noteId), note).then(function (response) {
        self.clear();
        $addModal.modal('hide');
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      note = {};
      noteId = null;
      $note.val('');
    }
  };
  self = Note;
  return self;
}();
"use strict";

BabyBuddy.Notification = function (root) {
  var $ = root.jQuery;
  var _ = root._; // var DurationFormHandler = root.BabyBuddy.DurationFormHandler;

  var runIntervalId = null,
      notificationId = null,
      $el = null,
      $childrenSelect = null,
      $accountSelect = null,
      $frequencyInHours = null,
      $intervals = null,
      $start = null,
      $end = null,
      $days = null,
      $hours = null,
      $minutes = null,
      $timerStatus = null,
      $notificationForm = null,
      lastUpdate = moment(),
      hidden = null,
      children = [],
      accounts = [],
      notification = {},
      self = null;
  var Notification = {
    init: function init(id, el) {
      notificationId = id;
      $el = $('#' + el);
      $childrenSelect = $el.find('#id_child');
      $accountSelect = $el.find('#id_account');
      $frequencyInHours = $el.find('#id_frequency_hours');
      $hours = $el.find('#notification-hours');
      $minutes = $el.find('#notification-minutes');
      $intervals = $el.find('#id_intervals');
      $start = $el.find('#datetimepicker_start');
      $end = $el.find('#datetimepicker_end');
      $timerStatus = $el.find('#timer-status');
      $notificationForm = $el.find('#notification-form');
      self = this;
      var initialDate = $start.find('input').val() ? $start.find('input').val() : moment().format('YYYY-MM-DD hh:mm a');
      $start.find('input').val(initialDate);
      $start.datetimepicker({
        format: 'YYYY-MM-DD hh:mm a',
        startDate: initialDate
      });
      $end.datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        onShow: function onShow(ct) {
          var minDate = self.getMinEndDate();
          minDate = minDate.format('YYYY-MM-DD hh:mm a');
          this.setOptions({
            minDate: minDate
          });
        }
      });
      $start.change(_.debounce(function (evt) {
        console.log('start date changed', evt);
        self.updateEndDate();
      }, 600));
      $end.change(_.debounce(function (evt) {
        console.log('end date changed', evt); // validate end date
      }, 1200)); // DurationFormHandler($notificationForm, $start, $end);

      $frequencyInHours.change(_.debounce(function (evt) {
        self.updateEndDate();
      }, 600));
      $intervals.change(_.debounce(function (evt) {
        self.updateEndDate();
      }, 600));

      if (notificationId) {
        this.fetchNotification().then(function (response) {
          if (notification.active) {
            self.run();
          } else {
            $el.find('input').each(function () {
              $(this).attr('disabled', true);
            });
            $el.find('select').each(function () {
              $(this).attr('disabled', true);
            });
            $el.find('textarea').each(function () {
              $(this).attr('disabled', true);
            });
          }
        });
      }

      this.fetchAccounts();
      this.fetchChildren();
      $childrenSelect.change(function (evt) {
        var selectedChildId = $(evt.currentTarget).val();
        var selectedAcct = accounts.find(function (a) {
          return a.id == selectedChildId;
        });

        if (selectedAcct && notification.hasOwnProperty('account')) {
          notification.account = selectedAcct.id;
        }

        $accountSelect.val(selectedChildId); // self.save();
      });
      $accountSelect.change(function (evt) {
        var selectedAcctId = $(evt.currentTarget).val();
        self.fillChildOptions(children.filter(function (c) {
          return c.account == selectedAcctId;
        })); // self.save();
      });
      window.addEventListener('beforeunload', function () {// self.save();
      });
      self.updateEndDate();
    },
    getMinEndDate: function getMinEndDate() {
      var hrs = 0;
      var intervals = 1;
      var startDT = $start.find('input').val() ? moment($start.find('input').val()) : moment();

      try {
        hrs = parseInt($frequencyInHours.val());
      } catch (err) {
        console.log(err);
      }

      try {
        intervals = parseInt($intervals.val());
      } catch (err) {
        console.log(err);
      }

      try {
        var endDT = startDT.clone().add(hrs * intervals, 'hours');
        return endDT;
      } catch (err) {
        console.log(err);
      }

      return moment();
    },
    updateEndDate: function updateEndDate() {
      var endDT = self.getMinEndDate();
      $end.find('input').val(endDT.format('YYYY-MM-DD hh:mm a'));
    },
    fillChildOptions: function fillChildOptions(availableChildren) {
      $childrenSelect.empty();
      var options = availableChildren.map(function (c) {
        var selected = notification.child == c.id ? 'selected' : '';
        var name = c.first_name + ' ' + c.last_name;
        return '<option value="' + c.id + '" ' + selected + '>' + name + '</option>';
      });
      options.unshift('<option disabled>Children</option>');
      $childrenSelect.html(options.join('\n'));
    },
    run: function run() {
      if ($el.length == 0) {
        console.error('Notification element not found.');
        return false;
      }

      if ($hours.length == 0 || $minutes.length == 0) {
        console.error('Element does not contain expected children.');
        return false;
      }

      $timerStatus.removeClass('timer-stopped');

      if (runIntervalId) {
        clearInterval(runIntervalId);
      }

      runIntervalId = setInterval(this.tick, 1000); // If the page just came in to view, update the timer data with the
      // current actual duration. This will (potentially) help mobile
      // phones that lock with the timer page open.

      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
      }

      window.addEventListener('focus', Notification.handleVisibilityChange, false);
    },
    handleVisibilityChange: function handleVisibilityChange() {
      if (!document[hidden] && moment().diff(lastUpdate) > 20000) {
        self.updateNotificationDisplay();
      }
    },
    tick: function tick() {
      var duration = self.timeUntilNextNotificationEvent(); // $days.text(duration.days());

      $hours.text(duration.hours());
      $minutes.text(duration.minutes());
    },
    updateNotificationDisplay: function updateNotificationDisplay() {
      if (notification && notification.frequency_hours) {
        clearInterval(runIntervalId);
        var duration = self.timeUntilNextNotificationEvent(); // $days.text(duration.days());

        $hours.text(duration.hours());
        $minutes.text(duration.minutes());
        lastUpdate = moment();

        if (notification.active) {
          // update every 10 seconds
          runIntervalId = setInterval(Notification.tick, 10000);
          $timerStatus.removeClass('timer-stopped');
        } else {
          $timerStatus.addClass('timer-stopped');
        }
      }
    },
    fetchNotification: function fetchNotification() {
      return $.get(BabyBuddy.ApiRoutes.notification(notificationId)).then(function (response) {
        notification = response;
        return response;
      });
    },
    fetchAccounts: function fetchAccounts() {
      return $.get(BabyBuddy.ApiRoutes.accounts()).then(function (response) {
        accounts = response;
        return response;
      });
    },
    fetchChildren: function fetchChildren() {
      return $.get(BabyBuddy.ApiRoutes.children()).then(function (response) {
        children = response;
        return response;
      });
    },
    save: function save() {// return $.post('/api/timers/' + timerId + '/', timer)
      //   .then(function(response){
      //     console.log('saved timer', response);
      //     timer = response;
      //     return response;
      //   });
    },
    timeUntilNextNotificationEvent: function timeUntilNextNotificationEvent() {
      var now = moment();

      if (_.isEmpty(notification) || !notification.active || now.isAfter(notification.end)) {
        return moment.duration(0, 'hours');
      }

      var secsSinceStart = moment.duration(now.diff(notification.start)).as('seconds');
      var freqInSecs = notification.frequency_hours * 60 * 60;
      var secsUntilNext = freqInSecs;

      if (freqInSecs > secsSinceStart) {
        secsUntilNext = freqInSecs - secsSinceStart;
      } else {
        var r = secsSinceStart % freqInSecs;

        if (r !== 0) {
          secsUntilNext = Math.round(freqInSecs - r);
        }
      }

      var durationUntilNext = moment.duration(secsUntilNext, 'seconds');
      return durationUntilNext;
    }
  };
  return Notification;
}(window);
"use strict";

BabyBuddy.Sleep = function () {
  var $el;
  var userId;
  var childId;
  var sleepId;
  var sleep;
  var sleeps = [];
  var $startPicker;
  var $endPicker;
  var $tableBody;
  var $addBtn;
  var $saveBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var sleepDao;
  var sleepChart;
  var detailPickerInitialized = false;
  var self;
  var Sleep = {
    init: function init(el, uId, cId) {
      var sId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      sleepId = sId;
      $startPicker = $el.find('#sleep-datetimepicker_start');
      $endPicker = $el.find('#sleep-datetimepicker_end');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#sleep-add-btn');
      $saveBtn = $el.find('#sleep-save-btn');
      $addModal = $el.find('#sleep-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#sleep-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#sleep-filter-datetimepicker_end');
      sleepDao = BabyBuddy.ChildDurationActivityDao();
      sleepChart = BabyBuddy.SleepChart();
      $confirmDeleteBtn.click(function (evt) {
        if (childId && sleepId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!sleepId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(7, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: function syncInputs() {
      var hasSleep = !_.isEmpty(sleep);
      var startDefault = hasSleep && sleep.start ? moment(sleep.start) : moment().subtract(2, 'minutes');
      var endDefault = hasSleep && sleep.end ? moment(sleep.end) : moment();
      BabyBuddy.setDurationPickerConstraints(detailPickerInitialized, startDefault, endDefault, $startPicker, $endPicker);
      detailPickerInitialized = true;
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(sleeps)) {
        $tableBody.empty();
        var html = sleeps.map(function (s) {
          var start = moment(s.start).format('YYYY-MM-DD hh:mm a');
          var end = moment(s.end).format('YYYY-MM-DD hh:mm a');
          var duration = moment.duration(s.duration);
          var durationStr = '';

          if (duration.hours()) {
            if (duration.minutes()) {
              durationStr = "".concat(duration.hours(), " hrs ").concat(duration.minutes(), " mins");
            } else {
              durationStr = "".concat(duration.hours(), " hrs");
            }
          } else if (duration.minutes()) {
            durationStr = "".concat(duration.minutes(), " mins");
          }

          var napIconClasses = s.nap ? 'icon-true text-success' : 'icon-false text-danger';
          return "\n            <tr>\n              <td class=\"text-center\">".concat(start, "</td>\n              <td class=\"text-center\">").concat(end, "</td>\n              <td class=\"text-center\">").concat(durationStr, "</td>\n              <td class=\"text-center\">\n                <i class=\"icon ").concat(napIconClasses, "\" aria-hidden=\"true\"></i>\n              </td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-sleep=\"").concat(s.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-sleep=\"").concat(s.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          sleepId = parseInt($target.data('sleep'));
          sleep = sleeps.find(function (c) {
            return c.id === sleepId;
          });
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          sleepId = parseInt($target.data('sleep'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(sleep)) {
          sleep = {};
        }

        sleep.child = childId;
        sleep.start = $startPicker.datetimepicker('viewDate').toISOString();
        sleep.end = $endPicker.datetimepicker('viewDate').toISOString();
      }
    },
    isValidInputs: function isValidInputs() {
      var s = $startPicker.datetimepicker('viewDate');
      var e = $endPicker.datetimepicker('viewDate');
      var datesValid = s.isValid() && e.isValid();

      if (datesValid) {
        datesValid = s.isBefore(e);
      }

      return datesValid;
    },
    fetch: function fetch() {
      $.get(BabyBuddy.ApiRoutes.sleeping(childId, sleepId)).then(function (response) {
        sleep = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.sleeping(childId);
      var s = $startFilterPicker.datetimepicker('viewDate').startOf('day');
      var e = $endFilterPicker.datetimepicker('viewDate').endOf('day');
      return sleepDao.fetch(url, s, e).then(function (response) {
        sleeps = response;
        self.syncTable();
        var $chartContainer = $el.find('#sleep-container');
        $(window).resize(function () {
          sleepChart.plot($chartContainer, sleeps, s, e);
        });
        $(window).on('orientationchange', function () {
          sleepChart.plot($chartContainer, sleeps, s, e);
        });
        sleepChart.plot($chartContainer, sleeps, s, e);
        return response;
      });
    },
    create: function create() {
      $.post(BabyBuddy.ApiRoutes.sleeping(childId), sleep).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      $.post(BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId), sleep).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      sleepId = null;
      sleep = {};
      var startDefault = moment().subtract(2, 'minutes');
      var endDefault = moment();
      BabyBuddy.setDurationPickerConstraints(detailPickerInitialized, startDefault, endDefault, $startPicker, $endPicker);
      detailPickerInitialized = true;
    }
  };
  self = Sleep;
  return self;
}();
"use strict";

BabyBuddy.Temperature = function () {
  var $el;
  var userId;
  var childId;
  var temperatureId;
  var temperature;
  var temperatures = [];
  var $timePicker;
  var $temperature;
  var $tableBody;
  var $addBtn;
  var $saveBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var detailPickerInitialized = false;
  var temperatureDao;
  var temperatureChart;
  var self;
  var Temperature = {
    init: function init(el, uId, cId) {
      var tId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      temperatureId = tId;
      $temperature = $el.find('#temperature');
      $saveBtn = $el.find('#temperature-save-btn');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#temperature-add-btn');
      $addModal = $el.find('#temperature-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $timePicker = $el.find('#temperature-datetimepicker_time');
      $startFilterPicker = $el.find('#temperature-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#temperature-filter-datetimepicker_end');
      temperatureDao = BabyBuddy.ChildTimeActivityDao(); // temperatureChart = BabyBuddy.TemperatureChart();

      $confirmDeleteBtn.click(function (evt) {
        if (childId && temperatureId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!temperatureId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(90, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: function syncInputs() {
      var defaultTime = !_.isEmpty(temperature) && temperature.time ? moment(temperature.time) : moment();

      if (!detailPickerInitialized) {
        $timePicker.datetimepicker({
          defaultDate: defaultTime,
          format: 'YYYY-MM-DD hh:mm a'
        });
        detailPickerInitialized = true;
      } else {
        $timePicker.datetimepicker('date', defaultTime);
      }

      $temperature.val(!_.isEmpty(temperature) ? temperature.temperature : '');
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(temperatures)) {
        $tableBody.empty();
        var html = temperatures.map(function (t) {
          var time = moment(t.time).format('YYYY-MM-DD hh:mm a');
          var temp = t.temperature || '';
          return "\n            <tr>\n              <td class=\"text-center\">".concat(temp, "</td>\n              <td class=\"text-center\">").concat(time, "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-temperature=\"").concat(t.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-temperature=\"").concat(t.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          temperatureId = parseInt($target.data('temperature'));
          temperature = temperatures.find(function (t) {
            return t.id === temperatureId;
          });
          self.syncInputs();
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          temperatureId = parseInt($target.data('temperature'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(temperature)) {
          temperature = {};
        }

        temperature.child = childId;
        temperature.time = $timePicker.datetimepicker('viewDate').toISOString();
        temperature.temperature = $temperature.val();
      }
    },
    isValidInputs: function isValidInputs() {
      if (!$temperature.val()) {
        return false;
      }

      try {
        var temp = parseFloat($temperature.val());

        if (temp <= 20 || temp > 110) {
          return false;
        }
      } catch (err) {
        return false;
      }

      return $timePicker.datetimepicker('viewDate').isValid();
    },
    fetch: function fetch() {
      return $.get(BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId)).then(function (response) {
        temperature = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.temperatures(childId);
      var s = $startFilterPicker.datetimepicker('viewDate');
      var e = $endFilterPicker.datetimepicker('viewDate');
      return temperatureDao.fetch(url, s.startOf('day'), e.endOf('day')).then(function (response) {
        temperatures = response;
        self.syncTable(); // $(window).resize(() => {
        //   temperatureChart.plot($el.find('#temperature-chart'), $el.find('#temperature-chart-container'), temperatures, s, e);
        // });
        // temperatureChart.plot($el.find('#temperature-chart'), $el.find('#temperature-chart-container'), temperatures, s, e);

        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.temperatures(childId), temperature).then(function (response) {
        temperature = response;
        temperatureId = response.id;
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      return $.post(BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId), temperature).then(function (response) {
        temperature = response;
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      temperature = {};
      temperatureId = null;
      var defaultTime = moment();

      if (!detailPickerInitialized) {
        $timePicker.datetimepicker({
          defaultDate: defaultTime,
          format: 'YYYY-MM-DD hh:mm a'
        });
        detailPickerInitialized = true;
      } else {
        $timePicker.datetimepicker('date', defaultTime);
      }
    }
  };
  self = Temperature;
  return self;
}();
"use strict";

BabyBuddy.Timers = function () {
  var $el;
  var userId;
  var $tableBody;
  var $startFilterPicker;
  var $endFilterPicker;
  var timers = [];
  var timerDao;
  var self;
  var Timers = {
    init: function init(el, uId) {
      $el = $(el);
      userId = uId;
      timerDao = BabyBuddy.ChildTimeActivityDao('created');
      $tableBody = $el.find('tbody');
      $startFilterPicker = $el.find('#timer-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#timer-filter-datetimepicker_end');
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(7, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    makeDuration: function makeDuration(duration) {
      var durationDisplay = '';

      if (duration.hours()) {
        if (duration.minutes()) {
          durationDisplay = "".concat(duration.hours(), " hrs, ").concat(duration.minutes(), " mins");
        } else {
          durationDisplay = "".concat(duration.hours(), " hrs");
        }
      } else if (duration.minutes()) {
        durationDisplay = "".concat(duration.minutes(), " mins");
      }

      return durationDisplay;
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(timers)) {
        $tableBody.empty();
        var html = timers.map(function (t) {
          var start = moment(t.created).format('YYYY-MM-DD hh:mm a');
          var end = t.end ? moment(t.end).format('YYYY-MM-DD hh:mm a') : '';
          var duration = moment.duration(t.duration);
          var durationStr = self.makeDuration(duration);
          var status;

          if (t.active) {
            status = 'Active';
          } else if (!t.complete) {
            status = 'Paused';
          } else {
            status = 'Complete';
          }

          return "\n            <tr>\n              <th scope=\"row\">\n                <a href=\"/timer/".concat(t.id, "/\">").concat(t.name, "</a>\n              </th>\n              <td class=\"text-center\">").concat(status, "</td>\n              <td class=\"text-center\">").concat(durationStr, "</td>\n              <td class=\"text-center\">").concat(end, "</td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
      }
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.timers();
      var s = $startFilterPicker.datetimepicker('viewDate').startOf('day');
      var e = $endFilterPicker.datetimepicker('viewDate').clone().add(1, 'days').endOf('day');
      return timerDao.fetch(url, s, e).then(function (response) {
        timers = response;
        self.syncTable();
        return response;
      });
    }
  };
  self = Timers;
  return self;
}();
"use strict";

BabyBuddy.TimerDetail = function (root) {
  var $ = root.$;
  var _ = root._;
  var runIntervalId = null,
      timerId = null,
      userId = null,
      $el = null,
      $errorModal = null,
      $childrenSelect = null,
      $accountSelect = null,
      $feedingCard = null,
      $sleepCard = null,
      $tummytimeCard = null,
      $startBtn = null,
      $pauseBtn = null,
      $endBtn = null,
      $name = null,
      $hours = null,
      $minutes = null,
      $seconds = null,
      $timerStatus = null,
      $timerStatusMsg = null,
      $feedingModal = null,
      $startFeedingPicker = null,
      $endFeedingPicker = null,
      debounceTimer = null,
      lastUpdate = moment(),
      periodicUpdateIntervalId = null,
      duration = null,
      hidden = null,
      children = [],
      accounts = [],
      timer = null,
      self = null;
  var TimerDetail = {
    init: function init(id, user, el) {
      timerId = id;
      userId = user;
      $el = $('#' + el);
      $errorModal = $el.find('#timer-msg-modal');
      $name = $el.find('#name');
      $childrenSelect = $el.find('#child');
      $accountSelect = $el.find('#account');
      $feedingCard = $el.find('#card-feeding');
      $sleepCard = $el.find('#card-sleep');
      $tummytimeCard = $el.find('#card-tummytime');
      $startBtn = $el.find('#start-timer');
      $pauseBtn = $el.find('#pause-timer');
      $endBtn = $el.find('#end-timer');
      $hours = $el.find('#timer-hours');
      $minutes = $el.find('#timer-minutes');
      $seconds = $el.find('#timer-seconds');
      $timerStatus = $el.find('#timer-status');
      $timerStatusMsg = $el.find('#timer-status-message');
      $feedingModal = $el.find('#feeding-modal');
      self = this;

      if (timerId) {
        this.fetchTimer().then(function (response) {
          if (!_.isEmpty(timer) && timer.active) {
            self.run();
            $startBtn.hide();
            $pauseBtn.show();
          } else {
            $startBtn.show();
            $pauseBtn.hide();
          }
        });
      } else {
        $endBtn.hide();
        $pauseBtn.hide();
      }

      $startBtn.click(function (evt) {
        evt.preventDefault();

        if (_.isEmpty(timer) || !timerId) {
          self.createTimer()["catch"](function (err) {
            $errorModal.find('#modal-error-message').html('Your monthly allocation of timers as been reached. Please upgrade your account to gain access to additional timers.');
            $errorModal.modal('show');
          });
        } else {
          timer.active = true;
          self.save().then(function (response) {
            self.run();
            $startBtn.hide();
            $pauseBtn.show();
          })["catch"](function (err) {
            $errorModal.find('#modal-error-message').html('Your monthly allocation of timers as been reached. Please upgrade your account to gain access to additional timers.');
            $errorModal.modal('show');
          });
        }
      });
      $pauseBtn.click(function (evt) {
        evt.preventDefault();
        timer.active = false;
        self.save().then(function (response) {
          self.updateTimerDisplay();
          $startBtn.show();
          $pauseBtn.hide();
        });
      });
      $endBtn.click(function (evt) {
        evt.preventDefault();
        timer.active = false;
        timer.complete = true;
        self.save().then(function (response) {
          if (response.is_feeding) {
            $feedingModal.modal('show');
            var feedingDuration = moment.duration(response.duration);
            var feedingEnd = moment();
            var feedingStart = feedingEnd.clone().subtract(feedingDuration);
            var $feedingStart = $feedingModal.find('#feeding-datetimepicker_start');
            var $feedingEnd = $feedingModal.find('#feeding-datetimepicker_end');
            $feedingStart.datetimepicker({
              defaultDate: feedingStart,
              format: 'YYYY-MM-DD hh:mm a'
            });
            $feedingEnd.datetimepicker({
              defaultDate: feedingEnd,
              format: 'YYYY-MM-DD hh:mm a'
            });
            var $units = $feedingModal.find('#feeding-units');
            var $type = $feedingModal.find('#feeding-type');
            var $method = $feedingModal.find('#feeding-method');
            var $amount = $feedingModal.find('#feeding-amount');
            $type.change(function (evt) {
              if (!$type.val()) {
                $method.find('option').each(function (i, el) {
                  var $this = $(el);
                  $this.prop('disabled', false);
                  $this.prop('selected', i === 0);
                });
              } else if ($type.val() !== 'breast milk') {
                var breastOptions = ['left breast', 'right breast', 'both breasts'];
                $method.find('option').each(function (i, el) {
                  var $this = $(el);
                  $this.prop('disabled', breastOptions.includes($this.prop('value')));
                  $this.prop('selected', $this.prop('value') === 'bottle');
                });
              } else {
                $method.find('option').each(function (i, el) {
                  var $this = $(el);
                  $this.prop('disabled', false);
                  $this.prop('selected', i === 0);
                });
              }
            });
            $method.change(function (evt) {
              if ($method.val() === 'bottle') {
                $amount.parent().show();
                $units.parent().show();
              } else {
                $amount.parent().hide();
                $units.parent().hide();
              }
            });
            $feedingModal.find('#feeding-save-btn').click(function (e) {
              var feeding = {
                child: response.child,
                start: $feedingStart.datetimepicker('viewDate').toISOString(),
                end: $feedingEnd.datetimepicker('viewDate').toISOString(),
                type: $type.val(),
                method: $method.val(),
                amount: $amount.val(),
                units: $units.val()
              };

              if (feeding.method === 'bottle' && !feeding.amount) {
                return;
              }

              $.post(BabyBuddy.ApiRoutes.feedings(feeding.child), feeding).then(function (response) {
                root.location.href = $endBtn.prop('href');
                return response;
              });
            });
          } else {
            root.location.href = $endBtn.prop('href');
          }
        });
      });
      $name.change(_.debounce(function (evt) {
        if (!_.isEmpty(timer) && timer.name !== $name.val()) {
          timer.name = $name.val();
          self.save();
        }
      }, 800));
      $childrenSelect.change(function (evt) {
        if (!_.isEmpty(timer)) {
          timer.child = $childrenSelect.val();
          var selectedAcct = accounts.find(function (a) {
            return a.id == timer.child;
          });

          if (selectedAcct) {
            timer.account = selectedAcct.id;
          }

          $accountSelect.val(timer.account);
          $accountSelect.change();
          self.save();
        }
      });
      $accountSelect.change(function (evt) {
        if (!_.isEmpty(timer)) {
          timer.account = $accountSelect.val();
          self.fillChildOptions(children.filter(function (c) {
            return c.account == timer.account;
          }));
          self.save();
        } else {
          self.fillChildOptions(children);
        }
      });
      $feedingCard.click(function (evt) {
        evt.preventDefault();
        $feedingCard.toggleClass('card-active');
        $sleepCard.removeClass('card-active');
        $tummytimeCard.removeClass('card-active');

        if (!_.isEmpty(timer)) {
          self.save();
        }
      });
      $sleepCard.click(function (evt) {
        evt.preventDefault();
        $sleepCard.toggleClass('card-active');
        $feedingCard.removeClass('card-active');
        $tummytimeCard.removeClass('card-active');

        if (!_.isEmpty(timer)) {
          self.save();
        }
      });
      $tummytimeCard.click(function (evt) {
        evt.preventDefault();
        $tummytimeCard.toggleClass('card-active');
        $feedingCard.removeClass('card-active');
        $sleepCard.removeClass('card-active');

        if (!_.isEmpty(timer)) {
          self.save();
        }
      });
      this.fetchChildren().then(function (response) {
        return self.fetchAccounts();
      });
      $(window).on('beforeunload', function () {
        if (!_.isEmpty(timer)) {
          self.save();
        }

        clearInterval(periodicUpdateIntervalId);
        clearInterval(runIntervalId);
      });
    },
    fillChildOptions: function fillChildOptions(availableChildren) {
      $childrenSelect.empty();
      var options = availableChildren.map(function (c) {
        var selected = !_.isEmpty(timer) && timer.child == c.id ? 'selected' : '';
        var name = c.first_name + ' ' + c.last_name;
        return '<option value="' + c.id + '" ' + selected + '>' + name + '</option>';
      });
      options.unshift('<option disabled>Children</option>');
      $childrenSelect.html(options.join('\n'));

      if (availableChildren.length === 1) {
        var child = availableChildren[0];
        $childrenSelect.val(child.id);
      }
    },
    run: function run() {
      if ($el.length == 0) {
        console.error('BBTimer: Timer element not found.');
        return false;
      }

      if ($seconds.length == 0 || $minutes.length == 0 || $hours.length == 0) {
        console.error('Timer element does not contain expected children.');
        return false;
      }

      $timerStatus.removeClass('timer-stopped');

      if (runIntervalId) {
        clearInterval(runIntervalId);
      }

      runIntervalId = setInterval(self.tick, 1000);

      if (periodicUpdateIntervalId) {
        clearInterval(periodicUpdateIntervalId);
      }

      periodicUpdateIntervalId = setInterval(self.fetchTimer, 5000); // If the page just came in to view, update the timer data with the
      // current actual duration. This will (potentially) help mobile
      // phones that lock with the timer page open.

      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
      }

      window.addEventListener('focus', self.handleVisibilityChange, false);
    },
    handleVisibilityChange: function handleVisibilityChange() {
      if (!document[hidden] || moment().diff(lastUpdate) > 5000) {
        self.updateTimerDisplay();
      }
    },
    tick: function tick() {
      if (duration && !_.isEmpty(timer) && timer.active) {
        duration.add(1, 'seconds');
        $seconds.text(duration.seconds());
        $minutes.text(duration.minutes());
        $hours.text(duration.days() * 24 + duration.hours());
      }
    },
    updateTimerDisplay: function updateTimerDisplay() {
      if (!_.isEmpty(timer)) {
        self.save().then(function (response) {
          if (!_.isEmpty(timer) && timer.duration) {
            self.syncUI();
          }
        });
      }
    },
    syncUI: function syncUI() {
      if (!_.isEmpty(timer)) {
        duration = moment.duration(timer.duration);
        $hours.text(duration.days() * 24 + duration.hours());
        $minutes.text(duration.minutes());
        $seconds.text(duration.seconds());
        lastUpdate = moment();

        if (timer.active) {
          if (runIntervalId) {
            clearInterval(runIntervalId);
          }

          runIntervalId = setInterval(TimerDetail.tick, 1000);
          $pauseBtn.show();
          $startBtn.hide();
          $endBtn.show();
          $timerStatus.removeClass('timer-stopped');
        } else {
          if (timer.complete) {
            $pauseBtn.hide();
            $startBtn.hide();
            $endBtn.hide();
          } else {
            $pauseBtn.hide();
            $startBtn.show();
            $endBtn.show();
          }

          $timerStatus.addClass('timer-stopped');
        }

        $tummytimeCard.toggleClass('card-active', timer.is_tummytime);
        $feedingCard.toggleClass('card-active', timer.is_feeding);
        $sleepCard.toggleClass('card-active', timer.is_sleeping);
      } else {
        $startBtn.show();
        $tummytimeCard.toggleClass('card-active', false);
        $feedingCard.toggleClass('card-active', false);
        $sleepCard.toggleClass('card-active', false);
      }
    },
    fetchTimer: function fetchTimer() {
      if (timerId) {
        return $.get(BabyBuddy.ApiRoutes.timerDetail(timerId)).then(function (response) {
          timer = response;
          duration = moment.duration(timer.duration);
          self.reportTimerStatusMessage();
          self.syncUI();
          return response;
        });
      }
    },
    fetchAccounts: function fetchAccounts() {
      return $.get('/api/accounts/').then(function (response) {
        accounts = response;

        if (!$accountSelect.val() && accounts.length) {
          $accountSelect.val(accounts[0].id);
          $accountSelect.change();
        }

        return response;
      });
    },
    fetchChildren: function fetchChildren() {
      return $.get('/api/children/').then(function (response) {
        children = response;
        self.fillChildOptions(children);
        return response;
      });
    },
    reportTimerStatusMessage: function reportTimerStatusMessage() {
      $timerStatusMsg.empty();

      if (!_.isEmpty(timer) && timer.end) {
        var endedAt = moment(timer.end).format('YYYY-MM-DD hh:mm a');

        if (!timer.active && !timer.complete && timer.end) {
          $timerStatusMsg.html("Paused at ".concat(endedAt));
        } else if (timer.complete) {
          $timerStatusMsg.html("Completed at ".concat(endedAt));
        }
      }
    },
    save: function save() {
      timer.is_feeding = $feedingCard.is('.card-active');
      timer.is_sleeping = $sleepCard.is('.card-active');
      timer.is_tummytime = $tummytimeCard.is('.card-active');
      timer.name = $name.val();
      timer.child = $childrenSelect.val();
      timer.account = $accountSelect.val();
      return $.post(BabyBuddy.ApiRoutes.timerDetail(timerId), timer).then(function (response) {
        timer = response;
        duration = moment.duration(timer.duration);
        self.reportTimerStatusMessage();
        self.syncUI();
        return response;
      });
    },
    createTimer: function createTimer() {
      timer = {
        name: $name.val(),
        user: userId,
        child: $childrenSelect.val(),
        account: $accountSelect.val(),
        is_feeding: $feedingCard.is('.card-active'),
        is_sleeping: $sleepCard.is('.card-active'),
        is_tummytime: $tummytimeCard.is('.card-active')
      };
      return $.post(BabyBuddy.ApiRoutes.timers(), timer).then(function (response) {
        timer = response;
        duration = moment.duration(timer.duration);
        timerId = timer.id;
        $endBtn.show();
        $startBtn.hide();
        $pauseBtn.show();
        $endBtn.prop('href', "".concat(BabyBuddy.host(), "/timer/").concat(timerId, "/stop/"));
        self.run();
        self.syncUI();
        BabyBuddy.updateTimerNavSpan();
        setTimeout(function () {
          window.location.href = "/timer/".concat(timerId, "/");
        }, 1200);
        return response;
      });
    }
  };
  return TimerDetail;
}(window);
"use strict";

BabyBuddy.TummyTime = function () {
  var $el;
  var userId;
  var childId;
  var tummyTimeId;
  var tummyTime = {};
  var tummyTimes = [];
  var $milestone;
  var $tableBody;
  var $startPicker;
  var $endPicker;
  var $addBtn;
  var $saveBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var detailPickerInitialized = false;
  var tummytimeDao;
  var tummytimeChart;
  var self;
  var TummyTime = {
    init: function init(el, uId, cId) {
      var tId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      tummyTimeId = tId;
      $startPicker = $el.find('#tummytime-datetimepicker_start');
      $endPicker = $el.find('#tummytime-datetimepicker_end');
      $milestone = $el.find('#milestone');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#tummytime-add-btn');
      $saveBtn = $el.find('#tummytime-save-btn');
      $addModal = $el.find('#tummytime-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#tummytime-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#tummytime-filter-datetimepicker_end');
      tummytimeDao = BabyBuddy.ChildDurationActivityDao();
      tummytimeChart = BabyBuddy.TummyTimeChart();
      $confirmDeleteBtn.click(function (evt) {
        if (childId && tummyTimeId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.tummyTimeDetail(childId, tummyTimeId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!tummyTimeId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(14, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: function syncInputs() {
      var hasTummyTime = !_.isEmpty(tummyTime);
      var startDefault = hasTummyTime && tummyTime.start ? moment(tummyTime.start) : moment().subtract(2, 'minutes');
      var endDefault = hasTummyTime && tummyTime.end ? moment(tummyTime.end) : moment();
      BabyBuddy.setDurationPickerConstraints(detailPickerInitialized, startDefault, endDefault, $startPicker, $endPicker);
      detailPickerInitialized = true;
      $milestone.val(!_.isEmpty(tummyTime) && tummyTime.milestone ? tummyTime.milestone : '');
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(tummyTimes)) {
        $tableBody.empty();
        var html = tummyTimes.map(function (t) {
          var start = moment(t.start).format('YYYY-MM-DD hh:mm a');
          var end = moment(t.end).format('YYYY-MM-DD hh:mm a');
          var duration = moment.duration(t.duration);
          var durationStr = '';

          if (duration.hours()) {
            if (duration.minutes()) {
              durationStr = "".concat(duration.hours(), " hrs ").concat(duration.minutes(), " mins");
            } else {
              durationStr = "".concat(duration.hours(), " hrs");
            }
          } else if (duration.minutes()) {
            durationStr = "".concat(duration.minutes(), " mins");
          }

          var milestone = t.milestone || '';
          return "\n            <tr>\n              <td class=\"text-center\">".concat(durationStr, "</td>\n              <td class=\"text-center\">").concat(start, "</td>\n              <td class=\"text-center\">").concat(end, "</td>\n              <td class=\"text-center\">").concat(milestone, "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-tummytime=\"").concat(t.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-tummytime=\"").concat(t.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          tummyTimeId = parseInt($target.data('tummytime'));
          tummyTime = tummyTimes.find(function (c) {
            return c.id === tummyTimeId;
          });
          self.syncInputs();
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          tummyTimeId = parseInt($target.data('tummytime'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(tummyTime)) {
          tummyTime = {};
        }

        tummyTime.child = childId;
        tummyTime.start = $startPicker.datetimepicker('viewDate').toISOString();
        tummyTime.end = $endPicker.datetimepicker('viewDate').toISOString();
        tummyTime.milestone = $milestone.val();
      }
    },
    isValidInputs: function isValidInputs() {
      var startDate = $startPicker.datetimepicker('viewDate');
      var endDate = $endPicker.datetimepicker('viewDate');
      var datesValid = startDate.isValid() && endDate.isValid() && startDate.isBefore(endDate);
      return datesValid;
    },
    fetch: function fetch() {
      $.get(BabyBuddy.ApiRoutes.tummyTime(childId, tummyTimeId)).then(function (response) {
        tummyTime = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.tummyTime(childId);
      var s = $startFilterPicker.datetimepicker('viewDate').startOf('day');
      var e = $endFilterPicker.datetimepicker('viewDate').endOf('day');
      return tummytimeDao.fetch(url, s, e).then(function (response) {
        tummyTimes = response;
        self.syncTable();
        var $chartContainer = $el.find('#tummytime-chart-container');
        $(window).resize(function () {
          tummytimeChart.plot($chartContainer, tummyTimes, s, e);
        });
        $(window).on('orientationchange', function () {
          tummytimeChart.plot($chartContainer, tummyTimes, s, e);
        });
        tummytimeChart.plot($chartContainer, tummyTimes, s, e);
        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.tummyTime(childId), tummyTime).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      return $.post(BabyBuddy.ApiRoutes.tummyTimeDetail(childId, tummyTimeId), tummyTime).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        console.log('error', err);

        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      tummyTime = {};
      tummyTimeId = null;
      var startDefault = moment().subtract(2, 'minutes');
      var endDefault = moment();
      BabyBuddy.setDurationPickerConstraints(detailPickerInitialized, startDefault, endDefault, $startPicker, $endPicker);
      detailPickerInitialized = true;
      $milestone.val('');
    }
  };
  self = TummyTime;
  return self;
}();
"use strict";

BabyBuddy.Weight = function () {
  var $el;
  var userId;
  var childId;
  var weightId;
  var weight;
  var weights = [];
  var $datePicker;
  var $weight;
  var $ounces;
  var $units;
  var $tableBody;
  var $saveBtn;
  var $addBtn;
  var $addModal;
  var $deleteModal;
  var $confirmDeleteBtn;
  var $startFilterPicker;
  var $endFilterPicker;
  var weightDao;
  var detailPickerInitialized = false;
  var weightChart;
  var self;
  var Weight = {
    init: function init(el, uId, cId) {
      var wId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $el = $(el);
      userId = uId;
      childId = cId;
      weightId = wId;
      $weight = $el.find('#weight');
      $ounces = $el.find('#ounces');
      $units = $el.find('#units');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#weight-save-btn');
      $addBtn = $el.find('#weight-add-btn');
      $addModal = $el.find('#weight-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $datePicker = $el.find('#weight-datetimepicker_date');
      $startFilterPicker = $el.find('#weight-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#weight-filter-datetimepicker_end');
      weightDao = BabyBuddy.ChildTimeActivityDao('date'); // weightChart = BabyBuddy.WeightChart();

      $confirmDeleteBtn.click(function (evt) {
        if (childId && weightId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.weightDetail(childId, weightId),
            type: 'DELETE'
          }).then(function (response) {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });
      $addBtn.click(function (evt) {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click(function (evt) {
        if (self.isValidInputs()) {
          self.syncModel();

          if (!weightId) {
            self.create();
          } else {
            self.update();
          }
        }
      });
      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(90, 'days'),
        format: 'YYYY-MM-DD'
      });
      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });
      $startFilterPicker.on('change.datetimepicker', function (evt) {
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });
      $endFilterPicker.on('change.datetimepicker', function (evt) {
        self.fetchAll();
      });
      $units.change(function (evt) {
        if ($units.val() === 'pounds') {
          $ounces.parent().show();
          $weight.parent().find('label').html('Pounds');
        } else {
          $ounces.parent().hide();
          $weight.parent().find('label').html('Kilograms');
        }
      });
      self.fetchAll();
    },
    showAddModal: function showAddModal() {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: function syncInputs() {
      var empty = _.isEmpty(weight);

      var defaultDate = !empty && weight.date ? moment(weight.date) : moment();

      if (!detailPickerInitialized) {
        $datePicker.datetimepicker({
          defaultDate: defaultDate,
          format: 'YYYY-MM-DD'
        });
        detailPickerInitialized = true;
      } else {
        $datePicker.datetimepicker('date', defaultDate);
      }

      var w = !empty ? weight.weight : 0;
      $units.val(!empty ? weight.units : 'pounds');

      if ($units.val() === 'pounds') {
        var pounds = Math.floor(w);
        var ounces = Math.round((w - pounds) * 16);
        $weight.val(pounds);
        $ounces.val(ounces);
      } else {
        $weight.val(w);
      }
    },
    syncTable: function syncTable() {
      if (!_.isEmpty(weights)) {
        $tableBody.empty();
        var html = weights.map(function (w) {
          var date = moment(w.date).format('YYYY-MM-DD');
          var wt = parseFloat(w.weight || 0);

          if (w.units === 'pounds') {
            var pounds = Math.floor(wt);
            var ounces = Math.round((wt - pounds) * 16);
            wt = "".concat(pounds, " lbs ").concat(ounces, " oz");
          } else {
            wt = "".concat(wt.toFixed(3), " kg");
          }

          return "\n            <tr>\n              <td class=\"text-center\">".concat(wt, "</td>\n              <td class=\"text-center\">").concat(date, "</td>\n              <td class=\"text-center\">\n                <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Actions\">\n                  <a class=\"btn btn-primary update-btn\" data-weight=\"").concat(w.id, "\">\n                    <i class=\"icon icon-update\" aria-hidden=\"true\"></i>\n                  </a>\n                  <a class=\"btn btn-danger delete-btn\" data-weight=\"").concat(w.id, "\">\n                    <i class=\"icon icon-delete\" aria-hidden=\"true\"></i>\n                  </a>\n                </div>\n              </td>\n            </tr>\n          ");
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          weightId = parseInt($target.data('weight'));
          weight = weights.find(function (c) {
            return c.id === weightId;
          });
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click(function (evt) {
          evt.preventDefault();
          var $target = $(evt.currentTarget);
          weightId = parseInt($target.data('weight'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: function syncModel() {
      if (self.isValidInputs()) {
        if (_.isEmpty(weight)) {
          weight = {};
        }

        weight.child = childId;
        weight.date = $datePicker.datetimepicker('viewDate').format('YYYY-MM-DD');
        weight.units = $units.val();
        weight.weight = parseFloat($weight.val());

        if (weight.units === 'pounds') {
          var ounces = parseFloat($ounces.val()) / 16;

          if (ounces && !isNaN(ounces)) {
            weight.weight += ounces;
          }
        }
      }
    },
    isValidInputs: function isValidInputs() {
      try {
        var wt = parseFloat($weight.val());

        if (wt <= 0) {
          return false;
        }

        if ($units.val() === 'pounds') {
          var ounces = parseFloat($ounces.val());

          if (ounces < 0) {
            return false;
          }
        }
      } catch (err) {
        return false;
      }

      return $datePicker.datetimepicker('viewDate').isValid();
    },
    fetch: function fetch() {
      return $.get(BabyBuddy.ApiRoutes.weightDetail(childId, weightId)).then(function (response) {
        weight = response;
        self.syncInputs();
        return response;
      });
    },
    fetchAll: function fetchAll() {
      var url = BabyBuddy.ApiRoutes.weight(childId);
      var s = $startFilterPicker.datetimepicker('viewDate');
      var e = $endFilterPicker.datetimepicker('viewDate');
      return weightDao.fetch(url, s.startOf('day'), e.endOf('day')).then(function (response) {
        weights = response;
        self.syncTable(); // $(window).resize(() => {
        //   weightChart.plot($el.find('#weight-chart'), $el.find('#weight-chart-container'), weights, s, e);
        // });
        // weightChart.plot($el.find('#weight-chart'), $el.find('#weight-chart-container'), weights, s, e);

        return response;
      });
    },
    create: function create() {
      return $.post(BabyBuddy.ApiRoutes.weight(childId), weight).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    update: function update() {
      return $.post(BabyBuddy.ApiRoutes.weightDetail(childId, weightId), weight).then(function (response) {
        $addModal.modal('hide');
        self.clear();
        return self.fetchAll();
      })["catch"](function (err) {
        if (err.responseJSON && err.responseJSON.message) {
          $addModal.find('#error-message').html(err.responseJSON.message);
        }
      });
    },
    clear: function clear() {
      weight = {};
      weightId = null;
      var defaultDate = moment();

      if (!detailPickerInitialized) {
        $datePicker.datetimepicker({
          defaultDate: defaultDate,
          format: 'YYYY-MM-DD'
        });
        detailPickerInitialized = true;
      } else {
        $datePicker.datetimepicker('date', defaultDate);
      }

      $weight.val(0);
    }
  };
  self = Weight;
  return self;
}();
"use strict";

/* Baby Buddy Dashboard
 *
 * Provides a "watch" function to update the dashboard at one minute intervals
 * and/or on visibility state changes.
 */
BabyBuddy.Dashboard = function ($) {
  var runIntervalId = null;
  var dashboardElement = null;
  var hidden = null;
  var Dashboard = {
    watch: function watch(element_id, refresh_rate) {
      dashboardElement = $('#' + element_id);

      if (dashboardElement.length == 0) {
        console.error('Baby Buddy: Dashboard element not found.');
        return false;
      }

      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
      }

      if (typeof window.addEventListener === "undefined" || typeof document.hidden === "undefined") {
        if (refresh_rate) {
          runIntervalId = setInterval(this.update, refresh_rate);
        }
      } else {
        window.addEventListener('focus', Dashboard.handleVisibilityChange, false);
      }
    },
    handleVisibilityChange: function handleVisibilityChange() {
      if (!document[hidden]) {
        Dashboard.update();
      }
    },
    update: function update() {
      // TODO: Someday maybe update in place?
      location.reload();
    }
  };
  return Dashboard;
}(jQuery);
//# sourceMappingURL=app.js.map
