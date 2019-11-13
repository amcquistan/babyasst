
BabyBuddy.Temperature = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let temperatureId;
  let temperature;
  let temperatures = [];
  let $time;
  let $temperature;
  let $tableBody;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $modal;
  let $confirmDeleteBtn;
  let self;

  const Temperature = {
    init: (el, uId, url, cId, tId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      temperatureId = tId;
      $time = $el.find('#time');
      $temperature = $el.find('#temperature');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');
      $modal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      
      $confirmDeleteBtn.click((evt) => {
        if (childId && temperatureId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $modal.modal('hide');
            root.location.reload();
          });
        }
      });

      if (childId && temperatureId) {
        self.fetch();
      }

      $('#datetimepicker_time').datetimepicker({
        defaultDate: 'now',
        format: 'YYYY-MM-DD hh:mm a'
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

      $prevBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($prevBtn.prop('href'));
      });

      $nextBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($nextBtn.prop('href'));
      });

      const fetchAllUrl = BabyBuddy.ApiRoutes.temperatures(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
    },
    syncInputs: () => {
      if (!_.isEmpty(temperature)) {
        if (temperature.time) {
          $time.val(moment(temperature.time).format('YYYY-MM-DD hh:mm a'));
        }
        $temperature.val(temperature.temperature);
      }
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
          let id = parseInt($target.data('temperature'));
          temperatureId = id;
          temperature = temperatures.find(c => c.id === id);
          self.syncInputs();
          root.window.scrollTo(0, 0);
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('temperature'));
          temperatureId = id;
          $modal.modal('show');
        });

      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(temperature)) {
          temperature = {};
        }
        temperature.child = childId;
        temperature.time = moment($time.val(), 'YYYY-MM-DD hh:mm a').toISOString();
        temperature.temperature = $temperature.val();
      }
    },
    isValidInputs: () => {
      if (!$temperature.val()) {
        return false;
      }
      try {
        const temp = parseFloat($temperature.val());
        if (temp <= 20) {
          return false;
        }
      } catch(err) {
        return false;
      }
      return Boolean($time.val());
    },
    fetch: () => {
      $.get(BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId))
        .then((response) => {
          temperature = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
          .then((response) => {
            temperatures = response.results;
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
      $.post(BabyBuddy.ApiRoutes.temperatures(childId), temperature)
        .then((response) => {
          temperature = response;
          temperatureId = response.id;
          root.location.href = successUrl;
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.temperatureDetail(childId, temperatureId), temperature)
        .then((response) => {
          temperature = response;
          self.syncInputs();
          root.location.href = successUrl;
          return response;
        });
    },
    clear: () => {
      temperature = {};
      temperatureId = null;
    }
  };

  self = Temperature;
  return self;
}(window);
