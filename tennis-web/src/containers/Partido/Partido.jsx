import React, { useEffect, useState } from 'react';
import Typography from '../../components/Typography/Typography';
import TablePartido from '../../components/Tables/TablePartido';
import PartidoModal from '../../components/Modals/PartidoModal';
import { Button } from 'react-bootstrap';

let partidosListMock = [
  {
    id: 1,
    fechaComienzo: '30/06/2021 16:00',
    estado: 'NO_INICIADO',
    jugadorLocal: {
      id: 1,
      nombre: 'pepe',
      puntos: 1000,
    },
    jugadorVisitante: {
      id: 2,
      nombre: 'jose',
      puntos: 100,
    },
  },
  {
    id: 2,
    fechaComienzo: '29/06/2021 16:00',
    estado: 'NO_INICIADO',
    jugadorLocal: {
      id: 3,
      nombre: 'saul',
      puntos: 50,
    },
    jugadorVisitante: {
      id: 4,
      nombre: 'anibal',
      puntos: 50,
    },
  },
];

const partidoInit = {
  fechaComienzo: '',
  estado: 'NO_INICIADO',
  jugadorLocal: {
    id: -1,
    nombre: '',
    puntos: 0,
  },
  jugadorVisitante: {
    id: -1,
    nombre: '',
    puntos: 0,
  },
};

let jugadoresListMock = [
  { id: 1, nombre: 'pepe', puntos: 1000 },
  { id: 2, nombre: 'jose', puntos: 100 },
  { id: 3, nombre: 'saul', puntos: 50 },
  { id: 4, nombre: 'anibal', puntos: 50 },
];

const Partido = () => {
  const [partidosList, setPartidosList] = useState([]);
  const [listaJugadores, setListaJugadores] = useState([]);
  const [partidoData, setPartidoData] = useState(partidoInit);
  const [isEdit, setIsEdit] = useState(false);
  const [hasErrorInForm, setHasErrorInForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getPartidos();
    getJugadores();
  }, []);

  // Functions
  //Usar esta funcion para convertir el string 'fechaComienzo' a Date
  const stringToDate = (dateString) => {
    try {
      const [fecha, hora] = dateString.split(' ');
      const [dd, mm, yyyy] = fecha.split('/');
      if (hora !== undefined) {
        if (hora.includes(':')) {
          const [hh, mins] = hora.split(':');
          return new Date(yyyy, mm - 1, dd, hh, mins);
        }
      }
      return new Date(yyyy, mm - 1, dd);
    } catch (err) {
      console.log(`stringToDate error formateando la fecha: ${err}`);
      return null;
    }
  };

  const validatePartido = () => {
    if (partidoData.jugadorLocal.id === partidoData.jugadorVisitante.id) {
      setErrorMsg('Los jugadores local y visitante no pueden ser iguales');
      return false;
    }

    const date = stringToDate(partidoData.fechaComienzo);

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      setErrorMsg('El formato de la fecha/hora de inicio no es válido');
      return false;
    }

    if (date < new Date(Date.now())) {
      setErrorMsg('La fecha/hora de inicio debe ser mayor o igual a la fecha/hora actual');
      return false;
    }

    return true;
  };

  // Buttons
  const handleEditPartido = (editData, event) => {
    event.preventDefault();
    handleOpenModal(true, editData);
  };

  const handleDeletePartido = (id, event) => {
    event.preventDefault();
    if (window.confirm('Estas seguro?')) {
      setPartidosList(partidosList.filter((item) => item.id !== id));
    }
  };

  // Modal
  const handleOpenModal = (editarPartido = false, partidoToEdit = null) => {
    setIsEdit(editarPartido);

    if (editarPartido) {
      setPartidoData(partidoToEdit);
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    setHasErrorInForm(false);
    setPartidoData(partidoInit);
    setErrorMsg('');
  };

  // Form
  const handleChangeInputForm = (property, value) => {
    value === '' ? setHasErrorInForm(true) : setHasErrorInForm(false);

    const newData = { ...partidoData };

    switch (property) {
      case 'jugadorLocal':
        newData.jugadorLocal = listaJugadores.filter((x) => x.id === parseInt(value))[0];
        break;
      case 'jugadorVisitante':
        newData.jugadorVisitante = listaJugadores.filter((x) => x.id === parseInt(value))[0];
        break;
      case 'fechaComienzo':
        newData.fechaComienzo = value;
        break;
      default:
        break;
    }

    setPartidoData(newData);
  };

  const handleSubmitForm = (e, form, isEdit) => {
    e.preventDefault();
    setHasErrorInForm(true);

    if (!validatePartido()) return;

    if (form.checkValidity()) isEdit ? editarPartido(partidoData.id) : agregarPartido();
  };

  // API
  const agregarPartido = () => {
    console.log(partidoData);
    let model = {
      ...partidoData,
      id: partidosListMock.length + 1,
      jugadorLocal: {
        ...partidoData.jugadorLocal,
        nombre: jugadoresListMock.filter((x) => x.id === partidoData.jugadorLocal.id)[0].nombre,
      },
      jugadorVisitante: {
        ...partidoData.jugadorVisitante,
        nombre: jugadoresListMock.filter((x) => x.id === partidoData.jugadorVisitante.id)[0].nombre,
      },
    };

    partidosListMock.push(model);
    setPartidosList(partidosListMock);
    handleCloseModal();
  };

  const editarPartido = (id) => {
    // Mapea la lista, y verifica por el ID si devuelve el objeto original o el objeto editado
    partidosListMock = partidosListMock.map((item) => (item.id === id ? partidoData : item));
    setPartidosList(partidosListMock);

    handleCloseModal();
  };

  const getPartidos = () => {
    setPartidosList(partidosListMock);
  };

  const getJugadores = () => {
    setListaJugadores(jugadoresListMock);
  };

  return (
    <>
      <Typography id={'title-id'}>Partido</Typography>
      <div className='mb-2'>
        <Button variant="success" onClick={() => handleOpenModal()}>Agregar partido</Button>
      </div>
      <TablePartido
        dataForTable={partidosList}
        editPartido={handleEditPartido}
        deletePartido={(id, event) => handleDeletePartido(id, event)}
      />
      <PartidoModal
        show={openModal}
        onHide={handleCloseModal}
        isEdit={isEdit}
        handleChange={handleChangeInputForm}
        validated={hasErrorInForm}
        handleSubmit={handleSubmitForm}
        errorMsg={errorMsg}
        partido={partidoData}
        listaJugadores={listaJugadores}
      />
    </>
  );
};

export default Partido;
