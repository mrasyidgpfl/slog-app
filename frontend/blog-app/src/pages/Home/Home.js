import React, { useEffect, useState } from "react";
import { Grid, Box, Container } from "@mui/material";
import BlogPost from "../Blog/BlogPost";
import { fetchBlogPosts } from "../../services/blogs";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBlogPosts();
      setPosts(data);
    };
    fetchData();
    console.log(posts);
  }, []);

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
              <BlogPost
                post={post}
                likesCount={post.likes_count} // Pass likes_count as prop
                commentsCount={post.comments_count} // Pass comments_count as prop
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
