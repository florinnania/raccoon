from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Action

log = logging.getLogger(__name__)

class ActionsController(BaseController):
    """
    Actions Controller
    """
    model = Action
