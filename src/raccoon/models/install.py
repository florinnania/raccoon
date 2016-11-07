from __future__ import absolute_import

from motorengine import DateTimeField, ReferenceField

from . import BaseModel, Build, Environment, Project, Task


class Install(BaseModel):
    __collection__ = 'installs'

    build = ReferenceField(required=True, reference_document_type=Build)
    environment = ReferenceField(required=True,
                                 reference_document_type=Environment)
    project = ReferenceField(required=True, reference_document_type=Project)
    task = ReferenceField(reference_document_type=Task)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
