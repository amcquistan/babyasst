
BabyBuddy.Sleep = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let sleepId;
  let sleep;
  let sleeps = [];
  let $startPicker;
  let $endPicker;
  let $tableBody;
  let $addBtn;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let sleepDao;
  let sleepChart;
  let self;

  const Sleep = {
    init: (el, uId, url, cId, sId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
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

      $confirmDeleteBtn.click((evt) => {
        if (childId && sleepId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $deleteModal.modal('hide');
            root.location.reload();
          });
        }
      });

      if (childId && sleepId) {
        self.fetch();
      }

      $addBtn.click((evt) => {
        evt.preventDefault();
        sleep = {};
        self.showAddModal();
      });
      $saveBtn.click((evt) => {
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

      $startFilterPicker.on('change.datetimepicker', function(evt){
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        console.log('start filter date changed');
        self.fetchAll();
      });

      $endFilterPicker.on('change.datetimepicker', function(evt) {
        console.log('end filter date changed');
        self.fetchAll();
      });

      self.fetchAll();
    },
    showAddModal: () => {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: () => {
      let startDefault = !_.isEmpty(sleep) && sleep.start ? moment(sleep.start) : moment().subtract(2, 'minutes');
      let endDefault = !_.isEmpty(sleep) && sleep.end ? moment(sleep.end) : moment();
      $startPicker.datetimepicker({
        defaultDate: startDefault,
        format: 'YYYY-MM-DD hh:mm a'
      });

      $endPicker.datetimepicker({
        defaultDate: endDefault,
        format: 'YYYY-MM-DD hh:mm a'
      });

      $startPicker.on('change.datetimepicker', function(evt){
        $endPicker.datetimepicker('minDate', moment(evt.date).add(1, 'minutes'));
      });
    },
    syncTable: () => {
      if (!_.isEmpty(sleeps)){
        $tableBody.empty();
        let html = sleeps.map(s => {
          const start = moment(s.start).format('YYYY-MM-DD hh:mm a');
          const end = moment(s.end).format('YYYY-MM-DD hh:mm a');
          let duration = moment.duration(s.duration);
          let durationStr = '';
          if (duration.hours()) {
            if (duration.minutes()) {
              durationStr = `${duration.hours()} hrs ${duration.minutes()} mins`;
            } else {
              durationStr = `${duration.hours()} hrs`;
            }
          } else if (duration.minutes()) {
            durationStr = `${duration.minutes()} mins`;
          }
          const napIconClasses = s.nap ? 'icon-true text-success' : 'icon-false text-danger';
          return `
            <tr>
              <td class="text-center">${start}</td>
              <td class="text-center">${end}</td>
              <td class="text-center">${durationStr}</td>
              <td class="text-center">
                <i class="icon ${napIconClasses}" aria-hidden="true"></i>
              </td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-sleep="${s.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-sleep="${s.id}">
                    <i class="icon icon-delete" aria-hidden="true"></i>
                  </a>
                </div>
              </td>
            </tr>
          `;
        }).join('\n');
        $tableBody.html(html);
        $el.find('.update-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('sleep'));
          sleepId = id;
          sleep = sleeps.find(c => c.id === id);
          root.window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('sleep'));
          sleepId = id;
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(sleep)) {
          sleep = {};
        }
        sleep.child = childId;
        sleep.start = moment($startPicker.find('#sleep-start').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        sleep.end = moment($endPicker.find('#sleep-end').val(), 'YYYY-MM-DD hh:mm a').toISOString();
      }
    },
    isValidInputs: () => {
      const s = $startPicker.find('#sleep-start').val();
      const e = $endPicker.find('#sleep-end').val();
      let datesValid = s && e;
      if (datesValid) {
        const startDate = moment(s, 'YYYY-MM-DD hh:mm a');
        const endDate = moment(e, 'YYYY-MM-DD hh:mm a');
        datesValid = startDate.isSame(endDate) || startDate.isBefore(endDate);
      }

      return datesValid;
    },
    fetch: () => {
      $.get(BabyBuddy.ApiRoutes.sleeping(childId, sleepId))
        .then((response) => {
          sleep = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.sleeping(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return sleepDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        sleeps = response;
        self.syncTable();
        sleepChart.plot($el.find('#sleep-chart'), $el.find('#sleep-chart-container'), sleeps, s, e);
        return response;
      });
    },
    plotData: (sleepSessions, $container, $chart, $chartStartPicker, $chartEndPicker) => {
      $chart.empty();
      const w = $container.width();
      const h = 350;
      const marginX = 50;
      const marginY = 50;
      const startChartDate = $chartStartPicker.datetimepicker('viewDate');
      const endChartDate = $chartEndPicker.datetimepicker('viewDate');
      const svg = d3.select('#sleep-chart').attr('width', w).attr('height', h);
      const curDate = startChartDate.clone();
      const xDomain = [];
      while(curDate.isSameOrBefore(endChartDate)) {
        xDomain.push(curDate.toDate());
        curDate.add(1, 'days');
      }
      const scaleX = d3.scaleBand()
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

      sleepTotalPerDay.forEach(d => {
        const maxY = scaleY(maxSleep);
        const x = scaleX(moment(d.day).toDate());
        
        const ht = scaleY(d.hours);
        const y = maxY - ht;
        const w = scaleX.bandwidth();
        console.log(`Day ${d.day} X ${x} Y ${y} maxY ${maxY} Ht ${ht} W ${w} Hrs ${d.hours}`);
      });

      svg.selectAll('.sleep-chart-bar')
          .data(sleepTotalPerDay)
            .enter()
            .append('rect')
            .classed('sleep-chart-bar', true)
            .attr('x', d => scaleX(moment(d.day).toDate()))
            .attr('y', d => scaleY(d.hours))
            .attr('width', scaleX.bandwidth() * 0.98)
            .attr('height', d => h - marginY - scaleY(d.hours))

    },
    create: () => {
      $.post(BabyBuddy.ApiRoutes.sleeping(childId), sleep)
        .then((response) => {
          sleep = response;
          // sleepId = response.id;
          // root.location.href = successUrl;
          root.location.reload(true);
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId), sleep)
        .then((response) => {
          sleep = response;
          // self.syncInputs();
          // root.location.href = successUrl;
          root.location.reload(true);
          return response;
        });
    },
    clear: () => {
      sleepId = null;
      sleep = {};
    }
  };

  self = Sleep;
  return self;
}(window);

