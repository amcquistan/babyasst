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
      ApiRoutes: {
        children: function() {
          return '/api/children/';
        },
        child: function(childId) {
          return '/api/children/' + childId + '/';
        },
        childTimeline: function(childId, dateStr) {
          return '/api/children/' + childId + '/timeline/' + dateStr + '/';
        },
        notification: function(notificationId) {
          return '/api/notifications/' + notificationId + '/';
        },
        accounts: function() {
          return '/api/accounts/';
        },
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
        $form.submit(function(evt){
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
