import React,{useState, useEffect} from 'react';
import { FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat} from "./util"
import LineGraph from './LineGraph';
import GitHubIcon from '@material-ui/icons/GitHub';
import "leaflet/dist/leaflet.css"
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796})
  const [mapCenter, setMapCenter] = useState({lat:20, lng:70})
  const [mapCountries, setMapCountries] = useState([])
  const [mapZoom, setMapZoom] = useState(2)
  const [casesType, setCasesType] = useState("cases")



  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data)
    })
  }, [])
  useEffect(() => {
    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>{
       const countries = data.map((country)=>({
           name: country.country,
           value:country.countryInfo.iso2,
         }));
         const sortedData = sortData(data);
         setTableData(sortedData);
         setMapCountries(data);
         setCountries(countries);
      });
      
    };
    getCountriesData();
 },[]);
 const onCountrychange =async (event)=>{
   const countryCode=event.target.value
   setCountry(countryCode);
   const url =countryCode === 'wordlwide'? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
   await fetch(url)
   .then(response => response.json())
   .then(data =>{
    setCountry(countryCode);
    setCountryInfo(data);
    setMapCenter([data.countryInfo.lat, data.countryInfo.long])
    setMapZoom(4);
   })
 };

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <div className="app__title">
        <h1>COVID-19 TRACKER</h1>
        <h5 className="app__creater">Developed by Aadvik Dhilip</h5>
        </div>
          <div className="header__github">
              {/* <img src="" alt=""/> */}
              <a href="https://github.com/dhilip1201/covid-19-tracker" target="_blank">
              <GitHubIcon />GitHub
              </a>
            </div>
      <FormControl className="app__formcontrol">
        <Select className="app_dropdown"
          varient="outlined"
          onChange={onCountrychange}
          value={country}
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>
         {
            countries.map(country=> 
            <MenuItem value={country.value}>{country.name} </MenuItem>)
          }
          
          
        </Select>
      </FormControl>
      </div>
      <div className="app_status">
        <InfoBox 
        isRed
        active = {casesType === 'cases'}
         onClick={e=>setCasesType('cases')}
        title="Coronavirus cases" 
        cases={prettyPrintStat(countryInfo.todayCases)} 
        total={prettyPrintStat(countryInfo.cases)}
         />
        <InfoBox 
        
        active = {casesType === 'recovered'}
        onClick={e=>setCasesType('recovered')}
        title="Recovered" 
        cases={prettyPrintStat(countryInfo.todayRecovered)} 
        total={prettyPrintStat(countryInfo.recovered)}
         />
        <InfoBox 
        isRed
        active = {casesType === 'deaths'}
         onClick={e=>setCasesType('deaths')}
        title="Deaths" 
        cases={prettyPrintStat(countryInfo.todayDeaths)} 
        total={prettyPrintStat(countryInfo.deaths)} 
        />
      </div>
      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />

            <h3 className="app__graphtitle">World wide new {casesType}</h3>
            
            <LineGraph className="app__graph" casesType={casesType}/>
          </CardContent>
      </Card>
      
     
    </div>
  );
}

export default App;




