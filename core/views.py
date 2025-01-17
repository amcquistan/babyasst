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

from babybuddy.mixins import PermissionRequired403Mixin, ChildActivityTestMixin, ChildCreationTestMixin
from babybuddy.views import BabyBuddyFilterView
from core import forms, helpers, models, timeline


class BaseChildActivityView(LoginRequiredMixin, View):
    def get_queryset(self):
        return self.model.objects.filter(child__slug=self.kwargs.get('slug'))

    def get_child(self):
        try:
            self.child = models.Child.objects.get(slug=self.kwargs.get('slug'))
        except models.Child.model.DoesNotExist:
            raise Http404(_("Uh oh something unexpected happended."))

        return self.child


class ChildActivityAddFromTimerView(UserPassesTestMixin, SuccessMessageMixin, BaseChildActivityView):
    success_url_name = 'core:child'

    def test_func(self):
        if self.request.method == 'POST':
            obj = models.Child.objects.get(pk=self.request.POST['child'])
            try:
              acct_member_settings = obj.account.account_member_settings.get(user=self.request.user)
              return acct_member_settings.is_active and obj.is_active
            except:
                pass

        return False

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
        context = {
          'child': kwargs.get('child', self.get_child())
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
        acct = self.request.user.account
        if not acct.can_add_child():
            messages.error(request, _('Must upgrade account to add child'))
            return redirect(reverse('babybuddy:user-account'))
        
        form = self.form_class(request.POST)
        if form.is_valid():
            child = form.save(commit=False)
            child.account = acct
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


class ChildDeleteView(LoginRequiredMixin, View):
    model = models.Child
    success_url_name = 'dashboard:dashboard'

    def post(self, request, slug):
        child = self.model.objects.get(slug=slug)
        if request.user.account.id != child.account.id:
            messages.error(request, _('Action only available to child account owner'))
            return redirect(reverse(self.success_url_name))

        child.delete()
        messages.success(request, _('Child has been deleted'))
        return redirect(reverse(self.success_url_name))


class ChildDeactivateView(LoginRequiredMixin, View):
    model = models.Child
    success_url_name = 'dashboard:dashboard'

    def post(self, request, slug):
        child = self.model.objects.get(slug=slug)

        if request.user.account.id != child.account.id:
            messages.error(request, _('Action only available to child account owner'))
            return redirect(reverse(self.success_url_name))

        child.is_active = False
        child.save()

        messages.success(request, _('Child has been deactivated'))
        return redirect(reverse(self.success_url_name))


class ChildActivateView(LoginRequiredMixin, View):
    model = models.Child
    success_url_name = 'dashboard:dashboard'

    def post(self, request, slug):
        child = self.model.objects.get(slug=slug)

        if request.user.account.id != child.account.id:
            messages.error(request, _('Action only available to child account owner'))
            return redirect(reverse(self.success_url_name))

        if not request.user.account.can_add_child():
            messages.error(request, _('Must upgrade service to activate child'))
            return redirect(reverse('babybuddy:user-account'))

        child.is_active = True
        child.save()

        messages.success(request, _('Child has been activated'))
        return redirect(reverse(self.success_url_name))

# List and Add Views are going to be the same
# Separate update and delete views

class BathAddListView(ChildActivityAddListView):
    model = models.Bath
    template_name = 'core/bath.html'
    form_class = forms.BathForm
    success_url_name = 'core:child'


class DiaperChangeAddListView(ChildActivityAddListView):
    model = models.DiaperChange
    template_name = 'core/diaperchange.html'
    form_class = forms.DiaperChangeForm
    success_url_name = 'core:child'


class FeedingAddListView(ChildActivityAddListView):
    model = models.Feeding
    form_class = forms.FeedingForm
    template_name = 'core/feeding.html'
    success_url_name = 'core:child'


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


class SleepAddListView(ChildActivityAddListView):
    model = models.Sleep
    form_class = forms.SleepForm
    template_name = 'core/sleep.html'
    success_url_name = 'core:child'


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
        return render(request, 'core/timer.html', {
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

        if timer.is_sleeping :
            sleep = models.Sleep.objects.create(
                child=timer.child,
                start=start,
                duration=timer.duration,
                end=timer.end
            )
            return redirect(reverse('core:child', args=(timer.child.slug,)))

        elif timer.is_feeding:
            return redirect(reverse('core:child', args=(timer.child.slug,)))

        elif timer.is_tummytime:
            tummytime = models.TummyTime.objects.create(
                child=timer.child,
                start=start,
                duration=timer.duration,
                end=timer.end
            )
            return redirect(reverse('core:child', args=(timer.child.slug,)))
        
        return redirect(reverse('core:timer-list'))


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
