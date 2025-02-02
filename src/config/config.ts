import * as dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("local", "development", "production")
      .required(),
    APP_PORT: Joi.number().required(),
    SUI_PACKAGE: Joi.string().required(),
    SUI_CONFIG_OBJECT: Joi.string().required(),
    MYSQL_URL: Joi.string().required(),
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
    url: envVars.MYSQL_URL,
  },
  port: envVars.APP_PORT,
  sui: {
    package: envVars.SUI_PACKAGE,
    config_object: envVars.SUI_CONFIG_OBJECT,
  }
};