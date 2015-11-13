from __future__ import absolute_import

from motorengine import Document, UUIDField, StringField, DateTimeField, JsonField 


class Connector(Document):
    __collection__ = 'connectors'

    id = UUIDField()
    name = StringField(required=True)
    config = JsonField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

