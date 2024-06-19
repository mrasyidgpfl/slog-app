import { restApi } from '../services/api';

export const fetchPosts = async () => {
  try {
    const response = await restApi.get('posts/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch posts');
  }
};

export const createPost = async (postData) => {
  try {
    const response = await restApi.post('posts/', postData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create post');
  }
};

// Implement other CRUD operations for posts as needed
