declare module 'mapbox-gl' {
  interface MapboxOptions {
    container: string | HTMLElement;
    style: string;
    center?: [number, number];
    zoom?: number;
    attributionControl?: boolean;
    [key: string]: any;
  }

  interface LngLat {
    lng: number;
    lat: number;
  }

  interface MarkerOptions {
    element?: HTMLElement;
    anchor?: string;
    offset?: [number, number];
  }

  interface PopupOptions {
    offset?: number | [number, number];
    closeButton?: boolean;
    closeOnClick?: boolean;
    maxWidth?: string;
  }

  class Map {
    constructor(options: MapboxOptions);
    addControl(control: any, position?: string): this;
    on(event: string, callback: () => void): this;
    remove(): void;
    setCenter(center: [number, number]): this;
    setZoom(zoom: number): this;
    flyTo(options: { center: [number, number]; zoom?: number }): this;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setLngLat(lngLat: [number, number] | LngLat): this;
    addTo(map: Map): this;
    remove(): this;
  }

  class Popup {
    constructor(options?: PopupOptions);
    setLngLat(lngLat: [number, number] | LngLat): this;
    setHTML(html: string): this;
    addTo(map: Map): this;
    remove(): this;
  }

  class NavigationControl {
    constructor(options?: any);
  }

  class GeolocateControl {
    constructor(options?: any);
  }

  const accessToken: string;
} 