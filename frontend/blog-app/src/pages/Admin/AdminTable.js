import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchAdminBlogPosts,
  updateBlogPost,
  deleteBlogPost,
} from "../../services/blogs";
import { fetchProfiles } from "../../services/profile";
import { useNavigate } from "react-router-dom";

const AdminTable = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchData();
    fetchProfilesData();
    console.log("PROFILESSS", profiles);
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

  const fetchProfilesData = async () => {
    try {
      const profilesData = await fetchProfiles();
      setProfiles(profilesData);
    } catch (error) {
      console.error("Error fetching profiles:", error);
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

  const blogColumns = [
    { field: "id", headerName: "Blog ID", width: 100 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "created_datetime", headerName: "Created At", width: 180 },
    { field: "updated_datetime", headerName: "Updated At", width: 180 },
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
            sx={{
              mr: 2,
              backgroundColor: params.row.hidden ? "#ffff00" : "#00e676",
            }}
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

  const profileColumns = [
    { field: "id", headerName: "User ID", width: 100 },
    { field: "first_name", headerName: "First Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "bio", headerName: "Bio", width: 300 },
    {
      field: "image",
      headerName: "Image URL",
      width: 150,
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
          marginBottom: "20px",
        }}
      >
        <h2>Blog Posts</h2>
        <DataGrid
          rows={blogPosts}
          columns={blogColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px",
          flex: 1,
        }}
      >
        <h2>User Profiles</h2>
        <DataGrid
          rows={profiles}
          columns={profileColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default AdminTable;
