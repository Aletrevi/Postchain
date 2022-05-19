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
        posts.findAll(self)
    @task
    def get_posts(self):
        posts.findOne(self)
    @task
    def create_post(self):
        posts.create(self)

    # CHECKER
    @task
    def check_post(self):
        checker.checkPost(self)
    
    #BLOCKCHAIN_INTERACTOR
    @task
    def publish_block(self):
        bc.create(self)
    @task
    def delete_block(self):
        bc.remove(self)
    @task
    def find_block(self):
        bc.findOne(self)
    @task
    def find_blocks(self):
        bc.findAll(self)
    @task
    def find_transaction(self):
        bc.findTransaction(self)
     @task
    def send_transaction(self):
        bc.findTransaction(self)