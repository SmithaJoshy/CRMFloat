import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  category: string;
}

interface GroupedNavigationProps {
  menuItems: MenuItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

const categoryConfig = {
  main: { title: '🏠 Main', color: '#1f2937' },
  sales: { title: '💼 Sales & Marketing', color: '#7c3aed' },
  project: { title: '📋 Project Management', color: '#059669' },
  customer: { title: '👥 Customer Relations', color: '#dc2626' },
  finance: { title: '💰 Finance', color: '#ea580c' },
  tools: { title: '🛠️ Tools', color: '#0891b2' },
};

export default function GroupedNavigation({ menuItems, currentPath, onNavigate }: GroupedNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    main: true,
    sales: true,
    project: true,
    customer: true,
    finance: true,
    tools: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  return (
    <Box>
      {Object.entries(groupedItems).map(([category, items]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const isExpanded = expandedCategories[category];
        
        return (
          <Box key={category}>
            <ListItemButton onClick={() => toggleCategory(category)}>
              <ListItemText 
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: config.color }}>
                    {config.title}
                  </Typography>
                }
              />
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      selected={currentPath === item.path}
                      onClick={() => onNavigate(item.path)}
                      sx={{
                        pl: 4,
                        '&.Mui-selected': {
                          backgroundColor: `${config.color}15`,
                          borderRight: `3px solid ${config.color}`,
                        },
                        '&:hover': {
                          backgroundColor: `${config.color}08`,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: config.color, minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: currentPath === item.path ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <Divider sx={{ my: 1 }} />
          </Box>
        );
      })}
    </Box>
  );
}
