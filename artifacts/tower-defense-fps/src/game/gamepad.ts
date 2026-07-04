export interface GamepadState {
  // Left stick
  leftX: number;
  leftY: number;
  // Right stick
  rightX: number;
  rightY: number;
  // Triggers
  leftTrigger: number;
  rightTrigger: number;
  // Buttons (pressed this frame)
  buttons: boolean[];
  // Buttons (just pressed, not held)
  justPressed: boolean[];
  connected: boolean;
  id: string;
}

const DEADZONE = 0.12;

function applyDeadzone(value: number, deadzone: number): number {
  if (Math.abs(value) < deadzone) return 0;
  return (value - Math.sign(value) * deadzone) / (1 - deadzone);
}

let prevButtons: boolean[] = [];

export function pollGamepad(): GamepadState {
  const gamepads = navigator.getGamepads();
  const gp = gamepads[0];

  if (!gp) {
    return {
      leftX: 0, leftY: 0,
      rightX: 0, rightY: 0,
      leftTrigger: 0, rightTrigger: 0,
      buttons: [],
      justPressed: [],
      connected: false,
      id: 'none',
    };
  }

  const buttons = gp.buttons.map((b) => b.pressed || b.value > 0.5);
  const justPressed = buttons.map((pressed, i) => pressed && !(prevButtons[i] ?? false));
  prevButtons = [...buttons];

  // Standard gamepad layout:
  // Axes: 0=leftX, 1=leftY, 2=rightX, 3=rightY
  // Buttons: 0=A, 1=B, 2=X, 3=Y, 4=LB, 5=RB, 6=LT(axis), 7=RT(axis)
  //          8=Select, 9=Start, 10=L3, 11=R3
  //          12=Up, 13=Down, 14=Left, 15=Right

  const leftX = applyDeadzone(gp.axes[0] ?? 0, DEADZONE);
  const leftY = applyDeadzone(gp.axes[1] ?? 0, DEADZONE);
  const rightX = applyDeadzone(gp.axes[2] ?? 0, DEADZONE);
  const rightY = applyDeadzone(gp.axes[3] ?? 0, DEADZONE);

  // Triggers might be axes or buttons depending on the controller
  const leftTrigger = gp.buttons[6]?.value ?? 0;
  const rightTrigger = gp.buttons[7]?.value ?? 0;

  return {
    leftX, leftY, rightX, rightY,
    leftTrigger, rightTrigger,
    buttons, justPressed,
    connected: true,
    id: gp.id,
  };
}

// Button indices for standard gamepad
export const BTN = {
  A: 0,          // Deploy unit / Confirm
  B: 1,          // Open/close upgrade menu
  X: 2,          // Reload / Use special ability (hold)
  Y: 3,          // Toggle unit list
  LB: 4,         // Previous unit
  RB: 5,         // Next unit
  LT: 6,         // (trigger) — secondary fire / scope
  RT: 7,         // (trigger) — primary fire
  SELECT: 8,     // Stats
  START: 9,      // Pause
  L3: 10,        // Sprint (hold)
  R3: 11,        // Crouch / steady aim
  DPAD_UP: 12,   // Previous era
  DPAD_DOWN: 13, // Next era
  DPAD_LEFT: 14, // Previous unit in era
  DPAD_RIGHT: 15,// Next unit in era
} as const;

export type BtnName = keyof typeof BTN;
