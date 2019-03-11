import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
      imageUrl: '',
      box: {},
      route: 'signin', // keeps track of where we are in the page
      isSignedIn: false
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  // EVENT LISTENER onInputChange (pass it as a prop into ImageLinkForm here inside this class and into ImageLinkForm.js)
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}) 
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input) // setState() in React is asynchronous, so here we CAN'T put this.state.imageUrl;
      // One way to go around this issue is to use a callback function: 
      // setState(updater, callback)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    // destructuring
    const { isSignedIn, box, route } = this.state;
    return (
      <div className='App'>
        <Particles className='particles'
         params={particlesOptions} 
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              {/* this. is needed because it is part of the class, onInputChange is a property of the app */}
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              /> 
              <FaceRecognition box={box} imageUrl={this.state.imageUrl}/>
            </div>
          : (
              route === 'signin' 
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
