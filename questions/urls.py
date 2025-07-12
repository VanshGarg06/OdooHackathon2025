from django.contrib import admin
from django.urls import path


urlpatterns = [
    path('', QuestionListCreateView.as_view()),     # GET all or POST new
    path('<int:id>/', QuestionDetailView.as_view()), # GET, PUT, DELETE
    path('<int:id>/answer/', AnswerCreateView.as_view()),
    path('<int:id>/accept/<int:answer_id>/', AcceptAnswerView.as_view()),
]
