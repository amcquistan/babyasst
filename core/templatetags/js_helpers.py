# -*- coding: utf-8 -*-
import json
from django import template

register = template.Library()

@register.filter
def to_js(value):
    return json.dumps(value)


@register.filter
def js_bool(value):
    if bool(value):
        return json.dumps(True)
    return json.dumps(False)
