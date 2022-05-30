from locust import HttpUser, task, between
import common.posts as posts #TODO add it in common folder
# import common.blockchain_interactor as bc #TODO add it in common folder
# import common.checker as checker #TODO add it in common folder
# import common.orchestrator as orchestrator #TODO add it in common folder

class User(HttpUser):
    wait_time = between(1,3)

    @task
    def list_posts(self):
        posts.list_posts(self)

    @task
    def get_post_by_id(self):
        posts.get_post_by_id(self)

    # @task
    # def add_post(self):
    #     postsssss.add_post(self)