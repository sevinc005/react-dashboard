import React, { useState, useEffect } from 'react'; // 1. useEffect əlavə etdik
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';

function App() {
  const [cards, setCards] = useState([]); // Əvvəlcə boş siyahı

  //  Mock API-dən məlumat çəkmə hissəsi
  useEffect(() => {
    
    const staticColors = ['#4facfe', '#667eea', '#00b894', '#f093fb'];

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const formattedCards = data.slice(0, 4).map((user, index) => ({
          id: user.id.toString(),
          title: user.username,
          value: user.phone.split(' ')[0],
          // İndeksə görə rəngi siyahıdan seçirik
          color: staticColors[index] || '#4facfe' 
        }));
        setCards(formattedCards);
      });
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

  return (
    <div className="App">
      <h1> Dashboard</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards" direction="horizontal">
          {(provided) => (
            <div 
              className="dashboard-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
              
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div
                      className="metric-card"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ 
                        ...provided.draggableProps.style,
                        background: card.color 
                      }}
                    >
                      <h3>{card.title}</h3>
                      <p>{card.value}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;