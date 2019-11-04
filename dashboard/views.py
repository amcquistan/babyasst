# -*- coding: utf-8 -*-
from django.contrib.auth.mixins import LoginRequiredMixin
# from django.http import HttpResponseRedirect
# from django.urls import reverse, redirect
# from django.views.generic.base import TemplateView
# from django.views.generic.detail import DetailView
from django.shortcuts import render, redirect, reverse
from django.views import View

from babybuddy.mixins import PermissionRequired403Mixin, AccountMemberRequiredMixin
from core.models import Child


class Dashboard(LoginRequiredMixin, View):

    # Show the overall dashboard or a child dashboard if one Child instance.
    def get(self, request):
        children = Child.objects.filter(
                          account__in=self.request.user.accounts.all()
                      ).all()
        children_cnt = len(children)
        if children_cnt == 0:
            return redirect(reverse('babybuddy:welcome'))

        elif children_cnt == 1:

            child = children[0]
            return redirect(reverse('core:child', args=(child.slug,)))

        children = sorted(children, key=lambda c: (c.account.name.lower(), c.last_name, c.first_name))
        return render(request, 'dashboard/dashboard.html', {'children': children})

    # def get_context_data(self, **kwargs):
    #     context = super(Dashboard, self).get_context_data(**kwargs)
    #     children = []
    #     for account in 
    #     context['children'] = Child.objects.order_by('last_name', 'first_name', 'id')
    #     return context

# class ChildDashboard(PermissionRequired403Mixin, DetailView):
#     model = Child
#     permission_required = ('core.view_child',)
#     raise_exception = True
#     template_name = 'dashboard/child.html'

class ChildDashboard(AccountMemberRequiredMixin, View):

    def test_func(self):
        child = Child.objects.get(slug=self.kwargs['slug'])
        return self.request.user.accounts.filter(children__pk=child.id).count() > 0

    def get(self, request, slug):
        child = Child.objects.get(slug=slug)
        return render(request, 'dashboard/child.html', {'object': child})
