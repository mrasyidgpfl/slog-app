import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { fetchCategories } from "../../services/categories";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategory,
  deselectCategory,
  selectSelectedCategories,
} from "../../redux/slices/categorySlices";

const Categories = ({ drawerOpen, setDrawerOpen }) => {
  const [categories, setCategories] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedCategories = useSelector(selectSelectedCategories);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      dispatch(deselectCategory(categoryId));
    } else {
      dispatch(selectCategory(categoryId));
    }
    // Keep the drawer open after category selection
    // setDrawerOpen(true); // Optionally keep the drawer open
  };

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: 390 }}>
        <Typography variant="h6" component="div" sx={{ padding: 2 }}>
          Categories
        </Typography>
        <List
          sx={{
            borderTop: `1px solid ${theme.palette.primary.main}`,
            borderBottom: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          {categories.map((category) => (
            <ListItem
              component="button"
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                width: "95%",
                padding: 1,
                ml: 1,
                my: 2,
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: selectedCategories.includes(category.id)
                  ? theme.palette.primary.main
                  : "white",
                color: selectedCategories.includes(category.id)
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
                cursor: "pointer", // Add mouse pointer
                "&:hover": {
                  backgroundColor: selectedCategories.includes(category.id)
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              <ListItemText primary={category.category_name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

Categories.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
};

export default Categories;
