import { Controller, Get, Route, Tags } from "tsoa";
import * as os from "os";

interface HostInfo {
  hostname: string;
  platform: string;
  release: string;
  uptime: number;
}

@Route("api/health")
export class HealthController extends Controller {

  @Get("")
  @Tags("Health")
  public async getHealth(): Promise<string> {
    return "OK";
  }

  @Get("host")
  @Tags("Health")
  public async getHost(): Promise<HostInfo> {
    const hostInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      uptime: os.uptime(),
    }
    return hostInfo;
  }
}