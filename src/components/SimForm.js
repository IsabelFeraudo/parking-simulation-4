import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SimForm = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState({
    //filas
    cantidadFilasASimular: 10,
    filaASimularDesde: 0,
    cantidadFilasAMostrar: 10,
    //horas
    cantidadHorasASimular: 0,
    mostrarDesdeHora: 0,
    mostrarHastaHora: 0,
    //modo simulacion
    modoSimulacion: 'filas' // Puede ser 'filas' o 'horas'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: Number(value),
    });
  };

  const handleModoSimulacionChange = (e) => {
    const { value } = e.target;
    setFormValues({
      ...formValues,
      modoSimulacion: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValues.modoSimulacion === 'horas' && (formValues.cantidadHorasASimular <= 0 || formValues.mostrarDesdeHora < 0 || formValues.mostrarHastaHora > 100000 || formValues.mostrarDesdeHora >= formValues.mostrarHastaHora)) {
      alert("Por favor, ingrese valores válidos para la simulación por horas.");
      return;
    }
    if (formValues.modoSimulacion === 'filas' && formValues.cantidadFilasAMostrar > (formValues.cantidadFilasASimular - formValues.filaASimularDesde)) {
      alert("Cantidad de Filas a Mostrar no puede ser mayor que (Cantidad de Filas a Simular - Fila a Mostrar Desde).");
      return;
    }
    onSubmit(formValues);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="modoSimulacion">
              <Form.Label>Modo de Simulación</Form.Label>
              <Form.Control as="select" name="modoSimulacion" value={formValues.modoSimulacion} onChange={handleModoSimulacionChange}>
                <option value="filas">Simular por Cantidad de Filas</option>
                <option value="horas">Simular por Horas</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        {formValues.modoSimulacion === 'filas' && (
          <>
            <Row>
              <Col>
                <Form.Group controlId="cantidadFilasASimular">
                  <Form.Label>Cantidad de Filas a Simular</Form.Label>
                  <Form.Control type="number" name="cantidadFilasASimular" value={formValues.cantidadFilasASimular} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="filaASimularDesde">
                  <Form.Label>Fila a Simular Desde</Form.Label>
                  <Form.Control type="number" name="filaASimularDesde" value={formValues.filaASimularDesde} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="cantidadFilasAMostrar">
                  <Form.Label>Cantidad de Filas a Mostrar</Form.Label>
                  <Form.Control type="number" name="cantidadFilasAMostrar" value={formValues.cantidadFilasAMostrar} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        {formValues.modoSimulacion === 'horas' && (
          <>
            <Row>
              <Col>
                <Form.Group controlId="cantidadHorasASimular">
                  <Form.Label>Cantidad de Horas a Simular</Form.Label>
                  <Form.Control type="number" name="cantidadHorasASimular" value={formValues.cantidadHorasASimular} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="mostrarDesdeHora">
                  <Form.Label>Mostrar Desde Hora</Form.Label>
                  <Form.Control type="number" name="mostrarDesdeHora" value={formValues.mostrarDesdeHora} onChange={handleChange} min="0" max="10000" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="mostrarHastaHora">
                  <Form.Label>Mostrar Hasta Hora</Form.Label>
                  <Form.Control type="number" name="mostrarHastaHora" value={formValues.mostrarHastaHora} onChange={handleChange} min="0" max="10000" />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Button variant="primary" type="submit">
          Comenzar Simulación
        </Button>
      </Form>
    </Container>
  );
};

export default SimForm;
