import React from 'react';
import { Table, Container } from 'react-bootstrap';

const DataTable = ({ data,variableEstadistica }) => {
    return (
        <div className="container">
          <Table className="table table-striped">
            <thead>
              <tr>
                <th>Evento</th>
                <th>N auto</th>
                <th>Tiempo</th>
                <th>RND tamano</th>
                <th>Tamano vehiculo</th>
                <th>RND t. llegada</th>
                <th>T. entre llegadas</th>
                <th>Proxima llegada</th>
                <th>RND t. estac</th>
                <th>T. estacionamiento</th>
                <th>Fin Estacionamiento(i)</th>
                <th>t cobro</th>
                <th>Fin Cobro(i)</th>
                <th>Estado Cajero</th>
                <th>Fila en Caja</th>
                <th>Autos Ingresados</th>
                <th>Lugares Utilitarios Parcialmente Libres</th>
                <th>Lugares Utilitarios Libres</th>
                <th>Lugares Grandes Libres</th>
                <th>Lugares Pequeños Libres</th>
                <th>Cantidad Autos que Pagaron</th>
                <th>Total Acumulado</th>
                <th>Autos en sistema</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.evento}</td>
                  <td>{JSON.stringify(row.nroAuto)}</td>
                  <td>{row.tiempoActual}</td>
                  <th>{row.rndTamano}</th>
                  <td>{row.tamano}</td>
                  <th>{row.rndLlegada}</th>
                  <td>{row.tiempoEntreLlegadas}</td>
                  <td>{row.proximaLlegada}</td>
                  <th>{row.rndEstacionamiento}</th>
                  <td>{row.tEstacionamiento}</td>
                  <td>{row.finEstacionamiento}</td>
                  <th>{row.tCobro}</th>
                  <td>{row.finCobro}</td>
                  <td>{JSON.stringify(row.estadoCajero)}</td>
                  <td>{JSON.stringify(row.filaCaja)}</td>   
                  <td>{row.cantAutosIngresados}</td>    
                  <td>{row.utilitariosParcialmenteLibres}</td>
                  <td>{row.utilitariosLibres}</td>
                  <td>{row.grandesLibres}</td>
                  <td>{row.pequeñosLibres}</td>
                  <td>{row.cantAutosPagaron}</td>
                  <td>{row.acumuladorPlata}</td>
                  <td>{JSON.stringify(row.autos)}</td>   
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    };

export default DataTable;