import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import axios from "axios";
import { format } from "timeago.js";

import Register from "./components/Register";
import Login from "./components/Login";

import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';

import "./App.css";

const App = () => {

  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude:  55.751244,
    longitude: 37.618423,
    zoom: 5
  });
  const [showPopup, togglePopup] = React.useState(false);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     alert("GeoLocation is Available!");
  //   } else {
  //     alert("Sorry Not available!");
  //   }
  // }, []);

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("pins");
        setPins(response.data)
      } catch (err){
        console.log(err)
      }
    }
    getPins();
  }, []);


  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude: lat, longitude: long});
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;

    setNewPlace({
      lat,
      long
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/dmitriy-yakovlev-js/ckshsfk0a0bel17pf1j2rurwf"
        onDblClick={handleAddClick}
        transitionDuratio="200"
      >
        {pins.map((p) => (
          <>
          <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 3,5} offsetTop={-viewport.zoom * 7}>
            <RoomIcon style={{ fontSize: viewport.zoom * 7, 
                               color: p.username === currentUser ? "tomato" : "slateblue", 
                               cursor: "pointer" }}
                      onClick={() => handleMarkerClick(p._id, p.lat, p.long)}          
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setCurrentPlaceId(null)}
              >
              <div className="card">
                  <div className="placeBlock">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                  </div>
                  <div className="reviewBlock">
                    <label>Review</label>
                    <p className="description">{p.description}</p>
                  </div>
                  <div className="ratingBlock">
                    <label className="stars">Rating</label>
                    <div className="starIconsBlock">
                      {Array(p.rating).fill(<StarIcon className="star" />)}
                    </div>
                  </div>
                  <div className="informationBlock">
                    <label>Information</label>
                    <span className="user">Created by <b>{p.username}</b></span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
              </div>
            </Popup>
          )}
          </>
        ))}
        {newPlace && (
          <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" onClick={(e) => setTitle(e.target.value)}/>
                <label>Review</label>
                <textarea placeholder="Say us something about this place" onClick={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select onClick={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser 
        ? (<button className="button logout">Log out</button>) 
        : (<div className="buttons">
            <button className="button login"  onClick={() => setShowLogin(true)}>Login</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>)}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} />}
      </ReactMapGL>
    </div>
  );
};

export default App;