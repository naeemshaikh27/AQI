import React from 'react';
import moment from 'moment';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';



export default class LiveChart extends React.Component {
    state = {
        chartOptions: {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'AQI For City'
            },
            time: {
                useUTC: false
            },
            xAxis: {
                title: {
                    text: 'Time'
                },
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'AQI'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            series: [{
                data: []
            }
            ]
        }
    }

    render() {
        if (this.props.cityAqi) {
            const seriesData = this.props.cityAqi.aqis.map((d) => {
                return {
                    x: moment(d.lastUpdated).unix(),
                    y:Number(d.aqi)
                };
            })
            return <div >
                <HighchartsReact highcharts={Highcharts} options={{
                    ...this.state.chartOptions, 
                    ...{
                        title: {
                            text: 'AQI For ' + this.props.cityAqi.cityName
                        }
                    },
                    series: [{ name: `AQI For ${this.props.cityAqi.cityName}`, data: seriesData}]
                }} />
            </div>
        }
        return <div></div>


    }
}