import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './CategoryService';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
    let service: CategoryService;
    let categoryRepository;
    let userRepository;


    const mockCategoryRepository = {
        create: jest.fn(),
        update: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryService, {
                provide: getRepositoryToken(Category),
                useValue: mockCategoryRepository,
            }, {
                provide: getRepositoryToken(User),
                useValue: mockUserRepository,
            }],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        categoryRepository = module.get(getRepositoryToken(Category));
        userRepository = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('create', () => {
        it('should create a category sucessfuly', async ()=> {
            const mockUser = { id: 1, name : 'Teste user'};
            const mockCategory = {
                title: 'teste Category',
                description: 'teste description',
                ownerId: 1
            }

            userRepository.findOne.mockResolvedValue(mockUser);
            categoryRepository.create.mockReturnValue(mockCategory);
            categoryRepository.save.mockResolvedValue({ ...mockCategory, id: 1});

            const result = await service.create(mockCategory);

            expect(result).toHaveProperty('id', 1);
            expect(result.title).toBe(mockCategory.title);
        });

        it('should throw nofoundexception user not found', async ()=> {
            const mockCategory = {
                title: 'teste Category',
                description: 'teste description',
                ownerId: 1
            }

            userRepository.findOne.mockResolvedValue(null);

            await expect(
                service.create(mockCategory)
            ).rejects.toThrow(NotFoundException);
        });
    });
});
