import React, { useRef, useEffect } from "react";
import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import ShuffleArray from "./ShuffleArray.js";
import audio from "../audio/triangles-no-2.ogg";
import cueSet1 from "./cueSet1.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.song = null;

        p.cueSet1Completed = [];

        p.triangles = [];

        p.strokeHue = 30;

        p.size = 0;

        p.preload = () => {
          p.song = p.loadSound(audio);
        };

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.colorMode(p.HSB, 360, 100, 100, 100);
            p.background(255);
            p.strokeWeight(2);
            p.noFill();
            

            p.song.onended(p.logCredits);
            for (let i = 0; i < cueSet1.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet1[i].duration,
                durationTicks: cueSet1[i].durationTicks,
              };
              p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
            }
        };

        p.draw = () => {
            
            
        };
        

        p.executeCueSet1 = (vars) => {
          if (!p.cueSet1Completed.includes(vars.currentCue)) {
            p.cueSet1Completed.push(vars.currentCue);
            const arrayIndex = (vars.currentCue % 8) ? (vars.currentCue % 8) : 8;
            const drawUpperTriangles =
              (vars.currentCue > 16 && vars.currentCue < 32) ||
              (vars.currentCue > 48 && vars.currentCue < 64) ||
              (vars.currentCue > 80); 
          
            if (arrayIndex === 1) {
              p.reloadTrianglesArray(drawUpperTriangles);
              p.background(255);
            }

            p.drawSierpinskiTriangles(p.triangles[arrayIndex], arrayIndex, vars.duration);

          }
        };

        p.reloadTrianglesArray = (drawUpperTriangles) => {
          p.triangles = [];
          const y = (p.height <= (p.width / 2)) ? p.height : p.height + ((p.width / 2) - p.height) /2;
          const baseFill = Math.floor(p.random(360));
          p.loadSierpinskiTriangles(0, y, p.width, baseFill, 1);
          if (drawUpperTriangles){
            const outerLeftBaseFill = ((baseFill - 120) >= 0) ? (baseFill - 120) : (baseFill + 240);
            p.loadSierpinskiTrianglesOuterLeft(
              0,
              y,
              p.width,
              outerLeftBaseFill,
              1
            );
            const outerRightBaseFill = ((baseFill + 120) <= 360) ? (baseFill + 120) : (baseFill - 240);
            p.loadSierpinskiTrianglesOuterRight(
              0,
              y,
              p.width,
              outerRightBaseFill,
              1
            );
          }
        }

        p.loadSierpinskiTrianglesOuterLeft = (x, y, size, fillHue, depth) => {
          if (size >= 60) {
            if (fillHue >= 360) {
              fillHue = fillHue - 360;
            }
            if (typeof p.triangles[depth] === "undefined") {
              p.triangles[depth] = [];
            }
            p.triangles[depth].push({
              x1: x,
              y1: y,
              x2: x + size / 2,
              y2: y - size / 2,
              x3: x,
              y3: y - size / 2,
              fillHue: fillHue,
            });
            //Left Triangle
            const leftFillHue =
              fillHue + 20 > 360 ? fillHue - 340 : fillHue + 20;
            p.loadSierpinskiTrianglesOuterLeft(
              x,
              y,
              size / 2,
              leftFillHue,
              depth + 1
            );
            //top Triangle
            const topFillHue =
              fillHue + 60 > 360 ? fillHue - 300 : fillHue + 60;
            p.loadSierpinskiTrianglesOuterLeft(
              x,
              y - size / 4,
              size / 2,
              topFillHue,
              depth + 1
            );
            //right Triangle
            const rightFillHue =
              fillHue + 40 > 360 ? fillHue - 320 : fillHue + 40;
            p.loadSierpinskiTrianglesOuterLeft(
              x + size / 4,
              y - size / 4,
              size / 2,
              rightFillHue,
              depth + 1
            );
          }
        };

         p.loadSierpinskiTrianglesOuterRight = (x, y, size, fillHue, depth) => {
           if (size >= 60) {
             if (fillHue >= 360) {
               fillHue = fillHue - 360;
             }
             if (typeof p.triangles[depth] === "undefined") {
               p.triangles[depth] = [];
             }

             p.triangles[depth].push({
               x1: x + size / 2,
               y1: y - size / 2,
               x2: x + size,
               y2: y,
               x3: x + size,
               y3: y - size / 2,
               fillHue: fillHue,
             });

             //Left Triangle
             const leftFillHue =
               fillHue + 40 > 360 ? fillHue - 320 : fillHue + 40;
             p.loadSierpinskiTrianglesOuterRight(
               x + size / 4,
               y - size / 4,
               size / 2,
               leftFillHue,
               depth + 1
             );

             //top Triangle
             const topFillHue =
               fillHue + 60 > 360 ? fillHue - 300 : fillHue + 60;
             p.loadSierpinskiTrianglesOuterRight(
               x + size / 2,
               y - size / 4,
               size / 2,
               topFillHue,
               depth + 1
             );
             //right Triangle
            const rightFillHue =
              fillHue + 20 > 360 ? fillHue - 340 : fillHue + 20;
            p.loadSierpinskiTrianglesOuterRight(
              x + size / 2,
              y,
              size / 2,
              rightFillHue,
              depth + 1
            );
           }
         };


        p.loadSierpinskiTriangles = (x, y, size, fillHue, depth) => {
          if (size >= 10) {
            if (fillHue >= 360) {
              fillHue = fillHue - 360;
            }
            if (typeof p.triangles[depth] === 'undefined'){
              p.triangles[depth] = [];
            }
            p.triangles[depth].push({
              x1: x,
              y1: y,
              x2: x + size,
              y2: y,
              x3: x + size / 2,
              y3: y - size / 2,
              fillHue: fillHue,
            });

            //Left Triangle
            const leftFillHue =
              fillHue - 60 <= 0 ? fillHue + 300 : fillHue - 60; 
            p.loadSierpinskiTriangles(x, y, size / 2, leftFillHue, depth + 1);
            //right Triangle
            const rightFillHue =
              fillHue + 60 >= 360 ? fillHue - 300 : fillHue + 60; 
            p.loadSierpinskiTriangles(
              x + size / 2,
              y,
              size / 2,
              rightFillHue,
              depth + 1
            );
            //Top Triangle
            const topFillHue =
              fillHue + 180 >= 360 ? fillHue - 180 : fillHue + 180; 
            p.loadSierpinskiTriangles(
              x + size / 4,
              y - size / 4,
              size / 2,
              topFillHue,
              depth + 1
            );
          }
        };

        p.drawSierpinskiTriangles = (array, index, duration) => {
          let delayAmount =  0;
          if(index > 7){
            delayAmount =  parseInt(duration * 1000) / array.length;
            array = ShuffleArray(array);
          }

          for(let i =0; i < array.length; i++){
             setTimeout(function () {
               p.fill(array[i].fillHue, 100, 100, 50);
               p.triangle(
                 array[i].x1,
                 array[i].y1,
                 array[i].x2,
                 array[i].y2,
                 array[i].x3,
                 array[i].y3
               );
             }, delayAmount * i);
            
          }
        }

         p.mousePressed = () => {
           if (p.song.isPlaying()) {
             p.song.pause();
           } else {
             if (
               parseInt(p.song.currentTime()) >=
               parseInt(p.song.buffer.duration)
             ) {
               p.reset();
             }
             //document.getElementById("play-icon").classList.add("fade-out");
             p.canvas.addClass("fade-in");
             p.song.play();
           }
         };

         p.creditsLogged = false;

         p.logCredits = () => {
           if (
             !p.creditsLogged &&
             parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
           ) {
             p.creditsLogged = true;
             console.log(
               "Music By: http://labcat.nz/",
               "\n",
               "Animation By: https://github.com/LABCAT/triangles-no-2",
               "\n",
               "Code Inspiration: https://breaksome.tech/coding-the-sierpinski-triangle-in-p5js/"
             );
             p.song.stop();
           }
         };

         p.reset = () => {
           p.clear();
           p.cueSet1Completed = [];
         };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
