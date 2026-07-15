type Shutdown = {
  shutdown?: boolean;
  restart?: false;
  fw?: false;
  force?: boolean;
  timing?: number;
  key: string;
};
type Firmware = {
  shutdown?: false;
  restart: true;
  fw: true;
  force?: false;
  timing?: number;
  key: string;
};
type Cancel = {
  cancel: true;
  shutdown?: false;
  restart?: false;
  fw?: false;
  force?: false;
  timing?: undefined;
  key: string;
};
type SystemActionProp = Firmware | Shutdown | Cancel;

export default async function sendSystemAction({
  shutdown,
  restart,
  fw,
  force,
  timing,
  cancel,
  key,
}: SystemActionProp) {
  try {
    let cmd = "shutdown";

    if (cancel) {
      cmd += " /a";
    } else {
      // Build the command flags based on the options passed
      if (shutdown) cmd += " /s";
      if (restart) cmd += " /r";
      if (fw) cmd += " /fw";
      if (force) cmd += " /f";

      // Append the timing parameter if provided
      if (timing !== undefined) {
        cmd += ` /t ${timing}`;
      }
    }
    console.log("COMMAND", cmd);
    console.log("ADMINKEY: ", key);
    const res = await fetch("http://192.168.31.116:5000/sysAct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cmd: cmd, adminKey: key }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error("ERROR!: ", error.message);
    return { success: false, error: error.message };
  }
}
