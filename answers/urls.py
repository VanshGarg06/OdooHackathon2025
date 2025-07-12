from django.contrib import admin
from django.urls import path


urlpatterns = [
    path('<int:id>/vote/', VoteAnswerView.as_view()),  # POST upvote/downvote
    path('<int:id>/', AnswerDetailView.as_view()),     # optional for edit/delete
]
