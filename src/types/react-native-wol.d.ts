declare module 'react-native-wol' {
  const wol: {
    send: (macAddress: string) => void;
    wake: (macAddress: string, broadcastIp: string) => void;
  };
  export default wol;
}
