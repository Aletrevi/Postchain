import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Posts } from './schemas/post.schema';
import { Model } from 'mongoose';

const mockPost = {
  title: 'Cat #1',
  body: 'Breed #1',
  author: 'Saadat',
};

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<Posts>;

  const postsArray = [
    {
      title: 'Cat #1',
      body: 'Breed #1',
      author: 'Trevi',
    },
    {
      title: 'Cat #2',
      body: 'Breed #2',
      author: 'Vardanega',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken('Posts'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockPost),
            constructor: jest.fn().mockResolvedValue(mockPost),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get<Model<Posts>>(getModelToken('Posts'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all posts', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(postsArray),
    } as any);
    const posts = await service.findAll();
    expect(posts).toEqual(postsArray);
  });

  it('should insert a new posts', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        title: 'Cat #1',
        body: 'Breed #1',
        author: 'Saadat',
      }),
    );
    const newPost = await service.create({
      title: 'Cat #1',
      body: 'Breed #1',
      author: 'Saadat',
    });
    expect(newPost).toEqual(mockPost);
  });
});
