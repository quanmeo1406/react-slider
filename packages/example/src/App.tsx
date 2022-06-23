import React, {ChangeEvent, useState} from 'react';
import styled from "styled-components";
import {Slider} from "@moclei/react-neumorphic-slider";
import ThemeCheck from "./components/Checkbox/ThemeCheck";
import {ColorResult, SketchPicker} from 'react-color';
import hexRgb from 'hex-rgb';

const Color = require('color');

interface StyledAppProps {
    dark: boolean;
    background: string;
}
const StyledApp = styled.div<StyledAppProps>`
  text-align: center;
  background-color: ${props => props.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: calc(10px + 2vmin);
  color:  ${props => props.dark ? "white" : "black"};
`;

const customTheme = {
    primary: '#aa0660',
    background: '#444444',
    bgDarkShadow: '#222222',
    bgLightShadow: '#575757',
    text: 'rgba(255, 255, 255, 0.87)',
    textDisabled: 'rgba(255, 255, 255, 0.38)',
    textSecondary: 'rgba(255, 255, 255, 0.60)',
    bgDisabled: '#727272',
    selectorBg: '#aa0660',
}

function App() {
    const [checkVal, setCheckVal] = useState<boolean>(false);
    const [color, setColor ] = useState( checkVal ? "#444444" : "#E4EBF5");
    const [theme, setTheme] = useState(customTheme)
    const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checkVal = event.target.checked
        console.debug("checkVal: ", checkVal);
        setCheckVal(checkVal);
        setColor(checkVal ? "#444444" : "#E4EBF5")
    }

    const handleSuggestColors = () => {
        const rgbBackground = Color(hexRgb(color, {format: 'css'}));
        console.debug("handleSuggestColors, darkMode? ", checkVal);
        console.debug("luminosity? ", rgbBackground.luminosity());
        let lightShadow = rgbBackground.lighten(0.5);
        let darkShadow =  rgbBackground.darken(0.5);

        if (rgbBackground.luminosity() < 0.02 ) {
            const newMax = 6;
            const newMin = 2;
            const oldMax = 1;
            const oldMin = 0.98;
            const newRange = newMax - newMin;
            const oldRange = oldMax - oldMin;
            const newValue = ((((1 - rgbBackground.luminosity()) - oldMin) * newRange) / oldRange) + newMin;
            console.debug("new luminosity value: ", newValue);
            lightShadow = rgbBackground.lighten(newValue);
            darkShadow = rgbBackground.lighten(newValue / 2);
        }

        console.debug("Suggesting lightShadow: ", lightShadow.grayscale().hex());
        console.debug("Suggesting darkShadow: ", darkShadow.grayscale().hex());
        setTheme({...customTheme, bgDarkShadow: darkShadow.grayscale().hex(), bgLightShadow: lightShadow.grayscale().hex()})
    }

    return (
      <StyledApp dark={checkVal} background={color}>
          <div style={{flex: 1}}>
            React neumorphic slider example
          </div>
          <div style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
          }}>
              <label>
                  <ThemeCheck checked={checkVal} onCheckChange={handleCheckChange}/>
                  <span style={{ marginLeft: 8 }}>Dark mode</span>
              </label>
              <p>Background color picker</p>
              <SketchPicker
              color={color}
              onChangeComplete={(color: ColorResult) => setColor(color.hex)}
              />
             {/* <label>
                <input style={{
                    width: "200px",
                    height: "28px",
                    background: "peachpuff",
                    cursor: "pointer",
                    border: "none",
                    borderRadius: "4px"
                }} type={"button"} onClick={handleSuggestColors} />
                  <span style={{ marginLeft: 8 }}>Suggest Colors</span>
              </label>*/}
          </div>
          <div style={{display:"flex", flex:3, flexDirection: "column", background: "inherit" }}>
              <Slider label={"Auto theme"} background={color} />
          </div>

      </StyledApp>
  );
}

export default App;
