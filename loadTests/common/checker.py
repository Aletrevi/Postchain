from json import JSONDecodeError
import random

checker_base_url = 'http://localhost:9234/checker'

def check_post(self):
  with self.client.get(checker_base_url, catch_response=True) as response:
    response = response.json()
    _post = random.choice(response)
    return self.client.get(checker_base_url, params=_post.text, catch_response=True)