import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Container,
  Snackbar,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import BlogPost from "../Blog/BlogPost";
import { fetchBlogPosts } from "../../services/blogs";
import {
  fetchCategories,
  fetchBlogsByCategories,
} from "../../services/categories";
import { useSelector, useDispatch } from "react-redux";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";
import {
  selectCategory,
  deselectCategory,
} from "../../redux/slices/categorySlices";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { accessToken, refreshToken } = useSelector((state) => state.auth);
  const { selectedCategories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categoryButtons, setCategoryButtons] = useState([]);
  const [noPostsMessage, setNoPostsMessage] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("userId:", userId);

    const fetchData = async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to fetch blog posts");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
          // Handle error refreshing access token (e.g., log out user)
        }
      }
    };

    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch]);

  useEffect(() => {
    const fetchAndFilterPosts = async () => {
      try {
        const blogCategories = await fetchBlogsByCategories();

        // Create an array of blog IDs for each selected category
        const filteredBlogIds = selectedCategories.map((selectedCat) =>
          blogCategories
            .filter((item) => item.category === selectedCat)
            .map((item) => item.blog),
        );

        // Find intersection of blog IDs (posts that have all selected categories)
        let filteredBlogIdsIntersection =
          filteredBlogIds.length > 0 ? filteredBlogIds[0] : [];
        for (let i = 1; i < filteredBlogIds.length; i++) {
          filteredBlogIdsIntersection = filteredBlogIdsIntersection.filter(
            (id) => filteredBlogIds[i].includes(id),
          );
        }

        // Filter posts based on filtered blog IDs intersection
        const filteredPosts = posts.filter((post) =>
          filteredBlogIdsIntersection.includes(post.id),
        );

        setFilteredPosts(filteredPosts);

        // Set message when no posts match selected categories
        if (selectedCategories.length > 0 && filteredPosts.length === 0) {
          setNoPostsMessage(
            `Sorry, no blog with ${
              selectedCategories.length > 1
                ? "these categories"
                : "this category"
            } yet.`,
          );
        } else {
          setNoPostsMessage("");
        }
      } catch (error) {
        console.error("Error fetching or filtering posts:", error);
        setError("Failed to fetch or filter posts");
      }
    };

    if (posts.length > 0) {
      if (selectedCategories.length > 0) {
        fetchAndFilterPosts();
      } else {
        // Show all posts if no categories are selected
        setFilteredPosts(posts);
        setNoPostsMessage("");
      }
    }
  }, [posts, selectedCategories]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategoryButtons(
          categoriesData.map((category) => ({
            id: category.id,
            name: category.category_name,
            selected: selectedCategories.includes(category.id),
          })),
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, [selectedCategories]);

  const handleSnackbarClose = () => {
    setError(null); // Clear error state when Snackbar closes
  };

  const handleCategorySelect = (categoryId, selected) => {
    if (selected) {
      dispatch(selectCategory(categoryId));
    } else {
      dispatch(deselectCategory(categoryId));
    }
  };

  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px",
          flex: 1,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }} // Stack vertically on xs, horizontally on sm and up
          spacing={1}
          flexWrap="wrap"
          sx={{ padding: "10px" }}
        >
          {categoryButtons.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() =>
                handleCategorySelect(category.id, !category.selected)
              }
              color={category.selected ? "primary" : "default"}
              variant={category.selected ? "filled" : "outlined"}
              sx={{ cursor: "pointer", mb: 1 }} // Add margin-bottom for spacing
            />
          ))}
        </Stack>
        {filteredPosts.length === 0 && (
          <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>
            {noPostsMessage}
          </Typography>
        )}
        <Grid container direction="column" spacing={3}>
          {filteredPosts.map((post) => (
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
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={`Error: ${error}`}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default Home;
