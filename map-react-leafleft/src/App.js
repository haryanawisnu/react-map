import React, { Component } from 'react';
import { icon } from 'leaflet';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet';
import axios from 'axios';

const Myicon = icon({
    iconUrl: 'http://www.qlue.co.id/vacancy/svc/icon-marker.png'});

const road_closed= icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2012/04/13/11/09/icon-31883_960_720.png',
    iconSize: [28, 35]});

const position = [-6.243410, 106.799767];

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      data:[],
      alerts:[],
      status_terminal:true,
      status_road_close:true
    }
    this.handleTerminal=this.handleTerminal.bind(this);
    this.handleRoadCLose=this.handleRoadCLose.bind(this);
  }
  componentDidMount(){
    let self=this;
    axios.get('http://www.qlue.co.id/vacancy/svc/getDataExample.php')
      .then(function(response) {
        self.setState({data: response.data});
    })
    axios.get('http://waze.qlue.id/jakarta/update/0atxn84I3hx2WmNm5ifPDZkJaLERZD9A.json')
      .then(function(response) {
        self.setState({alerts: response.data.alerts});
    })
  }
  handleTerminal(){
    if(this.state.status_terminal){
      this.setState({status_terminal: false});
    }else {
      this.setState({status_terminal: true});
    }
  }
  handleRoadCLose(){
    if(this.state.status_road_close){
      this.setState({status_road_close: false});
    }else {
      this.setState({status_road_close: true});
    }
  }
  render() {
    return (
      <div className="App">
        <Map center={position} zoom={11}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {
            this.state.data.map((data,index) =>{
              if (this.state.status_terminal) {
                return(
                  <Marker position={[data.lat,data.lng]} icon={Myicon} key={data.placemark_id} >
                    <Popup>
                      <span>{data.name}<br/>{data.address}</span>
                    </Popup>
                  </Marker>
                )
              }
            })}
          {
            this.state.alerts.map((data,index) =>{
                if(data.type==='ROAD_CLOSED'&&this.state.status_road_close){
                  console.log(data);
                  return(
                    <Marker position={[data.location.y,data.location.x]} icon={road_closed} key={data.uuid} >
                      <Popup>
                        <span>{data.subtype},<br/>{data.street},<br/>{data.reportDescription}</span>
                      </Popup>
                    </Marker>
                  )
                }
            })
          }
        </Map>
        <div style={{textAlign: 'center'}}>
          <p>Terminal</p>
            <input type="button" value={this.state.status_terminal} onClick={this.handleTerminal} />
          <p>Road CLose</p>
            <input type="button" value={this.state.status_road_close} onClick={this.handleRoadCLose}/>
        </div>
      </div>
    );
  }
}
export default App;
