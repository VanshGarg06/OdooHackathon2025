from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('', NotificationListView.as_view()),
    path('mark-as-read/', MarkAllReadView.as_view()),
]
