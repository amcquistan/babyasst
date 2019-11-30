
BabyBuddy.DiaperChange = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let diaperChangeId;
  let diaperChange;
  let diaperChanges = [];
  let $time;
  let $timePicker;
  let $wet;
  let $solid;
  let $color;
  let $tableBody;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $addBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let diaperChangeDao;
  let diaperChangeChart;
  let self;

  const DiaperChange = {
    init: (el, uId, url, cId, dId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      diaperChangeId = dId;
      $time = $el.find('#diaperchange-time');
      $wet = $el.find('#diaperchange-wet');
      $solid = $el.find('#diaperchange-solid');
      $color = $el.find('#diaperchange-color');
      $saveBtn = $el.find('#diaperchange-save-btn');
      $tableBody = $el.find('tbody');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');
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
            root.location.reload();
          });
        }
      });

      if (childId && diaperChangeId) {
        self.fetch();
      }

      $addBtn.click((evt) => {
        evt.preventDefault();
        diaperChange = {};
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
      let defaultTime = !_.isEmpty(diaperChange) && diaperChange.time ? moment(diaperChange.time) : moment();
      $timePicker.datetimepicker({
        defaultDate: defaultTime,
        format: 'YYYY-MM-DD hh:mm a'
      });
      $wet.prop('checked', !_.isEmpty(diaperChange) && diaperChange.wet);
      $solid.prop('checked', !_.isEmpty(diaperChange) && diaperChange.solid);
      $wet.parent().toggleClass('active', !_.isEmpty(diaperChange) && diaperChange.wet);
      $solid.parent().toggleClass('active', !_.isEmpty(diaperChange) && diaperChange.solid);
      $color.val(!_.isEmpty(diaperChange) && diaperChange.color ? diaperChange.color : '');
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
          let id = parseInt($target.data('change'));
          console.log('clicked update change ' + id);
          diaperChangeId = id;
          diaperChange = diaperChanges.find(c => c.id === id);
          root.window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('change'));
          diaperChangeId = id;
          console.log('clicked delete change ' + id);
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
        diaperChange.time = moment($time.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        diaperChange.wet = $wet.prop('checked');
        diaperChange.solid = $solid.prop('checked');
        diaperChange.color = $color.val();
      }
    },
    isValidInputs: () => {
      return $time.val() && ($wet.prop('checked') || $solid.prop('checked')) && $color.val();
    },
    fetch: () => {
      $.get(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId))
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
          diaperChangeChart.plot($el.find('#diaperchange-chart'), $el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        });
        diaperChangeChart.plot($el.find('#diaperchange-chart'), $el.find('#diaperchange-chart-container'), diaperChanges, s, e);
        return response;
      });
    },
    create: () => {
      $.post(BabyBuddy.ApiRoutes.diaperChanges(childId), diaperChange)
        .then((response) => {
          diaperChange = response;
          diaperChangeId = response.id;
          $addModal.modal('hide');
          root.location.reload(true);
          return response;
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId), diaperChange)
        .then((response) => {
          diaperChange = response;
          root.location.reload(true);
          return response;
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
    }
  };

  self = DiaperChange;
  return self;
}(window);
