# -*- coding: utf-8 -*-
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.core.paginator import Paginator
from django.shortcuts import redirect, reverse, render, get_object_or_404
from django.urls import reverse_lazy
from django.utils import timezone
from django.http import Http404
from django.utils.translation import gettext as _
from django.views import View
from django.views.generic.base import RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView

from babybuddy.mixins import PermissionRequired403Mixin, AccountMemberRequiredMixin, ActiveSubscriptionRequiredMixin, ChildActivityTestMixin, ChildCreationTestMixin
from babybuddy.views import BabyBuddyFilterView
from core import forms, helpers, models, timeline


class BaseChildActivityView(View):
    def get_queryset(self):
        return self.model.objects.filter(child__slug=self.kwargs.get('slug'))

    def get_child(self):
        try:
            self.child = models.Child.objects.get(slug=self.kwargs.get('slug'))
        except models.Child.model.DoesNotExist:
            raise Http404(_("Uh oh something unexpected happended."))

        return self.child


class ChildActivityQuickAddView(UserPassesTestMixin, SuccessMessageMixin, BaseChildActivityView):
    success_url_name = 'core:child'

    def test_func(self):
        if self.request.method == 'POST':
            obj = models.Child.objects.get(pk=self.request.POST['child'])
            user_accts = [acct.id for acct in self.request.user.accounts.all()]
            return obj.account.id in user_accts
        return True

    def get_success_message(self, cleaned_data):
        cleaned_data['model'] = self.model._meta.verbose_name.title()
        if 'child' in cleaned_data:
            self.success_message = _('%(model)s entry for %(child)s added!')
        else:
            self.success_message = _('%(model)s entry added!')
        return self.success_message % cleaned_data

    def get(self, request):
        return render(request, self.template_name, {
          'form': self.form_class(user=request.user)
        })

    def post(self, request):
        form = self.form_class(request.POST, user=request.user)
        if form.is_valid():
            obj = form.save()
            return redirect(reverse(self.success_url_name, args=(obj.child.slug,)))

        return render(request, self.template_name, {
          'form': form
        })


class ChildActivityAddFromTimerView(UserPassesTestMixin, SuccessMessageMixin, BaseChildActivityView):
    success_url_name = 'core:child'

    def test_func(self):
        if self.request.method == 'POST':
            obj = models.Child.objects.get(pk=self.request.POST['child'])
            user_accts = [acct.id for acct in self.request.user.accounts.all()]
            return obj.account.id in user_accts
        return True

    def get_success_message(self, cleaned_data):
        cleaned_data['model'] = self.model._meta.verbose_name.title()
        if 'child' in cleaned_data:
            self.success_message = _('%(model)s entry for %(child)s added!')
        else:
            self.success_message = _('%(model)s entry added!')
        return self.success_message % cleaned_data

    def get(self, request, pk):
        return render(request, self.template_name, {
          'form': self.form_class(user=request.user, timer=pk)
        })

    def post(self, request):
        form = self.form_class(request.POST, user=request.user)
        if form.is_valid():
            obj = form.save()
            return redirect(reverse(self.success_url_name, args=(obj.child.slug,)))

        return render(request, self.template_name, {
          'form': form
        })


class ChildActivityAddListView(ChildActivityTestMixin, SuccessMessageMixin, BaseChildActivityView):
    paginate_by = 10
    success_url_name = 'core:child'

    def get_success_message(self, cleaned_data):
        cleaned_data['model'] = self.model._meta.verbose_name.title()
        if 'child' in cleaned_data:
            self.success_message = _('%(model)s entry for %(child)s added!')
        else:
            self.success_message = _('%(model)s entry added!')
        return self.success_message % cleaned_data

    def get_context_data(self, **kwargs):
        object_list = self.get_queryset()
        if self.request.method == "GET":
            page = self.request.GET.get('page', 1)
            paginator = Paginator(object_list, 5)
            object_list = paginator.get_page(page)

        context = {
          'child': kwargs.get('child', self.get_child()),
          'object_list': object_list
        }
        if 'form' in kwargs:
            context['form'] = kwargs.get('form')
        return context

    def get(self, request, slug):
        child = self.get_child()
        form = self.form_class(child=child)
        context = self.get_context_data(form=form, child=child)
        return render(request, self.template_name, context)

    def post(self, request, slug):
        form = self.form_class(request.POST)
        if form.is_valid():
            obj = form.save()
            return redirect(reverse(self.success_url_name, args=(slug,)))

        context = self.get_context_data(form=form)
        return render(request, self.template_name, context)


class ChildActivityUpdateView(ChildActivityTestMixin, BaseChildActivityView):
    success_url_name = 'core:child'

    def get(self, request, slug, pk):
        child = self.get_child()
        obj = get_object_or_404(self.model, pk=pk)
        context = {
          'child': child,
          'obj': obj,
          'form': self.form_class(instance=obj, child=child)
        }
        return render(request, self.template_name, context)

    def post(self, request, slug, pk):
        obj = get_object_or_404(self.model, pk=pk)
        form = self.form_class(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect(reverse(self.success_url_name, args=(slug,)))

        context = {
          'child': self.get_child(),
          'obj': obj,
          'form': form
        }
        return render(request, self.template_name, context)


class ChildActivityDeleteView(ChildActivityTestMixin, BaseChildActivityView):
    success_url_name = 'core:child'

    def delete(self, request, slug, pk):
        obj = self.model.objects.get(pk=pk)
        obj.delete()
        return redirect(reverse(self.success_url_name, args=(slug,)))


class ChildAdd(LoginRequiredMixin, View):
    form_class = forms.ChildForm
    template_name = 'core/child_form.html'

    def get(self, request):
        if not self.request.user.account.can_add_child():
            messages.error(request, _('Must upgrade account to add child'))
            return redirect(reverse('babybuddy:user-account'))

        return render(request, self.template_name, {
          'form': self.form_class()
        })

    def post(self, request):
        if not self.request.user.account.can_add_child():
            messages.error(request, _('Must upgrade account to add child'))
            return redirect(reverse('babybuddy:user-account'))
        
        form = self.form_class(request.POST)
        if form.is_valid():
            child = form.save(commit=False)
            child.account = request.user.account
            child.save()
            messages.success(request, _('Child added'))
            return redirect(reverse('core:child', args=(child.slug,)))

        messages.error(request, _('Error adding child'))
        return render(request, self.template_name, {
          'form': form
        })



# Figure out how ListView works by filtering by all children by account
# class ChildList(LoginRequiredMixin, BabyBuddyFilterView):
class ChildList(LoginRequiredMixin, ListView):
    # model = models.Child
    template_name = 'core/child_list.html'
    paginate_by = 10
    filterset_fields = ('account__pk', 'first_name', 'last_name')

    def get_queryset(self):
        return models.Child.objects.filter(
                    account__in=self.request.user.accounts.all()
                ).all()


class ChildDetail(ChildActivityTestMixin, DetailView):
    model = models.Child

    def test_func(self):
        child = self.model.objects.get(slug=self.kwargs['slug'])
        return self.request.user.accounts.filter(children__pk=child.id).count() > 0

    def get_context_data(self, **kwargs):
        context = super(ChildDetail, self).get_context_data(**kwargs)
        date = self.request.GET.get('date', str(timezone.localdate()))
        date = timezone.datetime.strptime(date, '%Y-%m-%d')
        date = timezone.localtime(timezone.make_aware(date))
        context['timeline_objects'] = timeline.get_objects(self.object, date)
        context['date'] = date
        context['date_previous'] = date - timezone.timedelta(days=1)
        if date.date() < timezone.localdate():
            context['date_next'] = date + timezone.timedelta(days=1)
        return context


class ChildUpdateView(ChildActivityTestMixin, View):
    model = models.Child
    form_class = forms.ChildForm
    template_name = 'core/child_form.html'
    success_url_name = 'core:child'

    def get(self, request, slug):
        child = self.model.objects.get(slug=slug)
        return render(request, self.template_name, {
          'form': self.form_class(instance=child),
          'child': child
        })

    def post(self, request, slug):
        child = self.model.objects.get(slug=slug)
        form = self.form_class(request.POST, instance=child)
        if form.is_valid():
            form.save()
            return redirect(reverse(self.success_url_name, args=(child.slug,)))
        
        return render(request, self.template_name, {
          'form': form,
          'child': child
        })


class ChildDeleteView(ChildActivityTestMixin, View):
    model = models.Child
    success_url_name = 'dashboard:dashboard'

    def delete(self, request, slug):
        child = self.model.objects.get(slug=slug)
        child.delete()
        return redirect(reverse(self.success_url))


# List and Add Views are going to be the same
# Separate update and delete views

class DiaperChangeQuickAddView(ChildActivityQuickAddView):
    model = models.DiaperChange
    form_class = forms.DiaperChangeQuickAddForm
    template_name = 'core/diaperchange_form.html'


class DiaperChangeAddListView(ChildActivityAddListView):
    model = models.DiaperChange
    template_name = 'core/diaperchange.html'
    form_class = forms.DiaperChangeForm
    success_url_name = 'core:child'


class DiaperChangeUpdateView(ChildActivityUpdateView):
    model = models.DiaperChange
    template_name = 'core/diaperchange_form.html'
    form_class = forms.DiaperChangeForm
    success_url_name = 'core:child'


class DiaperChangeDeleteView(ChildActivityDeleteView):
    model = models.DiaperChange
    success_url_name = 'core:child'


class FeedingQuickAddView(ChildActivityQuickAddView):
    model = models.Feeding
    form_class = forms.FeedingQuickAddForm
    template_name = 'core/feeding_form.html'


class FeedingAddListView(ChildActivityAddListView):
    model = models.Feeding
    # permission_required = ('core.add_feeding',)
    form_class = forms.FeedingForm
    # success_url = reverse_lazy('core:feeding-list')
    template_name = 'core/feeding.html'
    success_url_name = 'core:child'


class FeedingUpdateView(ChildActivityUpdateView):
    model = models.Feeding
    # permission_required = ('core.change_feeding',)
    form_class = forms.FeedingForm
    # success_url = reverse_lazy('core:feeding-list')
    template_name = 'core/feeding_form.html'
    success_url_name = 'core:child'


class FeedingDeleteView(ChildActivityDeleteView):
    model = models.Feeding
    success_url_name = 'core:child'


class NoteQuickAddView(ChildActivityQuickAddView):
    model = models.Note
    form_class = forms.NoteQuickAddForm
    template_name = 'core/note_form.html'


class NoteAddListView(ChildActivityAddListView):
    model = models.Note
    template_name = 'core/note.html'
    form_class = forms.NoteForm
    success_url_name = 'core:child'


class NoteUpdateView(ChildActivityUpdateView):
    model = models.Note
    template_name = 'core/note_form.html'
    form_class = forms.NoteForm
    success_url_name = 'core:child'


class NoteDeleteView(ChildActivityDeleteView):
    model = models.Note
    success_url_name = 'core:child'


class NotificationAddView(LoginRequiredMixin, View):
    template_name = 'core/notification_create.html'
    form_class = forms.NotificationForm

    def get(self, request):
        accounts = request.user.accounts.all()
        children = models.Child.objects.filter(account__in=accounts)
        return render(request, self.template_name, {
            'accounts': accounts,
            'children':children,
            'form': self.form_class(accounts=accounts, children=children)
        })

    def post(self, request):
        account_id = int(request.POST.get('account'))
        account = models.Account.objects.get(pk=account_id)
        is_valid, accounts = helpers.validate_account(
            request.user,
            account=account,
            check_subscription=True
        )

        if not is_valid:
            messages.error(request, _('Cannot add notification at this time.'))
            return redirect(reverse('core:notification-add'))

        # save the notification, check for errors
        children = models.Child.objects.filter(account__in=accounts)
        form = self.form_class(
            request.POST,
            accounts=accounts,
            children=children
        )
        if form.is_valid():
            notification = form.save(commit=False)
            notification.user = request.user
            notification.save()
            messages.success(request, _('Notification successfully created'))
        else:
            messages.error(request, _('Notification failed to be created'))

        return redirect(reverse('core:notification-list'))


class NotificationsListView(LoginRequiredMixin, View):
    template_name = 'core/notification_list.html'
    form_class = forms.NotificationForm

    def get(self, request):
        return render(request, self.template_name, {
            'notifications': models.Notification.objects.filter(account__in=request.user.accounts.all())
        })


class NotificationDetailView(LoginRequiredMixin, View):
    template_name = 'core/notification_detail.html'
    form_class = forms.NotificationForm

    def get(self, request, pk):
        notification = models.Notification.objects.get(pk=pk)
        is_valid, accounts = helpers.validate_account(request.user, obj=notification)

        if not is_valid:
            raise Http404(_("Uh oh could not find that notification."))

        children = models.Child.objects.filter(account__in=accounts)

        return render(request, self.template_name, {
            'notification': notification,
            'children': children,
            'accounts': accounts,
            'form': self.form_class(instance=notification, children=children, accounts=accounts)
        })

    def post(self, request, pk):
        notification = models.Notification.objects.get(pk=pk)
        is_valid, accounts = helpers.validate_account(request.user, obj=notification, check_subscription=True)

        if not is_valid:
            messages.error(request, _('Cannot add notification at this time.'))
            return redirect(reverse('core:notification-detail', args=(notification.id,)))

        # save the notification, check for errors
        children = models.Child.objects.filter(account__in=accounts)
        form = self.form_class(request.POST, instance=notification, accounts=accounts, children=children)
        if form.is_valid():
            form.save()
            messages.success(request, _("Notification successfully updated"))
        else:
            messages.error(request, _("Notification could not be updated"))

        return redirect(reverse('core:notification-detail', args=(notification.id, )))


class SleepQuickAddView(ChildActivityQuickAddView):
    model = models.Sleep
    form_class = forms.SleepQuickAddForm
    template_name = 'core/sleep_form.html'


class SleepAddListView(ChildActivityAddListView):
    model = models.Sleep
    form_class = forms.SleepForm
    template_name = 'core/sleep.html'
    success_url_name = 'core:child'


class SleepUpdateView(ChildActivityUpdateView):
    model = models.Sleep
    template_name = 'core/sleep_form.html'
    form_class = forms.SleepForm
    success_url_name = 'core:sleep'


class SleepDeleteView(ChildActivityDeleteView):
    model = models.Sleep
    success_url_name = 'core:child'


class TemperatureQuickAddView(ChildActivityQuickAddView):
    model = models.Temperature
    form_class = forms.TemperatureQuickAddForm
    template_name = 'core/temperature_form.html'


class TemperatureAddListView(ChildActivityAddListView):
    model = models.Temperature
    form_class = forms.TemperatureForm
    template_name = 'core/temperature.html'
    success_url_name = 'core:child'


class TemperatureUpdateView(ChildActivityUpdateView):
    model = models.Temperature
    success_url_name = 'core:temperature'
    form_class = forms.TemperatureForm
    template_name = 'core/temperature_form.html'


class TemperatureDeleteView(ChildActivityDeleteView):
    model = models.Temperature
    success_url_name = 'core:child'


class TimerDetailView(LoginRequiredMixin, View):
    model = models.Timer
    template_name = 'core/timer_detail.html'

    def get(self, request, pk):
        timer = models.Timer.objects.get(pk=pk)
        accounts = request.user.accounts.all()

        acct_ids = {acct.id for acct in accounts.all()}

        if timer.account.id not in acct_ids:
            raise Http404(_("Uh oh could not find that timer."))

        return render(request, self.template_name, {
          'timer': timer,
          'children': models.Child.objects.filter(account__in=accounts),
          'accounts': accounts
        })


class TimerAddListView(ChildActivityAddListView):
    model = models.Timer
    form_class = forms.TimerForm
    success_url_name = 'core:child'
    template_name = 'core/timer.html'


class TimerUpdateView(ChildActivityUpdateView):
    model = models.Timer
    form_class = forms.TimerForm
    success_url_name = 'core:child'
    template_name = 'core/timer_form.html'


class TimerDeleteView(ChildActivityDeleteView):
    model = models.Timer
    success_url_name = 'core:child'


class TimerListView(LoginRequiredMixin, View):
    def get(self, request):
        timers = models.Timer.objects.filter(account__in=request.user.accounts.all())
        return render(request, 'core/timer_list.html', {
          'timers': timers
        })


class TimerQuickAddView(LoginRequiredMixin, View):
    model = models.Timer
    template_name = 'core/timer_detail.html'

    def get(self, request, *args, **kwargs):
        accounts = request.user.accounts.all()
        can_start_timer = True
        return render(request, self.template_name, {
          'children': models.Child.objects.filter(account__in=accounts),
          'accounts': accounts
        })


class TimerCompleteView(UserPassesTestMixin, View):
    def test_func(self):
        timer = models.Timer.objects.get(id=self.kwargs['pk'])
        user_accts = {acct.id for acct in self.request.user.accounts.all()}
        return timer.account.id in user_accts

    def get(self, request, *args, **kwargs):
        timer = models.Timer.objects.get(id=kwargs['pk'])
        timer.stop()
        messages.success(request, '{} complete.'.format(timer))

        if timer.child is None:
            return redirect(reverse('core:timer-list'))

        start = timer.end + (-1 * timer.duration)

        if timer.is_sleeping:
            sleep = models.Sleep.objects.create(
                child=timer.child,
                start=start,
                duration=timer.duration,
                end=timer.end
            )
            return redirect(reverse('core:child', args=(timer.child.slug,)))

        elif timer.is_feeding:
            feeding = models.Feeding.objects.create(
                child=timer.child,
                start=start,
                duration=timer.duration,
                end=timer.end
            )
            return redirect(reverse('core:feeding-update', args=(timer.child.slug, feeding.id,)))

        elif timer.is_tummytime:
            tummytime = models.TummyTime.objects.create(
                child=timer.child,
                start=start,
                duration=timer.duration,
                end=timer.end
            )
            return redirect(reverse('core:child', args=(timer.child.slug,)))
        
        return redirect(reverse('core:timer-list'))


class FeedingAddFromTimerView(ChildActivityAddFromTimerView):
      model = models.Feeding
      form_class = forms.FeedingQuickAddForm
      template_name = 'core/feeding_form.html'


class SleepAddFromTimerView(ChildActivityAddFromTimerView):
      model = models.Feeding
      form_class = forms.SleepQuickAddForm
      template_name = 'core/sleep_form.html'


class TummyTimeAddFromTimerView(ChildActivityAddFromTimerView):
      model = models.Feeding
      form_class = forms.TummyTimeQuickAddForm
      template_name = 'core/tummytime_form.html'


class TummyTimeQuickAddView(ChildActivityQuickAddView):
    model = models.TummyTime
    form_class = forms.TummyTimeQuickAddForm
    template_name = 'core/tummytime_form.html'


class TummyTimeAddListView(ChildActivityAddListView):
    model = models.TummyTime
    form_class = forms.TummyTimeForm
    success_url_name = 'core:child'
    template_name = 'core/tummytime.html'


class TummyTimeUpdateView(ChildActivityUpdateView):
    model = models.TummyTime
    form_class = forms.TummyTimeForm
    success_url_name = 'core:child'
    template_name = 'core/tummytime_form.html'


class TummyTimeDeleteView(ChildActivityDeleteView):
    model = models.TummyTime
    success_url_name = 'core:child'


class WeightQuickAddView(ChildActivityQuickAddView):
    model = models.Weight
    form_class = forms.WeightQuickAddForm
    template_name = 'core/weight_form.html'


class WeightAddListView(ChildActivityAddListView):
    model = models.Weight
    form_class = forms.WeightForm
    template_name = 'core/weight.html'
    success_url_name = 'core:child'


class WeightUpdateView(ChildActivityUpdateView):
    model = models.Weight
    form_class = forms.WeightForm
    success_url_name = 'core:child'
    template_name = 'core/weight_form.html'


class WeightDeleteView(ChildActivityDeleteView):
    model = models.Weight
    success_url_name = reverse_lazy('core:weight')
