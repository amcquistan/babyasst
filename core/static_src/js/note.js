
BabyBuddy.Note = function() {
  let $el;
  let userId;
  let childId;
  let noteId;
  let note;
  let notes = [];
  let $note;
  let $tableBody;
  let $saveBtn;
  let $addBtn;
  let $addModal;
  let $deleteModal;
  let $confirmDeleteBtn;
  let $startFilterPicker;
  let $endFilterPicker;
  let noteDao;
  let self;

  const Note = {
    init: (el, uId, cId, nId=null) => {
      $el = $(el);
      userId = uId;
      childId = cId;
      noteId = nId;
      $note = $el.find('#note');
      $saveBtn = $el.find('#note-save-btn');
      $tableBody = $el.find('tbody');
      $addBtn = $el.find('#note-add-btn');
      $addModal = $el.find('#note-modal');
      $deleteModal = $el.find('#confirm-delete-modal');
      $confirmDeleteBtn = $el.find('#confirm-delete-btn');
      $startFilterPicker = $el.find('#note-filter-datetimepicker_start');
      $endFilterPicker = $el.find('#note-filter-datetimepicker_end');
      noteDao = BabyBuddy.ChildTimeActivityDao();

      $confirmDeleteBtn.click((evt) => {
        if (childId && noteId) {
          $.ajax({
            url: BabyBuddy.ApiRoutes.noteDetail(childId, noteId),
            type: 'DELETE'
          }).then((response) => {
            self.clear();
            $deleteModal.modal('hide');
            self.fetchAll();
          });
        }
      });

      $addBtn.click((evt) => {
        evt.preventDefault();
        self.clear();
        self.showAddModal();
      });
      $saveBtn.click((evt) => {
        if (self.isValidInputs()) {
          self.syncModel();
          if (!noteId) {
            self.create();
          } else {
            self.update();
          }
        }
      });

      $startFilterPicker.datetimepicker({
        defaultDate: moment().subtract(7, 'days'),
        format: 'YYYY-MM-DD'
      });

      $endFilterPicker.datetimepicker({
        defaultDate: moment(),
        format: 'YYYY-MM-DD'
      });

      $startFilterPicker.on('change.datetimepicker', function(evt){
        $endFilterPicker.datetimepicker('minDate', moment(evt.date).add(1, 'days'));
        self.fetchAll();
      });

      $endFilterPicker.on('change.datetimepicker', function(evt) {
        self.fetchAll();
      });

      self.fetchAll();
    },
    showAddModal: () => {
      $addModal.modal('show');
      self.syncInputs();
    },
    syncInputs: () => {
      if (_.isEmpty(note)) {
        $note.val(note.note);
      }
    },
    syncTable: () => {
      if (!_.isEmpty(notes)) {
        $tableBody.empty();
        let html = notes.map(n => {
          const time = moment(n.time).format('YYYY-MM-DD hh:mm a');
          return `
            <tr>
              <td colspan="4">${n.note}</td>
              <td class="text-center">${time}</td>
              <td class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
                  <a class="btn btn-primary update-btn" data-note="${n.id}">
                    <i class="icon icon-update" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-danger delete-btn" data-note="${n.id}">
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
          noteId = parseInt($target.data('note'));
          note = notes.find(n => n.id === noteId);
          window.scrollTo(0, 0);
          self.showAddModal();
        });
        $el.find('.delete-btn').click((evt) => {
          evt.preventDefault();
          const $target = $(evt.currentTarget);
          noteId = parseInt($target.data('note'));
          $deleteModal.modal('show');
        });
      }
    },
    syncModel: () => {
      if (self.isValidInputs()) {
        if (_.isEmpty(note)) {
          note = {};
        }
        note.child = childId;
        note.note = $note.val();
      }
    },
    isValidInputs: () => {
      return $note.val();
    },
    fetch: () => {
      return $.get(BabyBuddy.ApiRoutes.noteDetail(childId, noteId))
        .then((response) => {
          note = response;
          self.syncInputs();
          return response;
        });
    },
    fetchAll: () => {
      const url = BabyBuddy.ApiRoutes.notes(childId);
      const s = $startFilterPicker.datetimepicker('viewDate');
      const e = $endFilterPicker.datetimepicker('viewDate');
      return noteDao.fetch(url, s.startOf('day'), e.endOf('day')).then(response => {
        notes = response;
        self.syncTable();
        return response;
      });
    },
    create: () => {
      return $.post(BabyBuddy.ApiRoutes.notes(childId), note)
        .then((response) => {
          note = response;
          noteId = response.id;
          $addModal.modal('hide');
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    update: () => {
      return $.post(BabyBuddy.ApiRoutes.noteDetail(childId, noteId), note)
        .then((response) => {
          note = response;
          $addModal.modal('hide');
          return self.fetchAll();
        })
        .catch(err => {
          if (err.responseJSON && err.responseJSON.error_message) {
            $addModal.find('#error-message').html(err.responseJSON.error_message);
          }
        });
    },
    clear: () => {
      note = {};
      noteId = null;
      notes = [];
    }
  };
  self = Note;
  return self;
}();

