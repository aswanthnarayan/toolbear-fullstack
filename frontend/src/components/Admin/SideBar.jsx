import React from "react";
import { List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <React.Fragment>
      <div className="">
        <List>
          <ListItem >
            <NavLink to="/admin/dashboard" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Dashboard Icon */}
              </ListItemPrefix>
              Dashboard
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/users" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Users Icon */}
              </ListItemPrefix>
              Users
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/categories" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Users Icon */}
              </ListItemPrefix>
              Categories
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/products" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Products Icon */}
              </ListItemPrefix>
              Products
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/brands" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Brands Icon */}
              </ListItemPrefix>
              Brands
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/orders" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Orders Icon */}
              </ListItemPrefix>
              Orders
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/coupons" className="flex items-center p-2 w-full">
              <ListItemPrefix>
                {/* Coupons Icon */}
              </ListItemPrefix>
              Coupons
            </NavLink>
          </ListItem>
        </List>
      </div>
    </React.Fragment>
  );
}
