import React, { useRef, useEffect } from "react";
import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
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

        p.strokeHue = 30;

        p.size = 0;

        p.preload = () => {
          p.song = p.loadSound(audio);
        };

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.colorMode(p.HSB, 360, 100, 100, 100);
            p.background(0);
            p.strokeWeight(3);
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
            
             if((vars.currentCue % 10) === 1){
                p.x = 0;
                p.y = p.height;
                p.size = p.width;
                p.strokeHue = p.random(360);
                p.background(0);
                p.sierpinskiTriangle(
                  p.x,
                  p.y,
                  p.width,
                  p.strokeHue,
                  4528.296 / 8
                );
                p.size = p.size / 2;
                //p.strokeHue = p.strokeHue + 45;
             }
             else {
                //  //Left Triangle
                // p.sierpinskiTriangle(p.x, p.y, p.size, p.strokeHue + 30);
                // //right Triangle
                // p.sierpinskiTriangle(
                //   p.x + p.size,
                //   p.y,
                //   p.size,
                //   p.strokeHue + 30
                // );
                // //Top Triangle
                // p.sierpinskiTriangle(
                //   p.x + p.size / 2,
                //   p.y - p.size / 2,
                //   p.size,
                //   p.strokeHue
                // );

                // p.size = p.size / 2;
                // p.strokeHue = p.strokeHue + 45;
             }
           }
         };


        p.sierpinskiTriangle = (x, y, size, strokeHue, delay) => {
          if (size > 4) {
            if (strokeHue >= 360){
                strokeHue = strokeHue - 360;
            } 
            p.stroke(strokeHue, 100, 100, 25);
            p.triangle(x, y, x + size, y, x + size / 2, y - size / 2);

            setTimeout(function () {
              //Left Triangle
              p.sierpinskiTriangle(x, y, size / 2, strokeHue + 30, delay);
              //right Triangle
              p.sierpinskiTriangle(
                x + size / 2,
                y,
                size / 2,
                strokeHue + 30,
                delay
              );
              //Top Triangle
              p.sierpinskiTriangle(
                x + size / 4,
                y - size / 4,
                size / 2,
                strokeHue + 45,
                delay
              );
            }, delay);
          }
        };

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
               "Animation By: https://github.com/LABCAT/triangles-no-2"
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
