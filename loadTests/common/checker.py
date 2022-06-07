from json import JSONDecodeError
import random
import os

checker_base_url = 'http://localhost:9234/checker'
posts_base_url = 'http://localhost:9232/posts'

def check_post(self):
  with self.client.get(posts_base_url, catch_response=True) as response:
    try:
      response = response.json()
      _post = random.choice(response)
      example = {"title": _post["title"], "body": _post["body"], "author": _post["author"]}
      return self.client.get(checker_base_url, params=example)
    except JSONDecodeError:
      os.write(1, "fails".encode())
