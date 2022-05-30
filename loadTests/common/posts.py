from json import JSONDecodeError
import random
import string

posts_base_url = '/posts'

def list_posts(self):
    return self.client.get('http://localhost:9232/posts')

def get_post_by_id(self):
     with self.client.get(posts_base_url, catch_response=True) as response:
        response = response.json()
        print(response)
        post = random.choice(response)
        return self.client.get(
            f'{posts_base_url}/{post["_id"]}', name=f"{posts_base_url}/booking_id", catch_response=True)

# def add_post(self):
#     post_data = generate_random_post_data(self)
#     return self.client.post(posts_base_url, json=post_data)

# def generate_random_post_data(self):
#     letters = string.ascii_letters
#     author = ''.join(random.choice(letters) for i in range(10))
#     title = ''.join(random.choice(letters) for i in range(10))
#     body = ''.join(random.choice(letters) for i in range(10))

#     return {"author": author, "title": title, "body": body}
