export function brainfuckInterpreter(code: string, input = "") {
  const memory = new Uint8Array(1000);
  let pointer = 0;
  let inputPointer = 0;
  const loopStack = [];

  for (let i = 0; i < code.length; i++) {
    const command = code[i];
    switch (command) {
      case ">":
        pointer++;
        if (pointer >= memory.length) pointer = 0;
        break;
      case "<":
        pointer--;
        if (pointer < 0) pointer = memory.length - 1;
        break;
      case "+":
        memory[pointer] = (memory[pointer] + 1) % 256;
        break;
      case "-":
        memory[pointer] = (memory[pointer] - 1 + 256) % 256;
        break;
      case ".":
        self.postMessage(String.fromCharCode(memory[pointer]));
        break;
      case ",":
        if (inputPointer < input.length) {
          memory[pointer] = input.charCodeAt(inputPointer++);
        } else {
          memory[pointer] = 0;
        }
        break;
      case "[":
        if (memory[pointer] === 0) {
          let openBrackets = 1;
          while (openBrackets > 0) {
            i++;
            if (code[i] === "[") openBrackets++;
            if (code[i] === "]") openBrackets--;
          }
        } else {
          loopStack.push(i);
        }
        break;
      case "]":
        if (memory[pointer] !== 0) {
          i = loopStack[loopStack.length - 1];
        } else {
          loopStack.pop();
        }
        break;
    }
  }
}

self.onmessage = (event) => {
  const data = event.data;
  brainfuckInterpreter(data.code, data.input);
};
