declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_TOKEN_SEC: string;
      MONGO_URI: string;
      NODE_ENV: "dev" | "prod";
      PORT: string;
    }
  }
}

export {};
