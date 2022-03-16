import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './post.controller';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './post.service';

describe('Posts Controller', () => {
  let controller: PostsController;
  let service: PostsService;
  const createPostDto: CreatePostDto = {
    title: 'Cat #1',
    body: 'Breed #1',
    author: 'Saadat',
  };

  const mockPost = {
    title: 'Cat #1',
    body: 'Breed #1',
    author: 'Saadat',
    _id: 'a id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                title: 'Cat #1',
                body: 'Breed #1',
                author: 'Saadat',
              },
              {
                title: 'Cat #2',
                body: 'Breed #2',
                author: 'Trevi',
              },
              {
                title: 'Cat #3',
                body: 'Breed #3',
                author: 'Vardanega',
              },
            ]),
            create: jest.fn().mockResolvedValue(createPostDto),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  describe('create()', () => {
    it('should create a new post', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockPost);

      await controller.create(createPostDto);
      expect(createSpy).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of posts', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          title: 'Cat #1',
          body: 'Breed #1',
          author: 'Saadat',
        },
        {
          title: 'Cat #2',
          body: 'Breed #2',
          author: 'Trevi',
        },
        {
          title: 'Cat #3',
          body: 'Breed #3',
          author: 'Vardanega',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
