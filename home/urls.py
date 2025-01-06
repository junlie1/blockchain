from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('add_transaction/', views.add_transaction, name="add_transaction"),
    path('mine_block/', views.mine_block, name="mine_block"),
    path('validate_chain/', views.validate_chain, name="validate_chain"),
    path('reset_blockchain/', views.reset_blockchain, name='reset_blockchain'),
    path('edit_block/<int:index>/', views.edit_block, name='edit_block')
]
