
BabyBuddy.Sleep = function() {
  let $el;
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
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let sleepDao;
  let sleepChart;
  let self;

  const Sleep = {
    init: (el, uId, cId, sId=null) => {
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

      $confirmDeleteBtn.click((evt) => {
        if (childId && sleepId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });

      $addBtn.click((evt) => {
        evt.preventDefault();
        self.clear();
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
        self.fetchAll();
      });

      $endFilterPicker.on('change.datetimepicker', function(evt) {
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
          sleepId = parseInt($target.data('sleep'));
          sleep = sleeps.find(c => c.id === sleepId);
          window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          sleepId = parseInt($target.data('sleep'));
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
      const s = $startPicker.datetimepicker('viewDate');
      const e = $endPicker.datetimepicker('viewDate');
      let datesValid = s.isValid() && e.isValid();
      if (datesValid) {
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
        sleepChart.plot($el.find('#sleep-container'), sleeps, s, e);
        return response;
      });
    },
    create: () => {
      $.post(BabyBuddy.ApiRoutes.sleeping(childId), sleep)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        })
        .catch(err => {
          console.log('error', err);
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId), sleep)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        })
        .catch(err => {
          console.log('error', err);
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    clear: () => {
      sleepId = null;
      sleep = {};
      sleeps = [];
    }
  };

  self = Sleep;
  return self;
}();

