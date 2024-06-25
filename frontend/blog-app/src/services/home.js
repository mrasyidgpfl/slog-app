const API_URL = "http://localhost:8000/api"; // Base API URL

export const fetchBlogPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/blogs/`);
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    const data = await response.json();

    // Fetch likes and comments for each blog post
    const postsWithLikesAndComments = await Promise.all(
      data.map(async (post) => {
        // Fetch likes count
        const likesResponse = await fetch(
          `${API_URL}/blog-likes/count/${post.id}/`,
        );
        const likesData = await likesResponse.json();
        const likesCount = likesData.like_count;

        // Fetch comments count
        const commentsResponse = await fetch(
          `${API_URL}/comments/count/${post.id}/`,
        );
        const commentsData = await commentsResponse.json();
        const commentsCount = commentsData.comment_count;

        // Return updated post object with likes and comments count
        return {
          id: post.id.toString(),
          title: "Title " + post.id,
          content: post.content,
          media: post.image,
          likes_count: likesCount,
          comments_count: commentsCount,
        };
      }),
    );

    return postsWithLikesAndComments;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};
