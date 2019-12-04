
BabyBuddy.Feeding = function() {
  let $el;
  let userId;
  let childId;
  let feedingId;
  let feeding;
  let feedings = [];
  let $startPicker;
  let $endPicker;
  let $type;
  let $method;
  let $units;
  let $amount;
  let $tableBody;
  let $addBtn;
  let $saveBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let feedingDao;
  let feedingChart;
  let self;

  const Feeding = {
    init: (el, uId, cId, fId=null) => {
      $el = $(el);
      userId = uId;
      childId = cId;
      feedingId = fId;
      $startPicker = $el.find('#feeding-datetimepicker_start');
      $endPicker = $el.find('#feeding-datetimepicker_end');
      $type = $el.find('#feeding-type');
      $method = $el.find('#feeding-method');
      $units = $el.find('#feeding-units');
      $amount = $el.find('#feeding-amount');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#feeding-add-btn');
      $saveBtn = $el.find('#feeding-save-btn');
      $addModal = $el.find('#feeding-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#feeding-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#feeding-filter-datetimepicker_end');
      feedingDao = BabyBuddy.ChildDurationActivityDao();

      $confirmDeleteBtn.click((evt) => {
        if (childId && feedingId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });

      $type.change((evt) => {
        if (!$type.val()) {
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        } else if ($type.val() !== 'breast milk') {
          const breastOptions = ['left breast', 'right breast', 'both breasts'];
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', breastOptions.includes($this.prop('value')));
            $this.prop('selected', $this.prop('value') === 'bottle');
          });
        } else {
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', false);
            $this.prop('selected', i === 0);
          });
        }
      });
      $method.change(function(evt){
        if ($method.val() === 'bottle') {
          $amount.parent().show();
          $units.parent().show();
        } else {
          $amount.parent().hide();
          $units.parent().hide();
        }
      });
      $addBtn.click((evt) => {
        evt.preventDefault();
        feeding = {};
        self.showAddModal();
      });
      $saveBtn.click((evt) => {
        if (self.isValidInputs()) {
          self.syncModel();
          if (!feedingId) {
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
      const empty = _.isEmpty(feeding);
      let startDefault = !empty && feeding.start ? moment(feeding.start) : moment().subtract(10, 'minutes');
      let endDefault = !empty && feeding.end ? moment(feeding.end) : moment();
      $type.val(!empty && feeding.type ? feeding.type : '');
      $method.val(!empty && feeding.method ? feeding.method : '');
      $amount.val(!empty && feeding.amount ? feeding.amount : '');
      $units.val(!empty && feeding.units ? feeding.units : 'ounces');
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
      if (!_.isEmpty(feedings)) {
        $tableBody.empty();
        let html = feedings.map(f => {
          const ended = moment(f.end).format('YYYY-MM-DD hh:mm a');
          let duration = moment.duration(f.duration);
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

          const amount = f.amount ? `${f.amount} ${f.units === 'ounces' ? 'oz' : 'ml'}` : '';
          return `
            <tr>
              <td class="text-center">${_.capitalize(f.method)}</td>
              <td class="text-center">${_.capitalize(f.type)}</td>
              <td class="text-center">${amount}</td>
              <td class="text-center">${durationStr}</td>
              <td class="text-center">${ended}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-feeding="${f.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-feeding="${f.id}">
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
          feedingId = parseInt($target.data('feeding'));
          feeding = feedings.find(c => c.id === feedingId);
          window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          feedingId = parseInt($target.data('feeding'));
          $deleteModal.modal('show');
        });

      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(feeding)) {
          feeding = {};
        }
        feeding.child = childId;
        feeding.start = $startPicker.datetimepicker('viewDate').toISOString();
        feeding.end = $endPicker.datetimepicker('viewDate').toISOString();
        feeding.type = $type.val();
        feeding.units = $units.val();
        feeding.method = $method.val();
        feeding.amount = $amount.val();
      }
    },
    isValidInputs: () => {
      const s = $startPicker.datetimepicker('viewDate');
      const e = $endPicker.datetimepicker('viewDate');
      let datesValid = s.isValid() && e.isValid();
      if (datesValid) {
        datesValid = s.isSame(e) || s.isBefore(e);
      }

      if (!datesValid || !$type.val() || !$method.val()) {
        return false;
      }

      if ($type.val() !== 'breast milk') {
        try {
          const amt = parseFloat($amount.val());
          if (amt <= 0) {
            return false;
          }
        } catch (err) {
          return false;
        }
      } else if (!['left breast', 'right breast', 'both breasts'].includes($method.val())) {
        return false;
      }

      return true;
    },
    fetch: () => {
      return $.get(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId))
        .then((response) => {
          feeding = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.feedings(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return feedingDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        feedings = response;
        self.syncTable();
        // $(window).resize(() => {
        //   feedingChart.plot($el.find('#feeding-chart'), $el.find('#feeding-chart-container'), feedings, s, e);
        // });
        // feedingChart.plot($el.find('#feeding-chart'), $el.find('#feeding-chart-container'), feedings, s, e);
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.feedings(childId), feeding)
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
      return $.post(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId), feeding)
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
      feeding = {};
      feedingId = null;
      feedings = [];
      $type.val('');
      $method.val('');
      $amount.val('');
    }
  };

  self = Feeding;
  return self;
}();
