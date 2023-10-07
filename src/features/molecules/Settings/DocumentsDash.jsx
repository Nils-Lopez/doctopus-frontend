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
import { useUsers } from "../../../utils/hooks/Users";

import { useTranslation } from "react-i18next";
import SearchItem from "../../atoms/docs/SearchItem";
import {useNavigate} from 'react-router-dom';
import { read_cookie } from 'sfcookies';

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
 
const DocumentsDash = ({}) => {
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
    const [docTypes, setDocTypes] = useState(0)
    const [docTypesDropdown, setDocTypesDropdown] = useState(false)   

    const chartTypes = ["date-added", "publication-date", "types"]
    const chartRanges = ['since-ever', 'this-year']


    const [chartLoading, setChartLoading] = useState(false)
    const [data, setData] = useState(false)
    const [historyRange, setHistoryRange] = useState("0-15")
    const [history, setHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)

    const {
        getDocsChart,
        responseDocsChart,
        getDocsHistory,
        responseDocsHistory
    } = useDashboard()

    useEffect(() => {
        if (!data && !chartLoading) {
            setChartLoading(true)
            getDocsChart({
                chartRange: chartType === 0 ? chartRanges[chartRange] : chartRanges[0],
                chartType: chartTypes[chartType]
            })
        } 
        if (!history[0] && !historyLoading) {
            setHistoryLoading(true)
            getDocsHistory(historyRange)
        }
    }, [])

    const getContent = (value, lang) => {
        if (value && typeof value === "array") {
          return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
        } else {
          return "Error"
        }
      }

    useEffect(() => {
        if (responseDocsChart && responseDocsChart.success && chartLoading) {
            setChartLoading(false)
            if (chartTypes[chartType] === "types") {
                let labels = responseDocsChart.data.labels
                const counter = responseDocsChart.data.counter
                labels = labels.map((l) => {
                    return l.filter(obj => obj.lang === i18n.language)[0].content
            
                })
                setData({
                    labels,
                    datasets: [
                        {
                            label: t('created-docs'),
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
            } else {
                const labels = responseDocsChart.data.labels
                const counter = responseDocsChart.data.counter
                setData({
                    labels,
                    datasets: [
                        {
                            label: t('created-docs'),
                            data: counter,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.7)',
                        }
                    ]
                })
            }
            
        }
    }, [responseDocsChart])

    

    useEffect(() => {
        if (!chartLoading) {
            setChartLoading(true)
            getDocsChart({
                chartRange: chartType === 0 ? chartRanges[chartRange] : chartRanges[0],
                chartType: chartTypes[chartType]
            })
        }
    }, [chartRange, chartType])

    useEffect(() => {
        if (!historyLoading && !history[0]) {
            setHistoryLoading(true)
            getDocsHistory(historyRange)
        }
    }, [historyLoading, historyRange])

    useEffect(() => {
        if (historyLoading && responseDocsHistory && responseDocsHistory.success && responseDocsHistory.data !== history) {

            setHistory(responseDocsHistory.data)
            setHistoryLoading(false)
        } 
    }, [responseDocsHistory])

    const navigate = useNavigate()

    const [client, setClient] = useState(false)
    const [loadingClient, setLoadingClient] = useState(false)

    const cookieKey = "VISITOR_COOKIE_TOKEN"

        //Fetch Users API
        const {
            responseFindUserById,
            findUserById
        } = useUsers()
    
        useEffect(() => {
            //Check for cookies
            if (read_cookie(cookieKey).id && !client && !loadingClient) {
                findUserById(read_cookie(cookieKey).id)
                setLoadingClient(true)
            }
        }, [])
    
        //Restore session and user data from cookie
        useEffect(() => {
            if (responseFindUserById && loadingClient) {
                if (responseFindUserById.success) {
                    setClient({user: responseFindUserById.data })
                    setLoadingClient(false)
                } 
            }
        }, [responseFindUserById, loadingClient])

    return <>
        <div className="ml-2 pl-2">
            <div className="container is-flex is-justify-content-start mb-6">
                <div className="mr-4  mb--1">
                    <div className="dropdown is-active" onMouseEnter={() => setChartTypeDropdown(true)} onMouseLeave={() => setChartTypeDropdown(false)}>
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
                    
                    
                </div>
                
            </div>

            {chartLoading || !data ? <div className="loader mt-6 pt-6">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div> : chartTypes[chartType] !== "types" ? <Line
            options={options}
            data={data}
            
            /> : <>
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
            </>}
            {client && client.user && client.user.drafts && client.user.drafts[0] && client.user.drafts[0].title && client.type !== "visitor" ? <>
            <hr className="mr-5 pr-2 mb-3 mt-4" />
            <h4 className="subtitle is-6 has-text-grey mb-1 has-text-right mr-4 pr-2 pt-0">
                    {t('drafts')}
                </h4>                
            <div className="columns is-multiline pb-3 mb-4 mt-0 pt-0">
                    {client.user.drafts.map((item, index) => {

                    return <Fragment key={JSON.stringify(item)}>
                    <SearchItem item={{doc: item}} setDisplay={(doc) => {
                            navigate('/document/' + doc._id)
                        }} i={index}/>
                </Fragment>

                    
                    })}
                </div>
            </>: null}
            <hr className="mr-5 pr-2 mb-3 mt-4" />
            <div className="is-flex is-justify-content-space-between">
                
                <div className="mt--1">
                    {historyRange[0] !== "0" ? <button className="button is-white" onClick={() => {
                        setHistoryRange((historyRange.split('-')[0]*1 - 15) + "-" + (historyRange.split('-')[1]*1 - 15))
                        setHistory([])
                    }}><FontAwesomeIcon icon={faAngleLeft} className=" is-size-4 has-text-grey"/></button> :null}

                    <button className="button is-white" onClick={() => {
                        setHistoryRange((historyRange.split('-')[0]*1 + 15) + "-" + (historyRange.split('-')[1]*1 + 15))
                        setHistory([])
                    }}><FontAwesomeIcon icon={faAngleRight} className=" is-size-4 has-text-grey"/></button>
                </div>
                <h4 className="subtitle is-6 has-text-grey mb-1 has-text-right mr-4 pr-2 pt-0">
                    {t('history')}
                </h4>
            </div>
            
            <div className="columns is-multiline mb-6 mr-2 pl-1 pr-2">
                {!historyLoading ? history?.map((doc, i) => {
                    return <Fragment key={JSON.stringify(doc)}>
                        <SearchItem item={{doc: doc}} setDisplay={(doc) => {
                            navigate('/document/' + doc._id)
                        }} i={i}/>
                    </Fragment>
                }) : <div className="loader mt-6 pt-6">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div>}
            </div>
        </div>
        
    </>
}

export default DocumentsDash