
BabyBuddy.Feeding = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let feedingId;
  let feeding;
  let feedings = [];
  let $startPicker;
  let $endPicker;
  let $type;
  let $method;
  let $amount;
  let $tableBody;
  let $addBtn;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let self;

  const Feeding = {
    init: (el, uId, url, cId, fId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      feedingId = fId;
      $startPicker = $el.find('#feeding-datetimepicker_start');
      $endPicker = $el.find('#feeding-datetimepicker_end');
      $type = $el.find('#feeding-type');
      $method = $el.find('#feeding-method');
      $amount = $el.find('#feeding-amount');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#feeding-add-btn');
      $saveBtn = $el.find('#feeding-save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');
      $addModal = $el.find('#feeding-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');

      $confirmDeleteBtn.click((evt) => {
        if (childId && feedingId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $deleteModal.modal('hide');
            root.location.reload();
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
        } else if ($type.val() === 'breast milk') {
          const validOptions = ['left breast', 'right breast', 'both breasts'];
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', !validOptions.includes($this.prop('value')));
            $this.prop('selected', false);
          });
        } else {
          $method.find('option').each((i, el) => {
            const $this = $(el);
            $this.prop('disabled', $this.prop('value') !== 'bottle');
            $this.prop('selected', $this.prop('value') === 'bottle');
          });
        }
      });

      if (childId && feedingId) {
        self.fetch();
      }

      const maxEnd = moment();
      
      $startPicker.datetimepicker({
        defaultDate: maxEnd.clone().subtract(10, 'minutes'),
        format: 'YYYY-MM-DD hh:mm a'
      });

      $endPicker.datetimepicker({
        defaultDate: maxEnd,
        format: 'YYYY-MM-DD hh:mm a'
      });

      $startPicker.on('change.datetimepicker', function(evt){
        $endPicker.datetimepicker('minDate', moment(evt.date).add(1, 'minutes'));
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

      $prevBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($prevBtn.prop('href'));
      });

      $nextBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($nextBtn.prop('href'));
      });

      const fetchAllUrl = BabyBuddy.ApiRoutes.feedings(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
    },
    showAddModal: () => {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: () => {
      let startDefault = !_.isEmpty(feeding) && feeding.start ? moment(feeding.start) : moment().subtract(10, 'minutes');
      let endDefault = !_.isEmpty(feeding) && feeding.end ? moment(feeding.end) : moment();
      $type.val(!_.isEmpty(feeding) && feeding.type ? feeding.type : '');
      $method.val(!_.isEmpty(feeding) && feeding.method ? feeding.method : '');
      $amount.val(!_.isEmpty(feeding) && feeding.amount ? feeding.amount : '');
      $startPicker.find('#feeding-start').val(startDefault.format('YYYY-MM-DD hh:mm a'));
      $startPicker.datetimepicker({
        defaultDate: startDefault,
        format: 'YYYY-MM-DD hh:mm a'
      });
      $endPicker.find('#feeding-end').val(endDefault.format('YYYY-MM-DD hh:mm a'));
      $endPicker.datetimepicker({
        defaultDate: endDefault,
        format: 'YYYY-MM-DD hh:mm a'
      });

      $startPicker.on('change.datetimepicker', function(evt){
        $endPicker.datetimepicker('minDate', evt.date);
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

          const amount = f.amount || '';
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
          let id = parseInt($target.data('feeding'));
          feedingId = id;
          console.log('clicked update feeding ' + id);
          feeding = feedings.find(c => c.id === id);
          root.window.scrollTo(0, 0);
          self.showAddModal();
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('feeding'));
          feedingId = id;
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
        feeding.start = moment($startPicker.find('#feeding-start').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feeding.end = moment($endPicker.find('#feeding-end').val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feeding.type = $type.val();
        feeding.method = $method.val();
        feeding.amount = $amount.val();
      }
    },
    isValidInputs: () => {
      const s = $startPicker.find('#feeding-start').val();
      const e = $endPicker.find('#feeding-end').val();
      let datesValid = s && e;
      if (datesValid) {
        const startDate = moment(s, 'YYYY-MM-DD hh:mm a');
        const endDate = moment(e, 'YYYY-MM-DD hh:mm a');
        datesValid = startDate.isSame(endDate) || startDate.isBefore(endDate);
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
      $.get(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId))
        .then((response) => {
          feeding = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
        .then((response) => {
          feedings = response.results;
          self.syncTable();
          $prevBtn.prop('href', response.previous || '#');
          $nextBtn.prop('href', response.next || '#');
          $prevBtn.toggleClass('disabled', !Boolean(response.previous));
          $nextBtn.toggleClass('disabled', !Boolean(response.next));
          self.syncTable();
          return response;
        });
      }
    },
    create: () => {
      $.post(BabyBuddy.ApiRoutes.feedings(childId), feeding)
        .then((response) => {
          feeding = response;
          // feedingId = response.id;
          // root.location.href = successUrl;
          root.location.reload(true);
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId), feeding)
        .then((response) => {
          feeding = response;
          // self.syncInputs();
          // root.location.href = successUrl;
          root.location.reload(true);
          return response;
        });
    },
    clear: () => {
      feeding = {};
      feedingId = null;
      $type.val('');
      $method.val('');
      $amount.val('');
    }
  };

  self = Feeding;
  return self;
}(window);
