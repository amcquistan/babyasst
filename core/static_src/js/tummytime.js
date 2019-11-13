
BabyBuddy.TummyTime = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let tummyTimeId;
  let tummyTime;
  let tummyTimes = [];
  let $startPicker;
  let $endPicker;
  let $start;
  let $end;
  let $milestone;
  let $tableBody;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $modal;
  let $confirmDeleteBtn;
  let self;

  const TummyTime = {
    init: (el, uId, url, cId, tId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      tummyTimeId = tId;
      $startPicker = $el.find('#datetimepicker_start');
      $endPicker = $el.find('#datetimepicker_end');
      $start = $el.find('#start');
      $end = $el.find('#end');
      $milestone = $el.find('#milestone');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');
      $modal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');

      $confirmDeleteBtn.click((evt) => {
        if (childId && tummyTimeId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.tummyTimeDetail(childId, tummyTimeId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $modal.modal('hide');
            root.location.reload();
          });
        }
      });

      if (childId && tummyTimeId) {
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
          if (!tummyTimeId) {
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

      const fetchAllUrl = BabyBuddy.ApiRoutes.tummyTime(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
    },
    syncInputs: () => {
      if (!_.isEmpty(tummyTime)) {
        if (tummyTime.start) {
          $start.val(moment(tummyTime.start).format('YYYY-MM-DD hh:mm a'));
        }
        if (tummyTime.end) {
          $end.val(moment(tummyTime.end).format('YYYY-MM-DD hh:mm a'));
        }
        $milestone.val(tummyTime.milestone);
      }
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
          let id = parseInt($target.data('tummytime'));
          tummyTimeId = id;
          console.log('clicked update tummytime ' + id);
          tummyTime = tummyTimes.find(c => c.id === id);
          self.syncInputs();
          root.scrollTo(0, 0);
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('tummytime'));
          tummyTimeId = id;
          console.log('clicked delete tummytime ' + id);
          $modal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(tummyTime)) {
          tummyTime = {};
        }
        tummyTime.child = childId;
        tummyTime.start = moment($start.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        tummyTime.end = moment($end.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        tummyTime.milestone = $milestone.val();
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
      $.get(BabyBuddy.ApiRoutes.tummyTime(childId, tummyTimeId))
        .then((response) => {
          tummyTime = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
          .then((response) => {
            tummyTimes = response.results;
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
      $.post(BabyBuddy.ApiRoutes.tummyTime(childId), tummyTime)
        .then((response) => {
          tummyTime = response;
          tummyTimeId = response.id;
          root.location.href = successUrl;
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.tummyTimeDetail(childId, tummyTimeId), tummyTime)
        .then((response) => {
          tummyTime = response;
          self.syncInputs();
          root.location.href = successUrl;
          return response;
        });
    },
    clear: () => {
      tummyTime = {};
      tummyTimeId = null;
    }
  };

  self = TummyTime;
  return self;
}(window);
