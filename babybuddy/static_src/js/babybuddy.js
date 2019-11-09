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
    var BabyBuddy = {
      host: () => {
        return `${window.location.protocol}//${window.location.host}`;
      },
      ApiRoutes: {
        children: () => {
          return '/api/children/';
        },
        child: (childId) => {
          return `/api/children/${childId}/`;
        },
        childTimeline: (childId, dateStr) => {
          return `/api/children/${childId}/timeline/${dateStr}/`;
        },
        notification: (notificationId) => {
          return `/api/notifications/${notificationId}/`;
        },
        accounts: () => {
          return '/api/accounts/';
        },
        diaperChanges: (childId) => {
          return `/api/children/${childId}/changes/`;
        },
        diaperChangeDetail: (childId, changeId) => {
          return `/api/children/${childId}/changes/${changeId}/`;
        },
        feedings: (childId) => {
          return `/api/children/${childId}/feeding/`;
        },
        feedingDetail: (childId, feedingId) => {
          return `/api/children/${childId}/feeding/${feedingId}/`;
        },
        notes: (childId) => {
          return `/api/children/${childId}/notes/`;
        },
        noteDetail: (childId, noteId) => {
          return `/api/children/${childId}/notes/${noteId}/`;
        },
        sleeping: (childId) => {
          return `/api/children/${childId}/sleep/`;
        },
        sleepingDetail: (childId, sleepId) => {
          return `/api/children/${childId}/sleep/${sleepId}/`;
        },
        temperatures: (childId) => {
          return `/api/children/${childId}/temperature/`;
        },
        temperatureDetail: (childId, temperatureId) => {
          return `/api/children/${childId}/temperature/${temperatureId}/`;
        },
        tummyTime: (childId) => {
          return `/api/children/${childId}/tummy-time/`;
        },
        tummyTimeDetail: (childId, tummyTimeId) => {
          return `/api/children/${childId}/tummy-time/${tummyTimeId}/`;
        },
        weight: (childId) => {
          return `/api/children/${childId}/weight/`;
        },
        weightDetail: (childId, weightId) => {
          return `/api/children/${childId}/weight/${weightId}/`;
        },
        timers: () => {
          return `/api/timers/`;
        },
        timerDetail: (timerId) => {
          return `/api/timers/${timerId}/`;
        }
      },
      DurationFormHandler: function($form, $startPicker, $endPicker){
        var $startInput = $startPicker.find('input');
        if ($startInput && $startInput.val()) {
          $startInput.val(moment($startInput.val()).format('YYYY-MM-DD hh:mm a'));
        }

        var $endInput = $endPicker.find('input');
        if ($endInput && $endInput.val()) {
          $endInput.val(moment($endInput.val()).format('YYYY-MM-DD hh:mm a'));
        }
        $startPicker.datetimepicker({
          format: 'YYYY-MM-DD hh:mm a',
          defaultDate: 'now',
        });
        $startPicker.on('change.datetimepicker', function(evt){
          $endPicker.datetimepicker('minDate', evt.date);
        });
    
        $endPicker.datetimepicker({
          defaultDate: 'now',
          format: 'YYYY-MM-DD hh:mm a'
        });
        $form.submit(function(evt){
          if ($startInput && $startInput.val() && $endInput && $endInput.val()) {
            var start = moment($startInput.val(), 'YYYY-MM-DD hh:mm a');
            var end = moment($endInput.val(), 'YYYY-MM-DD hh:mm a');
            $startInput.val(start.format('YYYY-MM-DD HH:mm'));
            $endInput.val(end.format('YYYY-MM-DD HH:mm'));
          } else {
            evt.preventDefault();
          }
        });
      },
      TimeFormHandler: function($form, $timePicker) {
        var $timeInput = $timePicker.find('input');
        if ($timeInput && $timeInput.val()) {
          $timeInput.val(moment($timeInput.val()).format('YYYY-MM-DD hh:mm a'));
        }
        $timePicker.datetimepicker({
          defaultDate: 'now',
          format: 'YYYY-MM-DD hh:mm a'
        });
        $form.submit(function(evt){
          if ($timeInput && $timeInput.val()) {
            var time = moment($timeInput.val(), 'YYYY-MM-DD hh:mm a');
            $timeInput.val(time.format('YYYY-MM-DD HH:mm'));
          } else {
            evt.preventDefault();
          }
        });
      }
    };
    return BabyBuddy;
}();

setUpAJAX();
