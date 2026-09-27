from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


# Create your models here.

def validate_image_size(image):
    max_size_mb = 2
    if image.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"이미지 크기는 최대 {max_size_mb}MB까지 업로드 가능합니다.")

STATUS_CHOICES = [
    ('pending',     '대기'),
    ('in_progress', '처리중'),
    ('resolved',    '완료'),
]

class Contact(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=100)
    content = models.TextField(max_length=2000)
    reply_to = models.CharField(blank=True, null=True, max_length=50)
    published_date = models.DateTimeField()
    image   = models.ImageField(blank=True, null=True, validators=[validate_image_size])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    ip=models.GenericIPAddressField()
    user_agent=models.CharField(max_length=256, blank=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.subject
