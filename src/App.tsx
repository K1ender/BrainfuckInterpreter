import { useCallback, useEffect, useRef, useState } from "react";
import worker from "./compiler?worker";

const App = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const [input, setInput] = useState("");

  const workerRef = useRef<Worker | null>(null);

  const [state, setState] = useState("Run");

  useEffect(() => {
    workerRef.current = new worker();

    workerRef.current.onmessage = (event) => {
      setOutput((prev) => prev + event.data);
      setState("Run");
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleRun = useCallback(() => {
    if (!workerRef.current) return;
    setOutput("");
    setState("Loading...");
    workerRef.current.postMessage({ code: code, input: input });
  }, [code, input]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 py-4 text-white">
      <div className="mx-4 h-4/5 w-full max-w-[40rem] rounded bg-zinc-800 px-4 py-4">
        <p className="text-center font-bold text-3xl">Code</p>
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          className="mt-4 h-48 w-full resize-none rounded text-black"
        />
        <p className="mt-2 text-center font-semibold text-xl">
          Input (if needed)
        </p>
        <input
          className="my-2 w-full rounded text-center text-black placeholder:text-center"
          placeholder="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="button"
          className="mt-2 w-full rounded bg-blue-500 py-3 font-semibold text-2xl transition-colors hover:bg-blue-600"
          onClick={handleRun}
        >
          {state}
        </button>
        <p className="mt-4 text-center font-bold text-3xl">Output</p>
        <textarea
          className="mt-3 h-48 w-full resize-none rounded font-semibold text-black"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default App;
