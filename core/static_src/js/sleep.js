
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
  let $start;
  let $end;
  let $tableBody;
  let $addBtn;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $chart;
  let $startFilterPicker;
  let $endFilterPicker;
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
      $start = $el.find('#sleep-start');
      $end = $el.find('#sleep-end');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#sleep-add-btn');
      $saveBtn = $el.find('#sleep-save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');
      $addModal = $el.find('#sleep-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $chart = $el.find('#sleep-chart');
      $startFilterPicker = $el.find('#sleep-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#sleep-filter-datetimepicker_end');

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

      $prevBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($prevBtn.prop('href'));
      });

      $nextBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($nextBtn.prop('href'));
      });
      /*
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
      });

      $endFilterPicker.on('change.datetimepicker', function(evt) {
        console.log('end filter date changed');
      });
      */
      const fetchAllUrl = BabyBuddy.ApiRoutes.sleeping(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
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
        sleep.start = moment($start.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        sleep.end = moment($end.val(), 'YYYY-MM-DD hh:mm a').toISOString();
      }
    },
    isValidInputs: () => {
      let datesValid = $start.val() && $end.val();
      if (datesValid) {
        const startDate = moment($start.val(), 'YYYY-MM-DD hh:mm a');
        const endDate = moment($end.val(), 'YYYY-MM-DD hh:mm a');
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
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
          .then((response) => {
            sleeps = response.results;
            self.syncTable();
            $prevBtn.prop('href', response.previous || '#');
            $nextBtn.prop('href', response.next || '#');
            $prevBtn.toggleClass('disabled', !Boolean(response.previous));
            $nextBtn.toggleClass('disabled', !Boolean(response.next));
            self.syncTable();
            self.plotData();
            return response;
          });
      }
    },
    plotData: () => {
      debugger
      $chart.empty();
      const w = $el.width();
      const h = 350;
      const marginX = 50;
      const marginY = 50;
      const startChartDate = $startFilterPicker.datetimepicker('viewDate');
      const endChartDate = $endFilterPicker.datetimepicker('viewDate');
      const svg = d3.select('#sleep-chart').attr('width', w).attr('height', h);
      const curDate = startChartDate.clone();
      const xDomain = [];
      while(curDate.isSameOrBefore(end)) {
        xDomain.push(curDate.toDate());
        curDate.add(1, 'days');
      }
      const scaleX = d3.scaleBand()
                        .domain(xDomain)
                        .range([marginX, w - marginX]);
      let grouped = _.groupBy(sleeps, (s) => moment(s.start).startOf('day'));
      const sleepTotalPerDay = _.reduce(
          grouped,
          (days, sleepThatDay, day) => {
            days.push(sleepThatDay.reduce((totalSleep, s) => {
              totalSleep.hours += moment.duration(s.duration).asHours();
              return totalSleep;
            }, {day: day, hours: 0}))
            return days;
          }, [])

      const scaleY = d3.scaleLinear()
                        .domain([
                          d3.min(sleepTotalPerDay, (daySleep) => daySleep.hours),
                          d3.max(sleepTotalPerDay, (daySleep) => daySleep.hours)
                        ])
                        .range([marginY, h - marginY]);
      
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

