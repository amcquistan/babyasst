
BabyBuddy.Sleep = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let sleepId;
  let sleep;
  let sleeps = [];
  let $startPicker;
  let $endPicker;
  let $start;
  let $end;
  let $tableBody;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let self;

  const Sleep = {
    init: (el, uId, url, cId, sId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      sleepId = sId;
      $startPicker = $el.find('#datetimepicker_start');
      $endPicker = $el.find('#datetimepicker_end');
      $start = $el.find('#start');
      $end = $el.find('#end');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');

      if (childId && sleepId) {
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
          if (!sleepId) {
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

      const fetchAllUrl = BabyBuddy.ApiRoutes.sleeping(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
    },
    syncInputs: () => {
      if (!_.isEmpty(sleep)) {
        if (sleep.start) {
          $start.val(moment(sleep.start).format('YYYY-MM-DD hh:mm a'));
        }
        if (sleep.end) {
          $end.val(moment(sleep.end).format('YYYY-MM-DD hh:mm a'));
        }
      }
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
                  <!--
                  <a class="btn btn-danger delete-btn" data-sleep="${s.id}">
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
          let id = parseInt($target.data('sleep'));
          sleepId = id;
          console.log('clicked update sleep ' + id);
          sleep = sleeps.find(c => c.id === id);
          self.syncInputs();
        });
        /*
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('sleep'));
          console.log('clicked delete sleep ' + id);
        });
        */
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(sleep)) {
          sleep = {};
        }
        sleep.child = childId;
        sleep.start = moment($start.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        sleep.end = moment($end.val(), 'YYYY-MM-DD hh:mm a').toISOString();
      }
    },
    isValidInputs: () => {
      let datesValid = $start.val() && $end.val();
      if (datesValid) {
        const startDate = moment($start.val(), 'YYYY-MM-DD hh:mm a');
        const endDate = moment($end.val(), 'YYYY-MM-DD hh:mm a');
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
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
          .then((response) => {
            sleeps = response.results;
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
      $.post(BabyBuddy.ApiRoutes.sleeping(childId), sleep)
        .then((response) => {
          sleep = response;
          sleepId = response.id;
          root.location.href = successUrl;
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.sleepingDetail(childId, sleepId), sleep)
        .then((response) => {
          sleep = response;
          self.syncInputs();
          root.location.href = successUrl;
          return response;
        });
    }

  };

  self = Sleep;
  return self;
}(window);

