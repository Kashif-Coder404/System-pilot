import { Firmware, Shutdown, Cancel } from "@/types/types";
type SystemActionProp = Firmware | Shutdown | Cancel;

export default async function sendSystemAction({
  cancel,
  shutdown,
  restart,
  fw,
  force,
  timing,
  key,
  isAdministrator,
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
      if (isAdministrator) {
        cmd = `powershell -Command "Start-Process cmd -ArgumentList '/c ${cmd}' -Verb runAs"`;
        console.log("ADMIN");
      }
    }
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
