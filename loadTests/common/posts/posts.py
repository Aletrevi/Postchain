import json from JSONDECODE

posts_base_url = '/api/posts'


def post_list(self):
    return self.client.get(posts_base_url, catch_response=True)

#def add_post(self):
    