import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function Modal({ receita, onClose, onSave, isCreate, isView }) {
  const [nome, setNome] = useState(receita?.nome ?? '');
  const [ingredientes, setIngredientes] = useState(receita?.ingredientes ?? '');
  const [modoFazer, setModoFazer] = useState(receita?.modoFazer ?? '');
  const [img, setImg] = useState(receita?.img ?? '');
  const [tipo, setTipo] = useState(receita?.tipo ?? '');
  const [custoAproximado, setCustoAproximado] = useState(receita?.custoAproximado ?? '');

  useEffect(() => {
    setNome(receita?.nome ?? '');
    setIngredientes(receita?.ingredientes ?? '');
    setModoFazer(receita?.modoFazer ?? '');
    setImg(receita?.img ?? '');
    setTipo(receita?.tipo ?? '');
    setCustoAproximado(receita?.custoAproximado ?? '');
  }, [receita, isCreate, isView]);

  if (!receita && !isCreate) return null;

  if (isView) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>{receita.nome}</h2>
          <img src={receita.img} alt={receita.nome} style={{ maxWidth: '100%' }} />
          <p><strong>Tipo:</strong> {receita.tipo}</p>
          <p><strong>Ingredientes:</strong> {receita.ingredientes}</p>
          <p><strong>Modo de Preparo:</strong> {receita.modoFazer}</p>
          <p><strong>Custo Aproximado:</strong> {receita.custoAproximado}</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Validação simples
    if (!nome || !ingredientes || !modoFazer || !img || !tipo || !custoAproximado) {
      alert('Preencha todos os campos!');
      return;
    }
    const updatedRecipe = {
      nome,
      ingredientes,
      modoFazer,
      img,
      tipo,
      custoAproximado: Number(custoAproximado)
    };
    if (isCreate) {
      onSave(updatedRecipe);
    } else {
      onSave(receita.id, updatedRecipe);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isCreate ? 'Criar Receita' : 'Editar Receita'}</h2>
        <div>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
        </div>
        <div>
          <label>Ingredientes:</label>
          <textarea value={ingredientes} onChange={e => setIngredientes(e.target.value)} />
        </div>
        <div>
          <label>Modo de Preparo:</label>
          <textarea value={modoFazer} onChange={e => setModoFazer(e.target.value)} />
        </div>
        <div>
          <label>Tipo:</label>
          <input type="text" value={tipo} onChange={e => setTipo(e.target.value)} placeholder="Ex: SALGADA" />
        </div>
        <div>
          <label>Custo Aproximado:</label>
          <input type="number" value={custoAproximado} onChange={e => setCustoAproximado(e.target.value)} />
        </div>
        <div>
          <label>URL da Imagem:</label>
          <input type="text" value={img} onChange={e => setImg(e.target.value)} placeholder="Cole o link da imagem aqui" />
        </div>
        {img && (
          <div>
            <img src={img} alt="Pré-visualização" style={{ maxWidth: '100%', marginTop: '8px' }} />
          </div>
        )}
        <button onClick={handleSave}>{isCreate ? 'Criar' : 'Salvar'}</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

function App() {
  const [receitas, setReceitas] = useState([]);
  const [modalReceita, setModalReceita] = useState(null);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://receitasapi-b-2025.vercel.app/receitas');
      setReceitas(response.data);
    };
    fetchData();
  }, []);

  const setEditar = (id, updateData) => {
    axios.put(`https://receitasapi-b-2025.vercel.app/receitas/${id}`, updateData)
      .then(() => {
        alert('Receita atualizada!');
        setReceitas(prevReceitas =>
          prevReceitas.map(receita =>
            receita.id === id ? { ...receita, ...updateData } : receita
          )
        );
      })
      .catch(error => {
        alert('Erro ao atualizar receita: ' + error);
      });
  };

  const setDeletar = (id) => {
    axios.delete(`https://receitasapi-b-2025.vercel.app/receitas/${id}`)
      .then(() => {
        alert('Receita deletada com sucesso!');
        setReceitas(prevReceitas => prevReceitas.filter(receita => receita.id !== id));
      })
      .catch(() => {
        alert('Erro ao deletar a receita.');
      });
  };

  const setCriar = (newRecipe) => {
    axios.post('https://receitasapi-b-2025.vercel.app/receitas', newRecipe)
      .then(response => {
        alert('Receita criada com sucesso!');
        setReceitas(prevReceitas => [...prevReceitas, response.data]);
      })
      .catch(() => {
        alert('Erro ao criar receita.');
      });
  };

  return (
    <>
      <header>
        <h1>Receitas</h1>
        <button
          onClick={() => {
            setIsCreateModal(true);
            setIsViewModal(false);
            setModalReceita({
              nome: '',
              ingredientes: '',
              modoFazer: '',
              img: '',
              tipo: '',
              custoAproximado: ''
            });
          }}
        >
          Criar Receita
        </button>
      </header>
      <main className="card-container">
        {receitas.map(receita => (
          <div className="card" key={receita.id}>
            <h2>{receita.nome}</h2>
            <h3>Ilustração:</h3>
            <img src={receita.img} alt={receita.nome} />
            <button onClick={() => {
              setIsViewModal(true);
              setIsCreateModal(false);
              setModalReceita(receita);
            }}>Ver Receita</button>
            <button onClick={() => {
              setIsCreateModal(false);
              setIsViewModal(false);
              setModalReceita(receita);
            }}>Editar</button>
            <button onClick={() => setDeletar(receita.id)}>Deletar</button>
          </div>
        ))}
      </main>
      <footer>
        <p>Receitas do Fessor &copy; 2025</p>
      </footer>
      {(modalReceita && (isCreateModal || isViewModal || modalReceita.id)) && (
        <Modal
          receita={modalReceita}
          onClose={() => {
            setModalReceita(null);
            setIsCreateModal(false);
            setIsViewModal(false);
          }}
          onSave={isCreateModal ? setCriar : setEditar}
          isCreate={isCreateModal}
          isView={isViewModal}
        />
      )}
    </>
  );
}

export default App;