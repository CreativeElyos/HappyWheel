import { Component, OnInit, HostListener } from '@angular/core';
declare var Winwheel: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Vars used by the code in this page to do power controls.
  wheelPower: number = 0;
  wheelSpinning: boolean = false;
  theWheel: any;
  width: number = 0;
  height: number = 0;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
  }
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  ngOnInit(): void {
    this.theWheel = new Winwheel({
      'outerRadius': 212,        // Set outer radius so wheel fits inside the background.
      'innerRadius': 75,         // Make wheel hollow so segments don't go all way to center.
      'textFontSize': 24,         // Set default font size for the segments.
      'textOrientation': 'vertical', // Make text vertial so goes down from the outside of wheel.
      'textAlignment': 'outer',    // Align text to outside of wheel.
      'numSegments': 24,         // Specify number of segments.
      'segments':             // Define segments including colour and text.
        [                               // font size and test colour overridden on backrupt segments.
          { 'fillStyle': '#ee1c24', 'text': '300' },
          { 'fillStyle': '#3cb878', 'text': '450' },
          { 'fillStyle': '#f6989d', 'text': '600' },
          { 'fillStyle': '#00aef0', 'text': '750' },
          { 'fillStyle': '#f26522', 'text': '500' },
          { 'fillStyle': '#000000', 'text': 'JOKER', 'textFontSize': 16, 'textFillStyle': '#ffffff' },
          { 'fillStyle': '#e70697', 'text': '3000' },
          { 'fillStyle': '#fff200', 'text': '600' },
          { 'fillStyle': '#f6989d', 'text': '700' },
          { 'fillStyle': '#ee1c24', 'text': '350' },
          { 'fillStyle': '#3cb878', 'text': '500' },
          { 'fillStyle': '#f26522', 'text': '800' },
          { 'fillStyle': '#a186be', 'text': '300' },
          { 'fillStyle': '#fff200', 'text': '400' },
          { 'fillStyle': '#00aef0', 'text': '650' },
          { 'fillStyle': '#ee1c24', 'text': '1000' },
          { 'fillStyle': '#f6989d', 'text': '500' },
          { 'fillStyle': '#f26522', 'text': '400' },
          { 'fillStyle': '#3cb878', 'text': '900' },
          { 'fillStyle': '#000000', 'text': 'JOKER', 'textFontSize': 16, 'textFillStyle': '#ffffff' },
          { 'fillStyle': '#a186be', 'text': '600' },
          { 'fillStyle': '#fff200', 'text': '700' },
          { 'fillStyle': '#00aef0', 'text': '800' },
          { 'fillStyle': '#ffffff', 'text': 'REJOUER', 'textFontSize': 10 }
        ],
      'animation':           // Specify the animation to use.
      {
        'type': 'spinToStop',
        'duration': 10,    // Duration in seconds.
        'spins': 3,     // Default number of complete spins.
        'callbackFinished': this.alertPrize,
        'callbackSound': this.playAudio,   // Function to call when the tick sound is to be triggered.
        'soundTrigger': 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
      },
      'pins':				// Turn pins on.
      {
        'number': 24,
        'fillStyle': 'silver',
        'outerRadius': 4,
      }
    });
  }


  // This function is called when the sound is to be played.
  playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/sounds/tick.mp3";
    audio.load();
    audio.pause();

    audio.currentTime = 0;

    audio.play();
  }

  // -------------------------------------------------------
  // Function to handle the onClick on the power buttons.
  // -------------------------------------------------------
  powerSelected(powerLevel) {
    // Ensure that power can't be changed while wheel is spinning.
    if (this.wheelSpinning == false) {
      // Reset all to grey incase this is not the first time the user has selected the power.
      document.getElementById('pw1').className = "";
      document.getElementById('pw2').className = "";
      document.getElementById('pw3').className = "";

      // Now light up all cells below-and-including the one selected by changing the class.
      if (powerLevel >= 1) {
        document.getElementById('pw1').className = "pw1";
      }

      if (powerLevel >= 2) {
        document.getElementById('pw2').className = "pw2";
      }

      if (powerLevel >= 3) {
        document.getElementById('pw3').className = "pw3";
      }

      // Set wheelPower var used when spin button is clicked.
      this.wheelPower = powerLevel;

      // Light up the spin button by changing it's source image and adding a clickable class to it.
      (document.getElementById('spin_button') as HTMLImageElement).src = "../../assets/imgs/spin_on.png";
      document.getElementById('spin_button').className = "clickable";
    }
  }

  // -------------------------------------------------------
  // Click handler for spin button.
  // -------------------------------------------------------
  startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (this.wheelSpinning == false) {
      // Based on the power level selected adjust the number of spins for the wheel, the more times is has
      // to rotate with the duration of the animation the quicker the wheel spins.
      if (this.wheelPower == 1) {
        this.theWheel.animation.spins = 3;
      } else if (this.wheelPower == 2) {
        this.theWheel.animation.spins = 6;
      } else if (this.wheelPower == 3) {
        this.theWheel.animation.spins = 10;
      }

      // Disable the spin button so can't click again while wheel is spinning.
      (document.getElementById('spin_button') as HTMLImageElement).src = "../../assets/imgs/spin_off.png";
      document.getElementById('spin_button').className = "";

      // Begin the spin animation by calling startAnimation on the wheel object.
      this.theWheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      this.wheelSpinning = true;
    }
  }

  // -------------------------------------------------------
  // Function for reset button.
  // -------------------------------------------------------
  resetWheel() {
    this.theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    this.theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    this.theWheel.draw();                // Call draw to render changes to the wheel.

    document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
    document.getElementById('pw2').className = "";
    document.getElementById('pw3').className = "";

    this.wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
  }

  // -------------------------------------------------------
  // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
  // -------------------------------------------------------
  alertPrize(indicatedSegment) {
    // Just alert to the user what happened.
    // In a real project probably want to do something more interesting than this with the result.
    if (indicatedSegment.text == 'REJOUER') {
      alert('Tu peux relancer la roue !');
    } else if (indicatedSegment.text == 'JOKER') {
      alert('Ah ! Tu peux choisir un autre défi !');
    } else {
      alert("C'est tombé sur : " + indicatedSegment.text);
    }
  }

}
