import React, { useCallback, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { v4 as uuidv4 } from 'uuid';

const styledButton = {
  height: 30,
  width: 120,
  margin: 20
};

function App() {
  const [blocks, setBlocks] = useState([]);
  const [file, setFile] = useState('');

  const addBlock = useCallback(() => {
    setBlocks(prevBlocks => [
      ...prevBlocks,
      {
        id: uuidv4(),
        date: new Date(),
        name: '',
        text: ''
      }
    ]);
  }, []);

  const updateBlock = useCallback((blockIndex, field) => event => {
    setBlocks(prevBlocks => {
      const currentBlock = prevBlocks[blockIndex];
      if (field === "date") {
        currentBlock[field] = event;
      } else {
        currentBlock[field] = event.target.value;
      }
      return [...prevBlocks];
    });
  }, []);

  const removeBlock = useCallback(blockIndex => () => {
    setBlocks(prevBlocks => {
      prevBlocks.splice(blockIndex, 1);
      return [...prevBlocks];
    });
  }, []);

  const clickLocally = () => {
    let output = '';
    blocks.forEach(block => {
      if (block.name !== '' && block.text !== '') {
        output += `${block.date.getDate()}.${block.date.getMonth()}.${block.date.getFullYear()} ${block.date.getHours()}:${block.date.getMinutes()}:${block.date.getSeconds()} \n ${block.name} \n ${block.text}\n\n`;
      }
    });

    const blob = new Blob([output]);

    if (file !== '') window.URL.revokeObjectURL(file);
    setFile(window.URL.createObjectURL(blob))
  }

  return (
    <div>
      <div>
        {blocks.map((block, index) => {
          return (
            <div key={block.id} style={{paddingLeft: 20, paddingTop: 20}}>
              <div style={{
                display: 'flex'
              }}>
                <DateTimePicker
                  onChange={updateBlock(index, 'date')}
                  value={block.date}
                />
                <input
                  style={{
                    width: 225,
                    marginLeft: 20
                  }}
                  type="text"
                  value={block.name}
                  placeholder="Введите наименование"
                  onChange={updateBlock(index, 'name')}
                />
              </div>
              <textarea
                style={{
                  width: 430,
                  marginTop: 10,
                  padding: 5
                }}
                type="text"
                value={block.text}
                placeholder="Введите текст"
                onChange={updateBlock(index, 'text')}
              />
              <button 
                style={{
                  position: 'absolute',
                  marginLeft: 30,
                  width: 40
                }}
                onClick={removeBlock(index)}>x</button>
            </div>
          )
        })}
        <button style={styledButton} onClick={addBlock}>Add block</button>
        <a style={styledButton} download='radio.txt' href={file} onClick={clickLocally} >Сохранить как ...</a>
      </div>
    </div>
  );
}

export default App;