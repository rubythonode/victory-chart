import React from "react";
import {
  VictoryChart, VictoryGroup, VictoryStack, VictoryScatter, VictoryBar, VictoryLine,
  VictoryBrushContainer, VictoryZoomContainer, VictoryAxis
} from "../../src/index";

class App extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  handleZoom(domain) {
    this.setState({selectedDomain: domain});
  }

  handleBrush(domain) {
    this.setState({zoomDomain: domain});
  }

  render() {
    const containerStyle = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center"
    };

    const chartStyle = {parent: {border: "1px solid #ccc", margin: "2%", maxWidth: "40%"}};

    return (
      <div className="demo">
        <div style={containerStyle}>
          <VictoryChart width={800} height={500} scale={{x: "time"}}
            containerComponent={
              <VictoryZoomContainer responsive={false}
                zoomDomain={this.state.zoomDomain}
                onDomainChange={this.handleZoom.bind(this)}
              />
            }
          >
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={[
                {x: new Date(1982, 1, 1), y: 125},
                {x: new Date(1987, 1, 1), y: 257},
                {x: new Date(1993, 1, 1), y: 345},
                {x: new Date(1997, 1, 1), y: 515},
                {x: new Date(2001, 1, 1), y: 132},
                {x: new Date(2005, 1, 1), y: 305},
                {x: new Date(2011, 1, 1), y: 270},
                {x: new Date(2015, 1, 1), y: 470}
              ]}
            />

          </VictoryChart>
          <VictoryChart
            padding={{top: 0, left: 50, right: 50, bottom: 30}}
            width={800} height={100} scale={{x: "time"}}
            containerComponent={
              <VictoryBrushContainer responsive={false}
                selectedDomain={this.state.selectedDomain}
                onDomainChange={this.handleBrush.bind(this)}
              />
            }
          >
            <VictoryAxis
              tickValues={[
                new Date(1985, 1, 1),
                new Date(1990, 1, 1),
                new Date(1995, 1, 1),
                new Date(2000, 1, 1),
                new Date(2005, 1, 1),
                new Date(2010, 1, 1)
              ]}
              tickFormat={(x) => new Date(x).getFullYear()}
            />
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={[
                {x: new Date(1982, 1, 1), y: 125},
                {x: new Date(1987, 1, 1), y: 257},
                {x: new Date(1993, 1, 1), y: 345},
                {x: new Date(1997, 1, 1), y: 515},
                {x: new Date(2001, 1, 1), y: 132},
                {x: new Date(2005, 1, 1), y: 305},
                {x: new Date(2011, 1, 1), y: 270},
                {x: new Date(2015, 1, 1), y: 470}
              ]}
            />

          </VictoryChart>

          <VictoryChart style={chartStyle}
            containerComponent={
              <VictoryBrushContainer/>
            }
          >
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={[
                {x: 1, y: -5},
                {x: 2, y: 4},
                {x: 3, y: 2},
                {x: 4, y: 3},
                {x: 5, y: 1},
                {x: 6, y: -3},
                {x: 7, y: 3}
              ]}
            />
            <VictoryLine
              style={{
                data: {stroke: "blue"}
              }}
              data={[
                {x: 1, y: -3},
                {x: 2, y: 5},
                {x: 3, y: 3},
                {x: 4, y: 0},
                {x: 5, y: -2},
                {x: 6, y: -2},
                {x: 7, y: 5}
              ]}
            />
            <VictoryLine
              data={[
                {x: 1, y: 5},
                {x: 2, y: -4},
                {x: 3, y: -2},
                {x: 4, y: -3},
                {x: 5, y: -1},
                {x: 6, y: 3},
                {x: 7, y: -3}
              ]}
            />
          </VictoryChart>

          <VictoryScatter
            style={{
              parent: chartStyle.parent,
              data: {
                fill: (datum, active) => active ? "tomato" : "black"
              }
            }}
            domain={{x: [0, 10], y: [-5, 5]}}
            containerComponent={
              <VictoryBrushContainer
                selectedDomain={{x: [0, 10], y: [-5, 5]}}
              />
            }
            size={(datum, active) => active ? 5 : 3}
            data={[
              {x: 1, y: -5},
              {x: 2, y: 4},
              {x: 3, y: 2},
              {x: 4, y: 3},
              {x: 5, y: 1},
              {x: 6, y: -3},
              {x: 7, y: 3}
            ]}
          />

          <VictoryScatter
            style={{
              parent: chartStyle.parent,
              data: {
                fill: (datum, active) => active ? "tomato" : "black"
              }
            }}
            containerComponent={
              <VictoryBrushContainer/>
            }
            size={(datum, active) => active ? 5 : 3}
            y={(d) => d.x * d.x}
          />

          <VictoryGroup style={chartStyle}
            containerComponent={
              <VictoryBrushContainer/>
            }
          >
            <VictoryScatter
              style={{
                data: {fill: "tomato"}
              }}
              size={(datum, active) => active ? 5 : 3}
              data={[
                {x: 1, y: -5},
                {x: 2, y: 4},
                {x: 3, y: 2},
                {x: 4, y: 3},
                {x: 5, y: 1},
                {x: 6, y: -3},
                {x: 7, y: 3}
              ]}
            />
            <VictoryScatter
              style={{
                data: {fill: "blue"}
              }}
              size={(datum, active) => active ? 5 : 3}
              data={[
                {x: 1, y: -3},
                {x: 2, y: 5},
                {x: 3, y: 3},
                {x: 4, y: 0},
                {x: 5, y: -2},
                {x: 6, y: -2},
                {x: 7, y: 5}
              ]}
            />
            <VictoryScatter
              data={[
                {x: 1, y: 5},
                {x: 2, y: -4},
                {x: 3, y: -2},
                {x: 4, y: -3},
                {x: 5, y: -1},
                {x: 6, y: 3},
                {x: 7, y: -3}
              ]}
              size={(datum, active) => active ? 5 : 3}
            />
          </VictoryGroup>

          <VictoryStack style={chartStyle}
            containerComponent={
              <VictoryBrushContainer/>
            }
          >
            <VictoryBar
              style={{
                data: {
                  fill: "tomato",
                  stroke: (d, active) => active ? "black" : "none",
                  strokeWidth: 2
                }
              }}
              size={(datum, active) => active ? 5 : 3}
              data={[
                {x: 1, y: -5},
                {x: 2, y: 4},
                {x: 3, y: 2},
                {x: 4, y: 3},
                {x: 5, y: 1},
                {x: 6, y: -3},
                {x: 7, y: 3}
              ]}
            />
            <VictoryBar
              style={{
                data: {
                  fill: "orange",
                  stroke: (d, active) => active ? "black" : "none",
                  strokeWidth: 2
                }
              }}
              size={(datum, active) => active ? 5 : 3}
              data={[
                {x: 1, y: -3},
                {x: 2, y: 5},
                {x: 3, y: 3},
                {x: 4, y: 0},
                {x: 5, y: -2},
                {x: 6, y: -2},
                {x: 7, y: 5}
              ]}
            />
            <VictoryBar
              style={{
                data: {
                  fill: "gold",
                  stroke: (d, active) => active ? "black" : "none",
                  strokeWidth: 2
                }
              }}
              data={[
                {x: 1, y: 5},
                {x: 2, y: -4},
                {x: 3, y: -2},
                {x: 4, y: -3},
                {x: 5, y: -1},
                {x: 6, y: 3},
                {x: 7, y: -3}
              ]}
            />
          </VictoryStack>
        </div>
      </div>
    );
  }
}

export default App;
