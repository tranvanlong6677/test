import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Collapse,
  List,
  withStyles,
  makeStyles
} from '@material-ui/core';
import MuiListItem from "@material-ui/core/ListItem";

import { ExpandLess, ExpandMore } from '@material-ui/icons';

const ListItem = withStyles({
  root: {
   
    "&:hover": {
      backgroundColor: "#f5c5c5",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white"
      }
    }
  },
  selected: {}
})(MuiListItem);

const useStyles = makeStyles(theme => ({
  image: {
    marginRight: "5px"
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1),
    color: '#313131'
  },
  title: {
    marginRight: 'auto',
    fontWeight: 400,
    color: '#45485E',
    fontSize: '14px'
  },
  subTitle: {
    // fontWeight: 400
  },
  active: {
    color: "#212529",
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium,
      color: "#C62222"
    },
    '& $icon': {
      color: "#212529"
    }
  },
  nested: {
    paddingLeft: 40
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  arrayNested,
  ...rest
}) => {
  const classes = useStyles();
  const [openTab, setOpenTab] = React.useState(false);
  return (
    <>
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        {...rest}
        onClick={() => {
          if (!arrayNested) return;
          setOpenTab(!openTab);
        }}
      >
        <Button
          activeClassName={classes.active}
          className={classes.button}
          component={href ? RouterLink : Button}
          to={href}
        >
          <img
              alt="Under development"
              className={classes.image}
              src={Icon}
            />

          <span className={classes.title}>{title}</span>
          {arrayNested && (openTab ? <ExpandLess /> : <ExpandMore />)}
        </Button>
      </ListItem>
      <List component={'div'}>
        {arrayNested &&
          arrayNested.map(item => (
            <Collapse
              in={openTab}
              timeout="auto"
              unmountOnExit
              key={item.title}
            >
              <ListItem
                className={clsx(classes.nested, className)}
                disableGutters
                {...rest}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={RouterLink}
                  to={item.href}
                >
                  {item.icon && <Icon className={classes.icon} size="20" />}
                  <span className={classes.subTitle}>{item.title}</span>
                </Button>
              </ListItem>
            </Collapse>
          ))}
      </List>
    </>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.element,
  title: PropTypes.string,
  arrayNested: PropTypes.array
};

export default NavItem;
