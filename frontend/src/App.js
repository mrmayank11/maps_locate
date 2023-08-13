import * as React from 'react';
import { useState, useEffect } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ReactMapGL, { Marker, Popup } from '!react-map-gl';// eslint-disable-line import/no-webpack-loader-syntax
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { format } from 'timeago.js';
import Login from './components/Login';
import Register from './components/Register';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
// import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker';
// mapboxgl.workerClass = MapboxWorker;

// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// added the following 6 lines.
// import mapboxgl from 'mapbox-gl';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
function App() {

  const [pins, setPins] = useState([]);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const [currUser, setCurrUser] = useState(null)
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceDesc, setNewPlaceDesc] = useState("");

  const [newRating, setNewRating] = useState(1);

  // console.log(pins);
  const [viewState, setViewState] = React.useState({
    longitude: 50,
    latitude: 37,
    zoom: 4,
  });

  const loginwindow = (e) => {
    e.preventDefault();
    setRegister(false);
    setLogin(true);
  }
  const logoutclick = (e) => {
    e.preventDefault();
    setCurrUser(null)
  }
  const registerwindow = (e) => {
    e.preventDefault();
    setLogin(false);
    setRegister(true);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {

      username: currUser,
      desc: newPlaceDesc,
      title: newPlaceName,
      rating: newRating,
      long: newPlace.long,
      lat: newPlace.lat
    }
    setNewPlace(null)


    try {
      const res = await axios.post('http://localhost:8080/pins', newPin);
      // console.log(res.data);
      setPins([...pins, res.data])
    } catch (error) {
      console.log(error);
    }


  }
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
  };
  const handleAddClick = (e) => {
    e.preventDefault();
    if (currUser == null) {
      setLogin(true)
    }
    else {
      setCurrentPlaceId(null);
      const lat = e.lngLat.lat;
      const long = e.lngLat.lng;

      setNewPlace(
        {
          lat,
          long
        }
      )
    }

  };
  console.log(pins);
  useEffect(() => {

    const getPins = async () => {
      // let res = ''
      try {
        const res = await (axios.get('http://localhost:8080/pins'))
        setPins(res.data)

      } catch (error) {
        console.log(error);
      }
      // setPins(res.data)
      // console.log(pins.length);
    }

    getPins();
  }, [])

  // console.log(currUser)
  return (

    <ReactMapGL
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"

      onDblClick={(handleAddClick)}
    >
      ({
        // console.log(pins) &&
        // (pins.length) &&
        Array.isArray(pins)
          ? (

            pins.map((pins) => (
              // console.log()
              <div key={pins._id}>
                <Marker longitude={pins.long} latitude={pins.lat} anchor="bottom" rotationAlignment="map" pitchAlignment="map" >
                  <LocationOnIcon
                    style={{ cursor: "pointer" }}
                    // (newUser ==={p.username} ?)
                    className={(currUser) === pins.username ? ' text-red-500' : ' text-violet-700'}

                    // 
                    onClick={() => handleMarkerClick(pins._id)}
                  />
                </Marker>

                {
                  // console.log(p._id) &&
                  pins._id === currentPlaceId &&
                  (
                    <Popup
                      key={pins._id}
                      latitude={pins.lat}
                      longitude={pins.long}
                      closeButton={true}
                      closeOnClick={false}
                      onClose={() => setCurrentPlaceId(null)}
                      anchor="left"
                    >
                      <div className=' flex-col p-1 space-y-1 '>
                        <div className=' '>
                          <p className=' font-semibold text-red-500 border-b border-red-400'>Place</p>
                          <h4>{pins.title}</h4>
                        </div>

                        <div>
                          <p className=' font-semibold  text-red-500 border-b border-red-400'>Review</p>
                          <p>{pins.desc}</p>
                        </div>
                        <div className=' text-yellow-400'>
                          {Array(pins.rating).fill(<StarIcon />)}

                        </div>
                        <div>
                          <p className=' font-semibold  text-red-500 border-b border-red-400'>Information</p>
                          <p>Created by <b>{pins.username}</b></p>
                          <p> {format((pins.createdAt))}</p>
                        </div>
                      </div>
                    </Popup>

                  )


                }
                {
                  newPlace != null &&
                  <Popup
                    // key={p._id}
                    latitude={newPlace.lat}
                    longitude={newPlace.long}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setNewPlace(null)}
                    anchor="left"
                  >

                    <form className=' flex-col p-1 space-y-1 ' onSubmit={handleSubmit}>
                      <div className=' '>
                        <p className=' font-semibold text-red-500 border-b border-red-400'>Place</p>
                        <input type='text' placeholder='Enter Place' className=' border-none  focus:outline-none ' onChange={(e) => (setNewPlaceName(e.target.value))} />
                      </div>
                      <div>
                        <p className=' font-semibold  text-red-500 border-b border-red-400'>Description</p>
                        <textarea placeholder='Enter Description ' className='  focus:outline-none ' onChange={(e) => (setNewPlaceDesc(e.target.value))}></textarea>

                      </div>
                      <div>
                        <p className=' font-semibold  text-red-500 border-b border-red-400'>Rating</p>
                        <input type="number" min={1} max={5} className=' focus:outline-none  w-full' onChange={(e) => (setNewRating(e.target.value))} />
                      </div>


                      <div className=''>
                        <button className=' w-full  text-white bg-red-400' type='submit'>
                          Add Pin
                        </button>
                      </div>



                    </form>

                  </Popup>

                }
              </div>)
            )
          ) : []})
      {currUser ?
        (<div className='absolute z-10 top-1 right-1 p-2'>
          <button className=' bg-blue-600 text-white p-2 rounded-lg w-20 m-1' onClick={logoutclick}>Logout</button>
        </div>)
        :
        <div className='absolute z-10 top-1 right-1 p-2'>
          <button className=' bg-red-600 text-white p-2 rounded-lg w-20 m-1' onClick={loginwindow}>Login</button>
          <button className=' bg-green-600 text-white p-2 rounded-lg w-20 m-1' onClick={registerwindow}>Register</button>
        </div>}

      {login &&
        <Login setCurrUser={setCurrUser} setLogin={setLogin} />
      }

      {register &&
        <Register setCurrUser={setCurrUser} setRegister={setRegister} />
      }
    </ReactMapGL>




  );
}

export default App;
