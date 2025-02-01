import axios from "axios";
import { Body, Controller, Post, Route, Tags } from "tsoa";
import { env } from "../config/config";

@Route("api/agent")
export class AgentController extends Controller {
  @Post("")
  @Tags("Agent")
  public async handleMessage(
    @Body() body: any,
  ) {
    try {
      const response = await axios.post(env.agent.agentApiUrl + `/${env.agent.agentId}/message`, body);
      if (response.status === 200) {
        const action = response.data[0].action;
        const res = response.data.map((data: any) => {
          return data.text
        });
        switch (action) {
          case "SEND_TOKEN":
            break;
          case "INVEST_TOKEN":
            break;
          case "SWAP_TOKEN":
            break;
        }
        return res;
      } else {
        throw new Error("Failed to send message to agent");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}