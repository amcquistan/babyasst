
BabyBuddy.Bath = function() {
  let $el;
  let userId;
  let childId;
  let bathId;
  let baths = [];
  let $timePicker;
  let $tableBody;
  let $addBtn;
  let $saveBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let bathDao;
  let sleepChart;
  let detailPickerInitialized = false;
  let self;

  const Bath = {
    init: (el, uId, cId, bId=null) => {
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
      bathDao = BabyBuddy.ChildTimeActivityDao();
      // bathChart = BabyBuddy.BathChart();

      $confirmDeleteBtn.click((evt) => {
        if (childId && bathId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.bathDetail(childId, bathId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $deleteModal.modal('hide');
            window.location.reload();
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
      self.syncInputs();
      $addModal.modal('show');
    },
    isValidInputs: () => {
      return $timePicker.datetimepicker('viewDate').isSameOrBefore(moment());
    },
    syncInputs: () => {
      const defaultTime = !_.isEmpty(bath) && bath.time ? moment(bath.time) : moment();
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
    syncTable: () => {
      if (!_.isEmpty(baths)) {
        $tableBody.empty();
        let html = baths.map(b => {
          const time = moment(b.time).format('YYYY-MM-DD');
          return `
            <tr>
              <td class="text-center">${time}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-bath="${b.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-bath="${b.id}">
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
          bathId = parseInt($target.data('bath'));
          bath = baths.find(b => b.id === bathId);
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          bathId = parseInt($target.data('bath'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(bath)) {
          bath = {};
        }
        bath.child = childId;
        bath.time = $timePicker.datetimepicker('viewDate').toISOString();
      }
    },
    fetch: () => {
      return $.get(BabyBuddy.ApiRoutes.bathDetail(childId, bathId))
        .then((response) => {
          bath = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.baths(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return bathDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        baths = response;
        self.syncTable();
        $(window).resize(() => {
          // bathChart.plot($el.find('#bath-chart'), $el.find('#bath-chart-container'), baths, s, e);
        });
        // bathChart.plot($el.find('#bath-chart'), $el.find('#bath-chart-container'), baths, s, e);
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.baths(childId), bath)
        .then((response) => {
          bath = response;
          bathId = response.id;
          $addModal.modal('hide');
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.bathDetail(childId, bathId), bath)
        .then((response) => {
          bath = response;
          $addModal.modal('hide');
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    clear: () => {
      bathId = null;
      bath = {};
      const defaultTime = moment();
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
