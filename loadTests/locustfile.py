import time
from locust import HttpUser, task
import common.posts as posts #TODO add it in common folder
import common.blockchain-interactor as bc #TODO add it in common folder
import common.checker as checker #TODO add it in common folder
import common.orchestrator as orchestrator #TODO add it in common folder

class User(HttpUser):
    
    wait_time = between(1,3)
    # POSTS
    @task
    def get_posts(self):
     posts.post_list(self)