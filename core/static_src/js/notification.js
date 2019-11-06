
BabyBuddy.Notification = function (root) {
  var $ = root.jQuery;
  var _ = root._;
  var runIntervalId = null,
      notificationId = null,
      $el = null,
      $childrenSelect = null,
      $accountSelect = null,
      $frequencyInHours = null,
      $intervals = null,
      $start = null,
      $end = null,
      $days = null,
      $hours = null,
      $minutes = null,
      $timerStatus = null,
      lastUpdate = moment(),
      hidden = null,
      children = [],
      accounts = [],
      notification = {},
      self = null;

  var Notification = {
      init: function(id, el) {
          notificationId = id;
          $el = $('#' + el);
          $childrenSelect = $el.find('#id_child');
          $accountSelect = $el.find('#id_account');
          $frequencyInHours = $el.find('#id_frequency_hours');
          // $days = $el.find('#notification-days');
          $hours = $el.find('#notification-hours');
          $minutes = $el.find('#notification-minutes');
          $intervals = $el.find('#id_intervals');
          $start = $el.find('#datetimepicker_start');
          $end = $el.find('#datetimepicker_end');
          $timerStatus = $el.find('#timer-status');
          self = this;

          var initialDate = $start.find('input').val() ? $start.find('input').val() : moment().format('YYYY-MM-DD HH:mm');
          $start.find('input').val(initialDate);

          $start.datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            startDate: initialDate
          });
          $end.datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            onShow: function(ct) {
              var minDate = self.getMinEndDate();
              minDate = minDate.format('YYYY-MM-DD HH:mm');
              this.setOptions({
                minDate: minDate
              })
            }
          });

          $start.change(_.debounce(function(evt){
            console.log('start date changed', evt);
            self.updateEndDate();
          }, 600));

          $end.change(_.debounce(function(evt){
            console.log('end date changed', evt);
            // validate end date

          }, 1200));

          $frequencyInHours.change(_.debounce(function(evt){
            console.log('frequency changed', evt);
            self.updateEndDate();
          }, 600));

          $intervals.change(_.debounce(function(evt){
            console.log('intervals changed', evt);
            self.updateEndDate();
          }, 600));

          if (notificationId) {
            this.fetchNotification()
            .then(function(response){
              if (notification.active) {
                self.run();
              } else {
                $el.find('input').each(function(){
                  $(this).attr('disabled', true);
                });
                $el.find('select').each(function(){
                  $(this).attr('disabled', true);
                });
                $el.find('textarea').each(function(){
                  $(this).attr('disabled', true);
                });
              }
            });
          }

          this.fetchAccounts();
          this.fetchChildren();

          $childrenSelect.change(function(evt){
            var selectedChildId = $(this).val();
            // notification.child = $(this).val();
            var selectedAcct = accounts.find(function(a){
              return a.id == selectedChildId;
            });
            if (selectedAcct && notification.hasOwnProperty('account')) {
              notification.account = selectedAcct.id;
            }
            $accountSelect.val(selectedChildId);
            // self.save();
          });

          $accountSelect.change(function(evt){
            var selectedAcctId = $(this).val();
            // notification.account = $(this).val();
            self.fillChildOptions(children.filter(function(c){
              return c.account == selectedAcctId;
            }));
            // self.save();
          });

          window.addEventListener('beforeunload', function(){
            // self.save();
          });

          self.updateEndDate();
      },
      getMinEndDate: function() {
        var hrs = 0;
        var intervals = 1;
        var startDT = $start.find('input').val() ? moment($start.find('input').val()) : moment();

        try {
          hrs = parseInt($frequencyInHours.val());
        } catch(err) {
          console.log(err);
        }

        try {
          intervals = parseInt($intervals.val());
        } catch(err) {
          console.log(err);
        }

        try {
          var endDT = startDT.clone().add((hrs * intervals), 'hours');
          return endDT;
        } catch(err) {
          console.log(err);
        }
        
        return moment();
      },
      updateEndDate: function () {
        var endDT = self.getMinEndDate();
        $end.find('input').val(endDT.format('YYYY-MM-DD HH:mm'));
      },

      fillChildOptions: function(availableChildren) {
        $childrenSelect.empty();
        var options = availableChildren.map(function(c){
          var selected = notification.child == c.id ? 'selected' : '';
          var name = c.first_name + ' ' + c.last_name;
          return '<option value="' + c.id + '" ' + selected + '>' + name + '</option>';
        });
        options.unshift('<option disabled>Children</option>');
        $childrenSelect.html(options.join('\n'));
      },

      run: function() {
        if ($el.length == 0) {
          console.error('Notification element not found.');
          return false;
        }

        if ($hours.length == 0 || $minutes.length == 0) {
            console.error('Element does not contain expected children.');
            return false;
        }

        $timerStatus.removeClass('timer-stopped');

        if (runIntervalId) {
          clearInterval(runIntervalId);
        }
        runIntervalId = setInterval(this.tick, 1000);

        // If the page just came in to view, update the timer data with the
        // current actual duration. This will (potentially) help mobile
        // phones that lock with the timer page open.
        if (typeof document.hidden !== "undefined") {
          hidden = "hidden";
        } else if (typeof document.msHidden !== "undefined") {
          hidden = "msHidden";
        } else if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
        }
        window.addEventListener('focus', Notification.handleVisibilityChange, false);
      },

      handleVisibilityChange: function() {
        if (!document[hidden] && moment().diff(lastUpdate) > 20000) {
          self.updateNotificationDisplay();
        }
      },

      tick: function() {
        var duration = self.timeUntilNextNotificationEvent();
        // $days.text(duration.days());
        $hours.text(duration.hours());
        $minutes.text(duration.minutes());
      },

      updateNotificationDisplay: function() {
        if (notification && notification.frequency_hours) {
          clearInterval(runIntervalId);
          var duration = self.timeUntilNextNotificationEvent();
          // $days.text(duration.days());
          $hours.text(duration.hours());
          $minutes.text(duration.minutes());
          lastUpdate = moment();

          if (notification.active) {
            // update every 10 seconds
            runIntervalId = setInterval(Notification.tick, 10000);
            $timerStatus.removeClass('timer-stopped');
          } else {
            $timerStatus.addClass('timer-stopped');
          }
        }
      },
      fetchNotification: function() {
        return $.get(BabyBuddy.ApiRoutes.notification(notificationId))
          .then(function(response){
            notification = response;
            return response;
          });
      },
      fetchAccounts: function() {
        return $.get(BabyBuddy.ApiRoutes.accounts())
          .then(function(response){
            accounts = response;
            return response;
          });
      },
      fetchChildren: function() {
        return $.get(BabyBuddy.ApiRoutes.children())
          .then(function(response){
            children = response;
            return response;
          });
      },
      save: function() {
        // return $.post('/api/timers/' + timerId + '/', timer)
        //   .then(function(response){
        //     console.log('saved timer', response);
        //     timer = response;
        //     return response;
        //   });
      },
      timeUntilNextNotificationEvent: function() {
          var now = moment();
          if (_.isEmpty(notification) || !notification.active || now.isAfter(notification.end)) {
            return moment.duration(0, 'hours');
          }

          var secsSinceStart = moment.duration(now.diff(notification.start)).as('seconds');
          var freqInSecs = notification.frequency_hours * 60 * 60;
          var secsUntilNext = freqInSecs;
          if (freqInSecs > secsSinceStart) {
            secsUntilNext = freqInSecs - secsSinceStart;
          } else {
            var r = secsSinceStart % freqInSecs;
            if (r !== 0) {
              secsUntilNext = Math.round(freqInSecs - r);
            }
          }
          var durationUntilNext = moment.duration(secsUntilNext, 'seconds');
          return durationUntilNext;
      }
  };

  return Notification;
}(window);
