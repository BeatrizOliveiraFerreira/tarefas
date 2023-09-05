import './App.css';
import { useState, useEffect } from 'react';
import {BsBookmarkCheck, BsBookmarkCheckFill, BsTrash} from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(false);


   useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const res = await fetch(API + "/listas");
        const data = await res.json();
        setListas(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    }

    loadData();

  }, []);
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const lista = {
      id: Math.random(),
      title,
      done: false
    }

    await fetch(API + "/listas", {
      method: "POST",
      body: JSON.stringify(lista),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setListas((prevState) => [...prevState, lista]);

    setTitle("");
    setTime("");
  };

  const handleDelete = async(id) => {
    await fetch(API + "/listas/" + id, {
      method: "DELETE"
    });

    setListas((prevState) => prevState.filter((lista) => lista.id !== id));
  }

  const handleEdit = async(lista) => {

    lista.done = !lista.done;

     const data = await fetch(API + "/listas/" + lista.id, {
      method: "PUT",
      body: JSON.stringify(lista),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setListas((prevState) => 
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  }

  if(loading) {
    return <p>Carregando ...</p>
  }
  return (
    <div className='App'>
    <div className='lista-header'>
      <h2>Lista de Tarefas</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-control'>
          <label htmlFor='title'>O que fazer hoje?</label>
          <input 
              type='text' 
              name='title' 
              placeholder='O que pretendo fazer' 
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
          />
        </div>

        
          <input type='submit' value='Criar' />
      </form>

    </div>
    
    <div className='form-lista'>
      <p>Formulário</p>
    </div>

    <div className='list-lista'>
      <h2>Minhas tarefas</h2>
      {listas.length === 0 && <p>Não há nada aqui!</p>}
      {listas.map((lista) => (
        <div className="lista" key={lista.id}>

          <h3 className={lista.done ? "lista-done" : ""}>{lista.title}</h3>
          <div className="actions">
            <span onClick={() => handleEdit(lista)}>
              {!lista.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
            </span>
            <BsTrash onClick={() => handleDelete(lista.id)} />
          </div>


        </div>
      ))}
    </div>
    </div>
  );
}

export default App;

