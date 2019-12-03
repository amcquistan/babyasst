
BabyBuddy.Temperature = function() {
  let $el;
  let userId;
  let childId;
  let temperatureId;
  let temperature;
  let temperatures = [];
  let $timePicker;
  let $temperature;
  let $tableBody;
  let $addBtn;
  let $saveBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let temperatureDao;
  let temperatureChart;
  let self;

  const Temperature = {
    init: (el, uId, cId, tId=null) => {
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
      temperatureDao = BabyBuddy.ChildTimeActivityDao();
      // temperatureChart = BabyBuddy.TemperatureChart();

      $confirmDeleteBtn.click((evt) => {
        if (childId && temperatureId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId),
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
          if (!temperatureId) {
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
      let defaultTime = !_.isEmpty(temperature) && temperature.time ? moment(temperature.time) : moment();
      $timePicker.datetimepicker({
        defaultDate: defaultTime,
        format: 'YYYY-MM-DD hh:mm a'
      });
      $temperature.val(!_.isEmpty(temperature) ? temperature.temperature : '');
    },
    syncTable: () => {
      if (!_.isEmpty(temperatures)) {
        $tableBody.empty();
        let html = temperatures.map(t => {
          const time = moment(t.time).format('YYYY-MM-DD hh:mm a');
          const temp = t.temperature || '';
          return `
            <tr>
              <td class="text-center">${temp}</td>
              <td class="text-center">${time}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-temperature="${t.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-temperature="${t.id}">
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
          temperatureId = parseInt($target.data('temperature'));
          temperature = temperatures.find(t => t.id === temperatureId);
          self.syncInputs();
          window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          temperatureId = parseInt($target.data('temperature'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(temperature)) {
          temperature = {};
        }
        temperature.child = childId;
        temperature.time = $timePicker.datetimepicker('viewDate').toISOString();
        temperature.temperature = $temperature.val();
      }
    },
    isValidInputs: () => {
      if (!$temperature.val()) {
        return false;
      }
      try {
        const temp = parseFloat($temperature.val());
        if (temp <= 20 || temp > 110) {
          return false;
        }
      } catch(err) {
        return false;
      }
      return $timePicker.datetimepicker('viewDate').isValid();
    },
    fetch: () => {
      return $.get(BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId))
        .then((response) => {
          temperature = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.temperatures(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return temperatureDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        temperatures = response;
        self.syncTable();
        // $(window).resize(() => {
        //   temperatureChart.plot($el.find('#temperature-chart'), $el.find('#temperature-chart-container'), temperatures, s, e);
        // });
        // temperatureChart.plot($el.find('#temperature-chart'), $el.find('#temperature-chart-container'), temperatures, s, e);
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.temperatures(childId), temperature)
        .then((response) => {
          temperature = response;
          temperatureId = response.id;
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        });
    },
    update: () => {
      return $.post(BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId), temperature)
        .then((response) => {
          temperature = response;
          $addModal.modal('hide');
          self.clear();
          return self.fetchAll();
        });
    },
    clear: () => {
      temperature = {};
      temperatureId = null;
      temperatures = [];
    }
  };

  self = Temperature;
  return self;
}();
