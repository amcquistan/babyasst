
BabyBuddy.TimerDetail = function (root) {
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
        $feedingModal = null,
        $startFeedingPicker = null,
        $endFeedingPicker = null,
        debounceTimer = null,
        lastUpdate = moment(),
        periodicUpdateIntervalId = null,
        duration = null,
        hidden = null,
        children = [],
        accounts = [],
        timer = null,
        self = null;

    var TimerDetail = {
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
            $feedingModal = $el.find('#feeding-modal');
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
              evt.preventDefault();
              timer.active = false;
              timer.complete = true;
              self.save().then(response => {
                if (response.is_feeding) {
                  $feedingModal.modal('show');
                  const feedingDuration = moment.duration(response.duration);
                  const feedingEnd = moment();
                  const feedingStart = feedingEnd.clone().subtract(feedingDuration);
                  const $feedingStart = $feedingModal.find('#feeding-datetimepicker_start');
                  const $feedingEnd = $feedingModal.find('#feeding-datetimepicker_end');
                  $feedingStart.datetimepicker({
                    defaultDate: feedingStart,
                    format: 'YYYY-MM-DD hh:mm a'
                  });
                  $feedingEnd.datetimepicker({
                    defaultDate: feedingEnd,
                    format: 'YYYY-MM-DD hh:mm a'
                  });
                  const $units = $feedingModal.find('#feeding-units');
                  const $type = $feedingModal.find('#feeding-type');
                  const $method = $feedingModal.find('#feeding-method');
                  const $amount = $feedingModal.find('#feeding-amount');
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
                  $feedingModal.find('#feeding-save-btn').click(e => {
                    const feeding = {
                      child: response.child,
                      start: $feedingStart.datetimepicker('viewDate').toISOString(),
                      end: $feedingEnd.datetimepicker('viewDate').toISOString(),
                      type: $type.val(),
                      method: $method.val(),
                      amount: $amount.val(),
                      units: $units.val()
                    };
                    if (feeding.method === 'bottle' && !feeding.amount) {
                      return;
                    }
                    $.post(BabyBuddy.ApiRoutes.feedings(feeding.child), feeding)
                      .then((response) => {
                        root.location.href = $endBtn.prop('href');
                        return response;
                      });
                  });
                } else {
                  root.location.href = $endBtn.prop('href');
                }
              });
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

            $(window).on('beforeunload', () => {
              if (!_.isEmpty(timer)) {
                self.save();
              }
              clearInterval(periodicUpdateIntervalId);
              clearInterval(runIntervalId);
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
              console.error('Timer element does not contain expected children.');
              return false;
          }

          $timerStatus.removeClass('timer-stopped');

          if (runIntervalId) {
            clearInterval(runIntervalId);
          }
          runIntervalId = setInterval(self.tick, 1000);

          if (periodicUpdateIntervalId) {
            clearInterval(periodicUpdateIntervalId);
          }
          periodicUpdateIntervalId = setInterval(self.fetchTimer, 5000);

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
          window.addEventListener('focus', self.handleVisibilityChange, false);
        },

        handleVisibilityChange: function() {
          if (!document[hidden] || moment().diff(lastUpdate) > 5000) {
            self.updateTimerDisplay();
          }
        },

        tick: function() {
          if (duration && !_.isEmpty(timer) && timer.active) {
            duration.add(1, 'seconds');
            $seconds.text(duration.seconds());
            $minutes.text(duration.minutes());
            $hours.text((duration.days() * 24) + duration.hours());
          }
        },
        updateTimerDisplay: function() {
          if (!_.isEmpty(timer)) {
            self.save().then((response) => {
              if (!_.isEmpty(timer) && timer.duration) {
                self.syncUI();
              }
            });
          }
        },
        syncUI: function() {
          if (!_.isEmpty(timer)) {
            duration = moment.duration(timer.duration);
            $hours.text((duration.days() * 24) + duration.hours());
            $minutes.text(duration.minutes());
            $seconds.text(duration.seconds());
            lastUpdate = moment();

            if (timer.active) {
              if (runIntervalId) {
                clearInterval(runIntervalId);
              }
              runIntervalId = setInterval(TimerDetail.tick, 1000);
              $pauseBtn.show();
              $startBtn.hide();
              $endBtn.show();
              $timerStatus.removeClass('timer-stopped');
            } else {
              if (timer.complete) {
                $pauseBtn.hide();
                $startBtn.hide();
                $endBtn.hide();
              } else {
                $pauseBtn.hide();
                $startBtn.show();
                $endBtn.show();
              }
              $timerStatus.addClass('timer-stopped');
            }

            $tummytimeCard.toggleClass('card-active', timer.is_tummytime);
            $feedingCard.toggleClass('card-active', timer.is_feeding);
            $sleepCard.toggleClass('card-active', timer.is_sleeping);
          } else {
            $startBtn.show();
            $tummytimeCard.toggleClass('card-active', false);
            $feedingCard.toggleClass('card-active', false);
            $sleepCard.toggleClass('card-active', false);
          }
        },
        fetchTimer: function() {
          if (timerId) {
            return $.get(BabyBuddy.ApiRoutes.timerDetail(timerId))
            .then(function(response){
              timer = response;
              duration = moment.duration(timer.duration);
              self.reportTimerStatusMessage();
              self.syncUI();
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
              duration = moment.duration(timer.duration);
              self.reportTimerStatusMessage();
              self.syncUI();
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
              duration = moment.duration(timer.duration);
              timerId = timer.id;
              $endBtn.show();
              $startBtn.hide();
              $pauseBtn.show();
              $endBtn.prop('href', `${BabyBuddy.host()}/timer/${timerId}/stop/`);
              self.run();
              self.syncUI();
              BabyBuddy.updateTimerNavSpan();
              setTimeout(() => {
                window.location.href = `/timer/${timerId}/`;
              }, 1200);
              return response;
            });
        }
    };

    return TimerDetail;
}(window);
