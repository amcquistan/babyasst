/* Baby Buddy
 *
 * Default namespace for the Baby Buddy app.
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Baby Asst requires jQuery.')
}

function setUpAJAX() {
  var csrftoken = getCookie('csrftoken');
  jQuery.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });
}


function getCookie (name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function csrfSafeMethod (method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var BabyBuddy = function () {
    var BabyBuddy = {};
    return BabyBuddy;
}();

setUpAJAX();


BabyBuddy.Account = function(root) {
  var $ = root.jQuery;
  var _ = root._;
  var Stripe = root.Stripe;
  var stripeCard = null;
  var userId = null,
      accountId = null,
      user = {},
      account = {},
      stripe = null,
      stripeElements = null,
      $el = null,
      $inviteeInput = null,
      usersToAddBeforeIncurringCost = 0,

      // clicking this means to invite the person to account and, potentially increase subscription
      $inviteeBtn = null,

      $inviteeStripeTokenInput = null,
      $inviteeStripeForm = null,

      $subscriptionStripeTokenInput = null,
      $subscriptionService = null,
      $subscriptionStripeForm = null,

      // if acct is premium, then clicking this means downgrade to free acct
      $freeAcctBtn = null,

      // if acct is free, then clicking this means upgrade to premium
      $premiumAcctBtn = null,
      $paymentModal = null,

      stripeStyle = {
        base: {
          // Add your base input styles here. For example:
          fontSize: '16px',
          color: "#32325d",
        }
      },
      self = null;

  var Account = {
    init: function(el, uId, aId, usersToAdd, key) {
      self = this;
      userId = uId;
      accountId = aId;
      usersToAddBeforeIncurringCost = usersToAdd;
      stripe = Stripe(key);
      stripeElements = stripe.elements();
      $el = $('#' + el);
      
      $inviteeInput = $el.find('#invitee');
      $inviteeBtn = $el.find('#invitee-btn');
      $inviteeStripeForm = $el.find('#invitee-form');
      $inviteeStripeTokenInput = $el.find('#stripe_invitee_token');

      $subscriptionStripeForm = $el.find('#subscription-form');
      $subscriptionStripeTokenInput = $el.find('#stripe_subscription_token');
      $subscriptionService = $el.find('#stripe_subscription_service');
      
      $freeAcctBtn = $el.find('#free-plan-btn');
      $premiumAcctBtn = $el.find('#premium-plan-btn');
      $paymentModal = $el.find('#payment-modal');

      $freeAcctBtn.click(function(evt){
        evt.preventDefault();
        $subscriptionService.val('free');
        $subscriptionStripeForm.submit();
      });

      $inviteeBtn.click(function(evt){
        evt.preventDefault();
        self.inviteAccountMember();
      });

      $premiumAcctBtn.click(function(evt){
        evt.preventDefault();
        self.upgradeToPremium();
      });

      // Create an instance of the card Element.
      stripeCard = stripeElements.create('card', {style: stripeStyle});

      self.fetchAccount(accountId);
    },
    fetchAccount: function(id) {
      return $.get('/api/accounts/' + id + '/').then(function(response){
        account = response;
        console.log('account', account);
        return response;
      });
    },
    upgradeToPremium: function (){
      $paymentModal.find('#purchase-description').html('Premium subscription purchase for $3 per month');
      
      var $useExistingPaymentSourceSection = $paymentModal.find('#existing-payment-source-section');
      var $useExistingPaymentSourceCB = $paymentModal.find('#use-existing-payment-source');
      var hasPaymentSource = account && account.payment_source && account.payment_source.has_payment_source;
      if (hasPaymentSource) {
        var paymentSource = account.payment_source;
        $paymentModal.find('#payment-brand').html(paymentSource.brand);
        $paymentModal.find('#payment-expmo').html(paymentSource.exp_mo);
        $paymentModal.find('#payment-expyr').html(paymentSource.exp_yr);
        $paymentModal.find('#payment-last4').html(paymentSource.last4);
      } else {
        $useExistingPaymentSourceSection.empty();
      }

      // Add an instance of the card Element into the `card-element` <div>.
      stripeCard.mount('#card-element');
      stripeCard.addEventListener('change', function(e){
        var $displayErrors = $el.find('#card-errors');
        if (e.error) {
          $displayErrors.html(e.error.message);
        } else {
          $displayErrors.html('');
        }
      });

      $paymentModal.modal('show');

      $paymentModal.find('#card-button').click(function(e){
        e.preventDefault();
        $subscriptionService.val('premium');
        if (hasPaymentSource && $useExistingPaymentSourceCB.prop('checked')) {
          $subscriptionStripeForm.submit();
        } else {
          stripe.createToken(stripeCard).then(function(result){
            if (result.error) {
              var $displayErrors = $paymentModal.find('#card-errors');
              $displayErrors.html(result.error.message);
            } else {
              $subscriptionStripeTokenInput.val(result.token.id);
              $subscriptionStripeForm.submit();
            }
          });
        }
      });
    },
    inviteAccountMember: function() {
      var invitee = $inviteeInput.val();
      if (!invitee || !account.subscription || !account.subscription.is_active) {
        return;
      }

      if (usersToAddBeforeIncurringCost > 0) {
        $inviteeStripeForm.submit();
      }

      $paymentModal.find('#purchase-description').html('Adding account user for an additional $1 per month');
      
      var $useExistingPaymentSourceSection = $paymentModal.find('#existing-payment-source-section');
      var $useExistingPaymentSourceCB = $paymentModal.find('#use-existing-payment-source');
      var hasPaymentSource = account && account.payment_source && account.payment_source.has_payment_source;
      if (hasPaymentSource) {
        var paymentSource = account.payment_source;
        $paymentModal.find('#payment-brand').html(paymentSource.brand);
        $paymentModal.find('#payment-expmo').html(paymentSource.exp_mo);
        $paymentModal.find('#payment-expyr').html(paymentSource.exp_yr);
        $paymentModal.find('#payment-last4').html(paymentSource.last4);
      } else {
        $useExistingPaymentSourceSection.empty();
      }

      // Add an instance of the card Element into the `card-element` <div>.
      stripeCard.mount('#card-element');
      stripeCard.addEventListener('change', function(e){
        var $displayErrors = $paymentModal.find('#card-errors');
        if (e.error) {
          $displayErrors.html(e.error.message);
        } else {
          $displayErrors.html('');
        }
      });

      $paymentModal.modal('show');

      $paymentModal.find('#card-button').click(function(e){
        e.preventDefault();
        if (hasPaymentSource && $useExistingPaymentSourceCB.prop('checked')) {
          $inviteeStripeForm.submit();
        } else {
          stripe.createToken(stripeCard).then(function(result){
            if (result.error) {
              var $displayErrors = $el.find('#card-errors');
              $displayErrors.html(result.error.message);
            } else {
              $inviteeStripeTokenInput.val(result.token.id);
              $inviteeStripeForm.submit();
            }
          });
        }
      });
    }
  };

  return Account;
} (window);


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
        // debugger
        // var hrs = $frequencyInHours.val();
        // var intervals = $intervals.val();
        // var startDt = $start.val();
        // try {
        //   hrs = hrs ? parseInt(hrs) : 0;
        //   if (hrs > 0 && startDt) {
        //     intervals = intervals ? parseInt(intervals) : 1;
        //     var endDate = moment(startDt).add(moment.duration((hrs * intervals), 'hours'));
        //     // figure out how to format date correctly with moment 
        //     // to match format used in datetime picker display input field
        //     $end.val(endDate.format('YYYY-MM-DD HH:mm'));
        //   } else if (startDt) {
        //     // figure out how to format date correctly with moment 
        //     // to match format used in datetime picker display input field
        //     $end.val(startDt);
        //   }
        // } catch(err) {
        //   console.error('Error updating end date', err);
        // }
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
        return $.get('/api/notifications/' + notificationId + '/')
          .then(function(response){
            notification = response;
            return response;
          });
      },
      fetchAccounts: function() {
        return $.get('/api/accounts/')
          .then(function(response){
            accounts = response;
            return response;
          });
      },
      fetchChildren: function() {
        return $.get('/api/children/')
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
              secsUntilNext = Math.round((1 - r) * freqInSecs);
            }
          }
          var durationUntilNext = moment.duration(secsUntilNext, 'seconds');
          return durationUntilNext;
      }
  };

  return Notification;
}(window);


BabyBuddy.Timer = function ($) {
    var runIntervalId = null,
        timerId = null,
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
        debounceTimer = null,
        lastUpdate = moment(),
        hidden = null,
        children = [],
        accounts = [],
        timer = null,
        self = null;

    var Timer = {
        init: function(id, el) {
            timerId = id;
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
            self = this;

            this.fetchTimer()
              .then(function(response){
                if (timer.active) {
                  self.run();
                  $startBtn.hide();
                  $pauseBtn.show();
                } else {
                  $startBtn.show();
                  $pauseBtn.hide();
                }
              });

            $startBtn.click(function(evt){
              evt.preventDefault();
              timer.active = true;
              self.save().then(function(response){
                self.run();
                $startBtn.hide();
                $pauseBtn.show();
              }).catch(function(err){
                $errorModal.find('#modal-error-message').html(
                  'Your monthly allocation of timers as been reached. Please upgrade your account to gain access to additional timers.'
                );
                $errorModal.modal('show');
              });
            });
            $pauseBtn.click(function(evt){
              evt.preventDefault();
              timer.active = false;
              self.save().then(function(response){
                self.updateTimerDisplay();
              });
              $startBtn.show();
              $pauseBtn.hide();
            });
            $endBtn.click(function(evt){
              timer.active = false;
              timer.complete = true;
              self.save();
            });

            $name.change(function(evt){
              if (!debounceTimer) {
                debounceTimer = setTimeout(function(){
                  clearTimeout(debounceTimer);
                  debounceTimer = null;
                  if (timer.name !== $name.val()) {
                    timer.name = $name.val();
                    self.save();
                  }
                }, 900);
              }
            });

            $childrenSelect.change(function(evt){
              timer.child = $(this).val();
              var selectedAcct = accounts.find(function(a){
                return a.id == timer.child;
              });
              if (selectedAcct) {
                timer.account = selectedAcct.id;
              }
              $accountSelect.val(timer.account);
              $accountSelect.change();
              self.save();
            });

            $accountSelect.change(function(evt){
              timer.account = $(this).val();
              self.fillChildOptions(children.filter(function(c){
                return c.account == timer.account;
              }));
              self.save();
            });

            $feedingCard.click(function(evt){
              evt.preventDefault();
              $feedingCard.toggleClass('card-active');
              $sleepCard.removeClass('card-active');
              $tummytimeCard.removeClass('card-active');
              self.save();  
            });

            $sleepCard.click(function(evt){
              evt.preventDefault();
              $sleepCard.toggleClass('card-active');
              $feedingCard.removeClass('card-active');
              $tummytimeCard.removeClass('card-active');
              self.save();
            });

            $tummytimeCard.click(function(evt){
              evt.preventDefault();
              $tummytimeCard.toggleClass('card-active');
              $feedingCard.removeClass('card-active');
              $sleepCard.removeClass('card-active');
              self.save();
            });

            this.fetchChildren().then(function(response){
              return self.fetchAccounts();
            })

            window.addEventListener('beforeunload', function(){
              self.save();
            });
        },

        fillChildOptions: function(availableChildren) {
          $childrenSelect.empty();
          var options = availableChildren.map(function(c){
            var selected = timer.child == c.id ? 'selected' : '';
            var name = c.first_name + ' ' + c.last_name;
            return '<option value="' + c.id + '" ' + selected + '>' + name + '</option>';
          });
          options.unshift('<option disabled>Children</option>');
          $childrenSelect.html(options.join('\n'));
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
          self.save().then(function(response){
            if (timer && timer.duration) {
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
        },
        fetchTimer: function() {
          return $.get('/api/timers/' + timerId + '/')
            .then(function(response){
              timer = response;
              return response;
            });
        },
        fetchAccounts: function() {
          return $.get('/api/accounts/')
            .then(function(response){
              accounts = response;
              if (!$accountSelect.val() && accounts.length) {
                $accountSelect.val(accounts[0].id);
              }
              return response;
            });
        },
        fetchChildren: function() {
          return $.get('/api/children/')
            .then(function(response){
              children = response;
              return response;
            });
        },
        save: function() {
          timer.is_feeding = $feedingCard.is('.card-active');
          timer.is_sleeping = $sleepCard.is('.card-active');
          timer.is_tummytime = $tummytimeCard.is('.card-active');
          return $.post('/api/timers/' + timerId + '/', timer)
            .then(function(response){
              timer = response;
              return response;
            });
        }
    };

    return Timer;
}(jQuery);

/* Baby Buddy Dashboard
 *
 * Provides a "watch" function to update the dashboard at one minute intervals
 * and/or on visibility state changes.
 */
BabyBuddy.Dashboard = function ($) {
    var runIntervalId = null;
    var dashboardElement = null;
    var hidden = null;

    var Dashboard = {
        watch: function(element_id, refresh_rate) {
            dashboardElement = $('#' + element_id);

            if (dashboardElement.length == 0) {
                console.error('Baby Buddy: Dashboard element not found.');
                return false;
            }

            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
            }
            else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
            }
            else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
            }

            if (typeof window.addEventListener === "undefined" || typeof document.hidden === "undefined") {
                if (refresh_rate) {
                    runIntervalId = setInterval(this.update, refresh_rate);
                }
            }
            else {
                window.addEventListener('focus', Dashboard.handleVisibilityChange, false);
            }
        },

        handleVisibilityChange: function() {
            if (!document[hidden]) {
                Dashboard.update();
            }
        },

        update: function() {
            // TODO: Someday maybe update in place?
            location.reload();
        }
    };

    return Dashboard;
}(jQuery);
