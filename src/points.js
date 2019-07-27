

const castPoint = value => {
  if (Array.isArray(value)) {
    const [head, tail] = value;
    return { x: head, y: tail };
  }

  if (typeof (value) == 'object') {
    const { x, y } = value;
    return { x, y };
  }

  return { x: value, y: value };
};

export const sumPoints = (...points) => points.reduce(
  (result, value) => {
    const point = castPoint(value);
    if (!result) return { ...point };
    result.x += point.x;
    result.y += point.y;
    return result;
  },
  null,
);

export const minusPoints = (...points) => points.reduce(
  (result, value) => {
    const point = castPoint(value);
    if (!result) return { ...point };
    result.x -= point.x;
    result.y -= point.y;
    return result;
  },
  null,
);

export const multiplyPoints = (...points) => points.reduce(
  (result, value) => {
    const point = castPoint(value);
    if (!result) return { ...point };
    result.x *= point.x;
    result.y *= point.y;
    return result;
  },
  null,
);

export const dividePoints = (...points) => points.reduce(
  (result, value) => {
    const point = castPoint(value);
    if (!result) return { ...point };
    result.x /= point.x;
    result.y /= point.y;
    return result;
  },
  null,
);

export const applyZoom = (point, zoom = 1) => multiplyPoints(point, zoom);
