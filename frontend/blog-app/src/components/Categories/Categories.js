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

const Categories = ({ drawerOpen, setDrawerOpen }) => {
  const [categories, setCategories] = useState([]);
  const theme = useTheme();

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

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box
        sx={{ width: 390 }}
        role="presentation"
        onClick={() => setDrawerOpen(false)}
        onKeyDown={() => setDrawerOpen(false)}
      >
        <Typography variant="h6" component="div" sx={{ padding: 2 }}>
          Categories
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              component="button"
              key={category.id}
              sx={{
                width: "95%",
                padding: 1,
                ml: 1,
                my: 2,
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                textAlign: "center",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.dark,
                },
                "&:focus": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.dark,
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
