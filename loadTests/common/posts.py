from json import JSONDecodeError
import random
import string

posts_base_url = '/api/posts'

def list_posts(self):
    return self.client.get(posts_base_url, catch_response=True)

def get_post_by_id(self):
     with self.client.get(posts_base_url, catch_response=True) as response:
        try:
            response = response.json()
            post = random.choice(response)
            return self.client.get(
                f'{posts_base_url}/{post["_id"]}', name=f"{posts_base_url}/booking_id", catch_response=True)
        except JSONDecodeError:
            response.failure("Response could not be decoded as JSON")
        except KeyError:
            response.failure(
                "Response did not contain expected key booking.id")

def add_post(self):
    post_data = generate_random_post_data(self)
    return self.client.post(posts_base_url, json=post_data)

def generate_random_post_data(self):
    letters = string.ascii_letters
    author = ''.join(random.choice(letters) for i in range(10))
    title = ''.join(random.choice(letters) for i in range(10))
    body = ''.join(random.choice(letters) for i in range(10))

    return {"author": author, "title": title, "body": body}
