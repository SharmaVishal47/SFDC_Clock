import React, { Component } from 'react';
import AnalogClock from './AnalogClock.js'
import {Col, Row} from "antd";
import DynamicFieldSet from "./store/DynamicFieldSet";


class App extends Component {








  constructor(props) {
    super(props);
    this.state = {
      options: {
        width: "100px",
        border: true,
        borderColor: "#2e2e2e",
        baseColor: "#17a2b8",
        centerColor: "#459cff",
        handColors: {
          second: "#d81c7a",
          minute: "#fff",
          hour: "#fff"
        }
      }
    };
    this.customizeClock = this.customizeClock.bind(this);
  }

  customizeClock(options) {
    this.setState({ options: { ...options } });
  }

  render() {
    return (
      <div>

        <DynamicFieldSet/>


          <Row>
              <Col span={20} offset={4}>
                  <h4><i>Select Clock</i></h4>
                  <AnalogClock {...this.state.options} />
              </Col>
          </Row>

      </div>
    );
  }
}

export default App;