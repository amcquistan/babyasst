
BabyBuddy.Timers = function() {
  let $el;
  let userId;
  let $tableBody;
  let $startFilterPicker;
  let $endFilterPicker;
  let timers = [];
  let timerDao;

  let self;

  const Timers = {
    init: (el, uId) => {
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

      $startFilterPicker.on('change.datetimepicker', function(evt){
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });

      $endFilterPicker.on('change.datetimepicker', function(evt) {
        self.fetchAll();
      });

      self.fetchAll();
    },
    makeDuration: (duration) => {
      let durationDisplay = '';
      if (duration.hours()) {
        if (duration.minutes()) {
          durationDisplay = `${duration.hours()} hrs, ${duration.minutes()} mins`;
        } else {
          durationDisplay = `${duration.hours()} hrs`;
        }
      } else if (duration.minutes()) {
        durationDisplay = `${duration.minutes()} mins`;
      }
      return durationDisplay;
    },
    syncTable: () => {
      if (!_.isEmpty(timers)) {
        $tableBody.empty();
        let html = timers.map(t => {
          debugger
          const start = moment(t.created).format('YYYY-MM-DD hh:mm a');
          const end = t.end ? moment(t.end).format('YYYY-MM-DD hh:mm a') : '';
          let duration = moment.duration(t.duration);
          let durationStr = self.makeDuration(duration);
          let status;
          if (t.active) {
            status = 'Active';
          } else if (!t.complete) {
            status = 'Paused';
          } else {
            status = 'Complete';
          }
          return `
            <tr>
              <th scope="row">
                <a href="/timer/${t.id}/">${t.name}</a>
              </th>
              <td class="text-center">${status}</td>
              <td class="text-center">${durationStr}</td>
              <td class="text-center">${start}</td>
              <td class="text-center">${end}</td>
            </tr>
          `;
        }).join('\n');
        $tableBody.html(html);
      }
    },

    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.timers();
      const s = $startFilterPicker.datetimepicker('viewDate').startOf('day');
      const e = $endFilterPicker.datetimepicker('viewDate').clone().add(1, 'days').endOf('day');
      return timerDao.fetch(url, s, e).then(response => {
        timers = response;
        self.syncTable();
        return response;
      });
    }
  };

  self = Timers;
  return self;
}();
