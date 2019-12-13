
BabyBuddy.Weight = function() {
  let $el;
  let userId;
  let childId;
  let weightId;
  let weight;
  let weights = [];
  let $datePicker;
  let $weight;
  let $ounces;
  let $units;
  let $tableBody;
  let $saveBtn;
  let $addBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let weightDao;
  let detailPickerInitialized = false;
  let weightChart;
  let self;

  const Weight = {
    init: (el, uId, cId, wId=null) => {
      $el = $(el);
      userId = uId;
      childId = cId;
      weightId = wId;
      $weight= $el.find('#weight');
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
      weightDao = BabyBuddy.ChildTimeActivityDao('date');
      // weightChart = BabyBuddy.WeightChart();

      $confirmDeleteBtn.click((evt) => {
        if (childId && weightId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.weightDetail(childId, weightId),
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

      $startFilterPicker.on('change.datetimepicker', function(evt){
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });

      $endFilterPicker.on('change.datetimepicker', function(evt) {
        self.fetchAll();
      });

      $units.change(function(evt){
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
    showAddModal: () => {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: () => {
      const empty = _.isEmpty(weight);
      let defaultDate = !empty && weight.date ? moment(weight.date) : moment();
      if (!detailPickerInitialized) {
        $datePicker.datetimepicker({
          defaultDate: defaultDate,
          format: 'YYYY-MM-DD'
        });
        detailPickerInitialized = true;
      } else {
        $datePicker.datetimepicker('date', defaultDate);
      }

      const w = !empty ? weight.weight : 0;
      $units.val(!empty ? weight.units : 'pounds');
      if ($units.val() === 'pounds') {
        const pounds = Math.floor(w);
        const ounces = Math.round((w - pounds) * 16);
        $weight.val(pounds);
        $ounces.val(ounces);
      } else {
        $weight.val(w);
      }
    },
    syncTable: () => {
      if (!_.isEmpty(weights)) {
        $tableBody.empty();
        let html = weights.map(w => {
          const date = moment(w.date).format('YYYY-MM-DD');
          let wt = parseFloat(w.weight || 0);
          if (w.units === 'pounds') {
            const pounds = Math.floor(wt);
            const ounces = Math.round((wt - pounds) * 16);
            wt = `${pounds} lbs ${ounces} oz`;
          } else {
            wt = `${wt.toFixed(3)} kg`;
          }
          return `
            <tr>
              <td class="text-center">${wt}</td>
              <td class="text-center">${date}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-weight="${w.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-weight="${w.id}">
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
          weightId = parseInt($target.data('weight'));
          weight = weights.find(c => c.id === weightId);
          window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          weightId = parseInt($target.data('weight'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(weight)) {
          weight = {};
        }
        weight.child = childId;
        weight.date = $datePicker.datetimepicker('viewDate').format('YYYY-MM-DD');
        weight.units = $units.val();
        weight.weight = parseFloat($weight.val());
        if (weight.units === 'pounds') {
          const ounces = parseFloat($ounces.val()) / 16;
          if (ounces && !isNaN(ounces)) {
            weight.weight += ounces;
          }
        }
      }
    },
    isValidInputs: () => {
      try {
        const wt = parseFloat($weight.val());
        if (wt <= 0) {
          return false;
        }
        if ($units.val() === 'pounds') {
          const ounces = parseFloat($ounces.val());
          if (ounces < 0) {
            return false;
          }
        }
      } catch(err) {
        return false;
      }
      return $datePicker.datetimepicker('viewDate').isValid();
    },
    fetch: () => {
      return $.get(BabyBuddy.ApiRoutes.weightDetail(childId, weightId))
        .then((response) => {
          weight = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.weight(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return weightDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        weights = response;
        self.syncTable();
        // $(window).resize(() => {
        //   weightChart.plot($el.find('#weight-chart'), $el.find('#weight-chart-container'), weights, s, e);
        // });
        // weightChart.plot($el.find('#weight-chart'), $el.find('#weight-chart-container'), weights, s, e);
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.weight(childId), weight)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.message) {
            $addModal.find('#error-message').html(err.responseJSON.message);
          }
        });
    },
    update: () => {
      return $.post(BabyBuddy.ApiRoutes.weightDetail(childId, weightId), weight)
        .then((response) => {
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.message) {
            $addModal.find('#error-message').html(err.responseJSON.message);
          }
        });
    },
    clear: () => {
      weight = {};
      weightId = null;
      let defaultDate =  moment();
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
