import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchAdminBlogPosts,
  updateBlogPost,
  deleteBlogPost,
} from "../../services/blogs";
import { useNavigate } from "react-router-dom";

const AdminTable = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const posts = await fetchAdminBlogPosts(accessToken);
      // Sort posts by created_datetime in descending order
      posts.sort(
        (a, b) => new Date(b.created_datetime) - new Date(a.created_datetime),
      );
      setBlogPosts(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleOpenBlog = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleHideUnhideBlog = async (blog, currentStatus) => {
    try {
      const updatedData = {
        content: blog.content,
        image: blog.image,
        draft: blog.draft,
        hidden: !currentStatus,
      }; // Toggle the 'hidden' status
      await updateBlogPost(blog.id, updatedData, accessToken);
      // Refresh the blog posts after update
      fetchData();
    } catch (error) {
      console.error("Error hiding/unhiding blog:", error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteBlogPost(id, accessToken);
      // Refresh the blog posts after delete
      fetchData();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Blog ID", width: 100 },
    { field: "title", headerName: "Title", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ mr: 2, backgroundColor: "#2196f3" }}
            onClick={() => handleOpenBlog(params.row.id)}
          >
            Open Blog
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 2, backgroundColor: "#00e676" }}
            onClick={() => handleHideUnhideBlog(params.row, params.row.hidden)}
          >
            {params.row.hidden ? "Unhide" : "Hide"}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteBlog(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

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
        <DataGrid
          rows={blogPosts}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default AdminTable;
