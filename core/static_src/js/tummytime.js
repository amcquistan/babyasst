
BabyBuddy.TummyTime = function() {
  let $el;
  let userId;
  let childId;
  let tummyTimeId;
  let tummyTime = {};
  let tummyTimes = [];
  let $milestone;
  let $tableBody;
  let $startPicker;
  let $endPicker;
  let $addBtn;
  let $saveBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let detailPickerInitialized = false;
  let tummytimeDao;
  let tummytimeChart;

  let self;

  const TummyTime = {
    init: (el, uId, cId, tId=null) => {
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

      $confirmDeleteBtn.click((evt) => {
        if (childId && tummyTimeId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.tummyTimeDetail(childId, tummyTimeId),
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
      const hasTummyTime = !_.isEmpty(tummyTime);
      const startDefault = hasTummyTime && tummyTime.start ? moment(tummyTime.start) : moment().subtract(2, 'minutes');
      const endDefault = hasTummyTime && tummyTime.end ? moment(tummyTime.end) : moment();

      BabyBuddy.setDurationPickerConstraints(
        detailPickerInitialized,
        startDefault,
        endDefault,
        $startPicker,
        $endPicker
      );
      detailPickerInitialized = true;

      $milestone.val(!_.isEmpty(tummyTime) && tummyTime.milestone ? tummyTime.milestone : '');
    },
    syncTable: () => {
      if (!_.isEmpty(tummyTimes)) {
        $tableBody.empty();
        let html = tummyTimes.map(t => {
          const start = moment(t.start).format('YYYY-MM-DD hh:mm a');
          const end = moment(t.end).format('YYYY-MM-DD hh:mm a');
          let duration = moment.duration(t.duration);
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
          const milestone = t.milestone || '';
          return `
            <tr>
              <td class="text-center">${durationStr}</td>
              <td class="text-center">${start}</td>
              <td class="text-center">${end}</td>
              <td class="text-center">${milestone}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-tummytime="${t.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-tummytime="${t.id}">
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
          tummyTimeId = parseInt($target.data('tummytime'));
          tummyTime = tummyTimes.find(c => c.id === tummyTimeId);
          self.syncInputs();
          window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          tummyTimeId = parseInt($target.data('tummytime'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
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
    isValidInputs: () => {
      const startDate = $startPicker.datetimepicker('viewDate');
      const endDate = $endPicker.datetimepicker('viewDate');
      const datesValid =  startDate.isValid() &&  endDate.isValid() && startDate.isBefore(endDate);
      return datesValid;
    },
    fetch: () => {
      $.get(BabyBuddy.ApiRoutes.tummyTime(childId, tummyTimeId))
        .then((response) => {
          tummyTime = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.tummyTime(childId);
      const s = $startFilterPicker.datetimepicker('viewDate').startOf('day');
      const e = $endFilterPicker.datetimepicker('viewDate').endOf('day');
      return tummytimeDao.fetch(url, s, e).then(response => {
        tummyTimes = response;
        self.syncTable();
        const $chartContainer = $el.find('#tummytime-chart-container');

        $(window).resize(() => {
          tummytimeChart.plot($chartContainer, tummyTimes, s, e);
        });
        $(window).on('orientationchange', () => {
          tummytimeChart.plot($chartContainer, tummyTimes, s, e);
        });
        tummytimeChart.plot($chartContainer, tummyTimes, s, e);
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.tummyTime(childId), tummyTime)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        }).catch(err => {
          console.log('error', err);
          if (err.responseJSON && err.responseJSON.message) {
            $addModal.find('#error-message').html(err.responseJSON.message);
          }
        });
    },
    update: () => {
      return $.post(BabyBuddy.ApiRoutes.tummyTimeDetail(childId, tummyTimeId), tummyTime)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        }).catch(err => {
          console.log('error', err);
          if (err.responseJSON && err.responseJSON.message) {
            $addModal.find('#error-message').html(err.responseJSON.message);
          }
        });
    },
    clear: () => {
      tummyTime = {};
      tummyTimeId = null;
      const startDefault = moment().subtract(2, 'minutes');
      const endDefault = moment();

      BabyBuddy.setDurationPickerConstraints(
        detailPickerInitialized,
        startDefault,
        endDefault,
        $startPicker,
        $endPicker
      );
      detailPickerInitialized = true;

      $milestone.val('');
    }
  };

  self = TummyTime;
  return self;
}();
