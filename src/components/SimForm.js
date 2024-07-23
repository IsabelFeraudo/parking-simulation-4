import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
export const CANTIDAD_DE_FILAS_A_SIMULAR = 'CANTIDAD_DE_FILAS_A_SIMULAR';
//export const CANTIDAD_HORAS_A_SIMULAR = 'CANTIDAD_HORAS_A_SIMULAR';


const SimForm = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState({
    cantidadFilasASimular: 20,
    filaASimularDesde: 0,
    cantidadFilasAMostrar: 100,
    cantidadHorasASimular:0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: Number(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="cantidadFilasASimular">
              <Form.Label>CANTIDAD_DE_FILAS_A_SIMULAR</Form.Label>
              <Form.Control type="number" name="cantidadFilasASimular" value={formValues.cantidadFilasASimular} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="filaASimularDesde">
              <Form.Label>FILA_A_SIMULAR_DESDE</Form.Label>
              <Form.Control type="number" name="filaASimularDesde" value={formValues.filaASimularDesde} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="cantidadFilasAMostrar">
              <Form.Label>CANTIDAD_FILAS_A_MOSTRAR</Form.Label>
              <Form.Control type="number" name="cantidadFilasAMostrar" value={formValues.cantidadFilasAMostrar} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
        </Row>
        <Button variant="primary" type="submit">
          Comenzar Simulación
        </Button>
      </Form>
    </Container>
  );
};

export default SimForm;