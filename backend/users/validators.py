import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class AlphaNumericValidator:
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(_("Password must contain at least 8 alphanumeric characters."))

        letters = len(re.findall(r"[A-Za-z]", password))
        numbers = len(re.findall(r"\d", password))

        if letters < 4:
            raise ValidationError(_("Password must contain at least 4 letters"))
        if numbers < 3:
            raise ValidationError(_("Password must contain at least 3 numbers"))

    def get_help_text(self):
        return _(
            "Password must be at least 8 alphanumeric characters"
        )
