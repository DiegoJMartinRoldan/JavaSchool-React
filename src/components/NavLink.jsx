import { NavLink as CustomNavLink } from "react-router-dom";

// This component helps the user to know on which page they are.
export const NavLink = ({ to, children, ...props }) => {
  return (
    <CustomNavLink to={to} {...props} className={(isActive) => (isActive ? 'is-active' : undefined)}>
      {children}
    </CustomNavLink>
  );
};
