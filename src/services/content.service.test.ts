import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contentService } from './content.service';
import { createMockSupabaseClient } from '../test/mocks/supabase.mock';

describe('content.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().mockResolvedValue({
        data: [{ id: '1', title: 'Test Project' }],
        error: null,
      });

      const projects = await contentService.getProjects();
      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('should handle errors', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().mockResolvedValue({
        data: null,
        error: { message: 'Error fetching projects' },
      });

      await expect(contentService.getProjects()).rejects.toThrow();
    });
  });

  describe('getProject', () => {
    it('should fetch project by ID', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().eq().single().mockResolvedValue({
        data: { id: '1', title: 'Test Project' },
        error: null,
      });

      const project = await contentService.getProject('1');
      expect(project).toBeDefined();
    });

    it('should fetch project by slug', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().eq().single().mockResolvedValue({
        data: { id: '1', slug: 'test-project', title: 'Test Project' },
        error: null,
      });

      const project = await contentService.getProject('test-project');
      expect(project).toBeDefined();
    });
  });

  describe('getArticles', () => {
    it('should fetch articles successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().mockResolvedValue({
        data: [{ id: '1', title: 'Test Article' }],
        error: null,
      });

      const articles = await contentService.getArticles();
      expect(articles).toBeDefined();
    });
  });

  describe('getArticle', () => {
    it('should fetch article by slug', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().eq().single().mockResolvedValue({
        data: { id: '1', slug: 'test-article', title: 'Test Article' },
        error: null,
      });

      const article = await contentService.getArticle('test-article');
      expect(article).toBeDefined();
    });
  });

  describe('getExperiments', () => {
    it('should fetch experiments successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from().select().mockResolvedValue({
        data: [{ id: '1', name: 'Test Experiment' }],
        error: null,
      });

      const experiments = await contentService.getExperiments();
      expect(experiments).toBeDefined();
    });
  });
});
