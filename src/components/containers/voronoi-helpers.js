import { Selection, Data, Helpers } from "victory-core";
import { assign, throttle, isFunction, groupBy, keys, isEqual } from "lodash";
import { voronoi as d3Voronoi } from "d3-voronoi";
import React from "react";

const VoronoiHelpers = {
  withinBounds(props, point) {
    const {width, height, voronoiPadding} = props;
    const padding = voronoiPadding || 0;
    const {x, y} = point;
    return x >= padding && x <= width - padding && y >= padding && y <= height - padding;
  },

  getDatasets(props) {
    const addMeta = (data, name) => {
      return data.map((datum, index) => {
        return assign({childName: name, eventKey: index}, datum);
      });
    };

    if (props.data) {
      return addMeta(props.data);
    }

    const getData = (childProps) => {
      const data = Data.getData(childProps);
      return Array.isArray(data) && data.length > 0 ? data : undefined;
    };

    const iteratee = (child, childName, parent) => {
      if (child.type && child.type.role === "axis") {
        return null;
      } else if (child.type && isFunction(child.type.getData)) {
        child = parent ? React.cloneElement(child, parent.props) : child;
        const childData = child.props && child.type.getData(child.props);
        return childData ? addMeta(childData, childName) : null;
      } else {
        const childData = getData(child.props);
        return childData ? addMeta(childData, childName) : null;
      }
    };
    return Helpers.reduceChildren(React.Children.toArray(props.children), iteratee);
  },

  // returns an array of objects with point and data where point is an x, y coordinate, and data is
  // an array of points belonging to that coordinate
  mergeDatasets(props, datasets) {
    const {scale} = props;
    const points = groupBy(datasets, (datum) => {
      const x = scale.x(datum ._x1 !== undefined ? datum ._x1 : datum ._x);
      const y = scale.y(datum ._y1 !== undefined ? datum ._y1 : datum ._y);
      return `${x},${y}`;
    });
    return keys(points).map((key) => {
      const point = key.split(",");
      return {
        x: +point[0],
        y: +point[1],
        points: points[key]
      };
    });
  },

  getVoronoi(props) {
    const {width, height, voronoiPadding} = props;
    const padding = voronoiPadding || 0;
    const voronoiFunction = d3Voronoi()
      .x((d) => d.x)
      .y((d) => d.y)
      .extent([[padding, padding], [width - padding, height - padding]]);
    const datasets = this.getDatasets(props);
    return voronoiFunction(this.mergeDatasets(props, datasets));
  },

  getActiveMutations(point) {
    const {childName, eventKey} = point;
    return ["data", "labels"].map((target) => {
      return {
        childName, eventKey, target, mutation: () => ({active: true })
      };
    });
  },

  getInactiveMutations(point) {
    const {childName, eventKey} = point;
    return ["data", "labels"].map((target) => {
      return {
        childName, eventKey, target, mutation: () => null
      };
    });
  },

  onMouseLeave(evt, targetProps) {
    const activePoints = targetProps.activePoints || [];
    const parentMutations = [{
      target: "parent",
      mutation: () => {
        return { activePoints: [] };
      }
    }];
    return activePoints.reduce((memo, point) => {
      memo = memo.concat(this.getInactiveMutations(point));
      return memo;
    }, [parentMutations]);
  },

  onMouseMove(evt, targetProps) {
    const activePoints = targetProps.activePoints || [];
    const {x, y} = Selection.getSVGEventCoordinates(evt);
    if (!this.withinBounds(targetProps, {x, y})) {
      return activePoints.length && activePoints.reduce((memo, point) => {
        memo = memo.concat(this.getInactiveMutations(point));
        return memo;
      }, []);
    }
    const voronoi = targetProps.voronoi || this.getVoronoi(targetProps); // TODO: animation
    const nearestVoronoi = voronoi.find(x, y, targetProps.size);
    const points = nearestVoronoi ? nearestVoronoi.data.points : [];
    const parentMutations = [{
      target: "parent",
      eventKey: "parent",
      mutation: () => {
        return { activePoints: points, voronoi };
      }
    }];
    if (isEqual(points, activePoints)) {
      return parentMutations;
    } else {
      const activeMutations = points.map((point) => this.getActiveMutations(point));
      const inactiveMutations = activePoints.map((point) => this.getInactiveMutations(point));

      return parentMutations.concat(...inactiveMutations, ...activeMutations);
    }
  }
};

export default {
  onMouseLeave: VoronoiHelpers.onMouseLeave.bind(VoronoiHelpers),
  onMouseMove: throttle(VoronoiHelpers.onMouseMove.bind(VoronoiHelpers), 16, {leading: true})
};