import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: '90afe5e1922e475c9b81939fd49d23a1'
 });

const particlesOptions = {
        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
              value_area: 800
            }
          }
        }      
}

class App extends Component {
  // SET STATE
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  // EVENT LISTENER onInputChange (pass it as a prop into ImageLinkForm here inside this class and into ImageLinkForm.js)
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}) 
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input) {/* setState() in React is asynchronous, so here we CAN'T put this.state.imageUrl;
      One way to go around this issue is to use a callback function: 
      setState(updater, callback)*/}
      .then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        // console.log(this.state.input);
      },
      function(err) {
        // there was an error
      }
    );
  }

  render() {
    return (
      <div className='App'>
        <Particles className='particles'
         params={particlesOptions} 
        />
        <Navigation />
        <Logo />
        <Rank />
        {/* this. is needed because it is part of the class, onInputChange is a property of the app */}
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        /> 
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
