import React, { useState, useEffect } from 'react'
import { geoPath, geoOrthographic } from 'd3-geo'
import { feature } from 'topojson-client'
import { Feature, FeatureCollection, Geometry } from 'geojson'

import AnimationFrames from '../hooks/AnimationFrames'
// import './WorldMap.scss'

const uuid = require('react-uuid')

const scale: number = 200
const cx: number = 400
const cy: number = 150

const WorldMap = () => {
    const [geographies, setGeographies] = useState<[] | Array<Feature<Geometry | null>>>([]);
    const [isRotate, setIsRotate] = useState<boolean>(true);
    const [rotation, setRotation] = useState<number>(0);

    useEffect( () => {
        fetch('/data/globeData.json').then((response) => {
            console.log('RESPONSE: ', response)
            if (response.status !== 200) {
              console.log(`Houston we have a problem: ${response.status}`)
              return
            }
            response.json().then((worldData) => {
                console.log('WORLD DATA: ', worldData)
                const mapFeatures: Array<Feature<Geometry | null>> = ((feature(worldData, worldData.objects.countries) as unknown) as FeatureCollection).features
        setGeographies(mapFeatures)
      })
    })
    }, [])

    const projection = geoOrthographic()
        .scale(scale)
        .translate([cx, cy])
        .rotate([rotation, 0])

    AnimationFrames(() => {
        if (isRotate) {
          let newRotation = rotation;
          if (rotation >= 360) {
            newRotation = rotation - 360;
          }
          setRotation(newRotation + 0.2);
        }
      });

    return (
        <>
        <button
            onClick={() => {
                setIsRotate(true)
              }}
        >
            Click
        </button>
          <svg width={scale * 3} height={scale * 3} viewBox="0 0 800 450">
          <g>
            <circle
            fill="#0098c8"
            cx={cx}
            cy={cy}
            r={scale}
            />
        </g>
            <g>
              {(geographies as []).map((d, i) => (
                <path
                  key={`path-${uuid()}`}
                  d={geoPath().projection(projection)(d) as string}
                  fill={`rgba(38,50,56,${(1 / (geographies ? geographies.length : 0)) * i})`}
                  stroke="aliceblue"
                  strokeWidth={0.5}
                />
              ))}
            </g>
          </svg>
        </>
      )

}

export default WorldMap;