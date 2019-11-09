
BabyBuddy.DiaperChange = function(root) {
  const $ = root.$;
  const _ = root._;
  let $el;
  let successUrl;
  let userId;
  let childId;
  let diaperChangeId;
  let diaperChange;
  let diaperChanges = [];
  let $time;
  let $wet;
  let $solid;
  let $color;
  let $tableBody;
  let $updateChangeBtn;
  let $deleteChangeBtn;
  let $saveBtn;
  let $prevBtn;
  let $nextBtn;
  let page = 1;
  let self;

  const DiaperChange = {
    init: (el, uId, url, cId, dId=null) => {
      $el = $(el);
      userId = uId;
      successUrl = url;
      childId = cId;
      diaperChangeId = dId;
      $time = $el.find('#time');
      $wet = $el.find('#wet');
      $solid = $el.find('#solid');
      $color = $el.find('#color');
      $tableBody = $el.find('tbody');
      $saveBtn = $el.find('#save-btn');
      $prevBtn = $el.find('#prev-btn');
      $nextBtn = $el.find('#next-btn');

      if (childId && diaperChangeId) {
        self.fetch();
      }

      $('#datetimepicker_time').datetimepicker({
        defaultDate: 'now',
        format: 'YYYY-MM-DD hh:mm a'
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

      $prevBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($prevBtn.prop('href'));
      });

      $nextBtn.click((evt) => {
        evt.preventDefault();
        self.fetchAll($nextBtn.prop('href'));
      });

      const fetchAllUrl = BabyBuddy.ApiRoutes.diaperChanges(childId);
      self.fetchAll(`${fetchAllUrl}?limit=10`);
    },
    syncInputs: () => {
      if (!_.isEmpty(diaperChange)) {
        if (diaperChange.time) {
          $time.val(moment(diaperChange.time).format('YYYY-MM-DD hh:mm a'));
        }
        $wet.prop('checked', diaperChange.wet);
        $solid.prop('checked', diaperChange.solid);
        $wet.parent().toggleClass('active', diaperChange.wet);
        $solid.parent().toggleClass('active', diaperChange.solid);
        $color.val(diaperChange.color);
      }
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
              <td class="text-center">${change.color}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-change="${change.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <!--
                  <a class="btn btn-danger delete-btn" data-change="${change.id}">
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
          let id = parseInt($target.data('change'));
          console.log('clicked update change ' + id);
          diaperChange = diaperChanges.find(c => c.id === id);
          self.syncInputs();
        });
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          let id = parseInt($target.data('change'));
          console.log('clicked delete change ' + id);
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
    fetchAll: (url) => {
      if (!_.isEmpty(url)) {
        $.get(url)
        .then((response) => {
          diaperChanges = response.results;
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
      $.post(BabyBuddy.ApiRoutes.diaperChanges(childId), diaperChange)
        .then((response) => {
          diaperChange = response;
          diaperChangeId = response.id;
          root.location.href = successUrl;
          return response;
        });
    },
    update: () => {
      $.post(BabyBuddy.ApiRoutes.diaperChangeDetail(childId, diaperChangeId), diaperChange)
        .then((response) => {
          diaperChange = response;
          self.syncInputs();
          root.location.href = successUrl;
          return response;
        });
    }
  };

  self = DiaperChange;
  return DiaperChange;

}(window);
