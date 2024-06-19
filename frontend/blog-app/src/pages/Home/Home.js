import React from "react";
import { Grid, Box, Container } from "@mui/material";
import BlogPost from "../Blog/BlogPost";

const Home = () => {
  // Mock data for demonstration
  const posts = [
    {
      id: "1",
      title: "Exciting News!",
      content: "Check out our latest updates on the blog!",
      media: "https://example.com/image.jpg",
      likes_count: "1600",
      comments_id: "3",
    },
    {
      id: "2",
      title: "New Feature Released!",
      content:
        "Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. Learn about the new features we've just launched. ",
      likes_count: "1200",
      comments_id: "7",
    },
    {
      id: "2",
      title: "New Feature Released!",
      content: "Learn about the new features we've just launched.",
      media: "https://example.com/image.jpg",
      likes_count: "1200",
      comments_id: "7",
    },
    {
      id: "2",
      title: "New Feature Released!",
      content: "Learn about the new features we've just launched.",
      media: "https://example.com/image.jpg",
      likes_count: "1200",
      comments_id: "7",
    },
    {
      id: "2",
      title: "New Feature Released!",
      content: "Learn about the new features we've just launched.",
      media: "https://example.com/image.jpg",
      likes_count: "1200",
      comments_id: "7",
    },
    {
      id: "2",
      title: "New Feature Released!",
      content: "Learn about the new features we've just launched.",
      media: "https://example.com/image.jpg",
      likes_count: "1200",
      comments_id: "7",
    },
  ];

  return (
    <Container>
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px 20px",
        }}
      >
        <Grid container direction="column" spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <BlogPost post={post} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
