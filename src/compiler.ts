export function brainfuckInterpreter(code: string, input = ""): string {
  const memory = new Uint8Array(30000);
  let pointer = 0;
  let inputPointer = 0;
  let output = "";
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
        output += String.fromCharCode(memory[pointer]);
        self.postMessage(output);
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

  return output;
}

self.onmessage = (event) => {
  const data = event.data;

  const result = brainfuckInterpreter(data.code, data.input);
  self.postMessage(result);
};
