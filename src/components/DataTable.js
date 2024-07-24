import React from 'react';
import { Table, Container } from 'react-bootstrap';

const DataTable = ({ data, variableEstadistica }) => {
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
                <th>Lugares Utilitarios Libres</th>
                <th>Lugares Grandes Libres</th>
                <th>Lugares Pequeños Libres</th>
                <th>Cantidad Autos que Pagaron</th>
                <th>Tarifa</th>
                <th>Total Acumulado</th>
                <th>Autos en sistema</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.evento}</td>
                  <td>{JSON.stringify(row.nroAuto)}</td>
                  <th>{row.tiempoActual}</th>
                  <td>{row.rndTamanoActual}</td>
                  <td>{row.tamanoActual}</td>
                  <td>{row.rndProximaLlegada}</td>
                  <td>{row.ProximotiempoEntreLlegadas}</td>
                  <th>{JSON.stringify(row.proximaLlegada)}</th>
                  <td>{row.rndProximoFinEstacionamiento}</td>
                  <td>{row.tiempoDeEstadiaProxFinEstacionamiento}</td>
                  <th>
                    {row.autosFinEstacionamiento.map((finEstacionamiento, idx) => (
                      <div key={idx}>
                        <p>
                          Auto: {finEstacionamiento.auto.nro}, 
                          T. Estadia: {finEstacionamiento.tiempoDeEstadiaActual?.toFixed(2)}, 
                          T. Llegada: {finEstacionamiento.tiempoDeLlegada?.toFixed(2)}, 
                          Fin Estacionamiento: {finEstacionamiento.tiempoDeOcurrenciaFinEstacionamientoActual?.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </th>
                  <td>{row.tCobro}</td>
                  <th>{row.finCobro}</th>
                  <td>{JSON.stringify(row.estadoCajero)}</td>
                  <td>{JSON.stringify(row.filaCaja)}</td>   
                  <td>{row.cantAutosIngresados}</td>    
                  <td>{row.utilitariosLibres}</td>
                  <td>{row.grandesLibres}</td>
                  <td>{row.pequeñosLibres}</td>
                  <td>{row.totalAutosPagaron}</td>
                  <td>{row.tarifaAuto}</td>
                  <td>{row.totalRecaudacion}</td>
                  <td>{JSON.stringify(row.autos)}</td>   
                  
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
};

export default DataTable;
