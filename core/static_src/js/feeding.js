
BabyBuddy.Feeding = function(root) {
  const $ = root.$;
  const _ = root._;
  let $el;
  let successUrl;
  let userId;
  let childId;
  let feedingId;
  let feeding;
  let feedings = [];
  let $startPicker;
  let $endPicker;
  let $start;
  let $end;
  let $type;
  let $method;
  let $amount;
  let $tableBody;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let self;

  const Feeding = {
    init: (el, uId, url, cId, fId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      feedingId = fId;
      $startPicker = $el.find('#datetimepicker_start');
      $endPicker = $el.find('#datetimepicker_end');
      $start = $el.find('#start');
      $end = $el.find('#end');
      $type = $el.find('#type');
      $method = $el.find('#method');
      $amount = $el.find('#amount');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');

      if (childId && feedingId) {
        self.fetch();
      }

      $startPicker.datetimepicker({
        defaultDate: 'now',
        format: 'YYYY-MM-DD hh:mm a'
      });

      $endPicker.datetimepicker({
        defaultDate: 'now',
        format: 'YYYY-MM-DD hh:mm a'
      });

      $startPicker.on('change.datetimepicker', function(evt){
        $endPicker.datetimepicker('minDate', evt.date);
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
    syncInputs: () => {
      if (!_.isEmpty(feeding)) {
        if (feeding.start) {
          $start.val(moment(feeding.start).format('YYYY-MM-DD hh:mm a'));
        }
        if (feeding.end) {
          $end.val(moment(feeding.end).format('YYYY-MM-DD hh:mm a'));
        }
        $type.val(feeding.type);
        $method.val(feeding.method);
        $amount.val(feeding.amount);
      }
    },
    syncTable: () => {
      if (!_.isEmpty(feedings)) {
        $tableBody.empty();
        let html = feedings.map(f => {
          const ended = moment(f.end).format('YYYY-MM-DD hh:mm a');
          let duration = moment.duration(f.duration).minutes();
          duration = duration ? `${duration} minutes` : '';
          const amount = f.amount || '';
          return `
            <tr>
              <td class="text-center">${f.method}</td>
              <td class="text-center">${f.type}</td>
              <td class="text-center">${amount}</td>
              <td class="text-center">${duration}</td>
              <td class="text-center">${ended}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-feeding="${f.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <!--
                  <a class="btn btn-danger delete-btn" data-feeding="${f.id}">
                    <i class="icon icon-delete" aria-hidden="true"></i>
                  </a>
                  -->
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
          self.syncInputs();
        });
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('feeding'));
          console.log('clicked delete feeding ' + id);
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(feeding)) {
          feeding = {};
        }
        feeding.child = childId;
        feeding.start = moment($start.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feeding.end = moment($end.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        feeding.type = $type.val();
        feeding.method = $method.val();
        feeding.amount = $amount.val();
      }
    },
    isValidInputs: () => {
      let datesValid = $start.val() && $end.val();
      if (datesValid) {
        const startDate = $startPicker.datetimepicker('viewDate');
        const endDate = $endPicker.datetimepicker('viewDate');
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

        if ($method === 'bottle') {
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
          feedingId = response.id;
          root.location.href = successUrl;
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.feedingDetail(childId, feedingId), feeding)
        .then((response) => {
          feeding = response;
          self.syncInputs();
          root.location.href = successUrl;
          return response;
        });
    }
  };

  self = Feeding;
  return self;
}(window);
