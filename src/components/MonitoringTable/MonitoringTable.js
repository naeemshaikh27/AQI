import React from 'react';
import { Table } from 'react-bootstrap';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import moment from 'moment';
import LiveChart from '../LiveChart/LiveChart';

const client = new W3CWebSocket('ws://city-ws.herokuapp.com');

export default class MonitoringTable extends React.Component {
    state = { aqi: [], chartData: null, historicalCityAqis: {} }
    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            const updatedAqiForCities = JSON.parse(message.data || '[]');
            if (updatedAqiForCities.length) {
                const tempState = { aqi: this.state.aqi, historicalCityAqis: this.state.historicalCityAqis };
                updatedAqiForCities.map((currentAqiForCity) => {
                    const staleAqiForCity = tempState.aqi.find((staleAqi) => { return staleAqi.city === currentAqiForCity.city });
                    if (staleAqiForCity) {
                        // updating the same object by reference
                        staleAqiForCity.city = currentAqiForCity.city;
                        staleAqiForCity.aqi = parseFloat(currentAqiForCity.aqi).toFixed(2);
                        staleAqiForCity.lastUpdated = moment().toISOString();
                        
                        // inserting a new copy to historical data array for graph
                        const updatedCityData = Object.assign({}, staleAqiForCity);
                        tempState.historicalCityAqis[currentAqiForCity.city].push(updatedCityData);
                        return null;
                    }
                    const newCityAqiToAdd = { ...currentAqiForCity, lastUpdated: moment().toISOString(), aqi: parseFloat(currentAqiForCity.aqi).toFixed(2) }
                    tempState.aqi.push(newCityAqiToAdd);
                    tempState.historicalCityAqis[newCityAqiToAdd.city] = [Object.assign({}, newCityAqiToAdd)];
                    return null;
                })
                this.setState({ ...tempState })
            }
        };
    }
    getAqiRenderColor(aqi) {
        if (aqi < 50) {
            return 'aqi-good';
        }
        if (aqi < 100) {
            return 'aqi-satisfactory';
        }
        if (aqi < 200) {
            return 'aqi-moderate';
        }
        if (aqi < 300) {
            return 'aqi-poor';
        }
        if (aqi < 400) {
            return 'aqi-very-poor';
        }
        if (aqi < 500) {
            return 'aqi-severe';
        }
    }
    loadChart(data) {
        this.setState({ chartData: {cityName: data.city, aqis:this.state.historicalCityAqis[data.city]} });
    }
    render() {
        return <div className='row'>
            <div className='col-lg-4 col'>
                <h6 className='text-center'> Click on any city to see AQI live. </h6>
                <Table bordered hover>
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Current AQI</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.aqi.map((data, index) => {
                        return <tr onClick={() => { this.loadChart(data) }} key={`aqi-city-${index}-${data.city}`}>
                            <td ><b>{data.city}</b></td>
                            <td className={this.getAqiRenderColor(data.aqi)}><b>{data.aqi}</b></td>
                            <td className='last-updated'>{moment(data.lastUpdated).fromNow()}</td>
                        </tr>
                    })}

                </tbody>
            </Table>
            </div>
            <div className='col-lg-8 col'>{this.state.chartData && <LiveChart cityAqi={this.state.chartData} />}</div>
        </div>
    }
}