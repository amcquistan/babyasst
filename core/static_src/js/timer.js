
BabyBuddy.Timer = function (root) {
    var $ = root.$;
    var _ = root._;
    var runIntervalId = null,
        timerId = null,
        userId = null,
        $el = null,
        $errorModal = null,
        $childrenSelect = null,
        $accountSelect = null,
        $feedingCard = null,
        $sleepCard = null,
        $tummytimeCard = null,
        $startBtn = null,
        $pauseBtn = null,
        $endBtn = null,
        $name = null,
        $hours = null,
        $minutes = null,
        $seconds = null,
        $timerStatus = null,
        $timerStatusMsg = null,
        debounceTimer = null,
        lastUpdate = moment(),
        hidden = null,
        children = [],
        accounts = [],
        timer = null,
        self = null;

    var Timer = {
        init: function(id, user, el) {
            timerId = id;
            userId = user;
            $el = $('#' + el);
            $errorModal = $el.find('#timer-msg-modal');
            $name = $el.find('#name');
            $childrenSelect = $el.find('#child');
            $accountSelect = $el.find('#account');
            $feedingCard = $el.find('#card-feeding');
            $sleepCard = $el.find('#card-sleep');
            $tummytimeCard = $el.find('#card-tummytime');
            $startBtn = $el.find('#start-timer');
            $pauseBtn = $el.find('#pause-timer');
            $endBtn = $el.find('#end-timer');
            $hours = $el.find('#timer-hours');
            $minutes = $el.find('#timer-minutes');
            $seconds = $el.find('#timer-seconds');
            $timerStatus = $el.find('#timer-status');
            $timerStatusMsg = $el.find('#timer-status-message');
            self = this;

            if (timerId) {
              this.fetchTimer()
              .then((response) => {
                if (!_.isEmpty(timer) && timer.active) {
                  self.run();
                  $startBtn.hide();
                  $pauseBtn.show();
                } else {
                  $startBtn.show();
                  $pauseBtn.hide();
                }
              });
            } else {
              $endBtn.hide();
              $pauseBtn.hide();
            }

            $startBtn.click((evt) => {
              evt.preventDefault();
              if (_.isEmpty(timer) || !timerId) {
                self.createTimer().catch((err) => {
                  $errorModal.find('#modal-error-message').html(
                    'Your monthly allocation of timers as been reached. Please upgrade your account to gain access to additional timers.'
                  );
                  $errorModal.modal('show');
                });
              } else {
                timer.active = true;
                self.save().then((response) => {
                  self.run();
                  $startBtn.hide();
                  $pauseBtn.show();
                }).catch((err) => {
                  $errorModal.find('#modal-error-message').html(
                    'Your monthly allocation of timers as been reached. Please upgrade your account to gain access to additional timers.'
                  );
                  $errorModal.modal('show');
                });
              }
            });
            $pauseBtn.click((evt) => {
              evt.preventDefault();
              timer.active = false;
              self.save().then((response) => {
                self.updateTimerDisplay();
                $startBtn.show();
                $pauseBtn.hide();
              });
            });
            $endBtn.click((evt) => {
              timer.active = false;
              timer.complete = true;
              self.save();
            });

            $name.change(_.debounce((evt) => {
              if (!_.isEmpty(timer) && timer.name !== $name.val()) {
                timer.name = $name.val();
                self.save();
              }
            }, 800));

            $childrenSelect.change((evt) => {
              if (!_.isEmpty(timer)) {
                timer.child = $(this).val();
                const selectedAcct = accounts.find((a) => a.id == timer.child);
                if (selectedAcct) {
                  timer.account = selectedAcct.id;
                }
                $accountSelect.val(timer.account);
                $accountSelect.change();
                self.save();
              }
            });

            $accountSelect.change((evt) => {
              if (!_.isEmpty(timer)) {
                timer.account = $(this).val();
                self.fillChildOptions(children.filter((c) => c.account == timer.account));
                self.save();
              } else {
                self.fillChildOptions(children);
              }
            });

            $feedingCard.click((evt) => {
              evt.preventDefault();
              $feedingCard.toggleClass('card-active');
              $sleepCard.removeClass('card-active');
              $tummytimeCard.removeClass('card-active');
              if (!_.isEmpty(timer)) {
                self.save();  
              }
            });

            $sleepCard.click((evt) => {
              evt.preventDefault();
              $sleepCard.toggleClass('card-active');
              $feedingCard.removeClass('card-active');
              $tummytimeCard.removeClass('card-active');
              if (!_.isEmpty(timer)) {
                self.save();  
              }
            });

            $tummytimeCard.click((evt) => {
              evt.preventDefault();
              $tummytimeCard.toggleClass('card-active');
              $feedingCard.removeClass('card-active');
              $sleepCard.removeClass('card-active');
              if (!_.isEmpty(timer)) {
                self.save();  
              }
            });

            this.fetchChildren().then((response) => {
              return self.fetchAccounts();
            })

            window.addEventListener('beforeunload', () => {
              if (!_.isEmpty(timer)) {
                self.save();
              }
            });
        },

        fillChildOptions: function(availableChildren) {
          $childrenSelect.empty();
          var options = availableChildren.map((c) => {
            var selected = !_.isEmpty(timer) && timer.child == c.id ? 'selected' : '';
            var name = c.first_name + ' ' + c.last_name;
            return '<option value="' + c.id + '" ' + selected + '>' + name + '</option>';
          });
          options.unshift('<option disabled>Children</option>');
          $childrenSelect.html(options.join('\n'));
          if (availableChildren.length === 1) {
            var child = availableChildren[0];
            $childrenSelect.val(child.id);
          }
        },

        run: function() {
          if ($el.length == 0) {
            console.error('BBTimer: Timer element not found.');
            return false;
          }

          if ($seconds.length == 0
              || $minutes.length == 0
              || $hours.length == 0) {
              console.error('BBTimer: Element does not contain expected children.');
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
          window.addEventListener('focus', Timer.handleVisibilityChange, false);
        },

        handleVisibilityChange: function() {
          if (!document[hidden] && moment().diff(lastUpdate) > 15000) {
            self.updateTimerDisplay();
          }
        },

        tick: function() {
          var seconds = Number($seconds.text());
          if (seconds < 59) {
            $seconds.text(seconds + 1);
            return;
          } else {
            $seconds.text(0);
          }

          var minutes = Number($minutes.text());
          if (minutes < 59) {
            $minutes.text(minutes + 1);
            return;
          } else {
            $minutes.text(0);
          }

          var hours = Number($hours.text());
          $hours.text(hours + 1);
        },
        updateTimerDisplay: function() {
          if (!_.isEmpty(timer)) {
            self.save().then((response) => {
              if (!_.isEmpty(timer) && timer.duration) {
                clearInterval(runIntervalId);
                var duration = moment.duration(timer.duration);
                $hours.text(duration.hours());
                $minutes.text(duration.minutes());
                $seconds.text(duration.seconds());
                lastUpdate = moment();
    
                if (timer.active) {
                  runIntervalId = setInterval(Timer.tick, 1000);
                  $timerStatus.removeClass('timer-stopped');
                } else {
                  $timerStatus.addClass('timer-stopped');
                }
              }
            });
          }
        },
        fetchTimer: function() {
          if (timerId) {
            return $.get(BabyBuddy.ApiRoutes.timerDetail(timerId))
            .then(function(response){
              timer = response;
              self.reportTimerStatusMessage();
              return response;
            });
          }
        },
        fetchAccounts: function() {
          return $.get('/api/accounts/')
            .then(function(response){
              accounts = response;
              if (!$accountSelect.val() && accounts.length) {
                $accountSelect.val(accounts[0].id);
                $accountSelect.change();
              }
              return response;
            });
        },
        fetchChildren: function() {
          return $.get('/api/children/')
            .then(function(response){
              children = response;
              self.fillChildOptions(children);
              return response;
            });
        },
        reportTimerStatusMessage: function() {
          $timerStatusMsg.empty();
          if (!_.isEmpty(timer) && timer.end) {
            const endedAt = moment(timer.end).format('YYYY-MM-DD hh:mm a');
            if (!timer.active && !timer.complete && timer.end) {
              $timerStatusMsg.html(`Paused at ${endedAt}`);
            } else if (timer.complete) {
              $timerStatusMsg.html(`Completed at ${endedAt}`);
            }
          }
        },
        save: function() {
          timer.is_feeding = $feedingCard.is('.card-active');
          timer.is_sleeping = $sleepCard.is('.card-active');
          timer.is_tummytime = $tummytimeCard.is('.card-active');
          timer.name = $name.val();
          timer.child = $childrenSelect.val();
          timer.account = $accountSelect.val();
          return $.post(BabyBuddy.ApiRoutes.timerDetail(timerId), timer)
            .then((response) => {
              timer = response;
              self.reportTimerStatusMessage();
              return response;
            });
        },
        createTimer: function() {
          timer = {
            name: $name.val(),
            user: userId,
            child: $childrenSelect.val(),
            account: $accountSelect.val(),
            is_feeding: $feedingCard.is('.card-active'),
            is_sleeping: $sleepCard.is('.card-active'),
            is_tummytime: $tummytimeCard.is('.card-active')
          }
          return $.post(BabyBuddy.ApiRoutes.timers(), timer)
            .then((response) => {
              timer = response;
              timerId = timer.id;
              $endBtn.show();
              $startBtn.hide();
              $pauseBtn.show();
              $endBtn.prop('href', `${BabyBuddy.host()}/timer/${timerId}/stop/`);
              self.run();
              return response;
            });
        }
    };

    return Timer;
}(window);
