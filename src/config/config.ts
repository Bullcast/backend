import * as dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("local", "development", "production").required(),
    MYSQL_HOST: Joi.string().required(),
    MYSQL_USER: Joi.string().required(),
    MYSQL_ROOT_PASSWORD: Joi.string().required(),
    MYSQL_DATABASE: Joi.string().required(),
    APP_PORT: Joi.number().required(),
    AGENT_API_URL: Joi.string().required(),
  })
  .unknown();

const { error, value: envVars } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error != null) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const isProduction = () => {
  return envVars.NODE_ENV === "production";
};

export const isDevelopment = () => {
  return envVars.NODE_ENV === "development";
};
export const isLocal = () => {
  return envVars.NODE_ENV === "local";
};

export const env = {
  nodeEnv: envVars.NODE_ENV,
  mysql: {
    host: envVars.MYSQL_HOST,
    password: envVars.MYSQL_ROOT_PASSWORD,
    db: envVars.MYSQL_DATABASE,
    user: envVars.MYSQL_USER,
  },
  port: envVars.APP_PORT,
  agent: {
    agentApiUrl: envVars.AGENT_API_URL,
    agentId: envVars.AGENT_ID,
  },
};