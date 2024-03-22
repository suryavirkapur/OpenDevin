import { atom, createStore } from "jotai";

const store = createStore();

interface Message {
  content: string;
  sender: "user" | "assistant";
}

const chatState = atom<Message[]>([
  {
    content:
      "I want you to setup this project: https://github.com/mckaywrigley/assistant-ui",
    sender: "user",
  },
  {
    content:
      "Got it, I'll get started on setting up the assistant UI project from the GitHub link you provided. I'll update you on my progress.",
    sender: "assistant",
  },
  { content: "Cloned repo from GitHub.", sender: "assistant" },
  { content: "You're doing great! Keep it up :)", sender: "user" },
  {
    content:
      "Thanks! I've cloned the repo and am currently going through the README to make sure we get everything set up right. There's a detailed guide for local setup as well as instructions for hosting it. I'll follow the steps and keep you posted on the progress! If there are any specific configurations or features you want to prioritize, just let me know.",
    sender: "assistant",
  },
  {
    content: "Installed project dependencies using npm.",
    sender: "assistant",
  },
]);

interface BrowserProps {
  url: string;
  screenshotSrc: string;
}

const browserState = atom<BrowserProps>({
  url: "https://github.com/OpenDevin/OpenDevin",
  screenshotSrc:
    "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0uGvyHwAFCAJS091fQwAAAABJRU5ErkJggg==",
});

const MESSAGE_ACTIONS = ["terminal", "planner", "code", "browser"] as const;
type MessageAction = (typeof MESSAGE_ACTIONS)[number];

// Only Implements Socket Message for BrowserProps
interface SocketMessage {
  action: MessageAction;
  data: BrowserProps;
}

const messageActions = {
  browser: (message: SocketMessage) => {
    const { url, screenshotSrc }: BrowserProps = message.data;
    const browser = store.get(browserState);
    if (browser.url !== url) {
      store.set(browserState, (prev) => ({ ...prev, screenshotSrc }));
    }
    store.set(browserState, (prev) => ({ ...prev, screenshotSrc }));
  },
  terminal: () => {},
  planner: () => {},
  code: () => {},
};

const WS_URL = import.meta.env.VITE_TERMINAL_WS_URL;
if (!WS_URL) {
  throw new Error(
    "The environment variable VITE_TERMINAL_WS_URL is not set. Please set it to the WebSocket URL of the terminal server.",
  );
}

const socket = new WebSocket(WS_URL);

socket.addEventListener("message", (event) => {
  const { message } = JSON.parse(event.data);
  // console.log("Received message:", message);
  if (message.action in messageActions) {
    const action = messageActions[message.action as MessageAction];
    action(message);
  }
});

export { store, browserState, chatState };
