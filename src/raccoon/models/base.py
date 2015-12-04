from motorengine import Document


class BaseModel(Document):

    def to_son(self):
        result = super(Document, self).to_son()
        result['id'] = self._id
        return result