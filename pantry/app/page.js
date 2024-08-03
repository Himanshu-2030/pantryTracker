'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Container, Typography, Paper } from '@mui/material';
import { db, collection, addDoc, deleteDoc, doc, onSnapshot } from './firebaseConfig';
import { styled } from '@mui/material/styles';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #a2c2e2, #f5f5f5)', // Gradient background
  
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  width: '100%',
  marginTop: theme.spacing(4),
  boxShadow: theme.shadows[5],
  backgroundColor: '#ffffff', // Paper background color
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '20px',
  textTransform: 'none',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '10px',
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

export default function Home() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const colRef = collection(db, 'items');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(newItems);
    });
    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (item.trim() === '') return;
    await addDoc(collection(db, 'items'), { name: item });
    setItem('');
  };

  const handleRemoveItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <StyledContainer>
      <Typography variant="h3" component="h1" gutterBottom>
        Item List
      </Typography>
      <StyledPaper>
        <StyledTextField
          label="Add Item"
          variant="outlined"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          fullWidth
        />
        <StyledButton variant="contained" color="primary" onClick={handleAddItem}>
          Add
        </StyledButton>
        <List>
          {items.map((item) => (
            <StyledListItem key={item.id}>
              <ListItemText primary={item.name} />
              <StyledButton variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                Remove
              </StyledButton>
            </StyledListItem>
          ))}
        </List>
      </StyledPaper>
    </StyledContainer>
  );
}
