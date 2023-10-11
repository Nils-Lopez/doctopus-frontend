import React, {Fragment, useEffect, useState} from "react"

import { Chart as 
    ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
} from "chart.js";
import { Line, Pie} from 'react-chartjs-2';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronDown, faChevronUp, faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons"
import { useDashboard } from "../../../utils/hooks/Dashboard";

import { useTranslation } from "react-i18next";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ArcElement,
    Tooltip,
    Legend
);
 
const VisitorsDash = ({}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
              }
         
        },
      };
      

   
    const { t, i18n } = useTranslation();

    const [chartType, setChartType] = useState(0)
    const [chartTypeDropdown, setChartTypeDropdown] = useState(false)
    const [chartRange, setChartRange] = useState(0)
    const [chartRangeDropdown, setChartRangeDropdown] = useState(false)
    const [chartDisplay, setChartDisplay] = useState(0)
    const [chartDisplayDropdown, setChartDisplayDropdown] = useState(false)
    

    const chartTypes = ["date", "location"]
    const chartRanges = ['since-ever', 'this-year', "this-month"]
    const chartDisplays = ["chart"]

    const [chartLoading, setChartLoading] = useState(false)
    const [data, setData] = useState(false)

    const {
        getVisitorsChart,
        responseVisitorsChart
    } = useDashboard()

    useEffect(() => {
        if (!data && !chartLoading) {
            setChartLoading(true)
            getVisitorsChart({
                chartRange: chartType === 0 ? chartRanges[chartRange] : chartRanges[0],
                chartType: chartTypes[chartType]
            })
        } 
    }, [])

    const getContent = (value, lang) => {
        if (value) {
          return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
        } else {
          return "Error"
        }
    }

    useEffect(() => {
        console.log(responseVisitorsChart)
        if (responseVisitorsChart && responseVisitorsChart.success && chartLoading && responseVisitorsChart.type === chartTypes[chartType]) {
            setChartLoading(false)
            if (chartTypes[chartType] === "location") {
                
                if (chartDisplay === 0) {
                    const labelsData = []
                    responseVisitorsChart.data.countriesCode.map((country, i) => {
                        labelsData.push({
                            size:responseVisitorsChart.data.counter[i]/200,
                            lat: responseVisitorsChart.data.labels[i][0],
                            lng: responseVisitorsChart.data.labels[i][1],
                            color: "red"
    
                        })
                    })
                    setData(labelsData)
                } else {
                    let labels = responseVisitorsChart.data.countriesCode
                    const counter = responseVisitorsChart.data.counter
                 
                    setData({
                        labels,
                        datasets: [
                            {
                                label: t('visitors'),
                                data: counter,
                                borderColor: 'rgb(255, 255, 255)',
                                
                                backgroundColor: labels.map((l, i) => {
                                    if ((i+1)%2) {
                                        return 'rgba(7, 155, 233, ' + (1.3-(i/5)) + ')'
                                    } else return 'rgba(12, 230, 178, ' + (1.3-(i/5)) + ')'
                                }),
                            }
                        ]
                    })
                }
            } else {
                const labels = responseVisitorsChart.data.labels
                const counter = responseVisitorsChart.data.counter
                setData({
                    labels,
                    datasets: [
                        {
                            label: t('visitors'),
                            data: counter,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.7)',
                        }
                    ]
                })
            }
            
        }
    }, [responseVisitorsChart])

    

    useEffect(() => {
        if (!chartLoading) {
            setData(false)

            setChartLoading(true)
            getVisitorsChart({
                chartRange: chartType === 0 ? chartRanges[chartRange] : chartRanges[0],
                chartType: chartTypes[chartType]
            })
        }
    }, [chartRange, chartType, chartDisplay])

    

    return <>
        <div className="ml-2 pl-2">
            <div className="container is-flex is-justify-content-start mb-6">
                <div className="mr-4  mb--1">
                    <div className="dropdown is-active visitordropdown" onMouseEnter={() => setChartTypeDropdown(true)} onMouseLeave={() => setChartTypeDropdown(false)}>
                        <div className="dropdown-trigger">
                            <button className="button tag is-medium is-primary pt-0 pb-0 has-text-monospace">
                                {t(chartTypes[chartType])}
                                &nbsp;
                                {chartTypeDropdown ? <FontAwesomeIcon icon={faChevronUp}/>  : <FontAwesomeIcon icon={faChevronDown}/> }
                            </button>
                        </div>
                        {chartTypeDropdown ? <div className="dropdown-menu ">
                            <div className="dropdown-content dropdown-dashboard">
                                {chartTypes.map((type, i) => {
                                    if (chartType !== i) {
                                        return <Fragment key={type}>
                                         <a className="dropdown-item has-text-left" onClick={() => {
                                            setChartType(i)
                                            
                                            setChartTypeDropdown(false)
                                         }}>
                                            {t(type)}
                                        </a>
                                    </Fragment>
                                    }
                                })}
                                
                            </div>
                        </div> : null}
                    </div>
                    {chartType === 0 ? <div className="dropdown is-active" onMouseEnter={() => setChartRangeDropdown(true)} onMouseLeave={() => setChartRangeDropdown(false)}>
                        <div className="dropdown-trigger">
                            <button className="button tag is-medium is-grey pt-0 pb-0 ml-2 has-text-monospace">
                                {t(chartRanges[chartRange])}
                                &nbsp;
                                {chartRangeDropdown ? <FontAwesomeIcon icon={faChevronUp}/>  : <FontAwesomeIcon icon={faChevronDown}/> }
                            </button>

                        </div>
                        {chartRangeDropdown ? <div className="dropdown-menu ml-2">
                            <div className="dropdown-content dropdown-dashboard">
                                {chartRanges.map((type, i) => {
                                    if (chartRange !== i) {
                                        return <Fragment key={type}>
                                         <a className="dropdown-item has-text-left" onClick={() => {
                                            setChartRange(i)
                                            setChartRangeDropdown(false)
                                            
                                         }}>
                                            {t(type)}
                                        </a>
                                    </Fragment>
                                    }
                                })}
                            </div>
                        </div> : null}
                    </div> : null}
                    {chartType === 1 ? <div className="dropdown is-active visitordropdown" onMouseEnter={() => setChartDisplayDropdown(true)} onMouseLeave={() => setChartDisplayDropdown(false)}>
                        <div className="dropdown-trigger">
                            <button className="button tag is-medium is-grey pt-0 pb-0 ml-2 has-text-monospace">
                                {t(chartDisplays[chartDisplay])}
                                &nbsp;
                                {chartDisplayDropdown ? <FontAwesomeIcon icon={faChevronUp}/>  : <FontAwesomeIcon icon={faChevronDown}/> }
                            </button>

                        </div>
                        {chartDisplayDropdown ? <div className="dropdown-menu ml-2">
                            <div className="dropdown-content dropdown-dashboard">
                                {chartDisplays.map((type, i) => {
                                    if (chartDisplay !== i) {
                                        return <Fragment key={type}>
                                         <a className="dropdown-item has-text-left" onClick={() => {
                                            setChartDisplay(i)
                                            setChartDisplayDropdown(false)
                                           
                                         }}>
                                            {t(type)}
                                        </a>
                                    </Fragment>
                                    }
                                })}
                            </div>
                        </div> : null}
                    </div> : null}
                    
                </div>
                
            </div>

            {chartLoading || !data ? <div className="loader mt-6 pt-6">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div> : chartTypes[chartType] !== "location" && data && data.datasets && data.datasets[0] ? <Line
            options={options}
            data={data}
            
            /> : data && ((chartDisplay === 0 && data[0]) || (data.datasets && chartDisplay === 1)) ? <>
           
             <div className="max-40 is-pointer">
                <Pie data={data} options={
                    {responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom"
                          }
                     
                    }}
                }/>
                </div>
            </> :  null}
           
            
           
        </div>
        
    </>
}

export default VisitorsDash