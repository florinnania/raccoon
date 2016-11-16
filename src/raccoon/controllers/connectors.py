import logging

from . import BaseController
from ..models import Connector

log = logging.getLogger(__name__)


class ConnectorsController(BaseController):
    """
    Connectors Controller
    """
    model = Connector
    audit_logs = True
