
BabyBuddy.DiaperChange = function() {
  let $el;
  let userId;
  let childId;
  let diaperChangeId;
  let diaperChange;
  let diaperChanges = [];
  let $timePicker;
  let $wet;
  let $solid;
  let $color;
  let $tableBody;
  let $saveBtn;
  let $addBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let detailPickerInitialized = false;
  let diaperChangeDao;
  let diaperChangeChart;
  let self;

  const DiaperChange = {
    init: (el, uId, cId, dId=null) => {
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

      $confirmDeleteBtn.click((evt) => {
        if (childId && diaperChangeId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId),
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
      let defaultTime = !_.isEmpty(diaperChange) && diaperChange.time ? moment(diaperChange.time) : moment();
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
    syncTable: () => {
      if (!_.isEmpty(diaperChanges)) {
        $tableBody.empty();
        let html = diaperChanges.map(change => {
          const time = moment(change.time).format('YYYY-MM-DD hh:mm a');
          const wetIconClasses = change.wet ? 'icon-true text-success' : 'icon-false text-danger';
          const solidIconClasses = change.solid ? 'icon-true text-success' : 'icon-false text-danger';
          return `
            <tr>
              <td class="text-center">${time}</td>
              <td class="text-center">
                <i class="icon ${wetIconClasses}" aria-hidden="true"></i>
              </td>
              <td class="text-center">
                <i class="icon ${solidIconClasses}" aria-hidden="true"></i>
              </td>
              <td class="text-center">${_.capitalize(change.color)}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-change="${change.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-change="${change.id}">
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
          diaperChangeId = parseInt($target.data('change'));
          diaperChange = diaperChanges.find(c => c.id === diaperChangeId);
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          diaperChangeId = parseInt($target.data('change'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
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
    isValidInputs: () => {
      return $timePicker.datetimepicker('viewDate').isValid() && ($wet.prop('checked') || $solid.prop('checked')) && $color.val();
    },
    fetch: () => {
      return $.get(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId))
        .then((response) => {
          diaperChange = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.diaperChanges(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return diaperChangeDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        diaperChanges = response;
        self.syncTable();
        $(window).resize(() => {
          diaperChangeChart.plot($el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        });
        $(window).on('orientationchange', () => {
          diaperChangeChart.plot($el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        });
        diaperChangeChart.plot($el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.diaperChanges(childId), diaperChange)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    update: () => {
      return $.post(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId), diaperChange)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    clear: () => {
      diaperChange = {};
      diaperChangeId = null;
      let defaultTime = moment();
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
