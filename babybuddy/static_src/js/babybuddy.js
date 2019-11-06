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
      }
    };
    return BabyBuddy;
}();

setUpAJAX();
