
BabyBuddy.Weight = function(root) {
  let $el;
  let successUrl;
  let userId;
  let childId;
  let weightId;
  let weight;
  let weights = [];
  let $date;
  let $weight;
  let $tableBody;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let $modal;
  let $confirmDeleteBtn;
  let self;

  const Weight = {
    init: (el, uId, url, cId, wId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      weightId = wId;
      $date = $el.find('#date');
      $weight= $el.find('#weight');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');
      $modal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');

      $confirmDeleteBtn.click((evt) => {
        if (childId && weightId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.weightDetail(childId, weightId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $modal.modal('hide');
            root.location.reload();
          });
        }
      });

      if (childId && weightId) {
        self.fetch();
      }

      $('#datetimepicker_date').datetimepicker({
        defaultDate: 'now',
        format: 'YYYY-MM-DD'
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

      $prevBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($prevBtn.prop('href'));
      });

      $nextBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($nextBtn.prop('href'));
      });

      const fetchAllUrl = BabyBuddy.ApiRoutes.weight(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
    },
    syncInputs: () => {
      if (!_.isEmpty(weight)) {
        if (weight.date) {
          $date.val(moment(weight.date).format('YYYY-MM-DD'));
        }
        $weight.val(weight.weight);
      }
    },
    syncTable: () => {
      if (!_.isEmpty(weights)) {
        $tableBody.empty();
        let html = weights.map(w => {
          const date = moment(w.date).format('YYYY-MM-DD');
          const wt = w.weight || '';
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
          let id = parseInt($target.data('weight'));
          weightId = id;
          weight = weights.find(c => c.id === id);
          self.syncInputs();
          root.scrollTo(0, 0);
        });

        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('weight'));
          weightId = id;
          $modal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(weight)) {
          weight = {};
        }
        weight.child = childId;
        weight.date = $date.val();
        weight.weight = $weight.val();
      }
    },
    isValidInputs: () => {
      if (!$weight.val()) {
        return false;
      }
      try {
        const wt = parseFloat($weight.val());
        if (wt <= 0) {
          return false;
        }
      } catch(err) {
        return false;
      }
      return Boolean($date.val());
    },
    fetch: () => {
      $.get(BabyBuddy.ApiRoutes.weightDetail(childId, weightId))
        .then((response) => {
          weight = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
          .then((response) => {
            weights = response.results;
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
      $.post(BabyBuddy.ApiRoutes.weight(childId), weight)
        .then((response) => {
          root.location.href = successUrl;
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.weightDetail(childId, weightId), weight)
        .then((response) => {
          root.location.href = successUrl;
          return response;
        });
    },
    clear: () => {
      weight = {};
      weightId = null;
    }
  };
  self = Weight;
  return self;
}(window);
